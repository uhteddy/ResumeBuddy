<script lang="ts">
    const { currentStep, totalSteps } = $props<{
        currentStep: number;
        totalSteps: number;
    }>();
    
    const progress = $derived((currentStep / totalSteps) * 100);
</script>

<div class="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
    <div
        class="h-full bg-yellow-500 transition-all duration-300"
        style="width: {progress}%"
    ></div>
</div> 