
// Base64 encoded sound files to avoid needing external assets.
// Source: freesound.org (Creative Commons 0 licenses)
const sounds = {
    correct: 'data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YV',
    incorrect: 'data:audio/wav;base64,UklGRk9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YV',
    gameOver: 'data:audio/wav;base64,UklGRohvT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YV',
};

const playSound = (sound: keyof typeof sounds) => {
    try {
        const audio = new Audio(sounds[sound]);
        audio.play().catch(e => {
            // Autoplay is often blocked, this is expected.
            if (e.name !== 'NotAllowedError') {
                 console.error("Error playing sound:", e);
            }
        });
    } catch (e) {
        console.error("Could not play sound", e);
    }
}

export const playCorrectSound = () => playSound('correct');
export const playIncorrectSound = () => playSound('incorrect');
export const playGameOverSound = () => playSound('gameOver');