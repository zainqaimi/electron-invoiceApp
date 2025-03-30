import useProducts from "../hooks/useProducts"

export default function ProductsPage() {
  const { products, addProduct } = useProducts();

  return (
    <div>
      <h1>Products</h1>
      <button onClick={() => addProduct({ name: "New Product", company: "ABC", stock: 10, price: 100, image: null })}>
        Add Product
      </button>
      <table>
        <thead>
          <tr><th>Name</th><th>Stock</th><th>Price</th></tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}><td>{p.name}</td><td>{p.stock}</td><td>{p.price}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
