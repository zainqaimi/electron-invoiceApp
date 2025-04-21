import { getDb } from "../database/connection.js";

// Update product stock in the database
export function updateProductStock(productId, soldQuantity) {
  const db = getDb();
  const stmt = db.prepare(`
    UPDATE products SET quantity = quantity - ?
    WHERE id = ?
  `);
  stmt.run(soldQuantity, productId);
}

// Get Invoice Items
export function getInvoiceItems(invoiceId) {
  const db = getDb();
  return db
    .prepare(
      `
    SELECT * FROM invoice_items WHERE invoice_id = ?
  `
    )
    .all(invoiceId);
}
