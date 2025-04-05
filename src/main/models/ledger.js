const db = require('../database/connection');

const createLedgerTable = () => {
  db.prepare(`
    CREATE TABLE IF NOT EXISTS ledger (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      type TEXT NOT NULL, -- 'purchase', 'sale', 'payment', etc.
      amount REAL NOT NULL,
      description TEXT,
      user_id INTEGER,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `).run();
};

const insertMockLedger = () => {
  const stmt = db.prepare('INSERT INTO ledger (date, type, amount, description, user_id) VALUES (?, ?, ?, ?, ?)');
  stmt.run(new Date().toISOString(), 'sale', 500.00, 'Sold item X', 1);
};

module.exports = {
  createLedgerTable,
  insertMockLedger
};
