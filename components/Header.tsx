import React from 'react';
import { SunIcon, MoonIcon, MaximizeIcon, MinimizeIcon, HomeIcon, VolumeUpIcon, VolumeOffIcon } from './icons';

interface HeaderProps {
    t: { [key: string]: string };
    theme: 'light' | 'dark';
    handleThemeChange: (theme: 'light' | 'dark') => void;
    isMaximized: boolean;
    toggleMaximize: () => void;
    styleProps: {
        borderColor: string;
        primaryAccentColor: string;
        buttonSecondaryBg: string;
    };
    onGoToMainMenu?: () => void;
    showGoToMainMenu?: boolean;
    isMuted: boolean;
    handleToggleMute: () => void;
}

const Header: React.FC<HeaderProps> = ({
    t,
    theme,
    handleThemeChange,
    isMaximized,
    toggleMaximize,
    styleProps,
    onGoToMainMenu,
    showGoToMainMenu,
    isMuted,
    handleToggleMute,
}) => {
    return (
        <header className={`flex justify-between items-center mb-6 pb-4 border-b ${styleProps.borderColor} flex-shrink-0`}>
            <h1 className={`text-3xl font-bold ${styleProps.primaryAccentColor}`}>{t.title}</h1>
            <div className="flex items-center space-x-2">
                {showGoToMainMenu && onGoToMainMenu && (
                    <button onClick={onGoToMainMenu} title={t.mainMenu} className={`p-2 rounded-md ${styleProps.buttonSecondaryBg}`}>
                        <HomeIcon />
                    </button>
                )}
                <button onClick={handleToggleMute} title={isMuted ? t.unmute : t.mute} className={`p-2 rounded-md ${styleProps.buttonSecondaryBg}`}>
                    {isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
                </button>
                <button onClick={() => handleThemeChange(theme === 'dark' ? 'light' : 'dark')} title={t.theme} className={`p-2 rounded-md ${styleProps.buttonSecondaryBg}`}>
                    {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
                </button>
                <button onClick={toggleMaximize} title={isMaximized ? t.minimize : t.maximize} className={`p-2 rounded-md ${styleProps.buttonSecondaryBg}`}>
                    {isMaximized ? <MinimizeIcon /> : <MaximizeIcon />}
                </button>
            </div>
        </header>
    );
};

export default Header;
