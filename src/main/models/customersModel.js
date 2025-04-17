import { getDb } from "../database/connection.js";

// Create Customer
export function createCustomer(customer) {
  const db = getDb();

  const stmt = db.prepare(`
    INSERT INTO customers (name, email, phone, address, salesmen_id, status)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  const info = stmt.run(
    customer.name,
    customer.email,
    customer.phone,
    customer.address,
    customer.salesmen_id,
    customer.status
  );
  return info.lastInsertRowid;
}

// Get All Customers
export function getAllCustomers() {
  const db = getDb();
  return db
    .prepare(
      `
    SELECT customers.*, salesmen.name AS salesmen_name 
    FROM customers 
    LEFT JOIN salesmen ON customers.salesmen_id = salesmen.id
  `
    )
    .all();
}

// Update Customer
export function updateCustomer(id, customer) {
  const db = getDb();

  const stmt = db.prepare(`
    UPDATE customers SET
    name = ?, email = ?, phone = ?, address = ?, salesmen_id = ?, status = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `);
  stmt.run(
    customer.name,
    customer.email,
    customer.phone,
    customer.address,
    customer.salesmen_id,
    customer.status,
    id
  );

  return true;
}

// Delete Customer
export function deleteCustomer(id) {
  const db = getDb();
  db.prepare("DELETE FROM customers WHERE id = ?").run(id);
  return true;
}
