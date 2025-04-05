import React, { useState } from 'react';

function Expenses() {
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [message, setMessage] = useState('');

  const saveProduct = async () => {
    if (!name || !sku || !quantity || !price) {
      setMessage("Please fill all fields.");
      return;
    }

    const product = {
      name,
      sku,
      quantity: parseInt(quantity),
      price: parseFloat(price),
    };

    try {
      const response = await window.electron.addProduct(product);

      if (response.success) {
        setMessage('Product saved successfully!');
        setName('');
        setSku('');
        setQuantity('');
        setPrice('');
      } else {
        setMessage('Error: ' + (response.message || 'Unknown error'));
      }
    } catch (error) {
      setMessage('Unexpected error: ' + error);
    }
  };

  return (
    <div>
      <h1>Add Product</h1>
      <input
        type="text"
        placeholder="Product Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="SKU"
        value={sku}
        onChange={(e) => setSku(e.target.value)}
      />
      <input
        type="number"
        placeholder="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
      />
      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <button onClick={saveProduct}>Save Product</button>
      <p>{message}</p>
    </div>
  );
}

export default Expenses;
