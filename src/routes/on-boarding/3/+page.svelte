<script lang="ts">
    import { fade } from 'svelte/transition';
    import { goto } from '$app/navigation';
    import Database from '@tauri-apps/plugin-sql';
    import Input from '$lib/components/forms/Input.svelte';
    import Select from '$lib/components/forms/Select.svelte';
    import PrimaryButton from '$lib/components/PrimaryButton.svelte';
    import FormContainer from '$lib/components/forms/FormContainer.svelte';
    import LoadingOverlay from '$lib/components/layout/LoadingOverlay.svelte';
    import { markStepComplete } from '$lib/stores/onboarding';

    let ollamaUrl = $state('http://localhost:11434');
    let selectedModel = $state('');
    let availableModels = $state<string[]>([]);
    let isTestingConnection = $state(false);
    let isTransitioning = $state(false);
    let connectionError = $state<string | null>(null);
    let database: Database;

    async function testOllamaConnection() {
        isTestingConnection = true;
        connectionError = null;
        
        try {
            // Test the connection
            const response = await fetch(`${ollamaUrl}/api/tags`);
            if (!response.ok) {
                throw new Error('Failed to connect to Ollama instance');
            }
            
            const data = await response.json();
            availableModels = data.models.map((model: any) => model.name);
            
            if (availableModels.length === 0) {
                throw new Error('No models found in Ollama instance');
            }
            
            // Auto-select the first model if none is selected
            if (!selectedModel && availableModels.length > 0) {
                selectedModel = availableModels[0];
            }
            
            return true;
        } catch (error) {
            connectionError = error instanceof Error ? error.message : 'Failed to connect to Ollama instance';
            return false;
        } finally {
            isTestingConnection = false;
        }
    }

    async function handleSubmit() {
        if (!ollamaUrl.trim() || !selectedModel.trim()) return;
        
        isTransitioning = true;
        try {
            // Test the connection first
            const isValid = await testOllamaConnection();
            if (!isValid) {
                isTransitioning = false;
                return;
            }
            
            // Update the profile with ID 1
            await database.execute(
                'UPDATE profiles SET ollama_url = ?, ollama_model = ? WHERE id = ?',
                [ollamaUrl.trim(), selectedModel.trim(), 1]
            );
            
            // Mark this step as complete
            markStepComplete('ollama');
            
            // Wait for the loading animation
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Navigate to the app
            await goto('/app');
        } catch (error) {
            console.error('Error saving Ollama configuration:', error);
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
    <FormContainer title="Ollama Configuration" subtitle="Configure your Ollama instance for AI-powered resume generation.">
        <div class="space-y-4">
            <Input
                value={ollamaUrl}
                type="url"
                label="Ollama URL"
                placeholder="http://localhost:11434"
                onInput={(e) => ollamaUrl = e}
                onKeydown={(e) => handleKeydown(e)}
            />
            
            <Select
                value={selectedModel}
                label="Available Models"
                options={availableModels.map(model => ({ value: model, label: model }))}
                disabled={availableModels.length === 0}
                onChange={(value) => selectedModel = value}
            />
            
            {#if connectionError}
                <p class="text-sm text-red-500">{connectionError}</p>
            {/if}
            
            <div class="flex gap-2">
                <PrimaryButton
                    disabled={!ollamaUrl.trim()}
                    onclick={testOllamaConnection}
                    fullWidth={true}
                    type="button"
                >
                    {#if isTestingConnection}
                        Testing Connection...
                    {:else}
                        Test Connection
                    {/if}
                </PrimaryButton>
                
                <PrimaryButton
                    disabled={!ollamaUrl.trim() || !selectedModel.trim() || isTestingConnection}
                    onclick={handleSubmit}
                    fullWidth={true}
                    type="button"
                >
                    Continue
                </PrimaryButton>
            </div>
        </div>
    </FormContainer>
</div>

{#if isTransitioning}
    <LoadingOverlay isTransitioning={isTransitioning} />
{/if} 