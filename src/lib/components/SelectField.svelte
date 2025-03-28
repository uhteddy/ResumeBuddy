<script lang="ts">
    import { fade } from 'svelte/transition';
    import { createEventDispatcher } from 'svelte';
    
    const dispatch = createEventDispatcher();
    
    let {
        id,
        label,
        value = '',
        options = [],
        placeholder = 'Select an option',
        isValid = true,
        errorMessage = '',
        optional = false
    } = $props();
    
    function handleInput(e: Event) {
        const target = e.target as HTMLSelectElement;
        dispatch('input', target.value);
    }
</script>

<div class="form-group">
    <label for={id} class="block text-sm font-medium text-left text-gray-700 mb-1">
        {label} {#if optional}<span class="text-gray-400">(optional)</span>{/if}
    </label>
    <div class="relative">
        <select
            {id}
            value={value}
            oninput={handleInput}
            class="w-full px-4 py-3 rounded-lg border focus:border-yellow-500
                {!isValid ? 'border-red-500' : 'border-gray-300'} 
                focus:ring-2 focus:ring-yellow-400/30 outline-none transition-all
                appearance-none bg-white"
        >
            <option value="" disabled selected>{placeholder}</option>
            {#each options as option}
                <option value={option}>{option}</option>
            {/each}
        </select>
        <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
        </div>
    </div>
    {#if !isValid && errorMessage}
        <p class="mt-1 text-sm text-red-500 text-left" transition:fade>
            {errorMessage}
        </p>
    {/if}
</div>

<style>
    select:focus {
        box-shadow: 0 8px 25px rgba(234, 179, 8, 0.1);
    }
</style>