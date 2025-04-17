// ipc/stock.js
import { ipcMain } from "electron";
import * as stockModel from "../models/stockModel.js";

// Get all stock
ipcMain.handle("stock:get", () => {
  return stockModel.getAllStock();
});
