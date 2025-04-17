import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

interface ProductLine {
  product_id: number;
  quantity: number;
  unit: string;
  packing_type: string;
  conversion_to_piece: number;
  cost_price: number;
}

export default function PurchaseBills() {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [productsList, setProductsList] = useState<any[]>([]);
  const [units, setUnits] = useState<any[]>([]);
  const [packingTypes, setPackingTypes] = useState<any[]>([]);
  const [products, setProducts] = useState<ProductLine[]>([]); // Correctly typed
  const [billNumber, setBillNumber] = useState("");
  const [billDate, setBillDate] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState<string>("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [stockPreview, setStockPreview] = useState<any[]>([]);

  useEffect(() => {
    window.electron.ipcRenderer.invoke("suppliers:get").then(setSuppliers);
    window.electron.ipcRenderer.invoke("products:get").then(setProductsList);
    window.electron.ipcRenderer.invoke("units:get").then(setUnits);
    window.electron.ipcRenderer
      .invoke("packing_types:get")
      .then(setPackingTypes);
  }, []);

  useEffect(() => {
    calculateTotal();
  }, [products]);

  const calculateTotal = () => {
    let total = 0;
    const preview: any[] = [];

    products.forEach((product) => {
      let totalPieces = 0;
      if (product.unit === "dozen") {
        totalPieces = product.quantity * 12; // Dozen to Pieces conversion
      } else if (product.unit === "piece") {
        totalPieces = product.quantity;
      } else {
        totalPieces = product.quantity * product.conversion_to_piece;
      }
      const subtotal = totalPieces * product.cost_price;
      total += subtotal;

      const selectedProduct = productsList.find(
        (p) => p.id === product.product_id
      );
      preview.push({
        name: selectedProduct?.name || "Unknown",
        totalPieces,
        cost_price: product.cost_price,
        subtotal,
      });
    });

    setStockPreview(preview);
    setTotalAmount(total);
  };

  const handleChange = (index: number, key: keyof ProductLine, value: any) => {
    const updated = [...products]; // Create a shallow copy of the products array
    updated[index] = {
      ...updated[index], // Spread the existing object to keep other fields intact
      [key]: value, // Dynamically set the field (key) to the new value
    };
    setProducts(updated); // Update the state with the new array
  };

  const handleAddProduct = () => {
    setProducts([
      ...products,
      {
        product_id: 0,
        quantity: 0,
        unit: "piece",
        packing_type: "",
        conversion_to_piece: 1,
        cost_price: 0,
      },
    ]);
  };

  const handleRemoveProduct = (index: number) => {
    const updated = products.filter((_, i) => i !== index);
    setProducts(updated);
  };

  const handleSubmit = async () => {
    if (
      !billNumber ||
      !billDate ||
      !selectedSupplier ||
      products.length === 0
    ) {
      alert("Please fill all fields and add at least one product.");
      return;
    }

    const payload = {
      supplier_id: parseInt(selectedSupplier),
      bill_number: billNumber,
      bill_date: billDate,
      products,
      total_amount: totalAmount,
    };

    await window.electron.ipcRenderer.invoke("purchase_bills:create", payload);
    alert("Purchase bill saved successfully.");
  };

  return (
    <Card className="p-4 space-y-4">
      <CardHeader>
        <CardTitle>Create Purchase Bill</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Supplier</Label>
            <Select
              onValueChange={setSelectedSupplier}
              value={selectedSupplier}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Supplier" />
              </SelectTrigger>
              <SelectContent>
                {suppliers.map((s) => (
                  <SelectItem key={s.id} value={String(s.id)}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Bill Number</Label>
            <Input
              value={billNumber}
              onChange={(e) => setBillNumber(e.target.value)}
            />
          </div>
          <div>
            <Label>Bill Date</Label>
            <Input
              type="date"
              value={billDate}
              onChange={(e) => setBillDate(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-4">
          {products.map((product, index) => (
            <div key={index} className="grid grid-cols-6 gap-2 items-end">
              <div>
                <Label>Product</Label>
                <Select
                  value={String(product.product_id)}
                  onValueChange={(val) =>
                    handleChange(index, "product_id", parseInt(val))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Product" />
                  </SelectTrigger>
                  <SelectContent>
                    {productsList.map((p) => (
                      <SelectItem key={p.id} value={String(p.id)}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Quantity</Label>
                <Input
                  type="number"
                  value={product.quantity}
                  onChange={(e) =>
                    handleChange(index, "quantity", Number(e.target.value))
                  }
                />
              </div>
              <div>
                <Label>Unit</Label>
                <Select
                  value={product.unit}
                  onValueChange={(val) => handleChange(index, "unit", val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {units.map((u) => (
                      <SelectItem key={u.id} value={u.name}>
                        {u.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Packing Type</Label>
                <Select
                  value={product.packing_type}
                  onValueChange={(val) =>
                    handleChange(index, "packing_type", val)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Packing Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {packingTypes.map((p) => (
                      <SelectItem key={p.id} value={p.name}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Conversion to Piece</Label>
                <Input
                  type="number"
                  value={product.conversion_to_piece}
                  onChange={(e) =>
                    handleChange(
                      index,
                      "conversion_to_piece",
                      Number(e.target.value)
                    )
                  }
                />
              </div>
              <div>
                <Label>Cost Price</Label>
                <Input
                  type="number"
                  value={product.cost_price}
                  onChange={(e) =>
                    handleChange(index, "cost_price", Number(e.target.value))
                  }
                />
              </div>
              <Button
                variant="destructive"
                onClick={() => handleRemoveProduct(index)}
              >
                Remove
              </Button>
            </div>
          ))}
          <Button onClick={handleAddProduct}>Add Product</Button>
        </div>

        <div className="space-y-2">
          <h3>Stock Preview</h3>
          {stockPreview.map((item, index) => (
            <div key={index} className="flex justify-between">
              <span>{item.name}</span>
              <span>{item.totalPieces} pieces</span>
              <span>{item.subtotal.toFixed(2)} USD</span>
            </div>
          ))}
        </div>

        <div className="flex justify-between">
          <h2>Total Amount</h2>
          <span>{totalAmount.toFixed(2)} USD</span>
        </div>

        <Button onClick={handleSubmit}>Submit</Button>
      </CardContent>
    </Card>
  );
}
