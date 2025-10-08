const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

class Database {
    constructor() {
        const dbPath = path.join(__dirname, '../../data/todos.db');
        this.db = new sqlite3.Database(dbPath);
        this.init();
    }

    init() {
        const initSQL = fs.readFileSync(path.join(__dirname, '../../data/init.sql'), 'utf8');
        this.db.exec(initSQL, (err) => {
            if (err) {
                console.error('Error initializing database:', err);
            } else {
                console.log('Database initialized successfully');
            }
        });
    }

    getDB() {
        return this.db;
    }

    close() {
        this.db.close((err) => {
            if (err) {
                console.error('Error closing database:', err);
            } else {
                console.log('Database connection closed');
            }
        });
    }
}

module.exports = Database;