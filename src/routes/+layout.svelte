<script>
    // Import global styles
    import '../app.css';
    import TitleBar from '$lib/components/TitleBar.svelte';
    let { children } = $props();
</script>

<TitleBar />
<main>
    {@render children()}
</main>