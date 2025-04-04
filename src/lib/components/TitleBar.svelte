<script lang="ts">
    import { getCurrentWindow } from '@tauri-apps/api/window';
    import { onMount } from 'svelte';
    import Icon from '../../resources/icon-32x32.png';

    const appWindow = getCurrentWindow();
    let isMaximized = $state(false);

    onMount(async () => {
        isMaximized = await appWindow.isMaximized();
    });

    async function toggleMaximize() {
        if (isMaximized) {
            await appWindow.unmaximize();
        } else {
            await appWindow.maximize();
        }
        isMaximized = !isMaximized;
    }
</script>

<div 
    data-tauri-drag-region 
    class="titlebar w-screen h-10 bg-white border-b border-neutral-200/50
    shadow-sm flex items-center justify-between px-4 rounded-t-lg"
>
    <!-- App Logo/Name -->
    <div class="flex items-center gap-2">
        <img src={Icon} class="w-4 h-4 rounded-sm" alt="Resume Buddy Icon" />
        <span class="text-gray-800 font-medium tracking-tight text-sm">Resume Buddy</span>
    </div>
    
    <!-- Window Controls -->
    <div class="flex items-center gap-1.5">
        <button
            class="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded transition-colors duration-200"
            on:click={() => appWindow.minimize()}
            aria-label="Minimize"
        >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
            </svg>
        </button>
        <button
            class="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded transition-colors duration-200"
            on:click={toggleMaximize}
            aria-label={isMaximized ? "Restore" : "Maximize"}
        >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {#if isMaximized}
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5h-4m4 0v-4m0 4l-5-5" />
                {:else}
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5h-4m4 0v-4m0 4l-5-5" />
                {/if}
            </svg>
        </button>
        <button
            class="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-red-500 hover:text-white rounded transition-colors duration-200"
            on:click={() => appWindow.close()}
            aria-label="Close"
        >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
    </div>
</div>