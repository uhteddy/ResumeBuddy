<script lang="ts">
    import { onMount } from 'svelte';
    import Database from '@tauri-apps/plugin-sql';
    import { fade } from 'svelte/transition';

    interface Profile {
        id: number;
        name: string;
        email: string;
        phone: string;
        specialty: string;
        ollama_url: string;
        ollama_model: string;
        created_at: string;
        updated_at: string;
    }

    let profile = $state<Profile | null>(null);
    let isLoading = $state(true);
    let error = $state<string | null>(null);
    let database: Database;

    onMount(async () => {
        try {
            console.log('Attempting to connect to database...');
            database = new Database('sqlite:resume.db');
            console.log('Database connection established');

            // First, check if the profiles table exists
            console.log('Checking if profiles table exists...');
            const tableExists = await database.select<{ name: string }[]>(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='profiles'"
            );
            console.log('Table check result:', tableExists);
            
            if (tableExists.length === 0) {
                error = "Profiles table does not exist. Please complete the onboarding process first.";
                return;
            }

            // Get the most recent profile
            console.log('Fetching most recent profile...');
            const result = await database.select<Profile[]>(
                'SELECT * FROM profiles ORDER BY created_at DESC LIMIT 1'
            );
            console.log('Profile fetch result:', result);
            
            if (result.length > 0) {
                profile = result[0];
                console.log('Profile loaded successfully:', profile);
            } else {
                error = "No profile found. Please complete the onboarding process first.";
            }
        } catch (err) {
            console.error('Error loading profile:', err);
            error = `Failed to load profile: ${err instanceof Error ? err.message : 'Unknown error'}`;
        } finally {
            isLoading = false;
        }
    });
</script>

<div class="w-full max-w-2xl mx-auto p-6" in:fade={{ duration: 300 }}>
    <div class="bg-white rounded-2xl shadow-sm p-6">
        <h1 class="text-2xl font-bold text-gray-900 mb-6">Profile Information</h1>
        
        {#if isLoading}
            <div class="flex justify-center py-8">
                <div class="animate-spin rounded-full h-8 w-8 border-4 border-yellow-500 border-t-transparent"></div>
            </div>
        {:else if error}
            <div class="text-center py-8">
                <p class="text-red-500">{error}</p>
                <a href="/on-boarding/1" class="mt-4 inline-block text-yellow-600 hover:text-yellow-700">
                    Go to Onboarding
                </a>
            </div>
        {:else if profile}
            <div class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-1">
                        <h2 class="text-sm font-medium text-gray-500">Name</h2>
                        <p class="text-lg text-gray-900">{profile.name}</p>
                    </div>
                    
                    <div class="space-y-1">
                        <h2 class="text-sm font-medium text-gray-500">Email</h2>
                        <p class="text-lg text-gray-900">{profile.email}</p>
                    </div>
                    
                    <div class="space-y-1">
                        <h2 class="text-sm font-medium text-gray-500">Phone</h2>
                        <p class="text-lg text-gray-900">{profile.phone}</p>
                    </div>
                    
                    <div class="space-y-1">
                        <h2 class="text-sm font-medium text-gray-500">Specialty</h2>
                        <p class="text-lg text-gray-900">{profile.specialty}</p>
                    </div>
                </div>
                
                <div class="border-t border-gray-200 pt-6">
                    <h2 class="text-lg font-semibold text-gray-900 mb-4">Ollama Configuration</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="space-y-1">
                            <h2 class="text-sm font-medium text-gray-500">Ollama URL</h2>
                            <p class="text-lg text-gray-900">{profile.ollama_url}</p>
                        </div>
                        
                        <div class="space-y-1">
                            <h2 class="text-sm font-medium text-gray-500">Selected Model</h2>
                            <p class="text-lg text-gray-900">{profile.ollama_model}</p>
                        </div>
                    </div>
                </div>
                
                <div class="border-t border-gray-200 pt-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="space-y-1">
                            <h2 class="text-sm font-medium text-gray-500">Created At</h2>
                            <p class="text-lg text-gray-900">{new Date(profile.created_at).toLocaleString()}</p>
                        </div>
                        
                        <div class="space-y-1">
                            <h2 class="text-sm font-medium text-gray-500">Last Updated</h2>
                            <p class="text-lg text-gray-900">{new Date(profile.updated_at).toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>
        {:else}
            <div class="text-center py-8">
                <p class="text-gray-500">No profile information found.</p>
                <a href="/on-boarding/1" class="mt-4 inline-block text-yellow-600 hover:text-yellow-700">
                    Go to Onboarding
                </a>
            </div>
        {/if}
    </div>
</div>