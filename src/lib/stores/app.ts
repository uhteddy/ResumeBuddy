import { writable } from 'svelte/store';
import type { Profile, Resume } from '$lib/database/types';
import Database from '@tauri-apps/plugin-sql';

export const profile = writable<Profile | null>(null);
export const resumes = writable<Resume[]>([]);
export const isLoading = writable(true);

export async function loadAppData() {
    try {
        const database = await Database.load('sqlite:resume.db');
        
        // Load profile
        const profileResult = await database.select<Profile[]>('SELECT * FROM profiles WHERE id = ?', [1]);
        profile.set(profileResult[0] || null);
        
        // Load resumes
        const resumesResult = await database.select<Resume[]>('SELECT * FROM resumes ORDER BY created_at DESC');
        resumes.set(resumesResult);
        
        isLoading.set(false);
    } catch (error) {
        console.error('Error loading app data:', error);
        isLoading.set(false);
    }
} 