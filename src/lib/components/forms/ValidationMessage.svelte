<script lang="ts">
    const { message, show } = $props<{
        message: string;
        show: boolean;
    }>();
</script>

{#if show}
    <p class="text-red-500 text-sm mt-1">{message}</p>
{/if} 