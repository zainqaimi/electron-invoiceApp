import { getDb } from "../database/connection.js";

// Create
export function createSupplier(supplier) {
  const db = getDb();

  if (!supplier.name || !supplier.contact_number || !supplier.company_name) {
    throw new Error("Name, contact number and company are required");
  }

  const stmt = db.prepare(`
    INSERT INTO suppliers (name, contact_number, company_name)
    VALUES (?, ?, ?)
  `);
  const info = stmt.run(
    supplier.name,
    supplier.contact_number,
    supplier.company_name
  );
  return info.lastInsertRowid;
}

// Get All
export function getAllSuppliers() {
  const db = getDb();
  return db.prepare("SELECT * FROM suppliers").all();
}

// Update
export function updateSupplier(id, supplier) {
  const db = getDb();

  const existing = db.prepare("SELECT * FROM suppliers WHERE id = ?").get(id);
  if (!existing) throw new Error("Supplier not found");

  db.prepare(
    `
    UPDATE suppliers
    SET name = ?, contact_number = ?, company_name = ?
    WHERE id = ?
  `
  ).run(supplier.name, supplier.contact_number, supplier.company_name, id);

  return true;
}

// Delete
export function deleteSupplier(id) {
  const db = getDb();
  db.prepare("DELETE FROM suppliers WHERE id = ?").run(id);
  return true;
}
