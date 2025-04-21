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
import PurchaseBillDetails from "./PurchaseBillDetails";

interface Supplier {
  id: number;
  name: string;
  company_name: string;
}

interface Product {
  id: number;
  name: string;
  unit: string;
  packing_type: string;
  units_per_pack: number;
  brand: string;
  cost_price: number;
}

interface ProductRow {
  product_id: number;
  product_name: string;
  unit: string;
  packing_type: string;
  units_per_pack: number;
  quantity: number;
  price: number;
  cost_price: number;
  discount: number;
  tax: number;
  total: number;
}

export default function PurchaseForm() {
  const defaultProductRow: ProductRow = {
    product_id: 0,
    product_name: "",
    unit: "",
    packing_type: "",
    units_per_pack: 1,
    quantity: 0,
    price: 0,
    cost_price: 0,
    discount: 0,
    tax: 0,
    total: 0,
  };

  const [serialNo, setSerialNo] = useState(201);
  const [date, setDate] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const [productRows, setProductRows] = useState<ProductRow[]>([
    defaultProductRow,
  ]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null
  );
  const [products, setProducts] = useState<Product[]>([]);
  const [purchaseBills, setPurchaseBills] = useState<any[]>([]);
  const [selectedBillId, setSelectedBillId] = useState<number | null>(null);

  useEffect(() => {
    fetchSerial();
    fetchSuppliers();
    fetchProducts();
    fetchPurchaseBills(); // Fetch purchase bills on component mount
  }, []);

  useEffect(() => {
    if (supplierId) {
      const supplier = suppliers.find((s) => s.id.toString() === supplierId);
      setSelectedSupplier(supplier || null);
    }
  }, [supplierId, suppliers]);

  const fetchSerial = async () => {
    const last = await window.electron.ipcRenderer.invoke(
      "purchase:getLastSerial"
    );
    setSerialNo(last);
  };

  const fetchSuppliers = async () => {
    try {
      const data = await window.electron.ipcRenderer.invoke("suppliers:get");
      setSuppliers(data);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const data = await window.electron.ipcRenderer.invoke("products:get");
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchPurchaseBills = async () => {
    try {
      const data = await window.electron.ipcRenderer.invoke("purchase:getAll");
      setPurchaseBills(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching purchase bills:", error);
    }
  };

  const handleProductChange = (
    index: number,
    field: keyof ProductRow,
    value: string
  ) => {
    const newRows = [...productRows];
    const row = newRows[index];

    if (field === "product_id") {
      const prodId = parseInt(value);
      const prod = products.find((p) => p.id === prodId);
      if (prod) {
        row.product_id = prod.id;
        row.product_name = prod.name;
        row.unit = prod.unit;
        row.packing_type = prod.packing_type;
        row.units_per_pack = prod.units_per_pack || 1;
        row.quantity = prod.units_per_pack || 1;
        row.cost_price = prod.cost_price || 0;
      }
    } else if (field === "quantity") {
      const qty = parseFloat(value) || 0;
      row.quantity = qty;
      const prod = products.find((p) => p.id === row.product_id);
      const baseUnits = prod?.units_per_pack || 1;
      row.units_per_pack = baseUnits ? qty / baseUnits : 1;
    } else if (field === "units_per_pack") {
      const unitsPerPack = parseFloat(value) || 0;
      row.units_per_pack = unitsPerPack;
      const prod = products.find((p) => p.id === row.product_id);
      const baseUnits = prod?.units_per_pack || 1;
      row.quantity = unitsPerPack * baseUnits;
    } else {
      (row[field] as any) = parseFloat(value) || 0;
    }

    const price = row.price || 0;
    const costPrice = row.cost_price || 0;
    const discount = row.discount || 0;
    const tax = row.tax || 0;
    const qty = row.quantity || 0;
    const discountedPrice = price - (price * discount) / 100;
    const taxedPrice = discountedPrice + (discountedPrice * tax) / 100;
    row.total = taxedPrice * qty;

    setProductRows(newRows);
  };

  const handleAddRow = () => {
    setProductRows([...productRows, { ...defaultProductRow }]);
  };

  const handleRemoveRow = (index: number) => {
    const newRows = [...productRows];
    newRows.splice(index, 1);
    setProductRows(newRows);
  };

  const handleSubmit = async () => {
    const total_amount = productRows.reduce((sum, p) => sum + p.total, 0);
    const payload = {
      serial_no: serialNo,
      date: date || new Date().toISOString().split("T")[0], // Manually set date
      supplier_id: parseInt(supplierId),
      supplier_name: selectedSupplier?.name, // Add supplier_name
      company: selectedSupplier?.company_name, // Add company
      total_amount,
      items: productRows.map((p) => ({
        product_id: p.product_id,
        quantity: p.quantity,
        price: p.price,
        cost_price: p.cost_price,
        discount: p.discount,
        tax: p.tax,
        total_amount: p.total,
        units_per_pack: p.units_per_pack,
        packing_type: p.packing_type,
      })),
    };
    console.log(payload);
    try {
      const result = await window.electron.ipcRenderer.invoke(
        "purchase:create",
        payload
      );
      console.log("Purchase bill saved:", result);
      setProductRows([defaultProductRow]);
      fetchSerial();
      fetchPurchaseBills(); // Re-fetch bills after submission
    } catch (error) {
      console.error("Failed to save purchase bill", error);
    }
  };

  return (
    <>
      <div className="p-4 space-y-4">
        <Card>
          <CardContent className="space-y-4 p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Serial No</Label>
                <Input value={serialNo} disabled />
              </div>
              <div>
                <Label>Date</Label>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div>
                <Label>Supplier</Label>
                <Select
                  value={supplierId}
                  onValueChange={(val) => setSupplierId(val)}
                >
                  <SelectTrigger>
                    <span>{supplierId || "Select Supplier"}</span>
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map((s) => (
                      <SelectItem key={s.id} value={s.id.toString()}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {selectedSupplier && (
              <div className="border p-2 rounded mt-2">
                <strong>Supplier Info:</strong>
                <p>Name: {selectedSupplier.name}</p>
                <p>Company: {selectedSupplier.company_name}</p>
              </div>
            )}

            <div className="space-y-2 mt-4">
              <h3 className="font-semibold text-lg">Products</h3>
              <div className="grid grid-cols-11 gap-2 font-bold text-sm">
                <div>Product</div>
                <div>Qty</div>
                <div>Packing Type</div>
                <div>Unit</div>
                <div>Packing</div>
                <div>Price</div>
                <div>Cost Price</div>
                <div>Discount</div>
                <div>Tax</div>
                <div>Total</div>
                <div>Action</div>
              </div>

              {productRows.map((row, index) => (
                <div
                  key={index}
                  className="grid grid-cols-11 gap-2 items-center border p-2 rounded"
                >
                  <Select
                    value={row.product_id?.toString()}
                    onValueChange={(val) =>
                      handleProductChange(index, "product_id", val)
                    }
                  >
                    <SelectTrigger>
                      <span>{row.product_name || "Select Product"}</span>
                    </SelectTrigger>
                    <SelectContent>
                      {products
                        .filter((p) =>
                          selectedSupplier
                            ? p.brand === selectedSupplier.company_name
                            : true
                        )
                        .map((p) => (
                          <SelectItem key={p.id} value={p.id.toString()}>
                            {p.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>

                  <Input
                    type="number"
                    placeholder="Qty"
                    value={row.quantity}
                    onChange={(e) =>
                      handleProductChange(index, "quantity", e.target.value)
                    }
                  />
                  <Input
                    type="number"
                    placeholder="Units/Pack"
                    value={row.units_per_pack}
                    onChange={(e) =>
                      handleProductChange(
                        index,
                        "units_per_pack",
                        e.target.value
                      )
                    }
                  />
                  <Input value={row.unit} readOnly />
                  <Input value={row.packing_type} readOnly />
                  <Input
                    type="number"
                    placeholder="Price"
                    value={row.price}
                    onChange={(e) =>
                      handleProductChange(index, "price", e.target.value)
                    }
                  />
                  <Input
                    type="number"
                    placeholder="Cost Price"
                    value={row.cost_price}
                    onChange={(e) =>
                      handleProductChange(index, "cost_price", e.target.value)
                    }
                  />
                  <Input
                    type="number"
                    placeholder="Discount"
                    value={row.discount}
                    onChange={(e) =>
                      handleProductChange(index, "discount", e.target.value)
                    }
                  />
                  <Input
                    type="number"
                    placeholder="Tax"
                    value={row.tax}
                    onChange={(e) =>
                      handleProductChange(index, "tax", e.target.value)
                    }
                  />
                  <Input
                    type="number"
                    placeholder="Total"
                    value={row.total}
                    readOnly
                  />
                  <Button onClick={() => handleRemoveRow(index)}>Remove</Button>
                </div>
              ))}
            </div>

            <Button onClick={handleAddRow}>Add Product</Button>
          </CardContent>
        </Card>

        <Button onClick={handleSubmit}>Save Purchase Bill</Button>

        <div className="space-y-4 mt-8">
          <h3 className="text-lg font-semibold">Existing Purchase Bills</h3>
          {purchaseBills.length > 0 ? (
            purchaseBills.map((bill) => (
              <Card key={bill.id}>
                <CardContent className="p-4">
                  <div className="font-semibold">{`Bill #${bill.serial_no}`}</div>
                  <div>Date: {bill.date}</div>
                  <div>Supplier: {bill.supplier_name}</div>
                  <div>company Name: {bill.company}</div>
                  <div>Total Amount: {bill.total_amount}</div>
                  <Button onClick={() => setSelectedBillId(bill.id)}>
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <div>No purchase bills found.</div>
          )}
        </div>

        {selectedBillId && <PurchaseBillDetails billId={selectedBillId} />}
      </div>
    </>
  );
}
