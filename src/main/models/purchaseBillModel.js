import { getDb } from "../database/connection.js";

export function getNextSerialNo() {
  const db = getDb();
  const last = db
    .prepare(`SELECT MAX(serial_no) AS max_serial FROM purchase_bills`)
    .get();

  return (last?.max_serial || 200) + 1;
}

export function createPurchaseBill(bill) {
  const db = getDb();
  const serial_no = getNextSerialNo();

  const insertBill = db.prepare(`
    INSERT INTO purchase_bills (serial_no, supplier_id, supplier_name, company, total_amount, discount, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  const billInfo = insertBill.run(
    serial_no,
    bill.supplier_id,
    bill.supplier_name,
    bill.company,
    bill.total_amount,
    bill.discount || 0,
    bill.date // 👈 ye last parameter ho manual date ke liye
  );

  const billId = billInfo.lastInsertRowid;

  const insertItem = db.prepare(`
    INSERT INTO purchase_items
    (bill_id, product_id, product_name, unit, packing_type, units_per_pack, quantity, price, cost_price)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const updateProduct = db.prepare(`
    UPDATE products SET
      quantity = COALESCE(quantity, 0) + ?,
      price = ?,
      cost_price = ?
    WHERE id = ?
  `);

  const transaction = db.transaction(() => {
    bill.items.forEach((item) => {
      insertItem.run(
        billId,
        item.product_id,
        item.product_name,
        item.unit,
        item.packing_type,
        item.units_per_pack,
        item.quantity,
        item.price,
        item.cost_price
      );

      // Update product
      updateProduct.run(
        item.quantity,
        item.price,
        item.cost_price,
        item.product_id
      );
    });
  });

  transaction();
  return billId;
}
export function getAllPurchaseBills() {
  const db = getDb();
  return db
    .prepare(
      `
    SELECT id, serial_no, supplier_name, company, total_amount, discount, created_at
    FROM purchase_bills
    ORDER BY created_at DESC
  `
    )
    .all();
}

export function getPurchaseBillDetails(billId) {
  const db = getDb();

  const bill = db
    .prepare(
      `
    SELECT * FROM purchase_bills WHERE id = ?
  `
    )
    .get(billId);

  const items = db
    .prepare(
      `
    SELECT * FROM purchase_items WHERE bill_id = ?
  `
    )
    .all(billId);

  return {
    ...bill,
    items,
  };
}
export function deletePurchaseBill(billId) {
  const db = getDb();

  const transaction = db.transaction(() => {
    // Pehle items delete karo
    db.prepare(`DELETE FROM purchase_items WHERE bill_id = ?`).run(billId);

    // Ab bill delete karo
    db.prepare(`DELETE FROM purchase_bills WHERE id = ?`).run(billId);
  });

  transaction();
  return true;
}
