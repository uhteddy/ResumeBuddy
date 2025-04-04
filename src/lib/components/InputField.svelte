<script lang="ts">
    import { fade } from 'svelte/transition';
    import { createEventDispatcher } from 'svelte';
    
    const dispatch = createEventDispatcher();
    
    let {
        id,
        label,
        value = $bindable(),
        placeholder = '',
        type = 'text',
        isValid = true,
        errorMessage = '',
        optional = false,
        help = '',
        class: className = ''
    } = $props<{
        id?: string;
        label: string;
        value?: string;
        placeholder?: string;
        type?: string;
        isValid?: boolean;
        errorMessage?: string;
        optional?: boolean;
        help?: string;
        class?: string;
    }>();
    
    function handleInput(e: Event) {
        const target = e.target as HTMLInputElement;
        dispatch('input', target.value);
    }
    
    function handleKeydown(e: KeyboardEvent) {
        dispatch('keydown', e);
    }
</script>

<div class="space-y-1 {className}">
    <label for={id} class="block text-sm font-medium text-left text-gray-700 mb-1">
        {label} {#if optional}<span class="text-gray-400">(optional)</span>{/if}
    </label>
    <div class="relative">
        <input
            {type}
            {id}
            bind:value
            oninput={handleInput}
            onkeydown={handleKeydown}
            {placeholder}
            class="w-full px-4 py-3 rounded-lg border focus:border-yellow-500 
                 {!isValid ? 'border-red-500' : 'border-gray-300'} 
                 focus:ring-2 focus:ring-yellow-400/30 outline-none transition-all"
        />
    </div>
    {#if help}
        <p class="text-sm text-gray-500">{help}</p>
    {/if}
    {#if !isValid && errorMessage}
        <p class="mt-1 text-sm text-red-500 text-left" transition:fade>
            {errorMessage}
        </p>
    {/if}
</div>

<style>
    input:focus {
        box-shadow: 0 8px 25px rgba(234, 179, 8, 0.1);
    }
</style>