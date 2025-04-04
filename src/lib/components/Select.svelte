<script lang="ts">
    import { onMount } from 'svelte';

    let { 
        label,
        value = $bindable(),
        options = [],
        disabled = false,
        help = '',
        class: className = ''
    } = $props<{
        label: string;
        value?: string;
        options: { value: string; label: string }[];
        disabled?: boolean;
        help?: string;
        class?: string;
    }>();

    let isOpen = $state(false);
    let selectedOption = $derived(options.find((opt: { value: string; label: string }) => opt.value === value));

    function handleClickOutside(event: MouseEvent) {
        const target = event.target as HTMLElement;
        if (!target.closest('.select-container')) {
            isOpen = false;
        }
    }

    onMount(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    });
</script>

<div class="space-y-1 {className} select-container">
    <label class="block text-sm font-medium text-gray-700">{label}</label>
    <div class="relative">
        <button
            type="button"
            class="relative w-full cursor-default rounded-md bg-white py-2 pl-3 pr-10 text-left border border-gray-300 shadow-sm focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            {disabled}
            on:click={() => !disabled && (isOpen = !isOpen)}
        >
            <span class="block truncate">{selectedOption?.label || 'Select an option'}</span>
            <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <svg class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
            </span>
        </button>

        {#if isOpen}
            <ul class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {#each options as option}
                    <li
                        class="relative cursor-default select-none py-2 pl-3 pr-9 hover:bg-yellow-50"
                        class:bg-yellow-50={option.value === value}
                        on:click={() => {
                            value = option.value;
                            isOpen = false;
                        }}
                    >
                        <span class="block truncate">{option.label}</span>
                        {#if option.value === value}
                            <span class="absolute inset-y-0 right-0 flex items-center pr-4 text-yellow-600">
                                <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                                </svg>
                            </span>
                        {/if}
                    </li>
                {/each}
            </ul>
        {/if}
    </div>
    {#if help}
        <p class="text-sm text-gray-500">{help}</p>
    {/if}
</div> 