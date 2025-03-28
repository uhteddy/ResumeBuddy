<script lang="ts">
    import { fade, fly, scale } from 'svelte/transition';
    import { goto } from "$app/navigation";
    import BlurFade from "../../../lib/components/BlurFade.svelte";
    
    // Form data
    let email = "";
    let phone = "";
    let specialty = "";
    
    // Validation state
    let emailValid = true;
    let phoneValid = true;
    let specialtyValid = true;
    let showValidationMessage = false;
    
    // Transition state
    let isTransitioning = false;
    
    // Specialty options
    const specialtyOptions = [
        "Frontend Development",
        "Backend Development",
        "Full Stack Development",
        "Mobile Development",
        "DevOps",
        "Cloud Computing",
        "Data Science",
        "Machine Learning",
        "Cybersecurity",
        "UI/UX Design",
        "Game Development",
        "Embedded Systems",
        "Blockchain",
        "QA/Testing",
        "Other"
    ];
    
    // Validate email using regex
    function validateEmail(email: string): boolean {
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return pattern.test(email);
    }
    
    // Validate phone - accept various formats
    function validatePhone(phone: string): boolean {
        // Allow empty phone as optional
        if (!phone) return true;
        
        // Remove all non-numeric characters and check if we have at least 10 digits
        const digits = phone.replace(/\D/g, '');
        return digits.length >= 10;
    }
    
    // Handle form submission
    function handleSubmit() {
        // Perform validation
        emailValid = validateEmail(email);
        phoneValid = validatePhone(phone);
        specialtyValid = !!specialty;
        
        // Show validation messages
        showValidationMessage = true;
        
        // If all valid, proceed
        if (emailValid && phoneValid && specialtyValid) {
            isTransitioning = true;
            
            // Store data (would typically use a store)
            localStorage.setItem('userEmail', email);
            localStorage.setItem('userPhone', phone);
            localStorage.setItem('userSpecialty', specialty);
            
            // Navigate after delay
            setTimeout(() => {
                goto('/on-boarding/3'); // Replace with your next page
            }, 2000);
        }
    }
    
    // Handle keyboard navigation
    function handleKeydown(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            handleSubmit();
        }
    }
</script>

<div class="select-none flex flex-col items-center h-full">
    <!-- Header section -->
    <div class="flex-1 w-full max-w-md flex flex-col justify-center items-center text-center pt-8">
        <BlurFade delay={0.25}>
            <h2 class="text-3xl font-bold tracking-tighter sm:text-4xl">
                Almost there!
            </h2>
        </BlurFade>
        <BlurFade delay={0.25 * 2}>
            <p class="text-lg text-gray-700 mt-3 mb-8">
                Help us personalize your experience by sharing a little more information.
            </p>
        </BlurFade>
        
        <!-- Form section -->
        <div class="w-full space-y-5">
            <!-- Email field -->
            <BlurFade delay={0.25 * 3}>
                <div class="form-group">
                    <label for="email" class="block text-sm font-medium text-left text-gray-700 mb-1">
                        Email address
                    </label>
                    <input
                        type="email"
                        id="email"
                        bind:value={email}
                        on:keydown={handleKeydown}
                        placeholder="you@example.com"
                        class="w-full px-4 py-3 rounded-lg border {!emailValid && showValidationMessage ? 'border-red-500' : 'border-gray-300'} 
                               focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                    {#if !emailValid && showValidationMessage}
                        <p class="mt-1 text-sm text-red-500 text-left" transition:fade>
                            Please enter a valid email address
                        </p>
                    {/if}
                </div>
            </BlurFade>
            
            <!-- Phone field -->
            <BlurFade delay={0.25 * 4}>
                <div class="form-group">
                    <label for="phone" class="block text-sm font-medium text-left text-gray-700 mb-1">
                        Phone number <span class="text-gray-400">(optional)</span>
                    </label>
                    <input
                        type="tel"
                        id="phone"
                        bind:value={phone}
                        on:keydown={handleKeydown}
                        placeholder="(123) 456-7890"
                        class="w-full px-4 py-3 rounded-lg border {!phoneValid && showValidationMessage ? 'border-red-500' : 'border-gray-300'} 
                               focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                    {#if !phoneValid && showValidationMessage}
                        <p class="mt-1 text-sm text-red-500 text-left" transition:fade>
                            Please enter a valid phone number
                        </p>
                    {/if}
                </div>
            </BlurFade>
            
            <!-- Specialty field -->
            <BlurFade delay={0.25 * 5}>
                <div class="form-group">
                    <label for="specialty" class="block text-sm font-medium text-left text-gray-700 mb-1">
                        Your specialty
                    </label>
                    <select
                        id="specialty"
                        bind:value={specialty}
                        class="w-full px-4 py-3 rounded-lg border {!specialtyValid && showValidationMessage ? 'border-red-500' : 'border-gray-300'} 
                               focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none bg-white"
                    >
                        <option value="" disabled selected>Select your specialty</option>
                        {#each specialtyOptions as option}
                            <option value={option}>{option}</option>
                        {/each}
                    </select>
                    {#if !specialtyValid && showValidationMessage}
                        <p class="mt-1 text-sm text-red-500 text-left" transition:fade>
                            Please select your specialty
                        </p>
                    {/if}
                </div>
            </BlurFade>
        </div>
    </div>
    
    <!-- Continue button -->
    <div class="w-full max-w-md mb-16 mt-5">
        <BlurFade delay={0.25 * 6}>
            <button 
                on:click={handleSubmit}
                class="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg 
                       transition-all duration-200 flex items-center justify-center gap-2"
            >
                <span>Continue</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
            </button>
        </BlurFade>
    </div>

    <!-- Privacy banner -->
    <div class="fixed rounded-b-md bottom-0 left-0 right-0 w-full py-2 bg-white border-t border-gray-200 text-center z-50">
        <div class="flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
            <span class="text-xs font-medium text-gray-800">All information is stored locally on your device only</span>
        </div>
    </div>
    
    <!-- Transition overlay -->
    {#if isTransitioning}
        <div 
            class="fixed inset-0 bg-blue-500 bg-opacity-90 z-50 flex items-center justify-center"
            in:fade={{ duration: 400 }}
        >
            <div 
                in:scale={{ duration: 400, start: 0.8 }}
                class="text-white text-center"
            >
                <h2 class="text-4xl font-bold mb-2">Great! Thanks for sharing.</h2>
                <p class="text-xl text-blue-100">Building your personalized experience...</p>
            </div>
        </div>
    {/if}
</div>

<style>
    /* Custom select arrow */
    select {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 10px center;
        background-size: 18px;
    }
</style>