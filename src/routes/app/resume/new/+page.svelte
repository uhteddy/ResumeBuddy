<script lang="ts">
    import { onMount } from 'svelte';
    import { profile } from '$lib/stores/app';
    import { ollamaSettings } from '$lib/stores/settings';
    import { toast } from '$lib/stores/toast';
    import InputField from '$lib/components/InputField.svelte';
    import TextArea from '$lib/components/forms/TextArea.svelte';
    import Button from '$lib/components/Button.svelte';
    import LoadingOverlay from '$lib/components/layout/LoadingOverlay.svelte';
    import { goto } from '$app/navigation';
    import Database from '@tauri-apps/plugin-sql';

    let jobTitle = $state('');
    let jobDescription = $state('');
    let isGenerating = $state(false);
    let generatedResume = $state<any>(null);

    async function generateResume() {
        if (!jobTitle.trim() || !jobDescription.trim()) {
            toast.error('Please fill in all fields');
            return;
        }

        isGenerating = true;
        try {
            const settings = $ollamaSettings;
            const profileData = $profile;

            if (!profileData) {
                toast.error('Profile information not found');
                return;
            }

            const candidateProfile = `
Name: ${profileData.name}
Phone: ${profileData.phone}
Email: ${profileData.email}
LinkedIn: ${profileData.linkedin_url}
GitHub: ${profileData.github_url}

Education:
${profileData.education || 'No education information provided'}

Experience:
${profileData.experience || 'No experience information provided'}

Projects:
${profileData.projects || 'No projects information provided'}

Skills:
${profileData.skills || 'No skills information provided'}
`;

            const payload = {
                model: settings.defaultModel,
                prompt: `Job Title: ${jobTitle}\n\nJob Description:\n${jobDescription}\n\nCandidate Information:\n${candidateProfile}`,
                format: 'json',
                stream: false,
                options: {
                    mirostat: 0,
                    num_ctx: 4096,
                    repeat_last_n: 64,
                    repeat_penalty: 1.1,
                    temperature: 0.3,
                    seed: 42,
                    num_predict: 500,
                    top_k: 40,
                    top_p: 0.9,
                    min_p: 0.05
                }
            };

            const response = await fetch(`${settings.baseUrl}/api/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error('Failed to generate resume');
            }

            const result = await response.json();
            
            // Parse the response to get the actual resume content
            let resumeContent;
            try {
                const parsedResponse = JSON.parse(result.response);
                resumeContent = parsedResponse;
            } catch (error) {
                // If parsing fails, use the raw response
                resumeContent = result.response;
            }

            // Save the generated resume to the database
            const database = await Database.load('sqlite:resume.db');
            await database.execute(
                `INSERT INTO resumes (
                    title,
                    content,
                    job_title,
                    job_description,
                    profile_id,
                    created_at,
                    updated_at
                ) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
                [
                    `Resume for ${jobTitle}`,
                    JSON.stringify(resumeContent),
                    jobTitle,
                    jobDescription,
                    profileData.id
                ]
            );

            toast.success('Resume generated successfully!');
            goto('/app');
        } catch (error) {
            console.error('Error generating resume:', error);
            toast.error('Failed to generate resume. Please try again.');
        } finally {
            isGenerating = false;
        }
    }
</script>

<div class="p-8">
    <div class="max-w-3xl mx-auto">
        <h1 class="text-2xl font-bold text-gray-900 mb-6">Generate New Resume</h1>
        
        <div class="space-y-6">
            <InputField
                label="Job Title"
                bind:value={jobTitle}
                placeholder="e.g., Full Stack Developer"
                required
            />

            <TextArea
                label="Job Description"
                value={jobDescription}
                on:input={(e) => jobDescription = e.target.value}
                placeholder="Paste the job description here..."
                rows={8}
                required
            />

            <div class="flex justify-end">
                <Button
                    on:click={generateResume}
                    disabled={isGenerating}
                >
                    {#if isGenerating}
                        Generating...
                    {:else}
                        Generate Resume
                    {/if}
                </Button>
            </div>
        </div>
    </div>
</div>

{#if isGenerating}
    <LoadingOverlay isTransitioning={isGenerating} />
{/if} 