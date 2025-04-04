import db from "../database/connection.js";

db.prepare(`
  CREATE TABLE IF NOT EXISTS companies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    contact TEXT,
    address TEXT
  )
`).run();

export const getCompanies = () => db.prepare("SELECT * FROM companies").all();
export const addCompany = (name, contact, address) => 
  db.prepare("INSERT INTO companies (name, contact, address) VALUES (?, ?, ?)").run(name, contact, address);
export const updateCompany = (id, name, contact, address) => 
  db.prepare("UPDATE companies SET name = ?, contact = ?, address = ? WHERE id = ?").run(name, contact, address, id);
export const deleteCompany = (id) => 
  db.prepare("DELETE FROM companies WHERE id = ?").run(id);
