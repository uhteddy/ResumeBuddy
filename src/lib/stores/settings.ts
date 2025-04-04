import { writable } from 'svelte/store';

export interface OllamaSettings {
    baseUrl: string;
    defaultModel: string;
}

const defaultSettings: OllamaSettings = {
    baseUrl: 'http://localhost:11434',
    defaultModel: 'llama2'
};

function createSettingsStore() {
    const storedSettings = localStorage.getItem('ollamaSettings');
    const initialSettings = storedSettings ? JSON.parse(storedSettings) : defaultSettings;

    const { subscribe, set, update } = writable<OllamaSettings>(initialSettings);

    return {
        subscribe,
        set,
        update,
        load: async () => {
            const stored = localStorage.getItem('ollamaSettings');
            if (stored) {
                set(JSON.parse(stored));
            } else {
                set(defaultSettings);
            }
        },
        save: async (settings: OllamaSettings) => {
            localStorage.setItem('ollamaSettings', JSON.stringify(settings));
            set(settings);
        }
    };
}

export const settings = createSettingsStore();
export const ollamaSettings = settings;
export const updateOllamaSettings = settings.save; 