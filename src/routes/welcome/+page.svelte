<script>
    import BlurFade from "../../lib/components/BlurFade.svelte";
    import { fade, fly } from 'svelte/transition';
    import { spring } from 'svelte/motion';
    import { goto } from "$app/navigation";
    
    let userName = "";
    let inputEl;
    let showArrow = false;
    
    // Spring animation for the arrow bounce effect
    const arrowBounce = spring({ x: 0 }, {
        stiffness: 0.15,
        damping: 0.4
    });
    
    // Spring animation for input field adjustment
    const inputAdjust = spring({ scale: 1, x: 0 }, {
        stiffness: 0.15,
        damping: 0.6
    });
    
    // Monitor user input to show arrow and trigger animations
    $: {
        const hasName = userName.trim().length > 0;
        
        if (hasName && !showArrow) {
            // First time showing the arrow
            showArrow = true;
            
            // Animate input field to make space
            inputAdjust.set({ scale: 0.98, x: -10 });
            setTimeout(() => {
                inputAdjust.set({ scale: 1, x: 0 });
            }, 300);
            
            // Start bounce animation after arrow appears
            setTimeout(() => {
                const interval = setInterval(() => {
                    arrowBounce.update($a => ({ x: $a.x === 0 ? 5 : 0 }));
                }, 1500);
                
                return () => clearInterval(interval);
            }, 800);
        } else if (!hasName && showArrow) {
            // Name was cleared, hide arrow
            showArrow = false;
            
            // Return input to original state with slight animation
            inputAdjust.set({ scale: 1.02, x: 10 });
            setTimeout(() => {
                inputAdjust.set({ scale: 1, x: 0 });
            }, 300);
        }
    }
    
    function handleKeydown(event) {
        if (event.key === 'Enter' && userName.trim()) {
            // Process the name (you can add routing or state management here)
            console.log('Name submitted:', userName);
            // Example: navigate to next page
            // goto('/next-step');
        }
    }

    function handleSubmit() {
        if (userName.trim()) {
            console.log('Name submitted:', userName);
            // goto('/next-step');
        }
    }
</script>

<!-- Full screen container -->
<div class="flex flex-col items-center justify-between h-screen p-8 bg-gradient-to-b from-white to-gray-50">
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
    
    <!-- Bottom input section -->
    <div class="w-full max-w-md mb-16">
        <BlurFade delay={0.25 * 10}>
            <div class="flex items-center gap-4 justify-center">
                <!-- Input field with animation -->
                <div 
                    class="relative flex-1 transition-all duration-300"
                    style="transform: translateX({$inputAdjust.x}px) scale({$inputAdjust.scale});"
                >
                    <div class="relative overflow-hidden rounded-full bg-white/90 backdrop-blur-sm border border-yellow-300 hover:border-yellow-400 shadow-lg shadow-yellow-400/10 hover:shadow-yellow-400/30 focus-within:shadow-yellow-400/40 focus-within:border-yellow-400 transition-all duration-300">
                        <input
                            bind:this={inputEl}
                            bind:value={userName}
                            on:keydown={handleKeydown}
                            type="text"
                            class="w-full py-3 px-5 bg-transparent text-neutral-900 placeholder-neutral-500 focus:outline-none text-lg"
                            placeholder="Enter your name"
                            autocomplete="off"
                        />
                    </div>
                </div>
                
                <!-- Right arrow button with enhanced animation -->
                {#if showArrow}
                <div 
                    in:fly={{ x: -50, y: 10, duration: 400, opacity: 0 }}
                    out:fly={{ x: -30, y: 0, duration: 300, opacity: 0 }}
                    class="arrow-container"
                >
                    <button 
                        on:click={handleSubmit}
                        class="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 shadow-md hover:shadow-yellow-400/50 transition-all duration-300 hover:-translate-y-0.5 relative"
                        style="transform: translateX({$arrowBounce.x}px);"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                        
                        <!-- Subtle pulse effect -->
                        <span class="absolute inset-0 rounded-full bg-white opacity-30 pulse-effect"></span>
                    </button>
                </div>
                {/if}
            </div>
            
            {#if showArrow}
                <div 
                    in:fade={{ duration: 400, delay: 300 }}
                    out:fade={{ duration: 200 }}
                    class="text-center text-neutral-600 text-sm mt-3 font-medium"
                >
                    Press Enter to continue
                </div>
            {/if}
        </BlurFade>
    </div>
</div>

<style>
    /* Animation for the subtle pulse effect on the button */
    .pulse-effect {
        animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
        0% {
            transform: scale(1);
            opacity: 0;
        }
        50% {
            transform: scale(1.1);
            opacity: 0.2;
        }
        100% {
            transform: scale(1.5);
            opacity: 0;
        }
    }
    
    /* Container for the arrow to help with animation */
    .arrow-container {
        transform-origin: left center;
        animation: popIn 0.4s cubic-bezier(0.17, 0.67, 0.4, 1.3);
    }
    
    @keyframes popIn {
        0% {
            transform: scale(0.7);
        }
        40% {
            transform: scale(1.1);
        }
        100% {
            transform: scale(1);
        }
    }
</style>