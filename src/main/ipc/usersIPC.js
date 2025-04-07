import { ipcMain } from 'electron';
import { User } from '../models/users.js';

ipcMain.handle('users:add', (event, { name, email, imagePath }) => {
  return User.add(name, email, imagePath);
});

ipcMain.handle('users:getAll', () => {
  return User.getAll();
});