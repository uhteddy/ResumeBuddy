<script lang="ts">
    import { toast } from '$lib/stores/toast';
    import Toast from './Toast.svelte';
</script>

<div class="fixed top-4 right-4 z-50 space-y-2">
    {#each $toast as t (t.id)}
        <Toast
            message={t.message}
            type={t.type}
            duration={t.duration}
            on:remove={() => toast.remove(t.id)}
        />
    {/each}
</div> 