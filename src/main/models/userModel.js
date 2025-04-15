// import { getDb } from '../database/connection.js';
// import path from 'path';
// import fs from 'fs';
// import { fileURLToPath } from 'url';
// import os from 'os';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Create User
// export function createUser(user) {
//   const db = getDb();
//   const stmt = db.prepare(`
//     INSERT INTO users (image, name, email, password)
//     VALUES (?, ?, ?, ?)
//   `);
//   const info = stmt.run(user.image, user.name, user.email, user.password);
//   return info.lastInsertRowid;
// }

// // Get All Users
// export function getAllUsers() {
//   const db = getDb();
//   return db.prepare("SELECT * FROM users").all();
// }

// // Update User
// export async function updateUser(id, userData) {
//   const db = getDb();

//   const existingUser = db.prepare("SELECT * FROM users WHERE id = ?").get(id);
//   if (!existingUser) throw new Error("User not found");

//   let imagePath = existingUser.image; // by default, keep old image

//   // Check if base64 image is coming
//   if (userData.image && typeof userData.image === "string" && userData.image.startsWith("data:image/")) {
//     const base64Data = userData.image.replace(/^data:image\/\w+;base64,/, "");
//     const imageBuffer = Buffer.from(base64Data, "base64");

//     const uploadDir = path.join(os.homedir(), "my-electron-app", "uploads", `${id}`);
//     fs.mkdirSync(uploadDir, { recursive: true });

//     const filePath = path.join(uploadDir, `${Date.now()}.png`);
//     fs.writeFileSync(filePath, imageBuffer);
//     imagePath = filePath;
//     console.log("🖼 imagePath being saved:", imagePath);
//   }

//   db.prepare(
//     "UPDATE users SET name = ?, email = ?, password = ?, image = ? WHERE id = ?"
//   ).run(userData.name, userData.email, userData.password, imagePath, id);
// }

// // Delete User
// export function deleteUser(id) {
//   const db = getDb();
//   db.prepare("DELETE FROM users WHERE id = ?").run(id);
//   return true;
// }

// // Save Image Function
// export function saveImage(base64ImageOrObject, userId) {
//   if (!base64ImageOrObject) return null;

//   const uploadsDir = path.join(os.homedir(), "my-electron-app", "uploads", `${userId}`);
//   if (!fs.existsSync(uploadsDir)) {
//     fs.mkdirSync(uploadsDir, { recursive: true });
//   }

//   // Handle base64 string format
//   if (typeof base64ImageOrObject === "string" && base64ImageOrObject.startsWith('data:image')) {
//     const matches = base64ImageOrObject.match(/^data:image\/([a-zA-Z]+);base64,(.+)$/);
//     if (!matches) {
//       throw new Error("Invalid base64 image format.");
//     }
//     const ext = matches[1];
//     const data = matches[2];
//     const fileName = `user_${Date.now()}.${ext}`;
//     const filePath = path.join(uploadsDir, fileName);
//     fs.writeFileSync(filePath, data, "base64");
//     return filePath;
//   }

//   // Handle object format: { name, data }
//   if (
//     typeof base64ImageOrObject === "object" &&
//     base64ImageOrObject.data &&
//     base64ImageOrObject.name
//   ) {
//     const ext = path.extname(base64ImageOrObject.name) || ".png";
//     const fileName = `user_${Date.now()}${ext}`;
//     const filePath = path.join(uploadsDir, fileName);
//     const buffer = Buffer.from(base64ImageOrObject.data);
//     fs.writeFileSync(filePath, buffer);
//     return filePath;
//   }

//   return null;
// }

// // Check Password by Email
// export function checkPassword(email, password) {
//   const db = getDb();
//   const stmt = db.prepare("SELECT * FROM users WHERE email = ?");
//   const user = stmt.get(email);
//   if (!user) return { success: false, message: 'User not found' };
//   const isMatch = user.password === password;
//   return {
//     success: isMatch,
//     message: isMatch ? 'Password correct' : 'Password incorrect',
//     user: isMatch ? user : null,
//   };
// }
import { getDb } from "../database/connection.js";

import fs from "fs";
import path from "path";
import os from "os";

export function saveImage(base64, userId) {
  if (!base64) return null;

  const dir = path.join(
    os.homedir(),
    "my-electron-app",
    "uploads",
    `user_${userId}`
  );
  fs.mkdirSync(dir, { recursive: true });

  const match = base64.match(/^data:image\/([a-zA-Z]+);base64,(.+)$/);
  if (!match) return null;

  const ext = match[1];
  const data = match[2];
  const fileName = `image_${Date.now()}.${ext}`;
  const filePath = path.join(dir, fileName);
  fs.writeFileSync(filePath, data, "base64");

  return filePath;
}

// Create User
export function createUser(user) {
  const db = getDb();

  const existing = db
    .prepare("SELECT * FROM users WHERE email = ?")
    .get(user.email);

  if (existing) {
    throw new Error("User with this email already exists.");
  }

  const stmt = db.prepare(`
    INSERT INTO users (name, email, password, image)
    VALUES (?, ?, ?, ?)
  `);
  const info = stmt.run(user.name, user.email, user.password, user.image);
  return info.lastInsertRowid;
}

// Get All
export function getAllUsers() {
  const db = getDb();
  return db.prepare("SELECT * FROM users").all();
}

// Update
export function updateUser(id, user) {
  const db = getDb();

  const existing = db.prepare("SELECT * FROM users WHERE id = ?").get(id);
  if (!existing) throw new Error("User not found");

  const duplicate = db
    .prepare("SELECT * FROM users WHERE email = ? AND id != ?")
    .get(user.email, id);

  if (duplicate) throw new Error("Email already in use by another user.");

  db.prepare(
    `
    UPDATE users SET name = ?, email = ?, password = ?, image = ? WHERE id = ?
  `
  ).run(user.name, user.email, user.password, user.image, id);

  return true;
}

// Delete
export function deleteUser(id) {
  const db = getDb();
  db.prepare("DELETE FROM users WHERE id = ?").run(id);
  return true;
}

// Password check / login
export function checkPassword(email, password) {
  const db = getDb();
  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);

  if (!user) return { success: false, message: "User not found" };
  const match = user.password === password;
  if (match) {
    db.prepare("UPDATE users SET is_logged_in = 1 WHERE id = ?").run(user.id);
    return { success: true, user };
  } else {
    return { success: false, message: "Invalid password" };
  }
}

export function logoutUser(id) {
  const db = getDb();
  db.prepare("UPDATE users SET is_logged_in = 0 WHERE id = ?").run(id);
  return true;
}
