import { useState } from "react";
import { Input } from "@/renderer/components/ui/input";
import { Button } from "@/renderer/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/renderer/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/renderer/components/ui/table";
import { Label } from "@/renderer/components/ui/label";

export default function CreateOrder() {
  const [invoice] = useState({ serial: "103", date: "2025-03-26", customer: "", items: [] });

  return (
    <div className="">
      <Card>
        <CardHeader>
          <CardTitle>Sale Invoice</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Serial No</Label>
              <Input value={invoice.serial} readOnly />
            </div>
            <div>
              <Label>Date</Label>
              <Input type="date" value={invoice.date} />
            </div>
            <div>
              <Label>Customer</Label>
              <Input placeholder="Enter customer name" value={invoice.customer} />
            </div>
          </div>

          <Table className="mt-6">
            <TableHeader>
              <TableRow>
                <TableHead>Item Code</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Rate</TableHead>
                <TableHead>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell><Input placeholder="Code" /></TableCell>
                <TableCell><Input placeholder="Description" /></TableCell>
                <TableCell><Input type="number" placeholder="Qty" /></TableCell>
                <TableCell><Input type="number" placeholder="Rate" /></TableCell>
                <TableCell><Input type="number" readOnly /></TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <div className="flex justify-end mt-6">
            <Button>Save Invoice</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
