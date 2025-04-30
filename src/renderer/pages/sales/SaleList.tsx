import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

interface SaleBill {
  id: number;
  invoice_no: number;
  date: string;
  customer_name: string;
  total_amount: number;
}

export function SaleList() {
  const [bills, setBills] = useState<SaleBill[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadBills = async () => {
      try {
        const data = await window.electron.ipcRenderer.invoke("sale:getAll");
        setBills(data);
      } catch (error) {
        console.error("Error loading bills:", error);
      } finally {
        setLoading(false);
      }
    };
    loadBills();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Sale Invoices</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice #</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bills.map((bill) => (
            <TableRow key={bill.id}>
              <TableCell>{bill.invoice_no}</TableCell>
              <TableCell>{new Date(bill.date).toLocaleDateString()}</TableCell>
              <TableCell>{bill.customer_name}</TableCell>
              <TableCell>{bill.total_amount.toFixed(2)}</TableCell>
              <TableCell>
                <button
                  className="text-blue-500 hover:underline"
                  onClick={() =>
                    window.electron.ipcRenderer.invoke("sale:print", bill.id)
                  }
                >
                  Print
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
