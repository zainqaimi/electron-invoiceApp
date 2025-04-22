import { ipcMain } from "electron";
import { resetAppData } from "../resetApp.js";

ipcMain.handle("app:reset", async () => {
  resetAppData();
});
