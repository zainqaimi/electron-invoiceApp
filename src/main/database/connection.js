import path from "path";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";
import fs from "fs";

// ES module ke liye __dirname ka workaround
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Development mode ka check kar rahe hain
const isDev = process.env.NODE_ENV === "development";

// Correct Database Path
let db;

export function initDatabase() {
  const dbPath = isDev
    ? path.join(__dirname, "db.sqlite")
    : path.join(__dirname, "db.sqlite");

  const dbInstance = new Database(dbPath);
  db = dbInstance; // Assign outer scoped `db`

  console.log("Database connected:", dbPath);

  db.prepare(
    `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      image TEXT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      is_logged_in BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `
  ).run();

  db.prepare(
    `
    CREATE TABLE IF NOT EXISTS companies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      address TEXT,
      logo TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `
  ).run();
}

export function getDb() {
  return db;
}
