import { getDb } from "../database/connection.js";

export function getAllUnits() {
  const db = getDb();
  return db.prepare("SELECT * FROM units").all();
}

export function createUnit(data) {
  const db = getDb();
  return db.prepare("INSERT INTO units (name) VALUES (?)").run(data.name);
}

export function updateUnit(id, data) {
  const db = getDb();
  return db
    .prepare("UPDATE units SET name = ? WHERE id = ?")
    .run(data.name, id);
}

export function deleteUnit(id) {
  const db = getDb();
  return db.prepare("DELETE FROM units WHERE id = ?").run(id);
}
