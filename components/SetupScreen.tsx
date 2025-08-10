import React from 'react';
import type { SavedRosco, Question } from '../types';

interface SetupScreenProps {
    t: { [key: string]: string };
    styleProps: {
        borderColor: string;
        primaryAccentColor: string;
        inputBgColor: string;
        inputBorderColor: string;
        placeholderColor: string;
        mutedTextColor: string;
        buttonSecondaryBg: string;
    };
    topic: string;
    setTopic: (value: string) => void;
    educationalLevel: string;
    setEducationalLevel: (value: string) => void;
    difficulty: string;
    setDifficulty: (value: string) => void;
    gameTime: number;
    setGameTime: (value: number) => void;
    questionGenLanguage: string;
    handleQuestionLanguageChange: (value: string) => void;
    handleGenerateQuestions: () => void;
    apiError: string;
    message: string;
    savedRoscos: SavedRosco[];
    loadRosco: (rosco: SavedRosco) => void;
    inputMode: 'ai' | 'manual';
    setInputMode: (mode: 'ai' | 'manual') => void;
    questions: Question[];
    handleQuestionEdit: (index: number, field: keyof Question, value: string) => void;
    startReviewingManualQuestions: () => void;
}

const SetupScreen: React.FC<SetupScreenProps> = ({
    t, styleProps, topic, setTopic, educationalLevel, setEducationalLevel,
    difficulty, setDifficulty, gameTime, setGameTime, questionGenLanguage,
    handleQuestionLanguageChange, handleGenerateQuestions, apiError, message, savedRoscos, loadRosco,
    inputMode, setInputMode, questions, handleQuestionEdit, startReviewingManualQuestions
}) => {
    return (
        <div className="space-y-6">
            <div className="flex justify-center p-1 rounded-lg bg-gray-200 dark:bg-slate-700 max-w-sm mx-auto">
                <button
                    onClick={() => setInputMode('ai')}
                    className={`w-1/2 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                        inputMode === 'ai' ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow' : 'text-slate-600 dark:text-slate-300'
                    }`}
                >
                    {t.generateWithAI}
                </button>
                <button
                    onClick={() => setInputMode('manual')}
                    className={`w-1/2 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                        inputMode === 'manual' ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow' : 'text-slate-600 dark:text-slate-300'
                    }`}
                >
                    {t.manualInput}
                </button>
            </div>

            {inputMode === 'ai' ? (
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="questionLanguage" className={`block text-sm font-medium ${styleProps.primaryAccentColor} mb-1`}>{t.questionLanguage}</label>
                            <input type="text" id="questionLanguage" value={questionGenLanguage} onChange={(e) => handleQuestionLanguageChange(e.target.value)} className={`w-full p-3 ${styleProps.inputBgColor} border ${styleProps.inputBorderColor} rounded-md focus:ring-sky-500 focus:border-sky-500 ${styleProps.placeholderColor}`} placeholder={t.placeholderQuestionLang}/>
                        </div>
                        <div>
                            <label htmlFor="topic" className={`block text-sm font-medium ${styleProps.primaryAccentColor} mb-1`}>{t.topic}</label>
                            <input type="text" id="topic" value={topic} onChange={(e) => setTopic(e.target.value)} className={`w-full p-3 ${styleProps.inputBgColor} border ${styleProps.inputBorderColor} rounded-md focus:ring-sky-500 focus:border-sky-500 ${styleProps.placeholderColor}`} placeholder={t.placeholderTopic}/>
                        </div>
                        <div>
                            <label htmlFor="educationalLevel" className={`block text-sm font-medium ${styleProps.primaryAccentColor} mb-1`}>{t.educationalLevel}</label>
                            <input type="text" id="educationalLevel" value={educationalLevel} onChange={(e) => setEducationalLevel(e.target.value)} className={`w-full p-3 ${styleProps.inputBgColor} border ${styleProps.inputBorderColor} rounded-md focus:ring-sky-500 focus:border-sky-500 ${styleProps.placeholderColor}`} placeholder={t.placeholderLevel}/>
                        </div>
                        <div>
                            <label htmlFor="difficulty" className={`block text-sm font-medium ${styleProps.primaryAccentColor} mb-1`}>{t.difficulty}</label>
                            <select id="difficulty" value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className={`w-full p-3 ${styleProps.inputBgColor} border ${styleProps.inputBorderColor} rounded-md focus:ring-sky-500 focus:border-sky-500`}>
                                <option value="easy">{t.easy}</option>
                                <option value="normal">{t.normal}</option>
                                <option value="hard">{t.hard}</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="gameTime" className={`block text-sm font-medium ${styleProps.primaryAccentColor} mb-1`}>{t.gameTime}</label>
                            <input type="number" id="gameTime" value={gameTime} onChange={(e) => setGameTime(parseInt(e.target.value, 10) || 0)} className={`w-full p-3 ${styleProps.inputBgColor} border ${styleProps.inputBorderColor} rounded-md focus:ring-sky-500 focus:border-sky-500`}/>
                        </div>
                        {apiError && <p className="text-red-400 text-sm">{apiError}</p>}
                        {message && <p className="text-yellow-500 text-sm">{message}</p>}
                        <button onClick={handleGenerateQuestions} className="w-full bg-sky-500 hover:bg-sky-600 dark:bg-sky-600 dark:hover:bg-sky-500 text-white font-semibold py-3 px-4 rounded-md transition duration-150 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-sky-300 dark:focus:ring-sky-400 focus:ring-opacity-75">
                            {t.generateQuestions}
                        </button>
                    </div>
                    <div className={`p-4 rounded-lg border ${styleProps.borderColor} ${styleProps.inputBgColor}`}>
                        <h3 className={`text-lg font-bold ${styleProps.primaryAccentColor} mb-4`}>{t.loadSavedRosco}</h3>
                        <div className="space-y-3 max-h-80 overflow-y-auto">
                            {savedRoscos.length > 0 ? savedRoscos.map(rosco => (
                                <div key={rosco.id} className="p-3 rounded-md flex justify-between items-center bg-white dark:bg-slate-800">
                                    <div>
                                        <p className="font-semibold">{rosco.topic}</p>
                                        <p className={`text-xs ${styleProps.mutedTextColor}`}>{rosco.educationalLevel}</p>
                                    </div>
                                    <button onClick={() => loadRosco(rosco)} className={`px-4 py-1 rounded-md text-sm ${styleProps.buttonSecondaryBg} hover:text-white`}>{t.load}</button>
                                </div>
                            )) : <p className={`text-sm ${styleProps.mutedTextColor}`}>{t.noSavedRoscos}</p>}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    <h3 className={`text-xl font-bold ${styleProps.primaryAccentColor} text-center`}>{t.manualInputTitle}</h3>
                    <div className={`space-y-4 max-h-[60vh] overflow-y-auto p-4 border rounded-lg ${styleProps.borderColor} ${styleProps.inputBgColor}`}>
                        {questions.map((q, index) => (
                            <div key={q.letter} className={`p-4 rounded-lg border ${styleProps.borderColor} bg-white dark:bg-slate-800`}>
                                <p className={`font-bold text-xl mb-3 ${styleProps.primaryAccentColor}`}>{t.letter} {q.letter}</p>
                                <div className="space-y-3">
                                    <div>
                                        <label className={`block text-sm font-medium ${styleProps.mutedTextColor} mb-1`}>{t.question}</label>
                                        <textarea value={q.question} onChange={(e) => handleQuestionEdit(index, 'question', e.target.value)} className={`w-full p-2 bg-gray-50 dark:bg-slate-700 border ${styleProps.inputBorderColor} rounded-md focus:ring-sky-500 focus:border-sky-500`} rows={2}/>
                                    </div>
                                    <div>
                                        <label className={`block text-sm font-medium ${styleProps.mutedTextColor} mb-1`}>{t.correctAnswer}</label>
                                        <input type="text" value={q.answer} onChange={(e) => handleQuestionEdit(index, 'answer', e.target.value)} className={`w-full p-2 bg-gray-50 dark:bg-slate-700 border ${styleProps.inputBorderColor} rounded-md focus:ring-sky-500 focus:border-sky-500`}/>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button onClick={startReviewingManualQuestions} className="w-full bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-500 text-white font-semibold py-3 px-4 rounded-md transition duration-150 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-300 dark:focus:ring-green-400 focus:ring-opacity-75">
                        {t.reviewQuestions}
                    </button>
                </div>
            )}
        </div>
    );
}

export default SetupScreen;