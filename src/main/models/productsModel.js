import { getDb } from "../database/connection.js";
import path from "path";
import fs from "fs";
import os from "os";

// Save Image
export function saveImage(base64, productId) {
  if (!base64) return null;

  const dir = path.join(
    os.homedir(),
    "my-electron-app",
    "uploads",
    `product_${productId}`
  );
  fs.mkdirSync(dir, { recursive: true });

  const match = base64.match(/^data:image\/([a-zA-Z]+);base64,(.+)$/);
  if (!match) return null;

  const ext = match[1];
  const data = match[2];
  const fileName = `image_${Date.now()}.${ext}`;
  const filePath = path.join(dir, fileName);
  fs.writeFileSync(filePath, data, "base64");

  return filePath;
}

// Create Product
export function createProduct(product) {
  const db = getDb();

  const stmt = db.prepare(`
    INSERT INTO products (name, brand, unit, packing_type, price, cost_price, description, image)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const info = stmt.run(
    product.name,
    product.brand,
    product.unit,
    product.packing_type,
    product.price,
    product.cost_price,
    product.description,
    product.image
  );
  return info.lastInsertRowid;
}

// Get All Products
export function getAllProducts() {
  const db = getDb();
  return db.prepare("SELECT * FROM products").all();
}

// Update Product
export function updateProduct(id, product) {
  const db = getDb();

  const existing = db.prepare("SELECT * FROM products WHERE id = ?").get(id);
  if (!existing) throw new Error("Product not found");

  db.prepare(
    `
    UPDATE products SET name = ?, brand = ?, unit = ?, packing_type = ?, price = ?, cost_price = ?, description = ?, image = ? WHERE id = ?
  `
  ).run(
    product.name,
    product.brand,
    product.unit,
    product.packing_type,
    product.price,
    product.cost_price,
    product.description,
    product.image,
    id
  );

  return true;
}

// Delete Product
export function deleteProduct(id) {
  const db = getDb();
  db.prepare("DELETE FROM products WHERE id = ?").run(id);
  return true;
}
