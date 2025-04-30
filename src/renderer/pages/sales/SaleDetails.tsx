import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

interface SaleItem {
  product_name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

interface SaleDetails {
  invoice_no: number;
  date: string;
  customer_name: string;
  customer_phone?: string; // Made optional
  total_amount: number;
  discount: number;
  items: SaleItem[];
}

export function SaleDetails() {
  const { id } = useParams<{ id: string }>();
  const [bill, setBill] = useState<SaleDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBill = async () => {
      try {
        const data = await window.electron.ipcRenderer.invoke(
          "sale:getDetails",
          Number(id)
        );
        if (!data) {
          throw new Error("Invoice not found");
        }
        setBill(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load invoice");
      } finally {
        setLoading(false);
      }
    };
    loadBill();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!bill) return <div>Invoice not found</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Invoice #{bill.invoice_no}</h2>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p>
            <strong>Date:</strong> {new Date(bill.date).toLocaleDateString()}
          </p>
          <p>
            <strong>Customer:</strong> {bill.customer_name}
          </p>
          {bill.customer_phone && (
            <p>
              <strong>Phone:</strong> {bill.customer_phone}
            </p>
          )}
        </div>
        <div className="text-right">
          <p>
            <strong>Total Amount:</strong>{" "}
            {bill.total_amount?.toFixed(2) || "0.00"}
          </p>
          <p>
            <strong>Discount:</strong> {(bill.discount || 0)?.toFixed(2)}
          </p>
        </div>
      </div>

      <h3 className="font-bold mb-2">Items</h3>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2">Product</th>
            <th className="text-right p-2">Qty</th>
            <th className="text-right p-2">Price</th>
            <th className="text-right p-2">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {bill.items?.map((item, index) => (
            <tr key={index} className="border-b">
              <td className="p-2">{item.product_name}</td>
              <td className="p-2 text-right">{item.quantity}</td>
              <td className="p-2 text-right">
                {item.price?.toFixed(2) || "0.00"}
              </td>
              <td className="p-2 text-right">
                {item.subtotal?.toFixed(2) || "0.00"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
