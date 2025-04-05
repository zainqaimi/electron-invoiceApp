const db = require('../database/connection');

const createUserTable = () => {
  db.prepare(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user'
    )
  `).run();
};

const insertMockUsers = () => {
  const stmt = db.prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)');
  stmt.run('Admin User', 'admin@example.com', 'hashed-password', 'admin');
};

module.exports = {
  createUserTable,
  insertMockUsers
};
