import { ipcMain } from "electron";
import * as userModel from "../models/userModel.js";

// Create
ipcMain.handle("users:create", (event, user) => {
  return userModel.createUser(user);
});

// Get All
ipcMain.handle("users:get", () => {
  return userModel.getAllUsers();
});

// Update
ipcMain.handle("users:update", (event, id, user) => {
  return userModel.updateUser(id, user);
});

// Delete
ipcMain.handle("users:delete", (event, id) => {
  return userModel.deleteUser(id);
});

// Check Password / Login
ipcMain.handle("users:checkPassword", (event, email, password) => {
  return userModel.checkPassword(email, password);
});

// Logout
ipcMain.handle("users:logout", (event, id) => {
  return userModel.logoutUser(id);
});
