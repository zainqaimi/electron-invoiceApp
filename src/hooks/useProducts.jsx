import { useState, useEffect } from "react";

export default function useProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    window.electron.invoke("get-products").then(setProducts);
  }, []);

  const addProduct = async (product) => {
    await window.electron.invoke("add-product", product);
    setProducts(await window.electron.invoke("get-products"));
  };

  return { products, addProduct };
}
