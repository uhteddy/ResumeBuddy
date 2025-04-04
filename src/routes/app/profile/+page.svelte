<script lang="ts">
    import { profile } from '$lib/stores/app';
    import { fade } from 'svelte/transition';
    import Database from '@tauri-apps/plugin-sql';
    import InputField from '$lib/components/InputField.svelte';
    
    let isEditing = $state(false);
    let editedProfile = $state({ ...$profile });
    let isLoading = $state(false);
    
    async function handleSave() {
        isLoading = true;
        try {
            const database = await Database.load('sqlite:resume.db');
            await database.execute(
                'UPDATE profiles SET name = ?, email = ?, phone = ?, specialty = ?, description = ?, address = ?, github_url = ?, linkedin_url = ? WHERE id = ?',
                [
                    editedProfile.name,
                    editedProfile.email,
                    editedProfile.phone,
                    editedProfile.specialty,
                    editedProfile.description,
                    editedProfile.address,
                    editedProfile.github_url,
                    editedProfile.linkedin_url,
                    1 // Assuming profile ID is 1
                ]
            );
            profile.set(editedProfile);
            isEditing = false;
        } catch (error) {
            console.error('Error updating profile:', error);
        } finally {
            isLoading = false;
        }
    }
</script>

<div class="h-full p-8" in:fade={{ duration: 300 }}>
    <div class="max-w-4xl mx-auto">
        <div class="mb-8">
            <h1 class="text-2xl font-bold text-gray-900">Profile Settings</h1>
            <p class="mt-1 text-sm text-gray-500">Manage your personal information and preferences</p>
        </div>

        <div class="bg-white rounded-lg border border-gray-200 p-8">
            <div class="space-y-8">
                <!-- Basic Information -->
                <div>
                    <h2 class="text-lg font-medium text-gray-900 mb-6">Basic Information</h2>
                    <div class="grid gap-6 sm:grid-cols-2">
                        <InputField
                            label="Name"
                            type="text"
                            bind:value={editedProfile.name}
                            disabled={!isEditing}
                            placeholder="Enter your name"
                        />
                        <InputField
                            label="Email"
                            type="email"
                            bind:value={editedProfile.email}
                            disabled={!isEditing}
                            placeholder="Enter your email"
                        />
                        <InputField
                            label="Phone"
                            type="tel"
                            bind:value={editedProfile.phone}
                            disabled={!isEditing}
                            placeholder="Enter your phone number"
                        />
                        <InputField
                            label="Specialty"
                            type="text"
                            bind:value={editedProfile.specialty}
                            disabled={!isEditing}
                            placeholder="Enter your specialty"
                        />
                    </div>
                </div>

                <!-- Additional Information -->
                <div>
                    <h2 class="text-lg font-medium text-gray-900 mb-6">Additional Information</h2>
                    <div class="space-y-6">
                        <InputField
                            label="Description"
                            type="textarea"
                            bind:value={editedProfile.description}
                            disabled={!isEditing}
                            placeholder="Tell us about yourself"
                            rows="4"
                        />
                        <InputField
                            label="Address"
                            type="text"
                            bind:value={editedProfile.address}
                            disabled={!isEditing}
                            placeholder="Enter your address"
                        />
                    </div>
                </div>

                <!-- Social Links -->
                <div>
                    <h2 class="text-lg font-medium text-gray-900 mb-6">Social Links</h2>
                    <div class="grid gap-6 sm:grid-cols-2">
                        <InputField
                            label="GitHub"
                            type="url"
                            bind:value={editedProfile.github_url}
                            disabled={!isEditing}
                            placeholder="https://github.com/username"
                        />
                        <InputField
                            label="LinkedIn"
                            type="url"
                            bind:value={editedProfile.linkedin_url}
                            disabled={!isEditing}
                            placeholder="https://linkedin.com/in/username"
                        />
                    </div>
                </div>
            </div>

            <div class="mt-8 flex justify-end space-x-4">
                {#if isEditing}
                    <button
                        type="button"
                        on:click={() => {
                            editedProfile = { ...$profile };
                            isEditing = false;
                        }}
                        class="px-6 py-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        on:click={handleSave}
                        disabled={isLoading}
                        class="px-6 py-3 text-base font-medium text-white bg-yellow-600 rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                    >
                        {#if isLoading}
                            <span class="flex items-center">
                                <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Saving...
                            </span>
                        {:else}
                            Save Changes
                        {/if}
                    </button>
                {:else}
                    <button
                        type="button"
                        on:click={() => isEditing = true}
                        class="px-6 py-3 text-base font-medium text-white bg-yellow-600 rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                    >
                        Edit Profile
                    </button>
                {/if}
            </div>
        </div>
    </div>
</div> 