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
  // Inside connection.js or wherever you setup the DB
  db.prepare(
    `
    CREATE TABLE IF NOT EXISTS suppliers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      contact_number TEXT,
      company_name TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `
  ).run();
  db.prepare(
    `
    CREATE TABLE IF NOT EXISTS salesmen (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      contact_number TEXT,
      email TEXT,
      company_name TEXT,
      address TEXT,
      joining_date TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `
  ).run();
  db.prepare(
    `
    CREATE TABLE IF NOT EXISTS customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  salesmen_id INTEGER, -- Reference to salesmen table
  status TEXT, -- active or inactive
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (salesmen_id) REFERENCES salesmen(id)
);
    `
  ).run();
  db.prepare(
    `
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      brand TEXT,
      unit TEXT,
      packing_type TEXT,
      price REAL NOT NULL,
      cost_price REAL,
      description TEXT,
      image TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `
  ).run();
  db.prepare(
    `
    CREATE TABLE IF NOT EXISTS units (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL
    )
  `
  ).run();
  db.prepare(
    `
    CREATE TABLE IF NOT EXISTS packing_types (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL
    )
  `
  ).run();
  db.prepare(
    `
    CREATE TABLE IF NOT EXISTS purchase_bills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      supplier_id INTEGER,
      bill_number TEXT,
      bill_date TEXT,
      total_amount REAL,
      created_at TEXT
    )
  `
  ).run();

  db.prepare(
    `
    CREATE TABLE IF NOT EXISTS purchase_bill_products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      bill_id INTEGER,
      product_id INTEGER,
      quantity REAL,
      unit TEXT,
      conversion_to_piece REAL,
      cost_price REAL
    )
  `
  ).run();

  db.prepare(
    `
    CREATE TABLE IF NOT EXISTS stock (
      product_id INTEGER PRIMARY KEY,
      quantity REAL,
      updated_at TEXT
    )
  `
  ).run();
}

export function getDb() {
  return db;
}
