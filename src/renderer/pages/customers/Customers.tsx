import { useEffect, useState } from "react";
import { TrendingDownIcon, TrendingUpIcon } from "lucide-react";

import DataTable from "@/renderer/components/DataTable";
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
import { AddCustomerModal } from "./AddCustomerModal";
import { Button } from "@/renderer/components/ui/button";

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  balance: number;
  salesmen_id: number | null;
  status: string | null;
  created_at?: string;
}

const Customers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Customer | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const result = await window.electron.ipcRenderer.invoke("customers:get");
      setCustomers(result);
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (selectedRow) {
      await window.electron.ipcRenderer.invoke(
        "customers:delete",
        selectedRow.id
      );
      await fetchCustomers();
      setConfirmOpen(false);
      setSelectedRow(null);
    }
  };

  const handleBulkDelete = async (rows: Customer[]) => {
    try {
      await Promise.all(
        rows.map((row) =>
          window.electron.ipcRenderer.invoke("customers:delete", row.id)
        )
      );
      fetchCustomers();
    } catch (error) {
      console.error("Error bulk deleting customers:", error);
    }
  };

  const columns = [
    { key: "name", label: "Name", sortable: true },
    { key: "email", label: "Email", sortable: true },
    { key: "phone", label: "Phone", sortable: true },
    { key: "address", label: "Address" },
    { key: "balance", label: "Balance", sortable: true },
    { key: "status", label: "Status", sortable: true },
  ];

  const totalCustomers = customers.length;
  const activeCustomers = customers.filter((c) => c.status === "active").length;
  const inactiveCustomers = customers.filter(
    (c) => c.status === "inactive"
  ).length;
  const uniqueSalesmen = new Set(customers.map((c) => c.salesmen_id)).size;

  const stats = [
    {
      title: "Total Customers",
      value: totalCustomers.toString(),
      description: "All registered customers",
      icon: TrendingUpIcon,
      trend: "up",
      percentage: "100%",
      footerText: "Updated live",
    },
    {
      title: "Active",
      value: activeCustomers.toString(),
      description: "Active status",
      icon: TrendingUpIcon,
      trend: "up",
      percentage: "↑",
      footerText: "Customers using service",
    },
    {
      title: "Inactive",
      value: inactiveCustomers.toString(),
      description: "Not using now",
      icon: TrendingDownIcon,
      trend: "down",
      percentage: "↓",
      footerText: "May need attention",
    },
    {
      title: "Salesmen Linked",
      value: uniqueSalesmen.toString(),
      description: "Assigned reps",
      icon: TrendingUpIcon,
      trend: "neutral",
      percentage: "-",
      footerText: "From customer list",
    },
  ];

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div className="px-4 lg:px-6 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div className="h-full" key={index}>
            <StatsCard {...stat} />
          </div>
        ))}
      </div>

      <DataTable
        title="Customers"
        actionButton={
          <Button
            onClick={() => {
              setEditingCustomer(null);
              setModalOpen(true);
            }}
          >
            Add Customer
          </Button>
        }
        columns={columns}
        data={customers}
        loading={loading}
        onEdit={(row: any) => {
          setEditingCustomer(row);
          setModalOpen(true);
        }}
        onDelete={(row: any) => {
          setSelectedRow(row);
          setConfirmOpen(true);
        }}
        onBulkDelete={(rows: any) => handleBulkDelete(rows)}
        fixedHeight="600px"
      />

      {modalOpen && (
        <AddCustomerModal
          customer={editingCustomer}
          onClose={() => {
            setModalOpen(false);
            setTimeout(() => {
              setEditingCustomer(null);
            }, 200);
          }}
          onCustomerAdded={fetchCustomers}
        />
      )}

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the customer.
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

export default Customers;
