<script lang="ts">
    import { page } from '$app/stores';
    import { fade } from 'svelte/transition';
    import { loadAppData } from '$lib/stores/app';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { validateOnboardingSteps, onboardingSteps } from '$lib/stores/onboarding';
    import '../app.css';
    import TitleBar from '$lib/components/TitleBar.svelte';
    let { children } = $props();

    onMount(async () => {
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

        // Load app data if we're not in onboarding
        if (!currentPath.startsWith('/on-boarding')) {
            await loadAppData();
        }
    });
</script>

<div class="h-screen flex flex-col bg-transparent">
    <TitleBar />
    <div class="flex-1 overflow-hidden rounded-b-lg bg-white overflow-clip">
        {@render children()}
    </div>
</div>