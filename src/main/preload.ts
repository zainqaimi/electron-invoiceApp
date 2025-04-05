import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  // Example of exposing a method to renderer process
  doSomething: () => ipcRenderer.invoke('do-something'),
});
