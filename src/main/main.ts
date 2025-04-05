import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';

function createWindow() {
  const isDev = !app.isPackaged;
  const __dirname = path.dirname(new URL(import.meta.url).pathname);

  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.resolve(__dirname, 'main/preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  win.loadURL(
    isDev
      ? 'http://localhost:5173'
      : `file://${path.join(__dirname, '../renderer/index.html')}`
  );
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
