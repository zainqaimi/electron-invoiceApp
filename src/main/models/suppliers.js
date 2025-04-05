const db = require('../database/connection');

const createSupplierTable = () => {
  db.prepare(`
    CREATE TABLE IF NOT EXISTS suppliers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT,
      address TEXT
    )
  `).run();
};

const insertMockSuppliers = () => {
  const stmt = db.prepare('INSERT INTO suppliers (name, phone, address) VALUES (?, ?, ?)');
  stmt.run('Supplier One', '987654321', '456 Avenue');
};

module.exports = {
  createSupplierTable,
  insertMockSuppliers
};
