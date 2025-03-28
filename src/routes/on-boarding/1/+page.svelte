<script lang="ts">
    import BlurFade from "../../../lib/components/BlurFade.svelte";
    import { fade, fly, scale } from 'svelte/transition';
    import { spring } from 'svelte/motion';
    import { goto } from "$app/navigation";
    
    let userName = "";
    let inputEl;
    let showArrow = false;
    let containerEl;
    let isTransitioning = false;
    let showGreeting = false;
    
    // Spring animation for the arrow bounce effect
    const arrowBounce = spring({ x: 0 }, {
        stiffness: 0.15,
        damping: 0.4
    });
    
    // Monitor user input to show arrow and trigger animations
    $: {
        const hasName = userName.trim().length > 0;
        
        if (hasName && !showArrow) {
            // First time showing the arrow
            showArrow = true;
            
            // Start bounce animation after arrow appears
            setTimeout(() => {
                const interval = setInterval(() => {
                    arrowBounce.update($a => ({ x: $a.x === 0 ? 5 : 0 }));
                }, 1500);
                
                return () => clearInterval(interval);
            }, 1600);
        } else if (!hasName && showArrow) {
            // Name was cleared, hide arrow
            showArrow = false;
        }
    }
    
    function startTransition() {
        if (userName.trim()) {
            isTransitioning = true;
            
            // Show greeting message after overlay appears
            setTimeout(() => {
                showGreeting = true;
                
                // Navigate after greeting shows
                setTimeout(() => {
                    goto('/on-boarding/2');
                }, 2000);
            }, 600);
        }
    }
    
    function handleKeydown(event: KeyboardEvent) {
        if (event.key === 'Enter' && userName.trim()) {
            startTransition();
        }
    }

    function handleSubmit() {
        if (userName.trim()) {
            startTransition();
        }
    }
</script>

<!-- Full screen container -->
<div class="select-none flex flex-col items-center h-full">
    <!-- Top content section -->
    <div class="flex-1 flex flex-col justify-center items-center text-center">
        <BlurFade delay={0.25}>
          <h2 class="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
            Hey 👋
          </h2>
        </BlurFade>
        <BlurFade delay={0.25 * 3}>
          <span class="text-xl text-pretty tracking-tighter sm:text-3xl xl:text-4xl/none mt-2">
            Welcome to <span class="text-yellow-500 font-semibold">Resume Buddy.</span>
          </span>
        </BlurFade>
        <BlurFade delay={0.25 * 5}>
          <span class="text-xl text-pretty tracking-tighter sm:text-3xl xl:text-4xl/none mt-6 text-gray-700">
            Let's get to know each other, what's your name?
          </span>
        </BlurFade>
    </div>
    
    <!-- Bottom input section - fixed at bottom -->
    <div class="w-full max-w-md mb-16 mt-auto">
        <BlurFade delay={0.25 * 7}>
            <!-- Container with dynamic class based on state -->
            <div 
                bind:this={containerEl}
                class="input-button-container {showArrow ? 'split' : ''}"
            >
                <!-- Input field -->
                <div class="input-wrapper">
                    <input
                        bind:this={inputEl}
                        bind:value={userName}
                        on:keydown={handleKeydown}
                        type="text"
                        class="name-input"
                        placeholder="Enter your name"
                        autocomplete="off"
                    />
                </div>
                
                <!-- Cell division connector effect (visible during split) -->
                <div class="cell-connector"></div>
                
                <!-- Arrow button -->
                <button 
                    on:click={handleSubmit}
                    class="arrow-button"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                    
                    <!-- Inner pulse effect -->
                    <span class="button-pulse"></span>
                </button>
            </div>
            
            <!-- Enter text container with absolute positioning -->
            <div class="relative h-6 mt-3">
                {#if showArrow}
                    <div 
                        in:fade={{ duration: 400, delay: 800 }}
                        out:fade={{ duration: 200 }}
                        class="absolute w-full text-center text-neutral-600 text-sm font-medium"
                    >
                        Press Enter to continue
                    </div>
                {/if}
            </div>
        </BlurFade>
    </div>
    
    <!-- Transition overlay -->
    {#if isTransitioning}
        <div 
            class="fixed rounded-md overflow-hidden inset-0 bg-yellow-500 bg-opacity-90 z-50 flex items-center justify-center"
            in:fade={{ duration: 400 }}
        >
            {#if showGreeting}
                <div 
                    in:scale={{ duration: 400, start: 0.8 }}
                    class="text-white text-center"
                >
                    <h2 class="text-4xl font-bold mb-2">Nice to meet you, {userName}!</h2>
                    <p class="text-x">Let's get started...</p>
                </div>
            {/if}
        </div>
    {/if}
</div>

<style>
    /* Base container for input and button */
    .input-button-container {
        position: relative;
        width: 100%;
        height: 56px;
        display: flex;
        align-items: center;
        border-radius: 28px;
        background: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(4px);
        border: 1px solid rgba(234, 179, 8, 0.3);
        box-shadow: 0 8px 20px rgba(234, 179, 8, 0.1);
        overflow: hidden;
        transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    
    /* Input wrapper */
    .input-wrapper {
        flex: 1;
        height: 100%;
        padding: 0 20px;
        transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        z-index: 2;
    }
    
    /* Input styling */
    .name-input {
        width: 100%;
        height: 100%;
        background: transparent;
        border: none;
        outline: none;
        font-size: 1.1rem;
        color: #333;
        padding: 0;
    }
    
    .name-input::placeholder {
        color: #9ca3af;
    }
    
    /* Arrow button styling */
    .arrow-button {
        position: absolute;
        right: 0;
        height: 48px;
        width: 48px;
        border-radius: 24px;
        background: linear-gradient(to right, #eab308, #f59e0b);
        box-shadow: 0 4px 10px rgba(234, 179, 8, 0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        transform: scale(0);
        opacity: 0;
        transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        z-index: 2;
        margin-right: 4px;
    }
    
    /* Cell connector effect */
    .cell-connector {
        position: absolute;
        top: 50%;
        right: 52px;
        transform: translateY(-50%) scaleX(0);
        height: 16px;
        width: 24px;
        background: rgba(234, 179, 8, 0.2);
        border-radius: 8px;
        opacity: 0;
        transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        z-index: 1;
    }
    
    /* When input has text and should show split animation */
    .input-button-container.split {
        padding-right: 56px;
        border-color: rgba(234, 179, 8, 0.5);
        box-shadow: 0 8px 25px rgba(234, 179, 8, 0.2);
    }
    
    .input-button-container.split .arrow-button {
        transform: scale(1);
        opacity: 1;
    }
    
    /* Cell division effect - appears briefly during split */
    .input-button-container.split .cell-connector {
        animation: splitConnect 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    
    /* Button pulse effect */
    .button-pulse {
        position: absolute;
        inset: 0;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.4);
        opacity: 0;
        transform: scale(0.8);
        animation: pulse 2s infinite;
    }
    
    /* Animation for the cell division connector */
    @keyframes splitConnect {
        0% {
            transform: translateY(-50%) scaleX(0);
            opacity: 0;
            right: 28px;
        }
        40% {
            transform: translateY(-50%) scaleX(1);
            opacity: 0.8;
            right: 40px;
        }
        80% {
            transform: translateY(-50%) scaleX(0.5);
            opacity: 0.4;
            right: 52px;
        }
        100% {
            transform: translateY(-50%) scaleX(0);
            opacity: 0;
            right: 56px;
        }
    }
    
    /* Animation for button pulse effect */
    @keyframes pulse {
        0% {
            transform: scale(0.8);
            opacity: 0;
        }
        50% {
            transform: scale(1.1);
            opacity: 0.3;
        }
        100% {
            transform: scale(1.4);
            opacity: 0;
        }
    }
    
    /* Hover effects */
    .input-button-container:hover {
        border-color: rgba(234, 179, 8, 0.6);
        box-shadow: 0 10px 30px rgba(234, 179, 8, 0.15);
    }
    
    .arrow-button:hover {
        transform: scale(1.05) translateX(0) !important;
        box-shadow: 0 6px 15px rgba(234, 179, 8, 0.3);
    }
</style>