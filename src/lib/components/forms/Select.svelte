<script lang="ts">
    const { 
        value = "",
        label = "",
        options = [],
        disabled = false,
        error = null,
        showError = false,
        onChange = () => {}
    } = $props<{
        value?: string;
        label?: string;
        options: { value: string; label: string }[];
        disabled?: boolean;
        error?: string | null;
        showError?: boolean;
        onChange?: (value: string) => void;
    }>();

    function handleChange(event: Event) {
        const target = event.target as HTMLSelectElement;
        onChange(target.value);
    }
</script>

<div class="space-y-1.5">
    {#if label}
        <label class="block text-sm font-medium text-gray-700">
            {label}
        </label>
    {/if}
    
    <select
        {value}
        {disabled}
        on:change={handleChange}
        class="w-full px-4 py-2.5 text-base border {error && showError ? 'border-red-300' : 'border-gray-200'} 
               rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent 
               transition-all duration-200 shadow-sm disabled:bg-gray-50 disabled:cursor-not-allowed
               appearance-none bg-white bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cG9seWxpbmUgcG9pbnRzPSI2IDkgMTIgMTUgMTggOSI+PC9wb2x5bGluZT48L3N2Zz4=')] 
               bg-[length:1rem_1rem] bg-[right:1rem_center] bg-no-repeat"
    >
        <option value="">Select an option</option>
        {#each options as option}
            <option value={option.value}>{option.label}</option>
        {/each}
    </select>
    
    {#if error && showError}
        <p class="text-sm text-red-500">{error}</p>
    {/if}
</div> 