import { getDb } from "../database/connection.js";

// Stock reduce karne ke liye
export async function updateProductStock(productId, quantitySold) {
  const db = getDb();
  const stmt = db.prepare(`
    UPDATE products SET quantity = quantity - ?
    WHERE id = ?
  `);
  stmt.run(quantitySold, productId);
}

// Get items by invoice ID — with product name, unit, and packingType
export function getInvoiceItemsWithProductDetails(invoiceId) {
  const db = getDb();
  return db
    .prepare(
      `
    SELECT 
      ii.*,
      p.name AS product_name,
      p.unit,
      p.packingType
    FROM invoice_items ii
    JOIN products p ON ii.product_id = p.id
    WHERE ii.invoice_id = ?
  `
    )
    .all(invoiceId);
}
