<script lang="ts">
    import { onMount } from 'svelte';
    import { validateOnboardingSteps, markStepComplete } from '$lib/stores/onboarding';
    import { loadAppData } from '$lib/stores/app';
    import { page } from '$app/stores';
    import TitleBar from '$lib/components/TitleBar.svelte';
    import ToastContainer from '$lib/components/ToastContainer.svelte';
    import { goto } from '$app/navigation';
    import '../app.css';

    let { children } = $props();

    onMount(async () => {
        const isOnboarding = $page.url.pathname.startsWith('/on-boarding');
        if (!isOnboarding) {
            await validateOnboardingSteps();
            await loadAppData();
        }
    });
</script>

<div class="h-screen flex flex-col">
    <div class="absolute inset-0 bg-gradient-to-b from-white to-gray-50 opacity-50 pointer-events-none rounded-lg"></div>
    <div class="flex-1 flex flex-col border border-gray-200 rounded-lg shadow-xl overflow-hidden relative">
        <TitleBar />
        <div class="flex-1 overflow-hidden">
            {@render children()}
        </div>
        <ToastContainer />
    </div>
</div>