import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("api", {
  addProduct: async (product: { name: string; price: number; stock: number }): Promise<{ success: boolean; message?: string }> => {
    return await ipcRenderer.invoke("add-product", product);
  },
});
