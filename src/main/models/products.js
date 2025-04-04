import db from "../connection.js";

// ➕ Add Product
export const addProduct = (name, price, stock, supplier_id = null, company_id = null) => {
  const stmt = db.prepare("INSERT INTO products (name, price, stock, supplier_id, company_id) VALUES (?, ?, ?, ?, ?)");
  return stmt.run(name, price, stock, supplier_id, company_id).lastInsertRowid;
};

// 🔍 Get All Products
export const getProducts = () => {
  return db.prepare("SELECT * FROM products").all();
};

// ✏️ Update Product
export const updateProduct = (id, name, price, stock) => {
  return db.prepare("UPDATE products SET name = ?, price = ?, stock = ? WHERE id = ?").run(name, price, stock, id);
};

// ❌ Delete Product
export const deleteProduct = (id) => {
  return db.prepare("DELETE FROM products WHERE id = ?").run(id);
};
