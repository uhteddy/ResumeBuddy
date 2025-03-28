<script lang="ts">
    let {
        type = 'button' as 'button' | 'submit' | 'reset',
        disabled = false,
        fullWidth = false,
        showArrow = true,
        pulseEffect = false,
        children
    } = $props();
</script>

<button 
    {type}
    {disabled}
    class="relative group bg-gradient-to-r from-yellow-500 to-amber-500 
           hover:from-yellow-400 hover:to-amber-400 text-white font-medium 
           py-3 px-4 rounded-lg transition-all duration-200 
           {fullWidth ? 'w-full' : ''}
           flex items-center justify-center gap-2
           {disabled ? 'opacity-60 cursor-not-allowed' : 'shadow-md hover:shadow-lg'}"
>
    {@render children()}
    
    {#if showArrow}
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transition-transform group-hover:translate-x-0.5" 
            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" 
            stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
    {/if}
    
    {#if pulseEffect}
        <span class="button-pulse"></span>
    {/if}
</button>

<style>
    .button-pulse {
        position: absolute;
        inset: 0;
        border-radius: 0.5rem;
        background: rgba(255, 255, 255, 0.2);
        opacity: 0;
        transform: scale(0.8);
        animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
        0% {
            transform: scale(0.95);
            opacity: 0;
        }
        50% {
            transform: scale(1);
            opacity: 0.2;
        }
        100% {
            transform: scale(1.05);
            opacity: 0;
        }
    }
</style>