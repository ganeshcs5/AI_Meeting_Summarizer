const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create database file in the project root
const dbPath = path.join(__dirname, '..', 'users.db');

// Initialize database
const initDatabase = () => {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                console.error('Error opening database:', err.message);
                reject(err);
            } else {
                console.log('Connected to SQLite database.');
                
                // Create users table if it doesn't exist
                db.run(`
                    CREATE TABLE IF NOT EXISTS users (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        username TEXT UNIQUE NOT NULL,
                        email TEXT UNIQUE NOT NULL,
                        password TEXT NOT NULL,
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                    )
                `, (err) => {
                    if (err) {
                        console.error('Error creating users table:', err.message);
                        reject(err);
                    } else {
                        console.log('Users table ready.');
                        resolve(db);
                    }
                });
            }
        });
    });
};

// User operations
const createUser = (db, username, email, hashedPassword) => {
    return new Promise((resolve, reject) => {
        const sql = `
            INSERT INTO users (username, email, password)
            VALUES (?, ?, ?)
        `;
        
        db.run(sql, [username, email, hashedPassword], function(err) {
            if (err) {
                reject(err);
            } else {
                resolve({ id: this.lastID, username, email });
            }
        });
    });
};

const findUserByEmail = (db, email) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM users WHERE email = ?';
        
        db.get(sql, [email], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
};

const findUserById = (db, id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT id, username, email, created_at FROM users WHERE id = ?';
        
        db.get(sql, [id], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
};

const findUserByUsername = (db, username) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM users WHERE username = ?';
        
        db.get(sql, [username], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
};

module.exports = {
    initDatabase,
    createUser,
    findUserByEmail,
    findUserById,
    findUserByUsername
}; 