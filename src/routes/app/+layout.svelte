<script lang="ts">
    import { page } from '$app/stores';
    import { profile } from '$lib/stores/app';
    import { fade } from 'svelte/transition';
    
    let isSidebarOpen = $state(true);
    let { children } = $props();
    
    const navigation = [
        { 
            name: 'Resumes', 
            href: '/app', 
            icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' 
        },
        { 
            name: 'Profile', 
            href: '/app/profile', 
            icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' 
        }
    ];
</script>

<div class="flex h-screen bg-white">
    <!-- Sidebar -->
    <div
        class="fixed left-0 top-8 h-[calc(100vh-2rem)] bg-white border-r border-gray-200 transition-all duration-300 ease-in-out {isSidebarOpen ? 'w-64' : 'w-12'}"
        style="transform: translateX({isSidebarOpen ? '0' : '-100%'});"
    >
        <div class="h-full flex flex-col">
            <!-- Navigation -->
            <nav class="flex-1 py-4">
                {#each navigation as item}
                    <a
                        href={item.href}
                        class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200 {item.href === $page.url.pathname ? 'bg-gray-100' : ''}"
                    >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={item.icon} />
                        </svg>
                        {#if isSidebarOpen}
                            <span class="ml-3">{item.name}</span>
                        {/if}
                    </a>
                {/each}
            </nav>

            <!-- User Profile -->
            {#if isSidebarOpen}
                <div class="p-4 border-t border-gray-200">
                    <div class="flex items-center">
                        <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <span class="text-gray-600 text-sm font-medium">
                                {$profile?.name?.charAt(0) || '?'}
                            </span>
                        </div>
                        <div class="ml-3">
                            <p class="text-sm font-medium text-gray-900">{$profile?.name || 'Guest'}</p>
                            <p class="text-xs text-gray-500">{$profile?.email || 'No email'}</p>
                        </div>
                    </div>
                </div>
            {/if}
        </div>
    </div>

    <!-- Toggle Button -->
    <button
        class="fixed top-12 left-0 w-8 h-8 flex items-center justify-center bg-white border-l border-r border-gray-200 shadow-sm transition-all duration-300 ease-in-out {isSidebarOpen ? 'left-64' : 'left-0'} rounded-r-md"
        on:click={() => (isSidebarOpen = !isSidebarOpen)}
        aria-label={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
    >
        <svg
            class="w-5 h-5 text-gray-500 transition-transform duration-300"
            class:rotate-180={isSidebarOpen}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
    </button>

    <!-- Main Content -->
    <main class="flex-1 overflow-auto transition-all duration-300 ease-in-out {isSidebarOpen ? 'ml-64' : 'ml-0'}">
        <div class="p-6">
            <slot />
        </div>
    </main>
</div> 