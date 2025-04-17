import { getDb } from "../database/connection.js";

// Create Purchase Bill
export function createPurchaseBill(bill) {
  const db = getDb();

  const stmt = db.prepare(`
    INSERT INTO purchase_bills (supplier_id, bill_number, bill_date, total_amount)
    VALUES (?, ?, ?, ?)
  `);
  const result = stmt.run(
    bill.supplier_id,
    bill.bill_number,
    bill.bill_date,
    bill.total_amount
  );
  return result.lastInsertRowid;
}

// Get All Purchase Bills
export function getAllPurchaseBills() {
  const db = getDb();
  return db.prepare("SELECT * FROM purchase_bills").all();
}
