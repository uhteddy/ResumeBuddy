import { writable } from 'svelte/store';
import Database from '@tauri-apps/plugin-sql';

interface Profile {
    id: number;
    name?: string;
    email?: string;
    phone?: string;
    specialty?: string;
    ollama_url?: string;
    ollama_model?: string;
}

export interface OnboardingStep {
    id: string;
    title: string;
    description: string;
    route: string;
    validate: (db: Database) => Promise<boolean>;
    isRequired: boolean;
}

export interface OnboardingState {
    currentStep: string | null;
    completedSteps: Set<string>;
    isComplete: boolean;
}

// Initialize the store with default state
const initialState: OnboardingState = {
    currentStep: null,
    completedSteps: new Set(),
    isComplete: false
};

export const onboardingStore = writable<OnboardingState>(initialState);

// Define all onboarding steps
export const onboardingSteps: OnboardingStep[] = [
    {
        id: 'name',
        title: 'Your Name',
        description: 'Let\'s get to know each other, what\'s your name?',
        route: '/on-boarding/1',
        validate: async (db) => {
            const result = await db.select<Profile[]>('SELECT name FROM profiles WHERE id = ?', [1]);
            return result.length > 0 && result[0].name != null && result[0].name.trim() !== '';
        },
        isRequired: true
    },
    {
        id: 'contact',
        title: 'Contact Information',
        description: 'We just need a few more details before you can generate your resume.',
        route: '/on-boarding/2',
        validate: async (db) => {
            const result = await db.select<Profile[]>('SELECT email, phone, specialty FROM profiles WHERE id = ?', [1]);
            return result.length > 0 && 
                   result[0].email != null && 
                   result[0].email.trim() !== '' &&
                   result[0].phone != null &&
                   result[0].phone.trim() !== '' &&
                   result[0].specialty != null &&
                   result[0].specialty.trim() !== '';
        },
        isRequired: false
    },
    {
        id: 'ollama',
        title: 'Ollama Configuration',
        description: 'Configure your Ollama instance for AI-powered resume generation.',
        route: '/on-boarding/3',
        validate: async (db) => {
            const result = await db.select<Profile[]>('SELECT ollama_url, ollama_model FROM profiles WHERE id = ?', [1]);
            return result.length > 0 && 
                   result[0].ollama_url != null && 
                   result[0].ollama_url.trim() !== '' &&
                   result[0].ollama_model != null &&
                   result[0].ollama_model.trim() !== '';
        },
        isRequired: true
    }
];

// Function to validate all steps and update the store
export async function validateOnboardingSteps() {
    const db = await Database.load('sqlite:resume.db');
    const completedSteps = new Set<string>();
    let firstIncompleteStep: string | null = null;

    // First, get the current state
    let currentState: OnboardingState = {
        currentStep: null,
        completedSteps: new Set(),
        isComplete: false
    };
    
    onboardingStore.subscribe(state => {
        currentState = state;
    })();

    // Check each step
    for (const step of onboardingSteps) {
        // If the step is already marked as complete in the store, skip validation
        if (currentState.completedSteps.has(step.id)) {
            completedSteps.add(step.id);
            continue;
        }

        const isValid = await step.validate(db);
        if (isValid) {
            completedSteps.add(step.id);
        } else if (!firstIncompleteStep && step.isRequired) {
            firstIncompleteStep = step.id;
        }
    }

    const isComplete = onboardingSteps.every(step => !step.isRequired || completedSteps.has(step.id));

    onboardingStore.update(state => ({
        ...state,
        currentStep: firstIncompleteStep,
        completedSteps,
        isComplete
    }));

    return { firstIncompleteStep, isComplete };
}

// Function to get the next incomplete step
export async function getNextIncompleteStep() {
    const db = await Database.load('sqlite:resume.db');
    
    // Get the current path from the URL
    const currentPath = window.location.pathname;
    const currentStep = onboardingSteps.find(step => step.route === currentPath);
    
    if (!currentStep) {
        // If we can't find the current step, start from the beginning
        for (const step of onboardingSteps) {
            const isValid = await step.validate(db);
            if (!isValid) {
                return step;
            }
        }
        return null;
    }
    
    // Find the current step index
    const currentIndex = onboardingSteps.findIndex(step => step.id === currentStep.id);
    
    // Start checking from the next step
    for (let i = currentIndex + 1; i < onboardingSteps.length; i++) {
        const step = onboardingSteps[i];
        const isValid = await step.validate(db);
        if (!isValid) {
            return step;
        }
    }
    
    // If we've checked all steps and they're all valid, return null
    return null;
}

// Function to mark a step as complete
export function markStepComplete(stepId: string) {
    onboardingStore.update(state => {
        const completedSteps = new Set(state.completedSteps);
        completedSteps.add(stepId);
        
        // Check if all required steps are complete
        const isComplete = onboardingSteps.every(step => !step.isRequired || completedSteps.has(step.id));
        
        return {
            ...state,
            completedSteps,
            isComplete
        };
    });
}

// Function to get the next step
export function getNextStep(currentStepId: string): OnboardingStep | null {
    const currentIndex = onboardingSteps.findIndex(step => step.id === currentStepId);
    if (currentIndex === -1 || currentIndex === onboardingSteps.length - 1) {
        return null;
    }
    return onboardingSteps[currentIndex + 1];
}

// Function to get the previous step
export function getPreviousStep(currentStepId: string): OnboardingStep | null {
    const currentIndex = onboardingSteps.findIndex(step => step.id === currentStepId);
    if (currentIndex <= 0) {
        return null;
    }
    return onboardingSteps[currentIndex - 1];
} 