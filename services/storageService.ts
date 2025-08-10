import type { SavedRosco, RoscoData } from '../types';

export const PREFS_KEY = 'pasapalabra_preferences';
export const ROSCOS_KEY = 'pasapalabra_roscos';

export interface Preferences {
    theme?: 'light' | 'dark';
    questionDisplaySize?: string;
    isMuted?: boolean;
    questionGenLanguage?: string;
}

// --- Preferences ---

export const loadPreferences = (): Preferences => {
    try {
        const prefs = localStorage.getItem(PREFS_KEY);
        return prefs ? JSON.parse(prefs) : {};
    } catch (error) {
        console.error("Error loading preferences from localStorage:", error);
        return {};
    }
};

export const savePreferences = (prefs: Preferences) => {
    try {
        const currentPrefs = loadPreferences();
        const newPrefs = { ...currentPrefs, ...prefs };
        localStorage.setItem(PREFS_KEY, JSON.stringify(newPrefs));
    } catch (error) {
        console.error("Error saving preferences to localStorage:", error);
    }
};

// --- Roscos ---

export const loadRoscos = (): SavedRosco[] => {
    try {
        const roscos = localStorage.getItem(ROSCOS_KEY);
        return roscos ? JSON.parse(roscos) : [];
    } catch (error) {
        console.error("Error loading roscos from localStorage:", error);
        return [];
    }
};

export const saveRosco = (roscoData: Omit<RoscoData, 'createdAt'>): SavedRosco[] => {
    try {
        const roscos = loadRoscos();
        const newRosco: SavedRosco = {
            ...roscoData,
            id: new Date().toISOString(), // Unique ID based on timestamp
            createdAt: new Date().toISOString(),
        };
        const updatedRoscos = [...roscos, newRosco];
        localStorage.setItem(ROSCOS_KEY, JSON.stringify(updatedRoscos));
        return updatedRoscos;
    } catch (error) {
        console.error("Error saving rosco to localStorage:", error);
        throw error; // re-throw to be caught by the caller
    }
};
