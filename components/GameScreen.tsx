import React from 'react';
import type { Question } from '../types';
import Rosco from './Rosco';
import { GamePhase } from '../types';

interface GameScreenProps {
    t: { [key: string]: string };
    theme: 'light' | 'dark';
    styleProps: any;
    isMaximized: boolean;
    questions: Question[];
    currentQuestionIndex: number;
    timeLeft: number;
    score: number;
    questionDisplaySize: string;
    handleQuestionDisplaySizeChange: (size: string) => void;
    userInput: string;
    setUserInput: (value: string) => void;
    handleAnswerSubmit: () => void;
    handlePass: () => void;
    message: string;
    onEndGame: () => void;
}

const GameScreen: React.FC<GameScreenProps> = ({
    t, theme, styleProps, isMaximized, questions, currentQuestionIndex, timeLeft, score,
    questionDisplaySize, handleQuestionDisplaySizeChange, userInput, setUserInput,
    handleAnswerSubmit, handlePass, message, onEndGame
}) => {
    const getQuestionTextClass = () => {
        let baseClass = '';
        let leadingClass = '';
        if (questionDisplaySize === 'md') { // Normal
            baseClass = isMaximized ? 'text-2xl md:text-3xl' : 'text-lg md:text-xl';
            leadingClass = 'leading-normal';
        } else if (questionDisplaySize === 'lg') { // Grande
            baseClass = isMaximized ? 'text-3xl md:text-4xl' : 'text-xl md:text-2xl';
            leadingClass = 'leading-relaxed';
        } else if (questionDisplaySize === 'xl') { // Extra Grande
            baseClass = isMaximized ? 'text-4xl md:text-5xl' : 'text-2xl md:text-3xl';
            leadingClass = 'leading-loose';
        }
        return `${baseClass} ${leadingClass}`;
    };

    const currentQ = questions[currentQuestionIndex];

    return (
        <div className={`flex flex-col ${isMaximized ? 'md:flex-row h-full' : 'md:flex-row'} gap-6`}>
            <div className={`${isMaximized ? 'md:w-1/2 flex justify-center items-center overflow-hidden' : 'md:w-1/2 flex justify-center items-start'}`}>
                <Rosco
                    questions={questions}
                    currentQuestionIndex={currentQuestionIndex}
                    gamePhase={GamePhase.PLAYING}
                    isMaximized={isMaximized}
                    theme={theme}
                    score={score}
                    timeLeft={timeLeft}
                    t={t}
                />
            </div>
            <div className={`${isMaximized ? 'md:w-1/2 space-y-6 flex flex-col justify-center' : 'md:w-1/2 space-y-4'}`}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
                    <h2 className={`font-semibold ${styleProps.primaryAccentColor} ${isMaximized ? 'text-3xl' : 'text-xl'}`}>{t.questionForLetter} <span className={`text-yellow-500 dark:text-yellow-400 ${isMaximized ? 'text-4xl' : 'text-2xl'}`}>{currentQ.letter}</span></h2>
                    <div className="flex-shrink-0">
                        <label htmlFor="questionFontSize" className={`block text-xs font-medium ${styleProps.mutedTextColor} mb-1`}>{t.questionFontSize}</label>
                        <select id="questionFontSize" value={questionDisplaySize} onChange={(e) => handleQuestionDisplaySizeChange(e.target.value)} className={`p-2 ${styleProps.inputBgColor} border ${styleProps.inputBorderColor} rounded-md text-xs focus:ring-sky-500 focus:border-sky-500`}>
                            <option value="md">{t.fontSizeNormal}</option>
                            <option value="lg">{t.fontSizeLarge}</option>
                            <option value="xl">{t.fontSizeExtraLarge}</option>
                        </select>
                    </div>
                </div>
                <p className={`bg-gray-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 min-h-[80px] p-4 rounded-md ${getQuestionTextClass()}`}>{currentQ.question}</p>
                <div>
                    <label htmlFor="userAnswer" className={`block font-medium ${styleProps.primaryAccentColor} mb-1 ${isMaximized ? 'text-xl' : 'text-sm'}`}>{t.answer}</label>
                    <input type="text" id="userAnswer" value={userInput} onChange={(e) => setUserInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleAnswerSubmit()} className={`w-full p-3 ${styleProps.inputBgColor} border ${styleProps.inputBorderColor} rounded-md focus:ring-sky-500 focus:border-sky-500 ${styleProps.placeholderColor} ${isMaximized ? 'text-xl py-4' : ''}`} autoFocus />
                </div>
                {message && <p className={`p-2 rounded-md ${isMaximized ? 'text-lg' : 'text-sm'} ${message.startsWith(t.correct) ? 'bg-green-200 text-green-800 dark:bg-green-700 dark:text-green-200' : message.startsWith(t.incorrect) ? 'bg-red-200 text-red-800 dark:bg-red-700 dark:text-red-200' : 'bg-yellow-200 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-200'}`}>{message}</p>}
                
                <div className="flex flex-col space-y-3">
                    <div className="flex space-x-3">
                        <button onClick={handleAnswerSubmit} className={`flex-1 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-semibold rounded-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-400 ${isMaximized ? 'text-xl py-4 px-6' : 'py-3 px-4 text-lg'}`}>
                            {t.submit}
                        </button>
                        <button onClick={handlePass} className={`flex-1 bg-orange-400 hover:bg-orange-500 dark:bg-orange-500 dark:hover:bg-orange-400 text-white font-semibold rounded-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-200 dark:focus:ring-orange-300 ${isMaximized ? 'text-xl py-4 px-6' : 'py-3 px-4 text-lg'}`}>
                            {t.pass}
                        </button>
                    </div>
                     <button onClick={onEndGame} className={`w-full bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-500 text-white font-semibold rounded-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-300 dark:focus:ring-red-400 ${isMaximized ? 'text-lg py-3' : 'py-2 text-md'}`}>
                        {t.endGame}
                    </button>
                </div>

                <div className={`mt-4 p-3 ${styleProps.inputBgColor} rounded-md`}>
                    <p className={`font-semibold ${isMaximized ? 'text-2xl' : 'text-lg'}`}>{t.score} <span className="text-green-600 dark:text-green-400">{score}</span></p>
                    <p className={`font-semibold ${isMaximized ? 'text-2xl' : 'text-lg'}`}>{t.timeLeft} <span className="text-yellow-500 dark:text-yellow-400">{timeLeft}s</span></p>
                </div>
            </div>
        </div>
    );
};

export default GameScreen;