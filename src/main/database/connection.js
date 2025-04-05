// connection.js
const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.resolve(__dirname, '../../data/inventory.db');

const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

module.exports = db;
