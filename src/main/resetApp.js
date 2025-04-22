import fs from "fs";
import path from "path";
import { app } from "electron";
import Database from "better-sqlite3";
import { initDatabase } from "./database/connection.js";
// import { initDatabase } from "./database/connection";

export function resetAppData() {
  const dbPath = path.join(app.getPath("userData"), "db.sqlite");

  // 👇 Pehle database ko close karo
  try {
    const db = new Database(dbPath, { readonly: false });
    db.close();
  } catch (err) {
    console.warn("DB already closed or failed to close:", err.message);
  }

  // 👇 Phir safe delete karo
  try {
    fs.unlinkSync(dbPath);
    console.log("Database reset successfully.");
  } catch (err) {
    console.error("Error deleting DB:", err.message);
    throw err;
  }
  initDatabase();
}
