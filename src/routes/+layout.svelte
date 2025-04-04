<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { validateOnboardingSteps, onboardingSteps } from '$lib/stores/onboarding';
    import Database from '@tauri-apps/plugin-sql';
    import '../app.css';
    import TitleBar from '$lib/components/TitleBar.svelte';
    let { children } = $props();

    onMount(async () => {
        const db = await Database.load('sqlite:resume.db');
        const { firstIncompleteStep, isComplete } = await validateOnboardingSteps();
        
        // Get the current path
        const currentPath = window.location.pathname;
        
        // If we're not in the onboarding flow and there are incomplete required steps
        if (!currentPath.startsWith('/on-boarding') && firstIncompleteStep) {
            const targetStep = onboardingSteps.find(step => step.id === firstIncompleteStep);
            if (targetStep) {
                goto(targetStep.route);
                return;
            }
        }
        
        // If we're in the onboarding flow and all required steps are complete
        if (currentPath.startsWith('/on-boarding') && isComplete) {
            goto('/app');
            return;
        }
    });
</script>

<main class="h-screen w-screen flex flex-col rounded-lg overflow-hidden border border-neutral-300 shadow-md">
    <TitleBar />
    <div class="h-full w-full bg-gray-50 rounded-b-lg">
        {@render children()}
    </div>
</main>