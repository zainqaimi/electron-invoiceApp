import { ipcMain } from 'electron';
import { addProduct } from '../models/products';  // Ensure this is correct

ipcMain.handle('add-product', async (_, product) => {
  console.log('Adding product:', product);  // Log to check
  try {
    const productId = await addProduct(product);
    return productId;  // Return product ID to renderer
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;  // Propagate error back to renderer
  }
});
