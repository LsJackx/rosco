
import React from 'react';

interface LoadingSpinnerProps {
    message: string;
    theme: 'light' | 'dark';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message, theme }) => {
    const primaryAccentColor = theme === 'dark' ? 'text-sky-400' : 'text-sky-600';
    const spinnerBorderColor = theme === 'dark' ? 'border-sky-400' : 'border-sky-600';

    return (
        <div className="text-center py-10 flex flex-col items-center justify-center min-h-[300px] md:min-h-[400px]">
            <div className={`animate-spin rounded-full h-16 w-16 border-b-4 ${spinnerBorderColor} mx-auto mb-6`}></div>
            <p className={`text-2xl font-semibold ${primaryAccentColor} mb-3`}>{message}</p>
        </div>
    );
};

export default LoadingSpinner;
