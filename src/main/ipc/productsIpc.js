import { ipcMain } from "electron";
import { getProducts, addProduct, updateProduct, deleteProduct } from "../database/products.js";

ipcMain.handle("get-products", () => getProducts());
ipcMain.handle("add-product", (_, data) => addProduct(data.name, data.company, data.stock, data.price, data.image));
ipcMain.handle("update-product", (_, data) => updateProduct(data.id, data.name, data.company, data.stock, data.price, data.image));
ipcMain.handle("delete-product", (_, id) => deleteProduct(id));
