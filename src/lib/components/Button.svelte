<script lang="ts">
    let { 
        type = 'button',
        disabled = false,
        class: className = ''
    } = $props<{
        type?: 'button' | 'submit' | 'reset';
        disabled?: boolean;
        class?: string;
    }>();
</script>

<button
    {type}
    {disabled}
    class="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 {className}"
    on:click
>
    <slot />
</button> 