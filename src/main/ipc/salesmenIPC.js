import { ipcMain } from "electron";
import * as salesmenModel from "../models/salesmenModel.js";

// Create
ipcMain.handle("salesmen:create", async (event, data) => {
  return salesmenModel.createSalesman(data);
});

// Get All
ipcMain.handle("salesmen:get", () => {
  return salesmenModel.getAllSalesmen();
});

// Update
ipcMain.handle("salesmen:update", async (event, id, data) => {
  return salesmenModel.updateSalesman(id, data);
});

// Delete
ipcMain.handle("salesmen:delete", (event, id) => {
  return salesmenModel.deleteSalesman(id);
});
