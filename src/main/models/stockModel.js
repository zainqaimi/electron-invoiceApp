import { getDb } from "../database/connection.js";

// Update stock or insert if not exists
export function updateStock(product_id, quantity) {
  const db = getDb();
  const existing = db
    .prepare("SELECT * FROM stock WHERE product_id = ?")
    .get(product_id);

  if (existing) {
    const newQty = existing.quantity + quantity;
    db.prepare("UPDATE stock SET quantity = ? WHERE product_id = ?").run(
      newQty,
      product_id
    );
  } else {
    db.prepare("INSERT INTO stock (product_id, quantity) VALUES (?, ?)").run(
      product_id,
      quantity
    );
  }

  return true;
}

// Get all stock
export function getAllStock() {
  const db = getDb();
  return db.prepare("SELECT * FROM stock").all();
}
