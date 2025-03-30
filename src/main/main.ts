import { app, BrowserWindow } from "electron";
import path from "path";

let mainWindow: BrowserWindow;

app.whenReady().then(() => {
  const preloadPath = path.join(__dirname, "src/main/preload.js"); // Ensure this path is correct
  console.log("🛠 Preload Path:", preloadPath);

  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: preloadPath, // Make sure this file exists!
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadURL("http://localhost:5173");
});
