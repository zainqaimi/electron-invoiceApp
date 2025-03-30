import db from "./connection.js";

db.prepare(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    company TEXT,
    stock INTEGER,
    price REAL,
    image TEXT
  )
`).run();

export const getProducts = () => db.prepare("SELECT * FROM products").all();
export const addProduct = (name, company, stock, price, image) => 
  db.prepare("INSERT INTO products (name, company, stock, price, image) VALUES (?, ?, ?, ?, ?)").run(name, company, stock, price, image);
export const updateProduct = (id, name, company, stock, price, image) => 
  db.prepare("UPDATE products SET name = ?, company = ?, stock = ?, price = ?, image = ? WHERE id = ?").run(name, company, stock, price, image, id);
export const deleteProduct = (id) => 
  db.prepare("DELETE FROM products WHERE id = ?").run(id);
