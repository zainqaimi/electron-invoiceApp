import { ipcMain } from "electron";
import * as saleModel from "../models/saleModel.js";

// 1. Create New Sale Invoice
ipcMain.handle("sale:create", (event, billData) => {
  return saleModel.createSaleBill(billData);
});

// 2. Get Next Invoice Number
ipcMain.handle("sale:getNextInvoiceNo", () => {
  return saleModel.getNextInvoiceNo();
});

// 3. Get All Sale Bills
ipcMain.handle("sale:getAll", () => {
  return saleModel.getAllSaleBills();
});

// 4. Get Bill Details
ipcMain.handle("sale:getDetails", (event, billId) => {
  return saleModel.getSaleBillDetails(billId);
});

// 5. Delete Sale Bill
ipcMain.handle("sale:delete", (event, billId) => {
  return saleModel.deleteSaleBill(billId);
});
