pub fn get_migrations() -> Vec<tauri_plugin_sql::Migration> {
    return vec![
        tauri_plugin_sql::Migration {
            version: 1,
            description: "initialize database",
            kind: tauri_plugin_sql::MigrationKind::Up,
            sql: r#"
                CREATE TABLE IF NOT EXISTS projects (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    description TEXT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    url TEXT,
                    repository_url TEXT,
                    date_released TIMESTAMP,
                    technologies TEXT NOT NULL
                );
            "#,
        },
        tauri_plugin_sql::Migration {
            version: 2,
            description: "Add table for profiles",
            kind: tauri_plugin_sql::MigrationKind::Up,
            sql: r#"
                CREATE TABLE IF NOT EXISTS profiles (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    email TEXT NOT NULL,
                    description TEXT,
                    phone TEXT,
                    address TEXT,
                    github_url TEXT,
                    linkedin_url TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            "#,
        },
        tauri_plugin_sql::Migration {
            version: 3,
            description: "Add specialty column to profiles",
            kind: tauri_plugin_sql::MigrationKind::Up,
            sql: r#"
                ALTER TABLE profiles ADD COLUMN specialty TEXT;
            "#,
        },
        tauri_plugin_sql::Migration {
            version: 4,
            description: "Add Ollama configuration columns to profiles",
            kind: tauri_plugin_sql::MigrationKind::Up,
            sql: r#"
                ALTER TABLE profiles ADD COLUMN ollama_url TEXT;
                ALTER TABLE profiles ADD COLUMN ollama_model TEXT;
            "#,
        },
        tauri_plugin_sql::Migration {
            version: 5,
            description: "Add table for resumes",
            kind: tauri_plugin_sql::MigrationKind::Up,
            sql: r#"
                CREATE TABLE IF NOT EXISTS resumes (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    title TEXT NOT NULL,
                    content TEXT NOT NULL,
                    profile_id INTEGER NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE
                );
            "#,
        }
    ];
}