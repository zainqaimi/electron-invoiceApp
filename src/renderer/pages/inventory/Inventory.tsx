import { useEffect, useState } from "react";
import { TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import DataTable from "@/renderer/components/DataTable";
import { AddProductModal } from "@/renderer/components/AddProductModal";
import { StatsCard } from "@/renderer/components/StatsCard";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/renderer/components/ui/alert-dialog";

// Types
interface Product {
  id: number;
  image: string;
  name: string;
  brand: string;
  unit: string;
  packing_type: string;
  price: number;
  cost_price?: number;
  description?: string;
  units_per_pack?: number;
  quantity?: number;
  created_at?: string;
}

const Inventory = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Product | null>(null);
  const [selectedRows, setSelectedRows] = useState<Product[]>([]);

  const fetchProducts = async () => {
    try {
      const result = await window.electron.ipcRenderer.invoke("products:get");
      setProducts(result);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const columns = [
    { key: "image", label: "Image", isImage: true },
    { key: "name", label: "Product", sortable: true },
    { key: "brand", label: "Brand", sortable: true },
    { key: "price", label: "Sell Price", sortable: true },
    { key: "quantity", label: "In Stock", sortable: true },
    { key: "unit", label: "Unit", sortable: true },
    { key: "packing_type", label: "Packing Type", sortable: true },
    { key: "units_per_pack", label: "Units Per Pack", sortable: true },
  ];

  const handleDelete = async () => {
    try {
      if (selectedRow) {
        await window.electron.ipcRenderer.invoke(
          "products:delete",
          selectedRow.id
        );
      } else if (selectedRows.length > 0) {
        await Promise.all(
          selectedRows.map((row) =>
            window.electron.ipcRenderer.invoke("products:delete", row.id)
          )
        );
      }
      await fetchProducts();
      setSelectedRow(null);
      setSelectedRows([]);
      setConfirmOpen(false);
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const totalProducts = products.length;
  const totalInStock = products.reduce((sum, p) => sum + (p.quantity || 0), 0);
  const outOfStock = products.filter((p) => (p.quantity || 0) === 0).length;
  const uniqueCompanies = new Set(products.map((p) => p.brand)).size;
  const stats = [
    {
      title: "Total Products",
      value: totalProducts.toString(),
      description: "All registered products",
      icon: TrendingUpIcon,
      trend: "up",
      percentage: "100%",
      footerText: "Updated live",
    },
    {
      title: "In Stock",
      value: totalInStock.toString(),
      description: "Units available",
      icon: TrendingUpIcon,
      trend: "up",
      percentage: "↑",
      footerText: "Based on quantity",
    },
    {
      title: "Out of Stock",
      value: outOfStock.toString(),
      description: "Zero quantity items",
      icon: TrendingDownIcon,
      trend: "down",
      percentage: "↓",
      footerText: "Needs restock",
    },
    {
      title: "Total Companies",
      value: uniqueCompanies.toString(),
      description: "Brands / Suppliers",
      icon: TrendingUpIcon,
      trend: "neutral",
      percentage: "-",
      footerText: "From product list",
    },
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="px-4 lg:px-6 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="h-full">
            <StatsCard {...stat} />
          </div>
        ))}
      </div>

      <DataTable
        title="Products"
        actionButton={<AddProductModal onProductAdded={fetchProducts} />}
        columns={columns}
        data={products}
        loading={false}
        onEdit={(row) => {
          (window as any).openProductModal(row, fetchProducts);
        }}
        onDelete={(row: any) => {
          setSelectedRow(row);
          setSelectedRows([]); // reset bulk
          setConfirmOpen(true);
        }}
        onBulkDelete={(rows: any) => {
          setSelectedRows(rows);
          setSelectedRow(null); // reset single
          setConfirmOpen(true);
        }}
        fixedHeight="600px"
      />
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedRow
                ? `This will permanently delete "${selectedRow.name}".`
                : `This will permanently delete ${selectedRows.length} selected products.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setConfirmOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Inventory;
