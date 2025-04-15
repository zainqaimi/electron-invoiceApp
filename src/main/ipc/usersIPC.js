// import { ipcMain } from 'electron';
// import * as userModel from '../models/userModel.js';
// import path from 'path';
// import fs from 'fs';
// import os from 'os';

// // Handle Create User
// ipcMain.handle('users:create', async (event, user) => {
//   const imagePath = user.image && user.image !== "UNCHANGED" ? userModel.saveImage(user.image, user.id) : null;
//   const newUser = { ...user, image: imagePath };
//   return userModel.createUser(newUser);
// });

// // Get All Users
// ipcMain.handle('users:get', () => {
//   return userModel.getAllUsers();
// });

// // Update User
// ipcMain.handle('users:update', async (event, id, user) => {
//   let imagePath;
//   if (user.image === "UNCHANGED") {
//     imagePath = "UNCHANGED"; // tell model to use existing image
//   } else if (user.image) {
//     imagePath = userModel.saveImage(user.image, id);
//   } else {
//     imagePath = null;
//   }
//   const updatedUser = { ...user, image: imagePath };
//   return userModel.updateUser(id, updatedUser);
// });

// // Delete User
// ipcMain.handle('users:delete', (event, id) => {
//   return userModel.deleteUser(id);
// });

// // Check Password by Email
// ipcMain.handle('users:checkPassword', (event, email, password) => {
//   return userModel.checkPassword(email, password);
// });

// // Image Upload Handler (if required separately)
// ipcMain.handle('image:upload', async (event, image) => {
//   try {
//     const uploadsDir = path.join(os.homedir(), 'my-electron-app', 'uploads');
//     if (!fs.existsSync(uploadsDir)) {
//       fs.mkdirSync(uploadsDir, { recursive: true });
//     }
//     // Correct template literal syntax:
//     const imagePath = path.join(uploadsDir, `${Date.now()}-${image.name}`);
//     const buffer = Buffer.from(image.data);
//     fs.writeFileSync(imagePath, buffer);
//     console.log("✅ Image saved to:", imagePath);
//     return imagePath;
//   } catch (err) {
//     console.error("Failed to save image:", err);
//     return null;
//   }
// });
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
