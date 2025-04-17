import { getDb } from "../database/connection.js";

export function createPurchaseItem(item, purchase_bill_id) {
  const db = getDb();

  const stmt = db.prepare(`
    INSERT INTO purchase_items (purchase_bill_id, product_id, quantity, unit, conversion_to_piece, cost_price)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  return stmt.run(
    purchase_bill_id,
    item.product_id,
    item.quantity,
    item.unit,
    item.conversion_to_piece,
    item.cost_price
  );
}
