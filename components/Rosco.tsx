
import React from 'react';
import type { Question } from '../types';
import { GamePhase } from '../types';

interface RoscoProps {
    questions: Question[];
    currentQuestionIndex: number;
    gamePhase: GamePhase;
    isMaximized: boolean;
    theme: 'light' | 'dark';
    score: number;
    timeLeft: number;
    t: { [key: string]: string };
}

const Rosco: React.FC<RoscoProps> = ({ questions, currentQuestionIndex, gamePhase, isMaximized, theme, score, timeLeft, t }) => {
    if (!questions || questions.length === 0) return null;

    const roscoRadius = isMaximized ? 230 : 160;
    const letterSize = isMaximized ? 42 : 34;
    const containerSize = (roscoRadius + 20 + letterSize / 2) * 2;
    const centerX = containerSize / 2;
    const centerY = containerSize / 2;

    return (
        <div className="relative my-4 mx-auto transition-all duration-300" style={{ width: `${containerSize}px`, height: `${containerSize}px` }}>
            {questions.map((q, index) => {
                const angle = (index / questions.length) * 2 * Math.PI - (Math.PI / 2);
                const x = centerX + roscoRadius * Math.cos(angle) - letterSize / 2;
                const y = centerY + roscoRadius * Math.sin(angle) - letterSize / 2;

                let bgColor = theme === 'dark' ? 'bg-slate-600' : 'bg-gray-300';
                if (q.status === 'correct') bgColor = 'bg-green-500';
                else if (q.status === 'incorrect') bgColor = 'bg-red-500';
                else if (q.status === 'pasada') bgColor = 'bg-yellow-400';

                let textColor = (q.status === 'correct' || q.status === 'incorrect') ? 'text-white' : (theme === 'dark' ? 'text-slate-200' : 'text-black');
                let border = (index === currentQuestionIndex && gamePhase === GamePhase.PLAYING) ? (theme === 'dark' ? 'border-4 border-sky-400' : 'border-4 border-blue-600') : '';

                return (
                    <div
                        key={q.letter}
                        className={`absolute rounded-full flex items-center justify-center font-bold transition-all duration-300 ${bgColor} ${textColor} ${border}`}
                        style={{ width: `${letterSize}px`, height: `${letterSize}px`, left: `${x}px`, top: `${y}px`, fontSize: isMaximized ? '1.25rem' : '1rem' }}
                    >
                        {q.letter}
                    </div>
                );
            })}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                {gamePhase === GamePhase.PLAYING && questions[currentQuestionIndex] && (
                    <>
                        <div className={`font-bold mb-2 ${theme === 'dark' ? 'text-sky-300' : 'text-sky-600'} ${isMaximized ? 'text-8xl' : 'text-6xl'}`}>{questions[currentQuestionIndex].letter}</div>
                        <div className={`${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'} ${isMaximized ? 'text-xl' : 'text-md'}`}>{t.score} {score}</div>
                        <div className={`${theme === 'dark' ? 'text-slate-400' : 'text-gray-600'} ${isMaximized ? 'text-xl' : 'text-md'}`}>{t.timeLeft} {timeLeft}s</div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Rosco;
