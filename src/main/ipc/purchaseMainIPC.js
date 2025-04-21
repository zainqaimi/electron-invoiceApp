import { ipcMain } from "electron";
import * as purchaseModel from "../models/purchaseBillModel.js";

ipcMain.handle("purchase:create", (event, bill) => {
  return purchaseModel.createPurchaseBill(bill);
});

ipcMain.handle("purchase:getLastSerial", () => {
  return purchaseModel.getNextSerialNo();
});

ipcMain.handle("purchase:getAll", () => {
  return purchaseModel.getAllPurchaseBills();
});

ipcMain.handle("purchase:getById", (event, billId) => {
  return purchaseModel.getPurchaseBillDetails(billId);
});
ipcMain.handle("purchase:delete", (event, billId) => {
  return purchaseModel.deletePurchaseBill(billId); // make sure model me ye fn exist kare
});
