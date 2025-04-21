// src/pages/Stock.tsx

import { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
} from "../components/ui/table";

type ProductStock = {
  id: number;
  name: string;
  unit: string;
  quantity: number;
};

export default function Stock() {
  const [stockData, setStockData] = useState<ProductStock[]>([]);

  const fetchStock = async () => {
    const products = await window.electron.ipcRenderer.invoke("products:get");

    const updatedStock: ProductStock[] = await Promise.all(
      products.map(async (product) => {
        const stock = await window.electron.ipcRenderer.invoke(
          "stocks:get",
          product.id
        );
        return {
          id: product.id,
          name: product.name,
          unit: product.unit,
          quantity: stock?.quantity || 0,
        };
      })
    );

    setStockData(updatedStock);
  };

  useEffect(() => {
    fetchStock();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Stock Overview</h2>
      <Card>
        <CardContent className="p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Quantity in Stock</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stockData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.unit}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
