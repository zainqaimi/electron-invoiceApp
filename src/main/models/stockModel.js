import { getDb } from "../database/connection.js";

// models/stockModel.js
export function updateStock(
  product_id,
  quantity,
  purchase_price,
  selling_price
) {
  const db = getDb();
  const existing = db
    .prepare("SELECT * FROM stock WHERE product_id = ?")
    .get(product_id);

  if (existing) {
    const newQty = existing.stock_quantity + quantity;
    const newAvg =
      (existing.stock_quantity * existing.average_purchase_price +
        quantity * purchase_price) /
      newQty;
    db.prepare(
      `
      UPDATE stock
      SET stock_quantity = ?, average_purchase_price = ?, selling_price = ?, updated_at = ?
      WHERE product_id = ?
    `
    ).run(newQty, newAvg, selling_price, new Date().toISOString(), product_id);
  } else {
    db.prepare(
      `
      INSERT INTO stock (product_id, stock_quantity, average_purchase_price, selling_price, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `
    ).run(
      product_id,
      quantity,
      purchase_price,
      selling_price,
      new Date().toISOString(),
      new Date().toISOString()
    );
  }

  return true;
}
