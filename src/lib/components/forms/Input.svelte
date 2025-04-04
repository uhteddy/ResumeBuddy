<script lang="ts">
    const { 
        value = "",
        type = "text",
        label = "",
        placeholder = "",
        error = null,
        showError = false,
        optional = false,
        disabled = false,
        autocomplete = "off",
        onKeydown = () => {},
        onInput = () => {}
    } = $props<{
        value?: string;
        type?: string;
        label?: string;
        placeholder?: string;
        error?: string | null;
        showError?: boolean;
        optional?: boolean;
        disabled?: boolean;
        autocomplete?: string;
        onKeydown?: (event: KeyboardEvent) => void;
        onInput?: (value: string) => void;
    }>();

    function handleInput(event: Event) {
        const target = event.target as HTMLInputElement;
        onInput(target.value);
    }
</script>

<div class="space-y-1.5">
    {#if label}
        <label class="block text-sm font-medium text-gray-700">
            {label}
            {#if optional}
                <span class="text-gray-400">(optional)</span>
            {/if}
        </label>
    {/if}
    
    <input
        {type}
        {value}
        {placeholder}
        {disabled}
        {autocomplete}
        on:keydown={onKeydown}
        on:input={handleInput}
        class="w-full px-4 py-2.5 text-base border {error && showError ? 'border-red-300' : 'border-gray-200'} rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 shadow-sm disabled:bg-gray-50 disabled:cursor-not-allowed"
    />
    
    {#if error && showError}
        <p class="text-sm text-red-500">{error}</p>
    {/if}
</div> 