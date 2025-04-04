<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { goto } from '$app/navigation';
    import { validateOnboardingSteps, onboardingStore, onboardingSteps, markStepComplete, getNextIncompleteStep } from '$lib/stores/onboarding';
    import BlurFade from '$lib/components/BlurFade.svelte';
    import Database from '@tauri-apps/plugin-sql';
    import ProgressBar from '$lib/components/layout/ProgressBar.svelte';

    let database: Database | undefined = $state(undefined);
    let currentStep: string | null = $state(null);
    let completedSteps: Set<string> = $state(new Set());
    let isComplete = $state(false);

    // Subscribe to the onboarding store
    const unsubscribe = onboardingStore.subscribe(state => {
        currentStep = state.currentStep;
        completedSteps = state.completedSteps;
        isComplete = state.isComplete;
    });

    onMount(async () => {
        // Load database
        database = await Database.load('sqlite:resume.db');

        // Validate all steps
        const { firstIncompleteStep, isComplete: onboardingComplete } = await validateOnboardingSteps();

        // If all required steps are complete, redirect to app
        if (onboardingComplete) {
            goto('/app');
            return;
        }

        // If there's an incomplete step and we're not already on it, redirect
        if (firstIncompleteStep) {
            const currentPath = window.location.pathname;
            const targetStep = onboardingSteps.find(step => step.id === firstIncompleteStep);
            
            if (targetStep && !currentPath.includes(targetStep.route)) {
                goto(targetStep.route);
            }
        }
    });

    // Cleanup subscription
    onDestroy(() => {
        unsubscribe();
    });
</script>

<div class="min-h-screen flex flex-col">
    <main class="flex-1 flex items-center justify-center p-4">
        <slot />
    </main>
    
    <ProgressBar completedSteps={completedSteps} />
    
    <div class="fixed bottom-0 left-0 right-0 w-full py-2 bg-white border-t border-neutral-200 text-center z-50 border-b border-r border-l">
        <div class="flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-yellow-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
            <span class="text-xs font-medium text-gray-800">All information is stored locally on your device only</span>
        </div>
    </div>
</div> 