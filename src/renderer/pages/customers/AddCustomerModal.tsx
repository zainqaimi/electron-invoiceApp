import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/renderer/components/ui/dialog";
import { Button } from "@/renderer/components/ui/button";

interface Props {
  customer?: any;
  onClose: () => void;
  onCustomerAdded: () => void;
}

export const AddCustomerModal = ({
  customer,
  onClose,
  onCustomerAdded,
}: Props) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    salesmen_id: "",
    status: "",
  });

  const [salesmen, setSalesmen] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(true); // Modal state

  // Effect for setting initial formData when customer is provided
  useEffect(() => {
    if (customer) {
      setFormData({
        ...customer,
        salesmen_id: customer.salesmen_id?.toString() || "", // Convert salesmen_id to string
      });
    }
    (async () => {
      const result = await window.electron.ipcRenderer.invoke("salesmen:get");
      setSalesmen(result);
    })();
  }, [customer]);

  // Handle the modal save functionality
  const handleSave = async () => {
    if (!formData.name) return alert("Name required");

    try {
      console.log("Saving data...");
      if (customer?.id) {
        console.log("Updating customer...");
        await window.electron.ipcRenderer.invoke(
          "customers:update",
          customer.id,
          formData
        );
      } else {
        console.log("Creating customer...");
        await window.electron.ipcRenderer.invoke("customers:create", formData);
      }

      console.log("Calling onCustomerAdded and onClose...");
      onCustomerAdded();

      // Directly close modal after data is saved
      setIsOpen(false);
      onClose(); // Close modal immediately after state update
    } catch (err: any) {
      console.error("Error:", err.message);
      alert("Error: " + err.message);
    }
  };

  // Close the modal when user clicks outside or presses the close button
  const handleClose = () => {
    setIsOpen(false);
    onClose(); // Directly trigger the onClose callback
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {customer ? "Edit Customer" : "Add Customer"}
          </DialogTitle>
          <DialogDescription>
            Please fill in the customer details below.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <input
            className="w-full border p-2 rounded"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <input
            className="w-full border p-2 rounded"
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          <input
            className="w-full border p-2 rounded"
            placeholder="Phone"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
          />
          <input
            className="w-full border p-2 rounded"
            placeholder="Address"
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
          />
          <select
            className="w-full border p-2 rounded"
            value={formData.salesmen_id}
            onChange={(e) =>
              setFormData({
                ...formData,
                salesmen_id: e.target.value,
              })
            }
          >
            <option value="">Select Salesman</option>
            {salesmen.map((s: any) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <select
            className="w-full border p-2 rounded"
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
          >
            <option value="">Select Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <Button onClick={handleSave} className="w-full">
            {customer ? "Update" : "Add"} Customer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
