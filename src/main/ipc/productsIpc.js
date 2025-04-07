ipcMain.handle('get-products', () => {
    const stmt = db.prepare('SELECT * FROM products');
    return stmt.all();
  });
  
  ipcMain.handle('add-product', (event, product) => {
    const { name, price, stock } = product;
    const stmt = db.prepare('INSERT INTO products (name, price, stock) VALUES (?, ?, ?)');
    stmt.run(name, price, stock);
  });
  