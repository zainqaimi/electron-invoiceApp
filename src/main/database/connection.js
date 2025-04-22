// import path from "path";
// import { fileURLToPath } from "url";
// import Database from "better-sqlite3";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const isDev = process.env.NODE_ENV === "development";

// // Correct Database Path
// let db;

// export function initDatabase() {
//   const dbPath = isDev
//     ? path.join(__dirname, "db.sqlite")
//     : path.join(__dirname, "db.sqlite");

//   const dbInstance = new Database(dbPath);
//   db = dbInstance;

//   console.log("Database connected:", dbPath);

//   db.prepare(
//     `
//     CREATE TABLE IF NOT EXISTS users (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       image TEXT,
//       name TEXT NOT NULL,
//       email TEXT UNIQUE NOT NULL,
//       password TEXT NOT NULL,
//       is_logged_in BOOLEAN DEFAULT 0,
//       created_at DATETIME DEFAULT CURRENT_TIMESTAMP
//     )
//   `
//   ).run();
//   db.prepare(
//     `
//     CREATE TABLE IF NOT EXISTS companies (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       name TEXT NOT NULL,
//       email TEXT,
//       phone TEXT,
//       address TEXT,
//       logo TEXT,
//       created_at DATETIME DEFAULT CURRENT_TIMESTAMP
//     )
//   `
//   ).run();
//   db.prepare(
//     `
//     CREATE TABLE IF NOT EXISTS suppliers (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       name TEXT NOT NULL,
//       contact_number TEXT,
//       company_name TEXT,
//       created_at TEXT DEFAULT CURRENT_TIMESTAMP
//     )
//   `
//   ).run();
//   db.prepare(
//     `
//     CREATE TABLE IF NOT EXISTS salesmen (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       name TEXT NOT NULL,
//       contact_number TEXT,
//       email TEXT,
//       company_name TEXT,
//       address TEXT,
//       joining_date TEXT,
//       created_at TEXT DEFAULT CURRENT_TIMESTAMP
//     )
//   `
//   ).run();
//   db.prepare(
//     `
//     CREATE TABLE IF NOT EXISTS customers (
//   id INTEGER PRIMARY KEY AUTOINCREMENT,
//   name TEXT NOT NULL,
//   email TEXT,
//   phone TEXT,
//   address TEXT,
//   balance INTEGER DEFAULT 0,
//   salesmen_id INTEGER, -- Reference to salesmen table
//   status TEXT, -- active or inactive
//   created_at TEXT DEFAULT CURRENT_TIMESTAMP,
//   updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
//   FOREIGN KEY (salesmen_id) REFERENCES salesmen(id)
// );
//     `
//   ).run();
//   db.prepare(
//     `
//     CREATE TABLE IF NOT EXISTS products (
//   id INTEGER PRIMARY KEY AUTOINCREMENT,
//   name TEXT NOT NULL,
//   brand TEXT,
//   unit TEXT,
//   packing_type TEXT,
//   price INTEGER DEFAULT 0,
//   cost_price INTEGER DEFAULT 0,
//   description TEXT,
//   image TEXT,
//   units_per_pack INTEGER DEFAULT 0,
//    quantity INTEGER DEFAULT 0,
//   created_at DATETIME DEFAULT CURRENT_TIMESTAMP
// )`
//   ).run();
//   db.prepare(
//     `
//     CREATE TABLE IF NOT EXISTS units (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       name TEXT UNIQUE NOT NULL
//     )
//   `
//   ).run();
//   db.prepare(
//     `
//     CREATE TABLE IF NOT EXISTS packing_types (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       name TEXT UNIQUE NOT NULL
//     )
//   `
//   ).run();
//   db.prepare(
//     `
//     CREATE TABLE IF NOT EXISTS purchase_bills (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       serial_no INTEGER UNIQUE,
//       supplier_id INTEGER,
//       supplier_name TEXT,
//       company TEXT,
//       total_amount REAL,
//       discount REAL DEFAULT 0,
//       created_at DATETIME DEFAULT CURRENT_TIMESTAMP
//     )
//   `
//   ).run();

//   db.prepare(
//     `
//     CREATE TABLE IF NOT EXISTS purchase_items (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       bill_id INTEGER,
//       product_id INTEGER,
//       product_name TEXT,
//       unit TEXT,
//       packing_type TEXT,
//       units_per_pack INTEGER,
//       quantity INTEGER,
//       price REAL,
//       cost_price REAL,
//       created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//       FOREIGN KEY (bill_id) REFERENCES purchase_bills(id),
//       FOREIGN KEY (product_id) REFERENCES products(id)
//     )
//   `
//   ).run();
// }

// export function getDb() {
//   return db;
// }
import path from "path";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";
import { app } from "electron";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let db;

export async function initDatabase() {
  let dbPath;

  if (app.isPackaged) {
    // 👇 Wait for app to be ready before using app.getPath
    if (!app.isReady()) {
      await app.whenReady();
    }

    const userDataPath = app.getPath("userData");
    dbPath = path.join(userDataPath, "db.sqlite");

    const bundledDBPath = path.join(__dirname, "db.sqlite");

    // Only copy if doesn't exist
    if (!fs.existsSync(dbPath)) {
      fs.copyFileSync(bundledDBPath, dbPath);
      console.log("Copied db.sqlite to userData folder");
    }
  } else {
    dbPath = path.join(__dirname, "db.sqlite");
  }

  db = new Database(dbPath);
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
}

export function getDb() {
  return db;
}
