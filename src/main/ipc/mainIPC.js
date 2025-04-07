// ipc/mainIPC.js
import db from '../database/connection.js';
import { ipcMain } from 'electron';

// Example: Get all users
ipcMain.handle('get-users', async () => {
  return db.prepare('SELECT * FROM users').all();
});

// Add similar for products, invoices, etc.