import { getDb } from "../database/connection.js";

export function createPurchaseItem(item) {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO purchase_items 
    (bill_id, product_id, product_name, unit, packing_type, units_per_pack, quantity, price, cost_price)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(
    item.bill_id,
    item.product_id,
    item.product_name,
    item.unit,
    item.packing_type,
    item.units_per_pack,
    item.quantity,
    item.price,
    item.cost_price
  );
  return true;
}

export function getItemsByPurchaseId(bill_id) {
  return getDb()
    .prepare("SELECT * FROM purchase_items WHERE bill_id = ?")
    .all(bill_id);
}
