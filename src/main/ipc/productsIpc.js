import { ipcMain } from "electron";
import * as productModel from "../models//productsModel.js";

// Create
ipcMain.handle("products:create", (event, product) => {
  return productModel.createProduct(product);
});

// Get All Products
ipcMain.handle("products:get", () => {
  return productModel.getAllProducts();
});

// Update Product
ipcMain.handle("products:update", (event, id, product) => {
  return productModel.updateProduct(id, product);
});

// Delete Product
ipcMain.handle("products:delete", (event, id) => {
  return productModel.deleteProduct(id);
});
