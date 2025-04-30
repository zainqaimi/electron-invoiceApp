import { useEffect, useState } from "react";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../components/ui/select";
import { toast } from "sonner";

interface Product {
  id: number;
  name: string;
  unit: string;
  price: number;
  packing_type: string;
  quantity: number;
  units_per_pack: number; // <-- Changed from unit_per_pack to units_per_pack
}

interface Customer {
  id: number;
  name: string;
  phone: string;
  address?: string;
  balance: number;
}

interface Salesman {
  id: number;
  name: string;
}

interface InvoiceItem {
  product_id: number;
  description?: string;
  quantity: number;
  ctn?: number;
  discount: number;
  price: number;
  total: number;
  unit?: string;
}

export function SaleForm() {
  const [invoiceNo, setInvoiceNo] = useState<number>(0);
  const [date, setDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [salesmen, setSalesmen] = useState<Salesman[]>([]);

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [selectedSalesman, setSelectedSalesman] = useState<number | null>(null);
  const [items, setItems] = useState<InvoiceItem[]>([]);

  const [discount, setDiscount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [invoiceNo, customers, products, salesmen] = await Promise.all([
          window.electron.ipcRenderer.invoke("sale:getNextInvoiceNo"),
          window.electron.ipcRenderer.invoke("customers:get"),
          window.electron.ipcRenderer.invoke("products:get"),
          window.electron.ipcRenderer.invoke("salesmen:get"),
        ]);
        setInvoiceNo(invoiceNo);
        setCustomers(customers);
        setProducts(products);
        setSalesmen(salesmen);
      } catch (err) {
        toast.error("Error loading data");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleProductChange = (index: number, productId: number) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const updated = [...items];
    updated[index] = {
      ...updated[index],
      product_id: product.id,
      price: product.price,
      quantity: 0,
      ctn: 0,
      discount: 0,
      total: parseFloat((product.price * product.units_per_pack).toFixed(2)), // <-- Changed from unit_per_pack to units_per_pack
      unit: product.unit,
    };
    setItems(updated);
  };

  const handleItemFieldChange = (
    index: number,
    field: keyof InvoiceItem,
    value: number | string
  ) => {
    const updated = [...items];
    const item: any = { ...updated[index] };

    const product = products.find((p) => p.id === item.product_id);

    // Parse numeric fields safely
    const numValue = ["price", "quantity", "discount", "ctn"].includes(field)
      ? Number(value)
      : value;

    item[field] = numValue;

    if (field === "ctn" && product) {
      const unitsPerPack = product.units_per_pack; // <-- Changed from unit_per_pack to units_per_pack
      const ctn = Number(value) || 0;
      item.ctn = ctn;
      item.quantity = ctn * unitsPerPack; // <-- Changed from unit_per_pack to units_per_pack
    }

    const qty = item.quantity || 0;
    const price = item.price || 0;
    const discount = item.discount || 0;

    const total = price * qty * (1 - discount / 100);
    item.total = parseFloat(total.toFixed(2));

    updated[index] = item;
    setItems(updated);
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        product_id: 0,
        quantity: 0,
        ctn: 0,
        price: 0,
        discount: 0,
        total: 0,
        description: "",
        unit: "",
      },
    ]);
  };

  const removeItem = (index: number) => {
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
  };

  const handleCustomerSelect = (id: number) => {
    const customer = customers.find((c) => c.id === id) || null;
    setSelectedCustomer(customer);
  };

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const grandTotal = subtotal - discount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer || !selectedSalesman || items.length === 0) {
      toast.warning("Please fill all required fields");
      return;
    }
    setSubmitting(true);
    try {
      await window.electron.ipcRenderer.invoke("sale:create", {
        customer_id: selectedCustomer.id,
        salesman_id: selectedSalesman,
        items,
        discount,
        date,
      });
      toast.success("Invoice created");
      setItems([]);
      setDiscount(0);
    } catch {
      toast.error("Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <form className="space-y-4 p-4" onSubmit={handleSubmit}>
      {/* Invoice Info */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label>Invoice #</Label>
          <Input readOnly value={invoiceNo} />
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
          <Label>Salesman</Label>
          <Select
            value={selectedSalesman?.toString() || ""}
            onValueChange={(v) => setSelectedSalesman(Number(v))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Salesman" />
            </SelectTrigger>
            <SelectContent>
              {salesmen.map((s) => (
                <SelectItem key={s.id} value={s.id.toString()}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Customer Info */}
      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-2">
          <Label>Customer</Label>
          <Select
            value={selectedCustomer?.id.toString() || ""}
            onValueChange={(v) => handleCustomerSelect(Number(v))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Customer" />
            </SelectTrigger>
            <SelectContent>
              {customers.map((c) => (
                <SelectItem key={c.id} value={c.id.toString()}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Phone</Label>
          <Input readOnly value={selectedCustomer?.phone || ""} />
        </div>
        <div>
          <Label>Balance</Label>
          <Input
            readOnly
            className="text-red-600 font-semibold"
            value={selectedCustomer?.balance?.toFixed(2) || ""}
          />
        </div>
      </div>
      <div>
        <Label>Address</Label>
        <Input readOnly value={selectedCustomer?.address || ""} />
      </div>

      {/* Product Table */}
      <div className="border rounded p-2 space-y-2">
        <div className="font-semibold">Products</div>
        <div className="grid grid-cols-9 gap-2 text-sm font-semibold">
          <div>Product</div>
          <div>Description</div>
          <div>CTN</div>
          <div>Qty</div>
          <div>Price</div>
          <div>Unit</div>
          <div>Disc %</div>
          <div>Total</div>
          <div>Action</div>
        </div>
        {items.map((item, index) => (
          <div key={index} className="grid grid-cols-9 gap-2">
            <Select
              value={item.product_id.toString()}
              onValueChange={(v) => handleProductChange(index, Number(v))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Product" />
              </SelectTrigger>
              <SelectContent>
                {products.map((p) => (
                  <SelectItem key={p.id} value={p.id.toString()}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Desc"
              value={item.description || ""}
              onChange={(e) =>
                handleItemFieldChange(index, "description", e.target.value)
              }
            />
            <Input
              type="number"
              placeholder="Ctn"
              value={item.ctn ?? ""}
              onChange={(e) =>
                handleItemFieldChange(index, "ctn", e.target.value)
              }
            />

            <Input
              type="number"
              placeholder="Qty"
              value={item.quantity ?? ""}
              onChange={(e) =>
                handleItemFieldChange(index, "quantity", e.target.value)
              }
            />
            <Input
              type="number"
              placeholder="Price"
              value={item.price}
              onChange={(e) =>
                handleItemFieldChange(index, "price", e.target.value)
              }
            />
            <Input readOnly value={item.unit || ""} />
            <Input
              type="number"
              placeholder="Disc %"
              value={item.discount}
              onChange={(e) =>
                handleItemFieldChange(index, "discount", e.target.value)
              }
            />
            <Input readOnly value={item.total.toFixed(2)} />
            <Button
              variant="ghost"
              type="button"
              onClick={() => removeItem(index)}
            >
              Remove
            </Button>
          </div>
        ))}
        <Button type="button" onClick={addItem}>
          Add Product
        </Button>
      </div>

      {/* Totals */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label>Subtotal</Label>
          <Input readOnly value={subtotal.toFixed(2)} />
        </div>
        <div>
          <Label>Discount</Label>
          <Input
            type="number"
            value={discount}
            onChange={(e) => setDiscount(Number(e.target.value))}
          />
        </div>
        <div>
          <Label>Grand Total</Label>
          <Input readOnly value={grandTotal.toFixed(2)} />
        </div>
      </div>

      <Button type="submit" disabled={submitting}>
        {submitting ? "Saving..." : "Submit Invoice"}
      </Button>
    </form>
  );
}
