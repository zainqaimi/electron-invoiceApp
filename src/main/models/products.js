export const addProduct = (product) => {
  const stmt = db.prepare(
    'INSERT INTO products (image, name, quantity, price, companyId, packingType, stock) VALUES (?, ?, ?, ?, ?, ?, ?)'
  );
  const result = stmt.run(
    product.image || null,
    product.name,
    product.quantity,
    product.price,
    product.companyId || null,
    product.packingType,
    product.stock
  );
  return result.lastInsertRowid;
};
