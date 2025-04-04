<script lang="ts">
    import { fade } from 'svelte/transition';
    import { goto } from '$app/navigation';
    import Database from '@tauri-apps/plugin-sql';
    import Input from '$lib/components/forms/Input.svelte';
    import PrimaryButton from '$lib/components/PrimaryButton.svelte';
    import FormContainer from '$lib/components/forms/FormContainer.svelte';
    import LoadingOverlay from '$lib/components/layout/LoadingOverlay.svelte';
    import { markStepComplete, getNextIncompleteStep } from '$lib/stores/onboarding';

    let email = $state('');
    let phone = $state('');
    let specialty = $state('');
    let emailValid = $state(true);
    let phoneValid = $state(true);
    let showValidationMessage = $state(false);
    let isTransitioning = $state(false);
    let database: Database;

    function validateEmail(email: string) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function validatePhone(phone: string) {
        const re = /^\+?[\d\s-]{10,}$/;
        return re.test(phone);
    }

    async function handleSubmit() {
        showValidationMessage = true;
        emailValid = validateEmail(email);
        phoneValid = validatePhone(phone);

        if (!emailValid || !phoneValid || !specialty.trim()) return;

        isTransitioning = true;
        try {
            // Update the profile with ID 1
            await database.execute(
                'UPDATE profiles SET email = ?, phone = ?, specialty = ? WHERE id = ?',
                [email.trim(), phone.trim(), specialty.trim(), 1]
            );
            
            // Mark this step as complete
            markStepComplete('contact');
            
            // Wait for the loading animation
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Get the next incomplete step
            const nextStep = await getNextIncompleteStep();
            
            // If there's a next step, go to it, otherwise go to the app
            if (nextStep) {
                await goto(nextStep.route);
            } else {
                await goto('/app');
            }
        } catch (error) {
            console.error('Error saving contact information:', error);
            isTransitioning = false;
        }
    }

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleSubmit();
        }
    }

    $effect(() => {
        database = new Database('sqlite:resume.db');
    });
</script>

<div class="w-full max-w-md" in:fade={{ duration: 300 }}>
    <FormContainer title="Contact Information" subtitle="We just need a few more details before you can generate your resume.">
        <div class="space-y-4">
            <Input
                value={email}
                type="email"
                label="Email Address"
                placeholder="Enter your email"
                error="Please enter a valid email address"
                showError={showValidationMessage && !emailValid}
                onInput={(e) => email = e}
                onKeydown={(e) => handleKeydown(e)}
            />
            
            <Input
                value={phone}
                type="tel"
                label="Phone Number"
                placeholder="Enter your phone number"
                error="Please enter a valid phone number"
                showError={showValidationMessage && !phoneValid}
                onInput={(e) => phone = e}
                onKeydown={(e) => handleKeydown(e)}
            />
            
            <Input
                value={specialty}
                type="text"
                label="Specialty"
                placeholder="Enter your specialty (e.g., Software Development, Data Science)"
                onInput={(e) => specialty = e}
                onKeydown={(e) => handleKeydown(e)}
            />
            
            <PrimaryButton
                disabled={!email.trim() || !phone.trim() || !specialty.trim()}
                onclick={handleSubmit}
                fullWidth={true}
                type="button"
            >
                Continue
            </PrimaryButton>
        </div>
    </FormContainer>
</div>

{#if isTransitioning}
    <LoadingOverlay isTransitioning={isTransitioning} />
{/if}