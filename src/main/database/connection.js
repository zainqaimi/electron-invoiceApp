import path from "path";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDev = process.env.NODE_ENV === "development";

// Correct Database Path
let db;

export function initDatabase() {
  const dbPath = isDev
    ? path.join(__dirname, "db.sqlite")
    : path.join(__dirname, "db.sqlite");

  const dbInstance = new Database(dbPath);
  db = dbInstance;

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
  balance INTEGER DEFAULT 0,
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
  price INTEGER DEFAULT 0,
  cost_price INTEGER DEFAULT 0,
  description TEXT,
  image TEXT,
  units_per_pack INTEGER DEFAULT 0,
   quantity INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`
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
      serial_no INTEGER UNIQUE,
      supplier_id INTEGER,
      supplier_name TEXT,
      company TEXT,
      total_amount REAL,
      discount REAL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `
  ).run();

  db.prepare(
    `
    CREATE TABLE IF NOT EXISTS purchase_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      bill_id INTEGER,
      product_id INTEGER,
      product_name TEXT,
      unit TEXT,
      packing_type TEXT,
      units_per_pack INTEGER,
      quantity INTEGER,
      price REAL,
      cost_price REAL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (bill_id) REFERENCES purchase_bills(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    )
  `
  ).run();
  db.prepare(
    `
    CREATE TABLE sales_bills (
  id INTEGER PRIMARY KEY,
  invoice_no INTEGER UNIQUE,
  date TEXT DEFAULT CURRENT_DATE,
  customer_id INTEGER REFERENCES customers(id),
  salesman_id INTEGER REFERENCES salesmen(id),
  subtotal INTEGER,
  discount INTEGER DEFAULT 0,
  total_amount INTEGER,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
  `
  ).run();

  db.prepare(
    `
    CREATE TABLE sales_items (
  id INTEGER PRIMARY KEY,
  bill_id INTEGER REFERENCES sales_bills(id),
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER,
  price INTEGER,
  subtotal INTEGER GENERATED ALWAYS AS (quantity * price)
);
  `
  ).run();

  db.prepare(
    `
    CREATE TABLE IF NOT EXISTS ledger (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      description TEXT,
      debit REAL DEFAULT 0,
      credit REAL DEFAULT 0,
      balance REAL DEFAULT 0
    );
  `
  ).run();
}

export function getDb() {
  return db;
}
