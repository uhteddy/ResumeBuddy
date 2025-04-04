<script lang="ts">
    import { fade } from 'svelte/transition';
    import { profile, resumes, isLoading, loadAppData } from '$lib/stores/app';
    import { onMount } from 'svelte';

    onMount(async () => {
        await loadAppData();
    });

    // In your component:
    console.log($profile);

    function handleCreateNewResume() {
        // TODO: Implement resume creation flow
        console.log('Create new resume clicked');
    }
</script>

<div class="h-full p-8">
    <div class="max-w-4xl mx-auto">
        <!-- Header -->
        <div class="mb-8">
            <h1 class="text-2xl font-bold text-gray-900">
                Hello, {$profile?.name || 'there'}!
            </h1>
            <p class="mt-1 text-sm text-gray-500">
                {#if $resumes.length === 0}
                    Ready to create your first resume?
                {:else}
                    You have {$resumes.length} resume{$resumes.length === 1 ? '' : 's'}
                {/if}
            </p>
        </div>

        <!-- Create Resume Button -->
        <div class="mb-8">
            <button 
                on:click={handleCreateNewResume}
                class="flex items-center px-4 py-2 text-sm font-medium text-white bg-yellow-600 rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Create New Resume
            </button>
        </div>

        <!-- Resumes List -->
        <div class="space-y-4">
            {#if $isLoading}
                <div class="flex justify-center py-8">
                    <div class="animate-spin rounded-full h-8 w-8 border-4 border-yellow-500 border-t-transparent"></div>
                </div>
            {:else if $resumes.length === 0}
                <div class="text-center py-12 bg-white rounded-lg border border-gray-200">
                    <div class="mb-4">
                        <svg class="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h3 class="text-lg font-medium text-gray-900 mb-2">No Resumes Yet</h3>
                    <p class="text-gray-500">Click the button above to create your first resume</p>
                </div>
            {:else}
                <div class="grid gap-4 sm:grid-cols-2">
                    {#each $resumes as resume (resume.id)}
                        <div class="bg-white rounded-lg border border-gray-200 p-6 hover:border-yellow-500 transition-colors duration-200">
                            <div class="flex items-center justify-between">
                                <div>
                                    <h3 class="text-lg font-medium text-gray-900">{resume.title}</h3>
                                    <p class="text-sm text-gray-500 mt-1">
                                        Created {new Date(resume.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                                <div class="flex items-center space-x-2">
                                    <button 
                                        class="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                                        aria-label="Edit resume"
                                    >
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                        </svg>
                                    </button>
                                    <button 
                                        class="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-gray-100"
                                        aria-label="Delete resume"
                                    >
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    {/each}
                </div>
            {/if}
        </div>
    </div>
</div>