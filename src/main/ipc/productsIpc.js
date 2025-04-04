import { ipcMain } from "electron";
import { addProduct, getProducts, updateProduct, deleteProduct } from "../database/models/products.js";

// ➕ Add Product IPC
ipcMain.handle("add-product", (_, product) => addProduct(product.name, product.price, product.stock));

// 🔍 Get All Products IPC
ipcMain.handle("get-products", () => getProducts());

// ✏️ Update Product IPC
ipcMain.handle("update-product", (_, product) => updateProduct(product.id, product.name, product.price, product.stock));

// ❌ Delete Product IPC
ipcMain.handle("delete-product", (_, id) => deleteProduct(id));
