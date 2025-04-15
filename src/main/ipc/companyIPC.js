import { ipcMain } from "electron";
import * as companyModel from "../models/companyModel.js";

// Create
ipcMain.handle("companies:create", async (event, company) => {
  return companyModel.createCompany(company); // logo save yahan bhi model kare
});

// Get All
ipcMain.handle("companies:get", () => {
  return companyModel.getAllCompanies();
});

// Update
ipcMain.handle("companies:update", async (event, id, company) => {
  return companyModel.updateCompany(id, company); // bas direct bhej do
});

// Delete
ipcMain.handle("companies:delete", (event, id) => {
  return companyModel.deleteCompany(id);
});
