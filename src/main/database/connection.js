import Database from "better-sqlite3";
const db = new Database("inventory.db", { verbose: console.log });

export default db;