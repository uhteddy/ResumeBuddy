<script lang="ts">
    import { onMount } from 'svelte';
    import { Window } from '@tauri-apps/api/window';
    
    const appWindow = Window.getCurrent();
  
    // Props with defaults
    export let showTitle = true;
    export let title = "Resume Buddy";
    export let theme = "dark"; // "dark" or "light"
    
    let isMaximized = false;
  
    // Update isMaximized state when window state changes
    async function updateMaximizedState() {
      isMaximized = await appWindow.isMaximized();
    }
  
    // Functions to control window
    async function minimizeWindow() {
      await appWindow.minimize();
    }
    
    async function maximizeWindow() {
      if (await appWindow.isMaximized()) {
        await appWindow.unmaximize();
      } else {
        await appWindow.maximize();
      }
      updateMaximizedState();
    }
    
    async function closeWindow() {
      await appWindow.close();
    }
  
    onMount(() => {
        // Initial state
        updateMaximizedState();
        
        // Listen for window changes
        let unlistenMaximize: () => void;
        let unlistenUnmaximize: () => void;
        
        appWindow.listen('tauri://window-maximized', () => {
          isMaximized = true;
        }).then(unlisten => unlistenMaximize = unlisten);
        
        appWindow.listen('tauri://window-unmaximized', () => {
          isMaximized = false;
        }).then(unlisten => unlistenUnmaximize = unlisten);
    
        return () => {
          if (unlistenMaximize) unlistenMaximize();
          if (unlistenUnmaximize) unlistenUnmaximize();
        };
      });
  </script>
  
  <div data-tauri-drag-region class="titlebar {theme}">
    {#if showTitle}
      <div data-tauri-drag-region class="title-text">
        {title}
      </div>
    {/if}
    
    <div class="window-controls">
      <button 
        class="titlebar-button minimize" 
        on:click={minimizeWindow}
        aria-label="Minimize">
        <svg width="12" height="12" viewBox="0 0 12 12">
          <rect width="10" height="1" x="1" y="5.5" fill="currentColor" />
        </svg>
      </button>
      
      <button 
        class="titlebar-button maximize" 
        on:click={maximizeWindow}
        aria-label={isMaximized ? "Restore" : "Maximize"}>
        {#if isMaximized}
          <svg width="12" height="12" viewBox="0 0 12 12">
            <path fill="currentColor" d="M3.5,3.5v5h5v-5H3.5z M2.5,2.5h7v7h-7V2.5z M5,1h7v7h-1V2.5H5V1z" />
          </svg>
        {:else}
          <svg width="12" height="12" viewBox="0 0 12 12">
            <rect width="9" height="9" x="1.5" y="1.5" fill="none" stroke="currentColor" />
          </svg>
        {/if}
      </button>
      
      <button 
        class="titlebar-button close" 
        on:click={closeWindow}
        aria-label="Close">
        <svg width="12" height="12" viewBox="0 0 12 12">
          <path 
            fill="currentColor" 
            d="M6.94 6l2.867-2.867a.67.67 0 0 0-.947-.946L6 5.06 3.133 2.194a.67.67 0 0 0-.946.946L5.06 6 2.194 8.867a.67.67 0 0 0 .946.946L6 6.94l2.867 2.867a.67.67 0 0 0 .946-.946L6.94 6z" 
          />
        </svg>
      </button>
    </div>
  </div>
  
  <style>
    .titlebar {
      height: 32px;
      padding: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: transparent;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 9999;
      -webkit-app-region: drag;
      user-select: none;
    }
  
    .title-text {
      font-size: 13px;
      font-weight: 500;
      padding: 0 12px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      opacity: 0.8;
    }
    
    .window-controls {
      display: flex;
      -webkit-app-region: no-drag;
    }
  
    .titlebar-button {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      width: 46px;
      height: 32px;
      border: none;
      background: transparent;
      outline: none;
      cursor: default;
      transition: background-color 0.2s;
    }
  
    .titlebar-button:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
  
    .titlebar-button.close:hover {
      background-color: #e81123;
    }
  
    .dark {
      color: white;
    }
  
    .light {
      color: #333;
    }
    
    .dark .close:hover {
      color: white;
    }
  
    .light .close:hover {
      color: white;
    }
    
    .light .titlebar-button:hover {
      background-color: rgba(0, 0, 0, 0.06);
    }
  </style>