import { useState } from "react";

export default function Expenses() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [message, setMessage] = useState("");

  const saveProduct = async () => {
    if (!name || !price || !stock) {
      setMessage("Please fill all fields.");
      return;
    }

    const product = { name, price: Number(price), stock: Number(stock) };

    try {
      // 🔹 **Fix: Explicitly define response type**
      const response: { success: boolean; message?: string } = await window.api.addProduct(product);

      if (response.success) {
        setMessage("Product saved successfully!");
        setName("");
        setPrice("");
        setStock("");
      } else {
        setMessage("Error: " + (response.message || "Unknown error"));
      }
    } catch (error) {
      setMessage("Unexpected error: " + error);
    }
  };

  return (
    <div>
      <h1>Add Product</h1>
      <input type="text" placeholder="Product Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
      <input type="number" placeholder="Stock" value={stock} onChange={(e) => setStock(e.target.value)} />
      <button onClick={saveProduct}>Save Product</button>
      <p>{message}</p>
    </div>
  );
}
