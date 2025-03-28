<script lang="ts">
    import { fade, fly, scale } from 'svelte/transition';
    import { goto } from "$app/navigation";
    import BlurFade from "../../../lib/components/BlurFade.svelte";
    import InputField from "../../../lib/components/InputField.svelte";
    import SelectField from "../../../lib/components/SelectField.svelte";
    import PrimaryButton from "../../../lib/components/PrimaryButton.svelte";
    
    // Form data
    let email: string = $state("");
    let phone: string = $state("");
    let specialty: string = $state("");
    
    // Validation state
    let emailValid: boolean = $state(true);
    let phoneValid: boolean = $state(true);
    let specialtyValid: boolean = $state(true);
    let showValidationMessage: boolean = false;
    
    // Transition state
    let isTransitioning: boolean = $state(false);
    
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
    function handleKeydown(event: CustomEvent<KeyboardEvent>) {
        if (event.detail.key === 'Enter') {
            handleSubmit();
        }
    }

    function handleEmailInput(e: CustomEvent<string>) {
        email = e.detail;
    }
    
    function handlePhoneInput(e: CustomEvent<string>) {
        phone = e.detail;
    }
    
    function handleSpecialtyInput(e: CustomEvent<string>) {
        specialty = e.detail;
    }
</script>

<div class="select-none flex flex-col items-center h-full bg-gradient-to-b from-white via-white to-yellow-50">
    <!-- Header section -->
    <div class="flex-1 w-full max-w-md flex flex-col justify-center items-center text-center pt-8">
        <BlurFade delay={0.25}>
            <h2 class="text-3xl font-bold tracking-tighter text-gray-800 sm:text-4xl">
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
                <InputField
                    id="email"
                    label="Email address"
                    type="email"
                    value={email}
                    isValid={emailValid}
                    placeholder="you@example.com"
                    errorMessage="Please enter a valid email address"
                    on:keydown={handleKeydown}
                    on:input={handleEmailInput}
                    on:validChange={(e) => emailValid = e.detail}
                />
            </BlurFade>
            <!-- Phone field -->
            <BlurFade delay={0.25 * 4}>
                <InputField
                    id="phone"
                    label="Phone number"
                    type="tel"
                    value={phone}
                    isValid={phoneValid}
                    placeholder="(123) 456-7890"
                    errorMessage="Please enter a valid phone number"
                    optional={true}
                    on:keydown={handleKeydown}
                    on:input={handlePhoneInput}
                    on:validChange={(e) => phoneValid = e.detail}
                />
            </BlurFade>
        </div>
    </div>
    
    <!-- Continue button -->
    <div class="w-full max-w-md mb-16 mt-5">
        <BlurFade delay={0.25 * 6}>
            <PrimaryButton 
                onclick={handleSubmit}
                fullWidth={true}
                pulseEffect={true}
            >
                Continue
            </PrimaryButton>
        </BlurFade>
    </div>

    <!-- Privacy banner -->
    <div class="fixed rounded-b-md bottom-0 left-0 right-0 w-full py-2 bg-white border-t border-neutral-200 text-center z-50 border-b border-r border-l">
        <div class="flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-yellow-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
            <span class="text-xs font-medium text-gray-800">All information is stored locally on your device only</span>
        </div>
    </div>
    
    <!-- Transition overlay -->
    {#if isTransitioning}
        <div 
            class="fixed inset-0 bg-yellow-500 bg-opacity-90 z-50 flex items-center justify-center"
            in:fade={{ duration: 400 }}
        >
            <div 
                in:scale={{ duration: 400, start: 0.8 }}
                class="text-white text-center"
            >
                <h2 class="text-4xl font-bold mb-2">Great! Thanks for sharing.</h2>
                <p class="text-xl text-yellow-100">Building your personalized experience...</p>
            </div>
        </div>
    {/if}
</div>