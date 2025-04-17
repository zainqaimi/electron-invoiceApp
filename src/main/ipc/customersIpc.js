import { ipcMain } from "electron";
import * as customersModel from "../models/customersModel.js";

// Create
ipcMain.handle("customers:create", async (event, customer) => {
  return customersModel.createCustomer(customer);
});

// Get All
ipcMain.handle("customers:get", async () => {
  return customersModel.getAllCustomers();
});

// Update
ipcMain.handle("customers:update", async (event, id, customer) => {
  return customersModel.updateCustomer(id, customer);
});

// Delete
ipcMain.handle("customers:delete", async (event, id) => {
  return customersModel.deleteCustomer(id);
});
