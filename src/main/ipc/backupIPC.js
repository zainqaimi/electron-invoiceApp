import { ipcMain, dialog } from "electron";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { app } from "electron";

// 👇 Ye lines lagani zaroori hain jab tu ES module use kar raha ho
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getDateTimeForFilename = () => {
  const now = new Date();
  const date = now.toLocaleDateString("en-GB").replace(/\//g, "-");
  const time = now
    .toLocaleTimeString("en-GB")
    .replace(/:/g, "-")
    .replace(/\s/g, "")
    .toLowerCase();
  return `Data Back-Up (Date ${date}) (Time ${time}).db`;
};

// Update the correct path for database in production
// const databasePath = path.join(__dirname,'db.sqlite');

const databasePath = app.isPackaged
  ? path.join(app.getPath("userData"), "db.sqlite")
  : path.join(__dirname, "..", "database", "db.sqlite");

// Export/Backup
ipcMain.handle("backup:create", async () => {
  const defaultName = getDateTimeForFilename();

  const { filePath } = await dialog.showSaveDialog({
    title: "Save Backup",
    defaultPath: defaultName,
    filters: [{ name: "Database Files", extensions: ["db"] }],
  });

  if (filePath) {
    try {
      fs.copyFileSync(databasePath, filePath);
      return { success: true, path: filePath };
    } catch (err) {
      console.error("Error during file copy:", err);
      return { success: false };
    }
  }

  return { success: false };
});

// Import/Restore
ipcMain.handle("backup:restore", async () => {
  const { filePaths } = await dialog.showOpenDialog({
    title: "Select Backup File",
    properties: ["openFile"],
    filters: [{ name: "Database Files", extensions: ["db"] }],
  });

  if (filePaths && filePaths.length > 0) {
    try {
      fs.copyFileSync(filePaths[0], databasePath);

      // // 👇 Optional: Force app reload after restore
      // app.relaunch();
      // app.exit();

      return { success: true };
    } catch (err) {
      console.error("Error during restore:", err);
      return { success: false };
    }
  }

  return { success: false };
});
