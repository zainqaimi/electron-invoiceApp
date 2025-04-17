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
