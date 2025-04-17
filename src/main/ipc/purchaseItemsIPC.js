// ipc/purchaseItems.js
import { ipcMain } from "electron";
import * as purchaseItemsModel from "../models/purchaseItemsModel.js";

// (Optional: create item separately)
ipcMain.handle("purchase_items:create", async (event, item, billId) => {
  return purchaseItemsModel.createPurchaseItem(item, billId);
});
