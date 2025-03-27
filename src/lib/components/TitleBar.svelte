<script lang="ts">
    import { getCurrentWindow } from '@tauri-apps/api/window';
    import Icon from '../../resources/icon-32x32.png';
    const appWindow = getCurrentWindow();

    function startDragging(e: MouseEvent) {
        if (e.buttons === 1) {
            e.detail === 2
                ? appWindow.toggleMaximize()
                : appWindow.startDragging();
        }
    }
    
    async function minimizeWindow() {
        await appWindow.minimize();
    }
    
    async function toggleMaximize() {
        await appWindow.toggleMaximize();
    }
    
    async function closeWindow() {
        await appWindow.close();
    }
</script>

<div 
    data-tauri-drag-region 
    class="titlebar w-screen h-10 bg-gradient-to-r from-white to-gray-50 border-b border-yellow-500/10
    shadow-sm flex items-center justify-between px-4 mb-[1px]"
    onmousedown={startDragging}
    role="button"
>
    <!-- App Logo/Name -->
    <div class="flex items-center gap-2">
        <img src={Icon} class="w-4 h-4 rounded-sm " alt="Resume Buddy Icon" />
        <span class="text-gray-700 font-medium tracking-tight text-sm">Resume Buddy</span>
    </div>
    
    <!-- Window Controls -->
    <div class="flex items-center gap-1.5">
        <button 
            onclick={minimizeWindow}
            class="group h-6 w-6 rounded-full flex items-center justify-center hover:bg-gray-100 transition-all duration-200"
            aria-label="Minimize"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400 group-hover:text-yellow-500 transition-colors">
                <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
        </button>
        
        <button 
            onclick={toggleMaximize}
            class="group h-6 w-6 rounded-full flex items-center justify-center hover:bg-gray-100 transition-all duration-200"
            aria-label="Maximize"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400 group-hover:text-yellow-500 transition-colors">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            </svg>
        </button>
        
        <button 
            onclick={closeWindow}
            class="group h-6 w-6 rounded-full flex items-center justify-center hover:bg-red-50 transition-all duration-200"
            aria-label="Close"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400 group-hover:text-red-500 transition-colors">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        </button>
    </div>
</div>