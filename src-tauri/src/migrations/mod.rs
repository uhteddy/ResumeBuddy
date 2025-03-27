pub fn get_migrations() -> Vec<tauri_plugin_sql::Migration> {
    return vec![{
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
        }
    }];
}
