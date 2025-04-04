<script lang="ts">
    import { fade } from 'svelte/transition';
    import { goto } from '$app/navigation';
    import Database from '@tauri-apps/plugin-sql';
    import Input from '$lib/components/forms/Input.svelte';
    import PrimaryButton from '$lib/components/PrimaryButton.svelte';
    import FormContainer from '$lib/components/forms/FormContainer.svelte';
    import LoadingOverlay from '$lib/components/layout/LoadingOverlay.svelte';
    import { markStepComplete, getNextIncompleteStep } from '$lib/stores/onboarding';

    let userName = $state('');
    let isTransitioning = $state(false);
    let database: Database;

    async function handleSubmit() {
        if (!userName.trim()) return;
        
        isTransitioning = true;
        try {
            // First, check if a profile exists
            const existingProfile = await database.select<{ id: number }[]>(
                'SELECT id FROM profiles WHERE id = ?',
                [1]
            );

            if (existingProfile.length === 0) {
                // Create the initial profile with all required fields
                await database.execute(
                    `INSERT INTO profiles (
                        id, 
                        name, 
                        email, 
                        phone, 
                        specialty, 
                        ollama_url, 
                        ollama_model,
                        created_at, 
                        updated_at
                    ) VALUES (?, ?, '', '', '', '', '', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
                    [1, userName.trim()]
                );
            } else {
                // Update the existing profile
                await database.execute(
                    'UPDATE profiles SET name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
                    [userName.trim(), 1]
                );
            }
            
            // Mark this step as complete
            markStepComplete('name');
            
            // Wait for the loading animation
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Get the next incomplete step
            const nextStep = await getNextIncompleteStep();
            
            // If there's a next step, go to it, otherwise go to the app
            if (nextStep) {
                await goto(nextStep.route);
            } else {
                await goto('/app');
            }
        } catch (error) {
            console.error('Error saving name:', error);
            isTransitioning = false;
        }
    }

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleSubmit();
        }
    }

    $effect(() => {
        database = new Database('sqlite:resume.db');
    });
</script>

<div class="w-full max-w-md" in:fade={{ duration: 300 }}>
    <FormContainer title="Welcome to Resume Buddy" subtitle="Let's get started by getting to know you better.">
        <div class="space-y-4">
            <Input
                value={userName}
                type="text"
                label="What's your name?"
                placeholder="Enter your full name"
                onInput={(e) => userName = e}
                onKeydown={(e) => handleKeydown(e)}
            />
            
            <PrimaryButton
                disabled={!userName.trim()}
                onclick={handleSubmit}
                fullWidth={true}
                type="button"
            >
                Continue
            </PrimaryButton>
        </div>
    </FormContainer>
</div>

{#if isTransitioning}
    <LoadingOverlay isTransitioning={isTransitioning} />
{/if}