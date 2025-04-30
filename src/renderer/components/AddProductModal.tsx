import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

type ProductFormData = {
  image: string;
  name: string;
  brand: string;
  unit: string;
  packing_type: string;
  price: number;
  cost_price: number;
  description: string;
  quantity?: number;
  units_per_pack?: number;
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
  units_per_pack: 0,
  quantity: 0,
};

export function AddProductModal({
  onProductAdded,
}: {
  onProductAdded: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState<ProductFormData>(defaultProduct);
  const [brands, setBrands] = useState<string[]>([]);
  const [units, setUnits] = useState<string[]>([]);
  const [packingTypes, setPackingTypes] = useState<string[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  useEffect(() => {
    fetchUnits();
    fetchPackingTypes();
    fetchBrands();
  }, []);

  const fetchUnits = async () => {
    const data = await window.electron.ipcRenderer.invoke("units:get");
    setUnits(data.map((u) => u.name));
  };

  const fetchPackingTypes = async () => {
    const data = await window.electron.ipcRenderer.invoke("packing_types:get");
    setPackingTypes(data.map((p) => p.name));
  };

  const fetchBrands = async () => {
    const data = await window.electron.ipcRenderer.invoke("companies:get");
    setBrands(data.map((company) => company.name));
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "units_per_pack" ? Number(value) : value,
    }));
  };

  const handleImage = (e: any) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, image: reader.result as string }));
    };
    if (file) reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
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
      await onProductAdded();
      setIsOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const resetForm = () => {
    setForm(defaultProduct);
    setEditId(null);
  };

  const handleEditProduct = async (product: any) => {
    setForm({
      name: product.name || "",
      brand: product.brand || "",
      unit: product.unit || "",
      packing_type: product.packing_type || "",
      price: product.price || 0,
      cost_price: product.cost_price || 0,
      description: product.description || "",
      image: product.image || "",
      units_per_pack: product.units_per_pack || 0,
      quantity: product.quantity || 0,
    });
    setEditId(product.id);
    setIsOpen(true);
  };

  useEffect(() => {
    (window as any).openProductModal = (product: any) => {
      handleEditProduct(product);
    };
  }, []);
  return (
    <>
      <Button
        onClick={() => {
          resetForm();
          setIsOpen(true);
        }}
      >
        Add Product
      </Button>
      <Dialog key={editId ?? "new"} open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="overflow-auto">
          <DialogHeader>
            <DialogTitle>{editId ? "Edit Product" : "Add Product"}</DialogTitle>
            <DialogDescription>
              {editId
                ? "Update product details and save changes."
                : "Fill out the form below to create a new product."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            {/* Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 items-center gap-4">
              <Label>Name</Label>
              <Input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="sm:col-span-2 lg:col-span-3"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 items-center gap-4">
              <Label>Brand</Label>
              <Select
                value={form.brand}
                onValueChange={(value) =>
                  handleChange({ target: { name: "brand", value } })
                }
              >
                <SelectTrigger className="sm:col-span-2 lg:col-span-3">
                  <SelectValue placeholder="Select Brand" />
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 items-center gap-4">
              <Label>Unit</Label>
              <Select
                value={form.unit}
                onValueChange={(value) =>
                  handleChange({ target: { name: "unit", value } })
                }
              >
                <SelectTrigger className="sm:col-span-2 lg:col-span-3">
                  <SelectValue placeholder="Select Unit" />
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 items-center gap-4">
              <Label>Packing Type</Label>
              <Select
                value={form.packing_type}
                onValueChange={(value) =>
                  handleChange({ target: { name: "packing_type", value } })
                }
              >
                <SelectTrigger className="sm:col-span-2 lg:col-span-3">
                  <SelectValue placeholder="Select Packing Type" />
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

            {form.unit && form.packing_type && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 items-center gap-4">
                <Label>
                  {form.unit} in {form.packing_type}
                </Label>
                <Input
                  type="number"
                  name="units_per_pack"
                  value={form.units_per_pack}
                  onChange={handleChange}
                  className="sm:col-span-2 lg:col-span-3"
                />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 items-center gap-4">
              <Label>Description</Label>
              <Input
                name="description"
                value={form.description}
                onChange={handleChange}
                className="sm:col-span-2 lg:col-span-3"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 items-center gap-4">
              <Label>Image</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImage}
                className="sm:col-span-2 lg:col-span-3"
              />
              {form.image && (
                <img
                  src={form.image}
                  alt="Preview"
                  className="h-20 w-20 object-contain rounded-full"
                />
              )}
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                type="button"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">{editId ? "Update" : "Create"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
