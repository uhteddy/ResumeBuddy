<script lang="ts">
    const { title, subtitle } = $props<{
        title: string;
        subtitle?: string;
    }>();
</script>

<div class="w-full max-w-md mx-auto">
    <div class="text-center mb-8">
        <h1 class="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
        {#if subtitle}
            <p class="text-gray-600">{subtitle}</p>
        {/if}
    </div>
    <div class="bg-white rounded-2xl shadow-sm p-6">
        <slot />
    </div>
</div> 