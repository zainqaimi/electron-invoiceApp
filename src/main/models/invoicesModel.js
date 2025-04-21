import { getDb } from "../database/connection.js";
import { updateProductStock } from "./invoice_itemsModel.js"; // Assuming you have this model to update product stock
import { updateCustomerBalance } from "./customersModel.js"; // Assuming you have this model to update customer balance
import { addToCustomerLedger } from "./customer_ledgerModel.js"; // To add ledger entries

// Create Invoice
export async function createInvoice(invoiceData) {
  const db = getDb();
  const {
    customer_id,
    total_amount,
    discount,
    paid_amount,
    invoice_date,
    items,
  } = invoiceData;

  // Begin Transaction
  db.prepare("BEGIN").run();

  try {
    // Insert invoice data
    const stmt = db.prepare(`
      INSERT INTO invoices (customer_id, total_amount, discount, paid_amount, balance_due, invoice_date)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
      customer_id,
      total_amount,
      discount,
      paid_amount,
      total_amount - paid_amount,
      invoice_date
    );

    const invoiceId = result.lastInsertRowid;

    // Insert items into invoice_items table
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
      // Update product stock
      await updateProductStock(item.product_id, item.quantity);
    }

    // Update customer balance
    await updateCustomerBalance(customer_id, total_amount - paid_amount);

    // Add ledger entry for invoice
    await addToCustomerLedger(
      customer_id,
      "invoice",
      invoiceId,
      total_amount,
      invoice_date,
      `Invoice #${invoiceId}`
    );

    // Commit Transaction
    db.prepare("COMMIT").run();
    return invoiceId;
  } catch (err) {
    db.prepare("ROLLBACK").run();
    throw new Error("Failed to create invoice: " + err.message);
  }
}

// Get All Invoices
export function getAllInvoices() {
  const db = getDb();
  return db
    .prepare(
      `
    SELECT invoices.*, customers.name AS customer_name
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
  `
    )
    .all();
}

// Get Invoice Details
export function getInvoiceDetails(invoiceId) {
  const db = getDb();
  const invoice = db
    .prepare(
      `
    SELECT invoices.*, customers.name AS customer_name
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
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
