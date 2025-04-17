import { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "../components/ui/select";
type Product = {
  id: number;
  image: string;
  name: string;
  brand: string;
  unit: string;
  packing_type: string;
  price: number;
  cost_price?: number;
  description?: string;
  created_at?: string;
};

type ProductFormData = {
  image: string;
  name: string;
  brand: string;
  unit: string;
  packing_type: string;
  price: number;
  cost_price: number;
  description: string;
};

const defaultProduct: ProductFormData = {
  image: "",
  name: "",
  brand: "",
  unit: "",
  packing_type: "",
  price: 0,
  cost_price: 0,
  description: "",
};

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<ProductFormData>(defaultProduct);
  const [editId, setEditId] = useState<number | null>(null);
  const [brands, setBrands] = useState<string[]>([]);
  const [units, setUnits] = useState<string[]>([]);
  const [packingTypes, setPackingTypes] = useState<string[]>([]);
  const fetchUnits = async () => {
    const data = await window.electron.ipcRenderer.invoke("units:get");
    setUnits(data.map((u) => u.name));
  };
  const fetchPackingTypes = async () => {
    const data = await window.electron.ipcRenderer.invoke("packing_types:get");
    setPackingTypes(data.map((p) => p.name));
  };

  const fetchProducts = async () => {
    try {
      const products = await window.electron.ipcRenderer.invoke("products:get");
      setProducts(products);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchBrands = async () => {
    try {
      const brands = await window.electron.ipcRenderer.invoke("companies:get");
      setBrands(brands.map((company) => company.name));
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (editId) {
        await window.electron.ipcRenderer.invoke(
          "products:update",
          editId,
          form
        );
        console.log("Product updated:", editId);
      } else {
        const newId = await window.electron.ipcRenderer.invoke(
          "products:create",
          form
        );
        console.log("Product created with ID:", newId);
      }

      fetchProducts();
      resetForm();
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm({ ...form, image: reader.result as string });
    };
    if (file) reader.readAsDataURL(file);
  };

  const handleEdit = (product: Product) => {
    setForm({
      name: product.name || "",
      brand: product.brand || "",
      unit: product.unit || "",
      packing_type: product.packing_type || "",
      price: product.price || 0,
      cost_price: product.cost_price || 0,
      description: product.description || "",
      image: product.image || "",
    });
    setEditId(product.id);
  };

  const handleDelete = async (id: number) => {
    await window.electron.ipcRenderer.invoke("products:delete", id);
    fetchProducts();
  };

  const resetForm = () => {
    setForm(defaultProduct);
    setEditId(null);
  };
  useEffect(() => {
    fetchUnits();
    fetchPackingTypes();
    fetchProducts();
    fetchBrands();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      <Card>
        <CardContent className="space-y-4 p-4">
          <h2 className="text-xl font-semibold">
            {editId ? "Edit Product" : "Add Product"}
          </h2>
          <div>
            <Label>Name</Label>
            <Input name="name" value={form.name} onChange={handleChange} />
          </div>
          <div>
            <Label>Brand</Label>
            <Select
              name="brand"
              value={form.brand}
              onValueChange={(value) =>
                handleChange({ target: { name: "brand", value } })
              }
            >
              <SelectTrigger>
                <span>{form.brand || "Select a brand"}</span>{" "}
                {/* Show the selected brand */}
              </SelectTrigger>
              <SelectContent>
                {brands.map((brand) => (
                  <SelectItem key={brand} value={brand}>
                    {brand}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Unit</Label>
            <Select
              name="unit"
              value={form.unit}
              onValueChange={(value) =>
                handleChange({ target: { name: "unit", value } })
              }
            >
              <SelectTrigger>
                <span>{form.unit || "Select unit"}</span>
              </SelectTrigger>
              <SelectContent>
                {units.map((unit) => (
                  <SelectItem key={unit} value={unit}>
                    {unit}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Packing Type</Label>
            <Select
              name="packing_type"
              value={form.packing_type}
              onValueChange={(value) =>
                handleChange({ target: { name: "packing_type", value } })
              }
            >
              <SelectTrigger>
                <span>{form.packing_type || "Select packing type"}</span>
              </SelectTrigger>
              <SelectContent>
                {packingTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Price</Label>
            <Input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Cost Price</Label>
            <Input
              type="number"
              name="cost_price"
              value={form.cost_price}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Description</Label>
            <Input
              name="description"
              value={form.description}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Image</Label>
            <Input type="file" accept="image/*" onChange={handleImage} />
            {form.image && (
              <img
                src={form.image}
                alt="Preview"
                className="h-20 w-20 object-cover rounded mt-2"
              />
            )}
          </div>
          <Button onClick={handleSubmit}>{editId ? "Update" : "Create"}</Button>
          {editId && (
            <Button variant="ghost" onClick={resetForm}>
              Cancel
            </Button>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 space-y-2">
          <h2 className="text-xl font-semibold">Product List</h2>
          {products.map((product) => (
            <div key={product.id} className="border p-2 rounded space-y-1">
              {product.image && (
                <img
                  src={product.image}
                  alt="Product"
                  className="h-16 w-16 rounded-full object-cover"
                />
              )}
              <p>
                <strong>Name:</strong> {product.name}
              </p>
              <p>
                <strong>Price:</strong> {product.price}
              </p>
              <div className="flex gap-2">
                <Button onClick={() => handleEdit(product)}>Edit</Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(product.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
