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
      FOREIGN KEY (bill_id) REFERENCES purchase_bills(id),
      FOREIGN KEY (product_id) REFERENCES products(id),
      created_at
      FROM purchase_bills
      ORDER BY created_at DESC
    )
  `
  ).run();
  db.prepare(
    `
  CREATE TABLE IF NOT EXISTS invoices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_id INTEGER,
  total_amount INTEGER,
  discount INTEGER,
  paid_amount INTEGER,
  balance_due INTEGER,
  invoice_date TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id)
)`
  ).run();
  db.prepare(
    `
    CREATE TABLE IF NOT EXISTS invoice_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  invoice_id INTEGER,
  product_id INTEGER,
  quantity INTEGER,
  rate INTEGER,
  total INTEGER,
  FOREIGN KEY (invoice_id) REFERENCES invoices(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
)`
  ).run();
  db.prepare(
    `
CREATE TABLE IF NOT EXISTS customer_ledger (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_id INTEGER,
  type TEXT, -- 'invoice' or 'payment'
  reference_id INTEGER, -- invoice id or payment id
  amount INTEGER,
  date TEXT,
  note TEXT
) `
  ).run();
}

export function getDb() {
  return db;
}
