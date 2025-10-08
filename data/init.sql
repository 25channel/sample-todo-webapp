-- SQLite schema for Todo application
CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT,
    deadline DATE,
    priority INTEGER DEFAULT 1, -- 1: Low, 2: Medium, 3: High
    completed INTEGER DEFAULT 0, -- 0: Not completed, 1: Completed
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create trigger to update the updated_at column
CREATE TRIGGER IF NOT EXISTS update_todos_updated_at 
AFTER UPDATE ON todos
FOR EACH ROW
BEGIN
    UPDATE todos SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;