// // src/main/preload.cjs
import { contextBridge, ipcRenderer } from "electron";
import path from "path";
import fs from "fs";

contextBridge.exposeInMainWorld("electron", {
  ipcRenderer: {
    invoke: (...args) => ipcRenderer.invoke(...args),
    on: (...args) => ipcRenderer.on(...args),
    send: (...args) => ipcRenderer.send(...args),
  },
  path: {
    join: (...args) => path.join(...args),
  },
  fs: {
    existsSync: (p) => fs.existsSync(p),
    readFileBase64: (filePath) => {
      try {
        const buffer = fs.readFileSync(filePath);
        return buffer.toString("base64");
      } catch (err) {
        console.error("Image read error:", err);
        return null;
      }
    },
  },
  backup: {
    create: () => ipcRenderer.invoke("backup:create"),
    restore: (backupFile) => ipcRenderer.invoke("backup:restore", backupFile),
  },
  users: {
    getUsers: () => ipcRenderer.invoke("users:get"),
    addUser: (user) => ipcRenderer.invoke("users:add", user),
    editUser: (user) => ipcRenderer.invoke("users:edit", user),
    deleteUser: (id) => ipcRenderer.invoke("users:delete", id),
    loginUser: (data) => ipcRenderer.invoke("users:login", data),
    logoutUser: () => ipcRenderer.invoke("users:logout"),
    isLogin: () => ipcRenderer.invoke("users:isLogin"),
  },
  purchase: {
    create: (bill) => ipcRenderer.invoke("purchase:create", bill),
    getLastSerial: () => ipcRenderer.invoke("purchase:getLastSerial"),
    getAll: () => ipcRenderer.invoke("purchase:getAll"),
    getById: (billId) => ipcRenderer.invoke("purchase:getById", billId),
    delete: (billId) => ipcRenderer.invoke("purchase:delete", billId),
  },
});
