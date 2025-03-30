import { contextBridge, ipcRenderer } from "electron";
declare global {
  interface Window {
    electron: {
      invoke: (channel: string, ...args: any[]) => Promise<any>;
      send: (channel: string, ...args: any[]) => void;
      on: (channel: string, callback: (event: any, ...args: any[]) => void) => void;
    };
  }
}

console.log("✅ Preload script is running...");
contextBridge.exposeInMainWorld("electron", {
  invoke: (channel: string, ...args: any[]) => {
    console.log("Electron API invoked:", channel, args);
    return ipcRenderer.invoke(channel, ...args);
  },
  send: (channel: string, ...args: any[]) => {
    console.log("Electron API sent:", channel, args);
    ipcRenderer.send(channel, ...args);
  },
  on: (channel: string, callback: (event: any, ...args: any[]) => void) => {
    console.log("Electron API listening:", channel);
    ipcRenderer.on(channel, (_event, ...args) => callback(_event, ...args));
  },
});

console.log("Exposed Electron API Methods:", Object.keys(window.electron || {}));
