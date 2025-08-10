import React from 'react';
import type { Question } from '../types';

type SaveStatus = 'idle' | 'saving' | 'success' | 'error';

interface ReviewScreenProps {
    t: { [key: string]: string };
    theme: 'light' | 'dark';
    styleProps: {
        borderColor: string;
        primaryAccentColor: string;
        inputBgColor: string;
        inputBorderColor: string;
        mutedTextColor: string;
    };
    isMaximized: boolean;
    questions: Question[];
    handleQuestionEdit: (index: number, field: keyof Question, value: string) => void;
    saveCurrentRosco: () => void;
    startPlayingFromReview: () => void;
    saveStatus: SaveStatus;
    saveMessage: string;
}

const ReviewScreen: React.FC<ReviewScreenProps> = ({
    t, theme, styleProps, isMaximized, questions, handleQuestionEdit,
    saveCurrentRosco, startPlayingFromReview, saveStatus, saveMessage
}) => {
    const isSaving = saveStatus === 'saving';

    const getMessageClass = () => {
        switch (saveStatus) {
            case 'success':
                return 'bg-green-200 text-green-800 dark:bg-green-700 dark:text-green-200';
            case 'error':
                 return 'bg-red-200 text-red-800 dark:bg-red-700 dark:text-red-200';
            case 'saving':
                return 'bg-yellow-200 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-200';
            default:
                return 'hidden';
        }
    };


    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className={`text-2xl font-bold ${styleProps.primaryAccentColor}`}>{t.reviewQuestions}</h2>
                <button onClick={saveCurrentRosco} disabled={isSaving} className="px-4 py-2 rounded-md font-semibold transition bg-indigo-500 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white disabled:bg-gray-400 disabled:opacity-50">
                    {isSaving ? t.saving : t.saveRosco}
                </button>
            </div>
            {saveStatus !== 'idle' && saveMessage && (
                <p className={`p-3 rounded-md text-sm font-medium ${getMessageClass()}`}>{saveMessage}</p>
            )}
            <div className={`space-y-4 ${isMaximized ? 'max-h-[calc(100vh-250px)] overflow-y-auto' : 'max-h-[60vh] overflow-y-auto'} p-2`}>
                {questions.map((q, index) => (
                    <div key={q.letter} className={`p-4 rounded-lg border ${styleProps.borderColor} ${styleProps.inputBgColor}`}>
                        <p className={`font-bold text-xl mb-3 ${styleProps.primaryAccentColor}`}>{t.letter} {q.letter}</p>
                        <div className="space-y-3">
                            <div>
                                <label className={`block text-sm font-medium ${styleProps.mutedTextColor} mb-1`}>{t.question}</label>
                                <textarea value={q.question} onChange={(e) => handleQuestionEdit(index, 'question', e.target.value)} className={`w-full p-2 bg-white dark:bg-slate-800 border ${styleProps.inputBorderColor} rounded-md focus:ring-sky-500 focus:border-sky-500`} rows={3}/>
                            </div>
                            <div>
                                <label className={`block text-sm font-medium ${styleProps.mutedTextColor} mb-1`}>{t.correctAnswer}</label>
                                <input type="text" value={q.answer} onChange={(e) => handleQuestionEdit(index, 'answer', e.target.value)} className={`w-full p-2 bg-white dark:bg-slate-800 border ${styleProps.inputBorderColor} rounded-md focus:ring-sky-500 focus:border-sky-500`}/>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <button onClick={startPlayingFromReview} className="w-full bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-500 text-white font-semibold py-3 px-4 rounded-md transition duration-150 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-300 dark:focus:ring-green-400 focus:ring-opacity-75">
                {t.startGame}
            </button>
        </div>
    );
};

export default ReviewScreen;
