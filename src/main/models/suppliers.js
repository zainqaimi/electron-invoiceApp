import db from "../database/connection.js";

db.prepare(`
  CREATE TABLE IF NOT EXISTS suppliers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    contact TEXT,
    address TEXT
  )
`).run();

export const getSuppliers = () => db.prepare("SELECT * FROM suppliers").all();
export const addSupplier = (name, contact, address) => 
  db.prepare("INSERT INTO suppliers (name, contact, address) VALUES (?, ?, ?)").run(name, contact, address);
export const updateSupplier = (id, name, contact, address) => 
  db.prepare("UPDATE suppliers SET name = ?, contact = ?, address = ? WHERE id = ?").run(name, contact, address, id);
export const deleteSupplier = (id) => 
  db.prepare("DELETE FROM suppliers WHERE id = ?").run(id);
