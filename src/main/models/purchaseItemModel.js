import { getDb } from "../database/connection.js";

// models/purchaseItemModel.js
export function createPurchaseItem(item) {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO purchase_items (purchase_id, product_id, quantity, price, discount, tax, total_amount, units_per_pack, packing_type ,created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(
    item.purchase_id,
    item.product_id,
    item.quantity,
    item.price,
    item.discount,
    item.tax,
    item.total_amount,
    item.units_per_pack,
    item.packing_type,
    created_at
  );
  return true;
}

export function getItemsByPurchaseId(purchase_id) {
  return getDb()
    .prepare("SELECT * FROM purchase_items WHERE purchase_id = ?")
    .all(purchase_id);
}
