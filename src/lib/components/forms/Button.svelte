<script lang="ts">
    const {
        type = 'button',
        variant = 'primary',
        size = 'md',
        disabled = false,
        fullWidth = false,
        onClick = () => {}
    } = $props<{
        type?: 'button' | 'submit';
        variant?: 'primary' | 'secondary' | 'text';
        size?: 'sm' | 'md' | 'lg';
        disabled?: boolean;
        fullWidth?: boolean;
        onClick?: () => void;
    }>();

    const sizeClasses = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2.5 text-base',
        lg: 'px-6 py-3 text-lg'
    };

    const variantClasses = {
        primary: 'bg-yellow-500 text-white hover:bg-yellow-600',
        secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
        text: 'bg-transparent text-gray-700 hover:bg-gray-50'
    };
</script>

<button
    {type}
    {disabled}
    on:click={onClick}
    class="rounded-xl font-medium transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed {sizeClasses[size]} {variantClasses[variant]} {fullWidth ? 'w-full' : ''}"
>
    <slot />
</button> 