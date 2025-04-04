<script lang="ts">
    import { fade } from 'svelte/transition';
    
    const { isTransitioning } = $props<{
        isTransitioning: boolean;
    }>();
</script>

{#if isTransitioning}
    <div
        transition:fade={{ duration: 200 }}
        class="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center"
    >
        <div class="animate-spin rounded-full h-8 w-8 border-4 border-yellow-500 border-t-transparent"></div>
    </div>
{/if} 