
import React, { useState, useEffect, useCallback } from 'react';
import * as storageService from './services/storageService';
import { generatePasapalabraQuestions } from './services/geminiService';
import { normalizeText } from './lib/utils';
import { translations, DEFAULT_TIME, LETTERS } from './constants';
import { playCorrectSound, playIncorrectSound, playGameOverSound } from './lib/sounds';
import { GamePhase } from './types';
import type { Question, SavedRosco } from './types';

// Components
import Header from './components/Header';
import LoadingSpinner from './components/LoadingSpinner';
import SetupScreen from './components/SetupScreen';
import ReviewScreen from './components/ReviewScreen';
import GameScreen from './components/GameScreen';
import GameOverScreen from './components/GameOverScreen';

type SaveStatus = 'idle' | 'saving' | 'success' | 'error';

function App() {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [isMaximized, setIsMaximized] = useState(false);
    const [questionDisplaySize, setQuestionDisplaySize] = useState('lg');
    const [isMuted, setIsMuted] = useState(false);
    
    const [isLoading, setIsLoading] = useState(true);

    const [gamePhase, setGamePhase] = useState<GamePhase>(GamePhase.SETUP);
    const [topic, setTopic] = useState('');
    const [educationalLevel, setEducationalLevel] = useState('');
    const [difficulty, setDifficulty] = useState('normal');
    const [gameTime, setGameTime] = useState(DEFAULT_TIME);
    const [inputMode, setInputMode] = useState<'ai' | 'manual'>('ai');
    const [questionGenLanguage, setQuestionGenLanguage] = useState('Español');

    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(DEFAULT_TIME);
    const [score, setScore] = useState(0);
    const [userInput, setUserInput] = useState('');
    const [message, setMessage] = useState('');

    const [apiError, setApiError] = useState('');
    
    const [savedRoscos, setSavedRoscos] = useState<SavedRosco[]>([]);
    const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
    const [saveMessage, setSaveMessage] = useState('');


    const t = translations.es;

    // --- Sound Player ---
    const playSound = useCallback((player: () => void) => {
        if (!isMuted) {
            player();
        }
    }, [isMuted]);

    // --- Effects ---
    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
    }, [theme]);
    
    // Load preferences and saved roscos from localStorage on initial mount
    useEffect(() => {
        const prefs = storageService.loadPreferences();
        setTheme(prefs.theme || 'light');
        setQuestionDisplaySize(prefs.questionDisplaySize || 'lg');
        setIsMuted(prefs.isMuted === true);
        setQuestionGenLanguage(prefs.questionGenLanguage || 'Español');

        const roscos = storageService.loadRoscos();
        setSavedRoscos(roscos);
        
        setIsLoading(false);
    }, []);

    // Effect to synchronize state with localStorage changes from other tabs
    useEffect(() => {
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === storageService.ROSCOS_KEY) {
                const roscos = storageService.loadRoscos();
                setSavedRoscos(roscos);
            }
            if (event.key === storageService.PREFS_KEY) {
                 const prefs = storageService.loadPreferences();
                 setTheme(prefs.theme || 'light');
                 setQuestionDisplaySize(prefs.questionDisplaySize || 'lg');
                 setIsMuted(prefs.isMuted === true);
                 setQuestionGenLanguage(prefs.questionGenLanguage || 'Español');
            }
        };
    
        window.addEventListener('storage', handleStorageChange);
    
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);


    useEffect(() => {
        if (gamePhase !== GamePhase.PLAYING || timeLeft <= 0) {
            if (gamePhase === GamePhase.PLAYING && timeLeft <= 0) {
                 setGamePhase(GamePhase.GAMEOVER);
                 playSound(playGameOverSound);
            }
            return;
        }
        const timerId = setInterval(() => setTimeLeft(prevTime => prevTime - 1), 1000);
        return () => clearInterval(timerId);
    }, [gamePhase, timeLeft, playSound]);

    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            if (gamePhase === GamePhase.PLAYING || gamePhase === GamePhase.REVIEW_QUESTIONS) {
                event.preventDefault();
                event.returnValue = t.confirmLeave;
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [gamePhase, t.confirmLeave]);


    // --- Handlers ---
    const handleToggleMute = () => {
        const newMutedState = !isMuted;
        setIsMuted(newMutedState);
        storageService.savePreferences({ isMuted: newMutedState });
    };
    
    const handleSetInputMode = (mode: 'ai' | 'manual') => {
        setInputMode(mode);
        if (mode === 'manual' && questions.filter(q => q.question || q.answer).length === 0) {
            const manualQuestions = LETTERS.map(l => ({
                letter: l,
                question: '',
                answer: '',
                status: 'pending' as const,
                userAnswer: ''
            }));
            setQuestions(manualQuestions);
        } else if (mode === 'ai') {
            setQuestions([]);
        }
    };
    
    const handleThemeChange = (newTheme: 'light' | 'dark') => {
        setTheme(newTheme);
        storageService.savePreferences({ theme: newTheme });
    };
    
    const handleQuestionDisplaySizeChange = (size: string) => {
        setQuestionDisplaySize(size);
        storageService.savePreferences({ questionDisplaySize: size });
    };

    const handleGoToMainMenu = () => {
        if (window.confirm(t.confirmLeave)) {
            resetGame();
        }
    };

    const handleQuestionLanguageChange = (langText: string) => {
        setQuestionGenLanguage(langText);
        storageService.savePreferences({ questionGenLanguage: langText });
    };

    const findNextAvailableQuestionIndex = useCallback((startIndex: number, questionsList: Question[]) => {
        const numQuestions = questionsList.length;
        if (numQuestions === 0 || questionsList.every(q => q.status === 'correct' || q.status === 'incorrect')) return -1;
        for (let i = 0; i < numQuestions; i++) {
            const checkIndex = (startIndex + 1 + i) % numQuestions;
            if (questionsList[checkIndex].status === 'pending') return checkIndex;
        }
        for (let i = 0; i < numQuestions; i++) {
            const checkIndex = (startIndex + 1 + i) % numQuestions;
            if (questionsList[checkIndex].status === 'pasada') return checkIndex;
        }
        return -1;
    }, []);

    const handleAnswerSubmit = useCallback(() => {
        if (!userInput.trim() || questions.length === 0) return;
        
        const updatedQuestions = [...questions];
        const currentQ = updatedQuestions[currentQuestionIndex];
        const isCorrect = normalizeText(userInput) === normalizeText(currentQ.answer);
        
        currentQ.status = isCorrect ? 'correct' : 'incorrect';
        currentQ.userAnswer = userInput;
        
        if (isCorrect) {
            setScore(s => s + 1);
            setMessage(t.correct);
            playSound(playCorrectSound);
        } else {
            setMessage(`${t.incorrect} ${t.correctAnswerWas} ${currentQ.answer}`);
            playSound(playIncorrectSound);
        }
        
        setQuestions(updatedQuestions);
        setUserInput('');
        
        const nextIndex = findNextAvailableQuestionIndex(currentQuestionIndex, updatedQuestions);
        if (nextIndex === -1) {
            setGamePhase(GamePhase.GAMEOVER);
            playSound(playGameOverSound);
        } else {
            setCurrentQuestionIndex(nextIndex);
        }
    }, [userInput, questions, currentQuestionIndex, t, findNextAvailableQuestionIndex, playSound]);

    const handlePass = useCallback(() => {
        if (questions.length === 0) return;
        setMessage('');
        const updatedQuestions = [...questions];
        updatedQuestions[currentQuestionIndex].status = 'pasada';
        setQuestions(updatedQuestions);

        const nextIndex = findNextAvailableQuestionIndex(currentQuestionIndex, updatedQuestions);
        if (nextIndex === -1) {
            setGamePhase(GamePhase.GAMEOVER);
            playSound(playGameOverSound);
        } else {
            setCurrentQuestionIndex(nextIndex);
        }
    }, [questions, currentQuestionIndex, findNextAvailableQuestionIndex, playSound]);
    
    const handleGenerateQuestions = useCallback(async () => {
        if (!topic.trim() || !educationalLevel.trim() || !questionGenLanguage.trim()) {
            setMessage(t.completeAllFields);
            return;
        }
        setGamePhase(GamePhase.LOADING_QUESTIONS);
        setApiError('');
        setMessage(t.waitingForAI);
        try {
            const generatedQuestions = await generatePasapalabraQuestions(topic, educationalLevel, difficulty, questionGenLanguage);
            setQuestions(generatedQuestions);
            setGamePhase(GamePhase.REVIEW_QUESTIONS);
            setMessage('');
            setSaveStatus('idle');
        } catch (error) {
            const err = error as Error;
            console.error(t.errorGeneratingQuestions, err);
            setApiError(`${t.errorGeneratingQuestions} ${err.message}`);
            setMessage('');
            setGamePhase(GamePhase.SETUP);
        }
    }, [topic, educationalLevel, difficulty, questionGenLanguage, t]);

    const startReviewingManualQuestions = () => {
        setGamePhase(GamePhase.REVIEW_QUESTIONS);
        setSaveStatus('idle');
    };
    
    const startPlayingFromReview = () => {
        const readyQuestions = questions.map(q => ({ ...q, status: 'pending' as const, userAnswer: '' }));
        setQuestions(readyQuestions);
        setScore(0);
        setTimeLeft(gameTime);
        setCurrentQuestionIndex(0);
        setUserInput('');
        setMessage('');
        setGamePhase(GamePhase.PLAYING);
    };

    const handleQuestionEdit = (index: number, field: keyof Question, value: string) => {
        setQuestions(prev => prev.map((q, i) => i === index ? { ...q, [field]: value } : q));
    };
    
    const saveCurrentRosco = () => {
        if (questions.length === 0) {
            setSaveStatus('error');
            setSaveMessage(t.noQuestionsToSave);
            return;
        }

        setSaveStatus('saving');
        setSaveMessage(t.saving);

        try {
            const roscoData = {
                topic: inputMode === 'ai' ? topic : t.manualInput,
                educationalLevel: inputMode === 'ai' ? educationalLevel : '',
                difficulty: inputMode === 'ai' ? difficulty : 'normal',
                questions: questions.map(({ letter, question, answer }) => ({ letter, question, answer })),
            };
            const updatedRoscos = storageService.saveRosco(roscoData);
            setSavedRoscos(updatedRoscos);
            setSaveStatus('success');
            setSaveMessage(t.roscoSavedSuccess);
        } catch (error) {
            console.error(t.errorSavingRosco, error);
            setSaveStatus('error');
            setSaveMessage(`${t.errorSavingRosco}: ${(error as Error).message}`);
        }
    };
    
    const loadRosco = (rosco: SavedRosco) => {
        setTopic(rosco.topic);
        setEducationalLevel(rosco.educationalLevel);
        setDifficulty(rosco.difficulty);
        setQuestions(rosco.questions.map(q => ({...q, status: 'pending' as const, userAnswer: ''})));
        setGamePhase(GamePhase.REVIEW_QUESTIONS);
        setInputMode('ai'); // Default to AI mode view when loading, as manual is for creation
        setSaveStatus('idle');
    };

    const resetGame = () => {
        setGamePhase(GamePhase.SETUP);
        setTopic('');
        setEducationalLevel('');
        setDifficulty('normal');
        setGameTime(DEFAULT_TIME);
        setQuestions([]);
        setMessage('');
        setApiError('');
        setInputMode('ai');
        setSaveStatus('idle');
    };

    // --- Render ---
    const styleProps = {
        mainBgColor: theme === 'dark' ? 'bg-gradient-to-br from-slate-900 to-slate-700' : 'bg-gradient-to-br from-gray-200 to-gray-50',
        cardBgColor: theme === 'dark' ? 'bg-slate-800' : 'bg-white',
        textColor: theme === 'dark' ? 'text-white' : 'text-slate-900',
        mutedTextColor: theme === 'dark' ? 'text-slate-400' : 'text-slate-600',
        borderColor: theme === 'dark' ? 'border-slate-700' : 'border-gray-300',
        inputBgColor: theme === 'dark' ? 'bg-slate-700' : 'bg-gray-100',
        inputBorderColor: theme === 'dark' ? 'border-slate-600' : 'border-gray-400',
        placeholderColor: theme === 'dark' ? 'placeholder-slate-400' : 'placeholder-gray-500',
        primaryAccentColor: theme === 'dark' ? 'text-sky-400' : 'text-sky-600',
        buttonSecondaryBg: theme === 'dark' ? 'bg-slate-600 hover:bg-slate-500' : 'bg-gray-300 hover:bg-gray-400',
        buttonPrimaryAccentBg: theme === 'dark' ? 'bg-sky-500' : 'bg-sky-600',
    };

    const renderContent = () => {
        if (isLoading) {
            return <LoadingSpinner message={t.loadingQuestions} theme={theme} />;
        }

        switch (gamePhase) {
            case GamePhase.SETUP:
                return <SetupScreen
                    t={t} styleProps={styleProps}
                    topic={topic} setTopic={setTopic}
                    educationalLevel={educationalLevel} setEducationalLevel={setEducationalLevel}
                    difficulty={difficulty} setDifficulty={setDifficulty}
                    gameTime={gameTime} setGameTime={setGameTime}
                    questionGenLanguage={questionGenLanguage} handleQuestionLanguageChange={handleQuestionLanguageChange}
                    handleGenerateQuestions={handleGenerateQuestions}
                    apiError={apiError} message={message}
                    savedRoscos={savedRoscos} loadRosco={loadRosco}
                    inputMode={inputMode} setInputMode={handleSetInputMode}
                    questions={questions} handleQuestionEdit={handleQuestionEdit}
                    startReviewingManualQuestions={startReviewingManualQuestions}
                />;
            case GamePhase.LOADING_QUESTIONS:
                return <LoadingSpinner message={t.loadingQuestions} theme={theme} />;
            case GamePhase.REVIEW_QUESTIONS:
                 return <ReviewScreen
                    t={t} theme={theme} styleProps={styleProps}
                    isMaximized={isMaximized}
                    questions={questions} handleQuestionEdit={handleQuestionEdit}
                    saveCurrentRosco={saveCurrentRosco}
                    startPlayingFromReview={startPlayingFromReview}
                    saveStatus={saveStatus}
                    saveMessage={saveMessage}
                />;
            case GamePhase.PLAYING:
                 return questions.length > 0 && questions[currentQuestionIndex] ? (
                    <GameScreen
                        t={t} theme={theme} styleProps={styleProps} isMaximized={isMaximized}
                        questions={questions} currentQuestionIndex={currentQuestionIndex}
                        timeLeft={timeLeft} score={score}
                        questionDisplaySize={questionDisplaySize} handleQuestionDisplaySizeChange={handleQuestionDisplaySizeChange}
                        userInput={userInput} setUserInput={setUserInput}
                        handleAnswerSubmit={handleAnswerSubmit} handlePass={handlePass}
                        message={message}
                        onEndGame={handleGoToMainMenu}
                    />
                ) : <p className="text-center text-yellow-500 py-10">{t.noQuestionsLoaded}</p>;
            case GamePhase.GAMEOVER:
                return <GameOverScreen
                    t={t} theme={theme} styleProps={styleProps} isMaximized={isMaximized}
                    questions={questions} score={score} message={message} resetGame={resetGame}
                />
            default:
                return null;
        }
    };

    return (
        <div className={`min-h-screen p-4 flex flex-col items-center font-sans transition-colors duration-300 ${styleProps.mainBgColor} ${styleProps.textColor}`}>
            <div className={`w-full ${isMaximized ? 'max-w-full h-full fixed inset-0 z-50 overflow-y-auto flex flex-col' : 'max-w-5xl'} ${styleProps.cardBgColor} shadow-2xl rounded-lg p-6 transition-all duration-300`}>
                <Header
                    t={t}
                    theme={theme} handleThemeChange={handleThemeChange}
                    isMaximized={isMaximized} toggleMaximize={() => setIsMaximized(!isMaximized)}
                    styleProps={styleProps}
                    onGoToMainMenu={handleGoToMainMenu}
                    showGoToMainMenu={gamePhase === GamePhase.REVIEW_QUESTIONS || gamePhase === GamePhase.PLAYING}
                    isMuted={isMuted}
                    handleToggleMute={handleToggleMute}
                />
                <div className={`${isMaximized ? 'flex-grow overflow-y-auto' : ''}`}>
                    <p className={`text-xs ${styleProps.mutedTextColor} mb-4`}>{t.pasapalabraInfo}</p>
                    {renderContent()}
                </div>
            </div>
            {!isMaximized && (
                <footer className={`text-center text-xs ${styleProps.mutedTextColor} mt-8 space-y-1`}>
                    <p><a href="https://labia.tiddlyhost.com" target="_blank" rel="noopener noreferrer" className={`hover:underline ${styleProps.primaryAccentColor}`}>{t.footerLab}</a></p>
                    <p><a href="https://bilateria.org" target="_blank" rel="noopener noreferrer" className={`hover:underline ${styleProps.primaryAccentColor}`}>{t.footerAuthor}</a></p>
                    <p><a href="https://creativecommons.org/licenses/by-sa/4.0/deed.es" target="_blank" rel="noopener noreferrer" className={`hover:underline ${styleProps.primaryAccentColor}`}>{t.footerLicense}</a></p>
                </footer>
            )}
        </div>
    );
}

export default App;