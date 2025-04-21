import { getDb } from "../database/connection.js";
import { updateProductStock } from "./invoice_itemsModel.js";
import { updateCustomerBalance } from "./customersModel.js";
import { addToCustomerLedger } from "./customer_ledgerModel.js";

export async function createInvoice(invoiceData) {
  const db = getDb();
  const {
    customer_id,
    salesman_id,
    total_amount,
    discount,
    paid_amount,
    invoice_date,
    items,
  } = invoiceData;

  db.prepare("BEGIN").run();

  try {
    const stmt = db.prepare(`
      INSERT INTO invoices (
        customer_id, salesman_id, total_amount, discount, paid_amount,
        balance_due, invoice_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      customer_id,
      salesman_id,
      total_amount,
      discount,
      paid_amount,
      total_amount - paid_amount,
      invoice_date
    );

    const invoiceId = result.lastInsertRowid;

    const itemStmt = db.prepare(`
      INSERT INTO invoice_items (invoice_id, product_id, quantity, rate, total)
      VALUES (?, ?, ?, ?, ?)
    `);

    for (const item of items) {
      itemStmt.run(
        invoiceId,
        item.product_id,
        item.quantity,
        item.rate,
        item.quantity * item.rate
      );

      await updateProductStock(item.product_id, item.quantity);
    }

    await updateCustomerBalance(customer_id, total_amount - paid_amount);

    await addToCustomerLedger(
      customer_id,
      "invoice",
      invoiceId,
      total_amount,
      invoice_date,
      `Invoice #${invoiceId}`
    );

    db.prepare("COMMIT").run();
    return invoiceId;
  } catch (err) {
    db.prepare("ROLLBACK").run();
    throw new Error("Failed to create invoice: " + err.message);
  }
}

export function getAllInvoices() {
  const db = getDb();
  return db
    .prepare(
      `
    SELECT 
      invoices.*, 
      customers.name AS customer_name,
      salesmen.name AS salesman_name
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    JOIN salesmen ON invoices.salesman_id = salesmen.id
    ORDER BY invoices.id DESC
  `
    )
    .all();
}

export function getInvoiceDetails(invoiceId) {
  const db = getDb();

  const invoice = db
    .prepare(
      `
    SELECT 
      invoices.*, 
      customers.name AS customer_name,
      salesmen.name AS salesman_name
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    JOIN salesmen ON invoices.salesman_id = salesmen.id
    WHERE invoices.id = ?
  `
    )
    .get(invoiceId);

  const items = db
    .prepare(
      `
    SELECT * FROM invoice_items WHERE invoice_id = ?
  `
    )
    .all(invoiceId);

  return { ...invoice, items };
}
