import { writable } from 'svelte/store';

interface OllamaSettings {
    host: string;
    model: string;
    availableModels: string[];
}

const defaultSettings: OllamaSettings = {
    host: 'http://localhost:11434',
    model: 'llama2',
    availableModels: []
};

function createOllamaStore() {
    const { subscribe, set, update } = writable<OllamaSettings>(defaultSettings);

    return {
        subscribe,
        set,
        update,
        reset: () => set(defaultSettings),
        fetchModels: async (host: string) => {
            try {
                const response = await fetch(`${host}/api/tags`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                update(settings => ({
                    ...settings,
                    availableModels: data.models.map((m: any) => m.name)
                }));
            } catch (error) {
                console.error('Failed to fetch models:', error);
                update(settings => ({
                    ...settings,
                    availableModels: []
                }));
            }
        }
    };
}

export const ollama = createOllamaStore(); 