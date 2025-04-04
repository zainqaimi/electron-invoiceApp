export {};

declare global {
  interface Window {
    api: {
      addProduct: (product: { name: string; price: number; stock: number }) => Promise<{ success: boolean; message?: string }>;
    };
  }
}
