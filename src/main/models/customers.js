import db from "../database/connection.js";

db.prepare(`
  CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    contact TEXT,
    address TEXT
  )
`).run();

export const getCustomers = () => db.prepare("SELECT * FROM customers").all();
export const addCustomer = (name, contact, address) => 
  db.prepare("INSERT INTO customers (name, contact, address) VALUES (?, ?, ?)").run(name, contact, address);
export const updateCustomer = (id, name, contact, address) => 
  db.prepare("UPDATE customers SET name = ?, contact = ?, address = ? WHERE id = ?").run(name, contact, address, id);
export const deleteCustomer = (id) => 
  db.prepare("DELETE FROM customers WHERE id = ?").run(id);
