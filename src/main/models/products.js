const db = require('../database/connection');

const createProductTable = () => {
  db.prepare(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      sku TEXT UNIQUE,
      quantity INTEGER NOT NULL DEFAULT 0,
      price REAL NOT NULL,
      company_id INTEGER,
      FOREIGN KEY(company_id) REFERENCES companies(id)
    )
  `).run();
};

const insertMockProducts = () => {
  const stmt = db.prepare('INSERT INTO products (name, sku, quantity, price) VALUES (?, ?, ?, ?)');
  stmt.run('Sample Product', 'SKU001', 10, 99.99);
};

module.exports = {
  createProductTable,
  insertMockProducts
};
