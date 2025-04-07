// ipc/backupIPC.js
import fs from 'fs';
import path from 'path';
import { ipcMain, dialog } from 'electron';

ipcMain.handle('backup-db', async () => {
  const { filePath } = await dialog.showSaveDialog({ defaultPath: 'backup.db' });
  fs.copyFileSync(path.join(app.getPath('userData'), 'invoice-app.db'), filePath);
});