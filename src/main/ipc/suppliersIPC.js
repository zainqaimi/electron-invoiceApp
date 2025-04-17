import { ipcMain } from "electron";
import * as supplierModel from "../models/supplierModel.js";

// Create
ipcMain.handle("suppliers:create", async (event, supplier) => {
  return supplierModel.createSupplier(supplier);
});

// Get All
ipcMain.handle("suppliers:get", () => {
  return supplierModel.getAllSuppliers();
});

// Update
ipcMain.handle("suppliers:update", async (event, id, supplier) => {
  return supplierModel.updateSupplier(id, supplier);
});

// Delete
ipcMain.handle("suppliers:delete", (event, id) => {
  return supplierModel.deleteSupplier(id);
});
