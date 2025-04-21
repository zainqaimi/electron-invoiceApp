import { app, BrowserWindow, protocol } from "electron";
import path from "path";
import isDev from "electron-is-dev";
import { initDatabase } from "./database/connection.js";
import { fileURLToPath } from "url";
import "./ipc/usersIPC.js";
import "./ipc/companyIPC.js";
import "./ipc/suppliersIPC.js";
import "./ipc/salesmenIPC.js";
import "./ipc/customersIpc.js";
import "./ipc/productsIPC.js";
import "./ipc/unitsIPC.js";
import "./ipc/packingTypesIPC.js";
import "./ipc/purchaseMainIPC.js";
import "./ipc/invoicesMainIPC.js";
import "./ipc/backupIPC.js";
let mainWindow;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
function createWindow() {
  mainWindow = new BrowserWindow({
    // fullscreen: true,
    width: 1300,
    height: 1200,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.cjs"),
      sandbox: false,
    },
  });

  mainWindow.loadURL(
    isDev
      ? "http://localhost:5173"
      : `file://${path.join(__dirname, "../dist/index.html")}`
  );

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
}

app.commandLine.appendSwitch("disable-features", "Autofill");

app.whenReady().then(() => {
  createWindow();
  initDatabase();
  protocol.registerFileProtocol("local", (request, callback) => {
    const url = request.url.substr(8);
    callback({ path: path.normalize(`${__dirname}/${url}`) });
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
