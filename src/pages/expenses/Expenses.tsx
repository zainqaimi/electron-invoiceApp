import { useEffect } from "react";

function Expenses() {
  useEffect(() => {
    console.log("Electron:", window.electron);
    console.log(
      "Electron API Methods:",
      window.electron ? Object.keys(window.electron) : "Not Available"
    );
  }, []);

  const addTestProduct = async () => {
    if (!window.electron) {
      console.error("Electron API is not available!");
      return;
    }

    const product = {
      name: "Test Product",
      company: "Test Company",
      stock: 10,
      price: 99.99,
      image: "",
    };

    try {
      console.log("Invoking add-product...");
      const response = await window.electron.invoke("add-product", product);
      console.log("Product Added:", response);
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  return (
    <button onClick={addTestProduct} className="p-2 bg-blue-500 text-white rounded">
      Add Test Product
    </button>
  );
}

export default Expenses;
