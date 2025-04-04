<script lang="ts">
    import { onboardingSteps } from '$lib/stores/onboarding';

    const { completedSteps } = $props<{
        completedSteps: Set<string>;
    }>();

    const totalSteps = $derived(onboardingSteps.length);
    const progress = $derived((completedSteps.size / totalSteps) * 100);
</script>

<div class="fixed bottom-0 left-0 right-0 h-1 bg-gray-100">
    <div
        class="h-full bg-yellow-500 transition-all duration-300"
        style="width: {progress}%"
    ></div>
</div> 