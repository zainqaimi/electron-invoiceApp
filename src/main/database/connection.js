import Database from 'better-sqlite3';
import path from 'path';
import { app } from 'electron';
import fs from 'fs';

// DB Path (Auto-creates in userData)
const dbPath = path.join(app.getPath('userData'), 'invoice-app.db');
const db = new Database(dbPath);

// Create Tables (with BLOB for images)
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    image BLOB,  -- Store image as binary
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price REAL,
    stock INTEGER,
    image BLOB,  -- Optional product image
    category TEXT
  );

  -- Add other tables (invoices, suppliers, etc.)
`);

export default db;