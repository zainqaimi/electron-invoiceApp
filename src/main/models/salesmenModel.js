import { getDb } from "../database/connection.js";

export function createSalesman(salesman) {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO salesmen (name, contact_number, email, company_name, address, joining_date)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  const info = stmt.run(
    salesman.name,
    salesman.contact_number,
    salesman.email,
    salesman.company_name,
    salesman.address,
    salesman.joining_date
  );
  return info.lastInsertRowid;
}

export function getAllSalesmen() {
  const db = getDb();
  return db.prepare("SELECT * FROM salesmen").all();
}

export function updateSalesman(id, salesman) {
  const db = getDb();
  const stmt = db.prepare(`
    UPDATE salesmen
    SET name = ?, contact_number = ?, email = ?, company_name = ?, address = ?, joining_date = ?
    WHERE id = ?
  `);
  stmt.run(
    salesman.name,
    salesman.contact_number,
    salesman.email,
    salesman.company_name,
    salesman.address,
    salesman.joining_date,
    id
  );
  return true;
}

export function deleteSalesman(id) {
  const db = getDb();
  db.prepare("DELETE FROM salesmen WHERE id = ?").run(id);
  return true;
}
