import { ipcMain } from "electron";
import * as invoicesModel from "../models/invoicesModel.js";
import * as customerLedgerModel from "../models/customer_ledgerModel.js";

// Create Invoice
ipcMain.handle("invoice:create", async (event, invoiceData) => {
  try {
    return await invoicesModel.createInvoice(invoiceData);
  } catch (error) {
    console.error("Error creating invoice:", error);
    throw error;
  }
});

// Get All Invoices
ipcMain.handle("invoice:getAll", async () => {
  try {
    return await invoicesModel.getAllInvoices();
  } catch (error) {
    console.error("Error fetching invoices:", error);
    throw error;
  }
});

// Get Invoice Details (including product details like name, unit, packingType)
ipcMain.handle("invoice:details", async (event, invoiceId) => {
  try {
    return await invoicesModel.getInvoiceDetails(invoiceId);
  } catch (error) {
    console.error("Error fetching invoice details:", error);
    throw error;
  }
});

// Get Customer Ledger
ipcMain.handle("ledger:customer", async (event, customerId) => {
  try {
    return await customerLedgerModel.getCustomerLedger(customerId);
  } catch (error) {
    console.error("Error fetching customer ledger:", error);
    throw error;
  }
});
