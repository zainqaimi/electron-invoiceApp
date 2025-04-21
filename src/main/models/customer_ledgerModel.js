import { getDb } from "../database/connection.js";

// Add entry to the customer ledger
export function addToCustomerLedger(
  customerId,
  type,
  referenceId,
  amount,
  date,
  note
) {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO customer_ledger (customer_id, type, reference_id, amount, date, note)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  stmt.run(customerId, type, referenceId, amount, date, note);
}

// Get Customer Ledger
export function getCustomerLedger(customerId) {
  const db = getDb();
  return db
    .prepare(
      `
    SELECT * FROM customer_ledger WHERE customer_id = ? ORDER BY date
  `
    )
    .all(customerId);
}
