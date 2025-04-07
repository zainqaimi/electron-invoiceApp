const db = require('./connection');

// Users CRUD
const addUser = (name, email, password) => {
  const stmt = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)');
  stmt.run(name, email, password);
};

const getUsers = () => {
  return db.prepare('SELECT * FROM users').all();
};

const updateUser = (id, name, email, password) => {
  const stmt = db.prepare('UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?');
  stmt.run(name, email, password, id);
};

const deleteUser = (id) => {
  const stmt = db.prepare('DELETE FROM users WHERE id = ?');
  stmt.run(id);
};

// Export CRUD functions
module.exports = { addUser, getUsers, updateUser, deleteUser };
