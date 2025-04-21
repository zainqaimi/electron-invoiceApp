import { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/card";

interface PurchaseItem {
  id: number;
  bill_id: number;
  product_id: number;
  quantity: number;
  price: number;
  cost_price: number;
  discount: number;
  tax: number;
  total_amount: number;
  packing_type: string;
  units_per_pack: number;
}

interface PurchaseBill {
  id: number;
  serial_no: number;
  supplier_id: number;
  supplier_name: string;
  company: string;
  created_at: string;
  total_amount: number;
  items: PurchaseItem[];
}

export default function PurchaseBillDetails({ billId }: { billId: number }) {
  const [bill, setBill] = useState<PurchaseBill | null>(null);

  useEffect(() => {
    if (billId) {
      fetchPurchaseBillDetails(billId);
    }
  }, [billId]);
  const handleDeleteBill = async (billId: number) => {
    try {
      const success = await window.electron.purchase.delete(billId);
      if (success) {
        console.log("Bill deleted successfully");
        // Optionally redirect or update UI
      }
    } catch (error) {
      console.error("Error deleting bill:", error);
    }
  };

  const fetchPurchaseBillDetails = async (id: number) => {
    try {
      const data = await window.electron.ipcRenderer.invoke(
        "purchase:getById",
        id
      );
      setBill(data);
    } catch (error) {
      console.error("Failed to load bill details:", error);
    }
  };

  if (!bill) {
    return <div className="p-4">Loading bill details...</div>;
  }

  return (
    <div className="p-6 space-y-4">
      <Card>
        <CardContent className="space-y-4 p-4">
          <h2 className="text-xl font-bold">Purchase Bill #{bill.serial_no}</h2>
          <p>
            <strong>Date:</strong> {bill.created_at}
          </p>
          <h4>
            <strong>supplier Name:</strong> {bill.supplier_name}
          </h4>
          <h4>
            <strong>supplier Company:</strong> {bill.company}
          </h4>
          <p>
            <strong>Total Amount:</strong> Rs. {bill.total_amount}
          </p>

          <div className="mt-4">
            <h3 className="font-semibold text-lg">Items</h3>
            <div className="grid grid-cols-8 gap-2 font-bold text-sm border-b pb-2 mb-2">
              <span>Product ID</span>
              <span>Qty</span>
              <span>Packing Type</span>
              <span>Units/Packing</span>
              <span>Price</span>
              <span>Cost Price</span>
              <span>Discount %</span>
              <span>Total</span>
            </div>
            {bill.items.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-8 gap-2 border-b py-1 text-sm"
              >
                <span>{item.product_id}</span>
                <span>{item.quantity}</span>
                <span>{item.packing_type}</span>
                <span>{item.units_per_pack}</span>
                <span>{item.price}</span>
                <span>{item.cost_price}</span>
                <span>{item.discount}</span>
                <span>{item.total_amount}</span>
              </div>
            ))}
            <button
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              onClick={() => handleDeleteBill(bill.id)}
            >
              Delete Bill
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
