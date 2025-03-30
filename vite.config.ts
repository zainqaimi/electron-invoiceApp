import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import * as path from "path";

export default defineConfig({
  base: "./",
  plugins: [react()],
  build: {
    outDir: "dist",
    rollupOptions: {
      external: ["electron", "fs", "path"], // ✅ Electron & Node modules ko exclude karo
      input: {
        frontend: path.resolve(__dirname, "index.html"), // ✅ React App
        backend: path.resolve(__dirname, "src/main/main.ts"), // ✅ Electron Main Process
        preload: path.resolve(__dirname, "src/main/preload.ts"), // ✅ Preload Script
      },
    },
    "chunkSizeWarningLimit": 1024
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // ✅ Frontend aur Backend ke liye sahi alias
    },
  },
});
