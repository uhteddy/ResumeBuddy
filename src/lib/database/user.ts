import Database from '@tauri-apps/plugin-sql';
import type { Profile } from './types';

let database: Database | null = null;

async function getDatabase() {
    if (!database) {
        database = await Database.load('sqlite:resume.db');
    }
    return database;
}

export async function getProfile(id: number = 1): Promise<Profile | null> {
    const db = await getDatabase();
    const result = await db.select<Profile[]>('SELECT * FROM profiles WHERE id = ?', [id]);
    return result.length > 0 ? result[0] : null;
}

export async function updateProfile(id: number, data: Partial<Profile>): Promise<void> {
    const db = await getDatabase();
    const fields = Object.keys(data).filter(key => key !== 'id');
    const values = fields.map(field => data[field as keyof Profile]);
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    
    await db.execute(
        `UPDATE profiles SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        [...values, id]
    );
}

export async function createProfile(data: Omit<Profile, 'id' | 'created_at' | 'updated_at'>): Promise<number> {
    const db = await getDatabase();
    const fields = Object.keys(data);
    const values = fields.map(field => data[field as keyof typeof data]);
    const placeholders = fields.map(() => '?').join(', ');
    
    const result = await db.execute(
        `INSERT INTO profiles (${fields.join(', ')}, created_at, updated_at) 
         VALUES (${placeholders}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
        values
    );
    
    if (result.lastInsertId === undefined) {
        throw new Error('Failed to create profile: no lastInsertId returned');
    }
    
    return result.lastInsertId;
}