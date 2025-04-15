import { getDb } from "../database/connection.js";
import path from "path";
import fs from "fs";
import os from "os";

// Save Logo
function saveLogo(base64Logo, companyId) {
  if (!base64Logo) return null;

  const uploadDir = path.join(
    os.homedir(),
    "my-electron-app",
    "uploads",
    `company_${companyId}`
  );
  fs.mkdirSync(uploadDir, { recursive: true });

  const matches = base64Logo.match(/^data:image\/([a-zA-Z]+);base64,(.+)$/);
  if (!matches) return null;

  const ext = matches[1];
  const data = matches[2];
  const fileName = `logo_${Date.now()}.${ext}`;
  const filePath = path.join(uploadDir, fileName);
  fs.writeFileSync(filePath, data, "base64");
  return filePath;
}

// Create Company
export function createCompany(company) {
  const db = getDb();

  const existing = db
    .prepare("SELECT * FROM companies WHERE name = ? OR phone = ?")
    .get(company.name, company.phone);

  if (existing) {
    throw new Error("Company with same name or phone already exists.");
  }

  const stmt = db.prepare(`
    INSERT INTO companies (name, email, phone, address, logo)
    VALUES (?, ?, ?, ?, ?)
  `);
  const info = stmt.run(
    company.name,
    company.email,
    company.phone,
    company.address,
    company.logo
  );
  return info.lastInsertRowid;
}

// Get All
export function getAllCompanies() {
  const db = getDb();
  return db.prepare("SELECT * FROM companies").all();
}

// Update Company
export function updateCompany(id, company) {
  const db = getDb();

  const existing = db.prepare("SELECT * FROM companies WHERE id = ?").get(id);
  if (!existing) throw new Error("Company not found");

  // Validation: name/phone must be unique except for current record
  const duplicate = db
    .prepare(
      "SELECT * FROM companies WHERE (name = ? OR phone = ?) AND id != ?"
    )
    .get(company.name, company.phone, id);

  if (duplicate) {
    throw new Error("Another company with same name or phone exists.");
  }

  const logoPath =
    company.logo === "UNCHANGED" ? existing.logo : saveLogo(company.logo, id);

  db.prepare(
    `UPDATE companies SET name = ?, email = ?, phone = ?, address = ?, logo = ? WHERE id = ?`
  ).run(
    company.name,
    company.email,
    company.phone,
    company.address,
    logoPath,
    id
  );

  return true;
}

// Delete
export function deleteCompany(id) {
  const db = getDb();
  db.prepare("DELETE FROM companies WHERE id = ?").run(id);
  return true;
}

// Expose logo saver
export { saveLogo };
