const Database = require('./Database');

class TodoController {
    constructor() {
        this.database = new Database();
        this.db = this.database.getDB();
    }

    // Get all todos
    getAllTodos(callback) {
        const sql = `
            SELECT id, title, content, deadline, priority, completed, 
                   created_at, updated_at
            FROM todos 
            ORDER BY 
                CASE priority 
                    WHEN 3 THEN 0 
                    WHEN 2 THEN 1 
                    ELSE 2 
                END,
                deadline ASC,
                created_at DESC
        `;
        this.db.all(sql, [], callback);
    }

    // Get todo by id
    getTodoById(id, callback) {
        const sql = 'SELECT * FROM todos WHERE id = ?';
        this.db.get(sql, [id], callback);
    }

    // Create new todo
    createTodo(todoData, callback) {
        const { title, content, deadline, priority } = todoData;
        const sql = `
            INSERT INTO todos (title, content, deadline, priority)
            VALUES (?, ?, ?, ?)
        `;
        this.db.run(sql, [title, content, deadline, priority], function(err) {
            callback(err, this ? this.lastID : null);
        });
    }

    // Update todo
    updateTodo(id, todoData, callback) {
        const { title, content, deadline, priority, completed } = todoData;
        const sql = `
            UPDATE todos 
            SET title = ?, content = ?, deadline = ?, priority = ?, completed = ?
            WHERE id = ?
        `;
        this.db.run(sql, [title, content, deadline, priority, completed, id], callback);
    }

    // Delete todo
    deleteTodo(id, callback) {
        const sql = 'DELETE FROM todos WHERE id = ?';
        this.db.run(sql, [id], callback);
    }

    // Toggle todo completion status
    toggleComplete(id, callback) {
        const sql = 'UPDATE todos SET completed = NOT completed WHERE id = ?';
        this.db.run(sql, [id], callback);
    }
}

module.exports = TodoController;