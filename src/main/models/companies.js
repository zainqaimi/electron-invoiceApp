const db = require('../database/connection');

const createCompanyTable = () => {
  db.prepare(`
    CREATE TABLE IF NOT EXISTS companies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      address TEXT,
      phone TEXT
    )
  `).run();
};

const insertMockCompanies = () => {
  const stmt = db.prepare('INSERT INTO companies (name, address, phone) VALUES (?, ?, ?)');
  stmt.run('Sample Company', '123 Street', '123456789');
};

module.exports = {
  createCompanyTable,
  insertMockCompanies
};
