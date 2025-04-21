import { ipcMain } from "electron";
import * as invoicesModel from "../models/invoicesModel.js";
import * as invoiceItemsModel from "../models/invoice_itemsModel.js";
import * as customerLedgerModel from "../models/customer_ledgerModel.js";

// Create Invoice
ipcMain.handle("invoice:create", async (event, invoiceData) => {
  return invoicesModel.createInvoice(invoiceData);
});

// Get All Invoices
ipcMain.handle("invoice:getAll", async () => {
  return invoicesModel.getAllInvoices();
});

// Get Invoice Details
ipcMain.handle("invoice:details", async (event, invoiceId) => {
  return invoicesModel.getInvoiceDetails(invoiceId);
});

// Get Customer Ledger
ipcMain.handle("ledger:customer", async (event, customerId) => {
  return customerLedgerModel.getCustomerLedger(customerId);
});
