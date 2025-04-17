import { getDb } from "../database/connection.js";

export function getAllPackingTypes() {
  const db = getDb();
  return db.prepare("SELECT * FROM packing_types").all();
}

export function createPackingType(data) {
  const db = getDb();
  return db
    .prepare("INSERT INTO packing_types (name) VALUES (?)")
    .run(data.name);
}

export function updatePackingType(id, data) {
  const db = getDb();
  return db
    .prepare("UPDATE packing_types SET name = ? WHERE id = ?")
    .run(data.name, id);
}

export function deletePackingType(id) {
  const db = getDb();
  return db.prepare("DELETE FROM packing_types WHERE id = ?").run(id);
}
