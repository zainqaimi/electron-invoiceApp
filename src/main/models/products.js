import db from '../database/connection.js';

export const Product = {
  add: (name, price, stock, imagePath = null) => {
    let imageBlob = null;
    if (imagePath) {
      imageBlob = fs.readFileSync(imagePath);
    }
    return db
      .prepare('INSERT INTO products (name, price, stock, image) VALUES (?, ?, ?, ?)')
      .run(name, price, stock, imageBlob);
  },

  getAll: () => {
    const products = db.prepare('SELECT * FROM products').all();
    return products.map(product => ({
      ...product,
      image: product.image ? product.image.toString('base64') : null,
    }));
  },
};