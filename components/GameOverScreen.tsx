
import React from 'react';
import type { Question } from '../types';

interface GameOverScreenProps {
    t: { [key: string]: string };
    theme: 'light' | 'dark';
    styleProps: any;
    isMaximized: boolean;
    questions: Question[];
    score: number;
    message: string;
    resetGame: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ t, theme, styleProps, isMaximized, questions, score, message, resetGame }) => {
    return (
        <div className="text-center py-10 space-y-6">
            <h2 className={`text-4xl font-bold ${styleProps.primaryAccentColor} ${isMaximized ? 'md:text-5xl' : ''}`}>{t.gameOver}</h2>
            <p className={`text-2xl ${isMaximized ? 'md:text-3xl' : ''}`}>{t.finalScore} <span className="text-green-600 dark:text-green-400 font-bold">{score}</span></p>
            {message && <p className={`text-lg p-3 rounded-md ${message.startsWith(t.correct) ? 'bg-green-200 text-green-800 dark:bg-green-700 dark:text-green-200' : 'bg-red-200 text-red-800 dark:bg-red-700 dark:text-red-200'}`}>{message}</p>}
            
            <div className={`bg-opacity-50 p-4 rounded-lg shadow ${isMaximized ? 'max-h-[calc(100vh-300px)] overflow-y-auto' : 'max-h-80 overflow-y-auto'} ${styleProps.inputBgColor}`}>
                <h3 className={`text-xl font-semibold mb-3 ${styleProps.primaryAccentColor} ${isMaximized ? 'md:text-2xl' : ''}`}>{t.summaryRosco}</h3>
                {questions.map(q => (
                    <div key={q.letter} className={`mb-3 rounded-md flex flex-col sm:flex-row justify-between items-start sm:items-center text-left ${isMaximized ? 'p-4 text-base' : 'p-3 text-sm'} ${q.status === 'correct' ? 'bg-green-400 dark:bg-green-600' : q.status === 'incorrect' ? 'bg-red-400 dark:bg-red-600' : 'bg-yellow-400 dark:bg-yellow-500'} ${q.status === 'pasada' && theme === 'light' ? 'text-slate-800' : 'text-white'}`}>
                        <div className="flex-grow mb-2 sm:mb-0">
                            <p className="font-bold"><span className="text-lg">{q.letter}:</span> {q.question}</p>
                            <p className="italic text-xs mt-1">{t.correctAnswerWas} {q.answer}</p>
                            {q.status === 'incorrect' && q.userAnswer && <p className="text-xs mt-1">{t.yourAnswer}: {q.userAnswer}</p>}
                        </div>
                        <span className={`flex-shrink-0 px-3 py-1 rounded font-semibold ${isMaximized ? 'text-sm' : 'text-xs'} ${q.status === 'correct' ? 'bg-green-600 dark:bg-green-800' : q.status === 'incorrect' ? 'bg-red-600 dark:bg-red-800' : 'bg-yellow-600 dark:bg-yellow-700'}`}>
                            {q.status === 'correct' ? t.answeredCorrect : q.status === 'incorrect' ? t.answeredIncorrect : t.passed}
                        </span>
                    </div>
                ))}
            </div>

            <button onClick={resetGame} className={`bg-sky-500 hover:bg-sky-600 dark:bg-sky-600 dark:hover:bg-sky-500 text-white font-semibold rounded-md transition duration-150 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-sky-300 dark:focus:ring-sky-400 ${isMaximized ? 'py-4 px-8 text-xl' : 'py-3 px-6'}`}>
                {t.playAgain}
            </button>
        </div>
    );
};

export default GameOverScreen;
