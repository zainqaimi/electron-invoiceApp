import { getDb } from "../database/connection.js";

// 1. Generate Invoice Number (1001, 1002...)
export function getNextInvoiceNo() {
  const db = getDb();
  const last = db
    .prepare("SELECT MAX(invoice_no) as last FROM sales_bills")
    .get();
  return (last?.last || 1000) + 1;
}

// 2. Create New Sale Invoice
export function createSaleBill(billData) {
  const db = getDb();
  const { customer_id, salesman_id, items, discount } = billData;

  return db.transaction(() => {
    // Generate invoice number
    const invoice_no = getNextInvoiceNo();

    // Calculate totals
    const subtotal = items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );
    const total_amount = subtotal - (discount || 0);

    // Insert bill
    const billStmt = db.prepare(`
      INSERT INTO sales_bills (
        invoice_no, customer_id, salesman_id, 
        subtotal, discount, total_amount
      ) VALUES (?, ?, ?, ?, ?, ?)
    `);
    const bill = billStmt.run(
      invoice_no,
      customer_id,
      salesman_id,
      subtotal,
      discount || 0,
      total_amount
    );
    const billId = bill.lastInsertRowid;

    // Insert items and update stock
    const itemStmt = db.prepare(`
      INSERT INTO sales_items (
        bill_id, product_id, quantity, price
      ) VALUES (?, ?, ?, ?)
    `);

    const updateProductStmt = db.prepare(`
      UPDATE products SET quantity = quantity - ? WHERE id = ?
    `);

    items.forEach((item) => {
      itemStmt.run(billId, item.product_id, item.quantity, item.price);
      updateProductStmt.run(item.quantity, item.product_id);
    });

    // Update customer balance
    db.prepare(
      `
      UPDATE customers SET balance = balance + ? WHERE id = ?
    `
    ).run(total_amount, customer_id);

    return billId;
  })();
}

// 3. Get All Sale Bills
export function getAllSaleBills() {
  return getDb()
    .prepare(
      `
      SELECT sb.*, c.name as customer_name, s.name as salesman_name
      FROM sales_bills sb
      LEFT JOIN customers c ON sb.customer_id = c.id
      LEFT JOIN salesmen s ON sb.salesman_id = s.id
      ORDER BY sb.invoice_no DESC
    `
    )
    .all();
}

// 4. Get Bill Details
export function getSaleBillDetails(billId) {
  const db = getDb();
  const bill = db
    .prepare(
      `
      SELECT sb.*, c.name as customer_name, c.phone as customer_phone
      FROM sales_bills sb
      LEFT JOIN customers c ON sb.customer_id = c.id
      WHERE sb.id = ?
    `
    )
    .get(billId);

  const items = db
    .prepare(
      `
      SELECT si.*, p.name as product_name, p.packing_type, p.unit
      FROM sales_items si
      LEFT JOIN products p ON si.product_id = p.id
      WHERE si.bill_id = ?
    `
    )
    .all(billId);

  return { ...bill, items };
}

// 5. Delete Sale Bill
export function deleteSaleBill(billId) {
  const db = getDb();
  return db.transaction(() => {
    // Get bill details first
    const bill = db
      .prepare("SELECT * FROM sales_bills WHERE id = ?")
      .get(billId);

    // Restore product quantities
    const items = db
      .prepare("SELECT * FROM sales_items WHERE bill_id = ?")
      .all(billId);
    const updateProduct = db.prepare(
      "UPDATE products SET quantity = quantity + ? WHERE id = ?"
    );
    items.forEach((item) => updateProduct.run(item.quantity, item.product_id));

    // Reverse customer balance
    db.prepare("UPDATE customers SET balance = balance - ? WHERE id = ?").run(
      bill.total_amount,
      bill.customer_id
    );

    // Delete records
    db.prepare("DELETE FROM sales_items WHERE bill_id = ?").run(billId);
    db.prepare("DELETE FROM sales_bills WHERE id = ?").run(billId);

    return true;
  })();
}
