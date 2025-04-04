<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { ollamaSettings, updateOllamaSettings } from '$lib/stores/settings';
    import { toast } from '$lib/stores/toast';
    import InputField from '$lib/components/InputField.svelte';
    import Select from '$lib/components/Select.svelte';
    import Button from '$lib/components/Button.svelte';
    import LoadingOverlay from '$lib/components/layout/LoadingOverlay.svelte';
    import { markStepComplete } from '$lib/stores/onboarding';

    let settings = $derived($ollamaSettings);
    let isTesting = $state(false);
    let availableModels = $state<string[]>([]);
    let selectedModel = $state(settings.defaultModel);
    let isSaving = $state(false);

    onMount(async () => {
        try {
            const response = await fetch(`${settings.baseUrl}/api/tags`);
            if (response.ok) {
                const data = await response.json();
                availableModels = data.models.map((model: any) => model.name);
                if (availableModels.length > 0 && !selectedModel) {
                    selectedModel = availableModels[0];
                    settings.defaultModel = selectedModel;
                }
            }
        } catch (error) {
            console.error('Failed to fetch models:', error);
        }
    });

    async function testConnection() {
        isTesting = true;
        try {
            const response = await fetch(`${settings.baseUrl}/api/tags`);
            if (response.ok) {
                const data = await response.json();
                availableModels = data.models.map((model: any) => model.name);
                if (availableModels.length > 0 && !selectedModel) {
                    selectedModel = availableModels[0];
                    settings.defaultModel = selectedModel;
                }
                toast.success('Successfully connected to Ollama!');
            } else {
                toast.error('Failed to connect to Ollama. Please check your settings.');
            }
        } catch (error) {
            toast.error('Failed to connect to Ollama. Please check your settings.');
        } finally {
            isTesting = false;
        }
    }

    async function handleSave() {
        isSaving = true;
        try {
            settings.defaultModel = selectedModel;
            await updateOllamaSettings(settings);
            toast.success('Settings saved successfully!');
            markStepComplete('ollama');
            await goto('/app');
        } catch (error) {
            toast.error('Failed to save settings. Please try again.');
        } finally {
            isSaving = false;
        }
    }
</script>

<div class="p-8">
    <h1 class="text-2xl font-semibold text-gray-900 mb-6">Ollama Settings</h1>
    
    <div class="space-y-6 max-w-2xl">
        <InputField
            label="Base URL"
            bind:value={settings.baseUrl}
            help="The URL where your Ollama server is running"
            placeholder="http://localhost:11434"
        />

        <Select
            label="Default Model"
            bind:value={selectedModel}
            options={availableModels.map(model => ({ value: model, label: model }))}
            help="The default model to use for generating content"
        />

        <div class="flex items-center space-x-4">
            <Button
                on:click={testConnection}
                disabled={isTesting}
            >
                {#if isTesting}
                    Testing...
                {:else}
                    Test Connection
                {/if}
            </Button>
            <Button
                on:click={handleSave}
                disabled={isSaving}
            >
                {#if isSaving}
                    Saving...
                {:else}
                    Save Settings
                {/if}
            </Button>
        </div>
    </div>
</div>

{#if isTesting || isSaving}
    <LoadingOverlay isTransitioning={isTesting || isSaving} />
{/if} 