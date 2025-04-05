// src/electron.d.ts
import { Product } from './types'; // optional, if you have a types file for Product

declare global {
  interface Window {
    electron: {
      addProduct: (product: Product) => Promise<{ success: boolean; message?: string }>;
    };
  }
}

export {};
