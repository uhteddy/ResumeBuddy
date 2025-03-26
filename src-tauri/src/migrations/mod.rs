pub fn get_migrations() -> Vec<tauri_plugin_sql::Migration> {
    return vec![{
        tauri_plugin_sql::Migration {
            version: 1,
            description: "initialize database",
            kind: tauri_plugin_sql::MigrationKind::Up,
            sql: r#"
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    email TEXT NOT NULL
                );
            "#
        }
    }];
}
