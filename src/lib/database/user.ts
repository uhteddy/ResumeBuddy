import Database from '@tauri-apps/plugin-sql';

const db = await Database.load('sqlite:resume.db');
await db.execute('INSERT INTO ...');

export async function user() {
    // Check if 
    const user = await db.execute('SELECT * FROM profile WHERE id = 1');
    console.log(user);
}