<script>
    // Import global styles
    import '../app.css';
    import TitleBar from '$lib/components/TitleBar.svelte';
    let { children } = $props();
</script>

<main class="h-screen w-screen flex flex-col rounded-lg overflow-hidden border border-neutral-300 shadow-md">
    <TitleBar />
    <div class="h-full w-full bg-gray-50">
        {@render children()}
    </div>
</main>