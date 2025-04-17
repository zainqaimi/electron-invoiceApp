// ipc/purchaseBills.js
import { ipcMain } from "electron";
import * as purchaseBillModel from "../models/purchaseBillModel.js";
import * as purchaseItemsModel from "../models/purchaseItemsModel.js";
import * as stockModel from "../models/stockModel.js";

// Create a complete purchase bill (bill + items + stock update)
ipcMain.handle("purchase_bills:create", async (event, bill) => {
  const billId = purchaseBillModel.createPurchaseBill(bill);

  bill.products.forEach((product) => {
    purchaseItemsModel.createPurchaseItem(product, billId);

    // Calculate total pieces to add in stock
    let pieces =
      product.unit === "dozen"
        ? product.quantity * 12
        : product.unit === "piece"
        ? product.quantity
        : product.quantity * product.conversion_to_piece;

    stockModel.updateStock(product.product_id, pieces);
  });

  return billId;
});

// Get all purchase bills
ipcMain.handle("purchase_bills:get", () => {
  return purchaseBillModel.getAllPurchaseBills();
});
