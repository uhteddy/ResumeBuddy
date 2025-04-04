<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { validateOnboardingSteps, onboardingSteps } from '$lib/stores/onboarding';
  import Database from '@tauri-apps/plugin-sql';
  import { fade } from 'svelte/transition';

  let isLoading = $state(true);
  let showContent = $state(false);

  onMount(async () => {
    // Show the splash screen for at least 1.5 seconds
    const minimumShowTime = new Promise(resolve => setTimeout(resolve, 1500));

    // Load database and check onboarding status
    const db = await Database.load('sqlite:resume.db');
    const { firstIncompleteStep, isComplete } = await validateOnboardingSteps();

    // Wait for minimum show time
    await minimumShowTime;

    // Hide loading state
    isLoading = false;

    // Wait for fade out animation
    await new Promise(resolve => setTimeout(resolve, 300));

    // Navigate based on onboarding status
    if (firstIncompleteStep) {
      const targetStep = onboardingSteps.find(step => step.id === firstIncompleteStep);
      if (targetStep) {
        goto(targetStep.route);
      }
    } else if (isComplete) {
      goto('/app');
    }
  });
</script>

<div class="h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-white">
  <div class="text-center" in:fade={{ duration: 300 }}>
    <div class="mb-8">
      <svg class="w-24 h-24 mx-auto text-yellow-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
      </svg>
    </div>
    
    <h1 class="text-4xl font-bold text-gray-900 mb-2">Resume Buddy</h1>
    <p class="text-gray-600 mb-8">Your personal resume assistant</p>
    
    {#if isLoading}
      <div class="flex justify-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
      </div>
    {/if}
  </div>
</div>