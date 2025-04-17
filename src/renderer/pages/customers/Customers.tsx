import React, { useEffect, useState } from "react";

type CustomerData = {
  id: any;
  name: string;
  email: string;
  phone: string;
  address: string;
  salesmen_id: number | null;
  status: string | null;
  created_at: string;
  updated_at: string;
};

export default function Customers() {
  const [customers, setCustomers] = useState<CustomerData[]>([]);
  const [newCustomer, setNewCustomer] = useState<CustomerData>({
    id: null,
    name: "",
    email: "",
    phone: "",
    address: "",
    salesmen_id: null,
    status: null,
    created_at: "",
    updated_at: "",
  });
  const [alertMsg, setAlertMsg] = useState<string>("");
  const [salesmen, setSalesmen] = useState<any[]>([]); // To load salesmen list

  const fetchCustomers = async () => {
    const result = await window.electron.ipcRenderer.invoke("customers:get");
    setCustomers(result);
  };

  const fetchSalesmen = async () => {
    const result = await window.electron.ipcRenderer.invoke("salesmen:get");
    setSalesmen(result);
  };

  useEffect(() => {
    fetchCustomers();
    fetchSalesmen();
  }, []);

  const clearForm = () => {
    setNewCustomer({
      id: null,
      name: "",
      email: "",
      phone: "",
      address: "",
      salesmen_id: null,
      status: null,
      created_at: "",
      updated_at: "",
    });
    setAlertMsg("");
  };

  const handleAddOrUpdateCustomer = async () => {
    if (!newCustomer.name) {
      setAlertMsg("❌ Name is required!");
      return;
    }

    try {
      if (newCustomer.id) {
        // Update Mode
        await window.electron.ipcRenderer.invoke(
          "customers:update",
          newCustomer.id,
          newCustomer
        );
        setAlertMsg("✅ Customer updated!");
      } else {
        // Create Mode
        await window.electron.ipcRenderer.invoke(
          "customers:create",
          newCustomer
        );
        setAlertMsg("✅ Customer added!");
      }
      fetchCustomers();
      clearForm();
    } catch (err: any) {
      setAlertMsg(`❌ Error: ${err.message}`);
    }
  };

  const handleEditCustomer = (customer: CustomerData) => {
    setNewCustomer({ ...customer });
    setAlertMsg("");
  };

  const handleDeleteCustomer = async (id: number) => {
    await window.electron.ipcRenderer.invoke("customers:delete", id);
    fetchCustomers();
    setAlertMsg("✅ Customer deleted");
  };

  return (
    <div className="p-4 space-y-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold">👥 Customers</h2>

      {/* Add/Edit Customer Form */}
      <div className="space-y-2 border p-4 rounded-xl shadow">
        <h3 className="font-semibold">
          {newCustomer.id ? "✏️ Edit Customer" : "➕ Add New Customer"}
        </h3>
        <input
          className="w-full border p-2 rounded"
          placeholder="Name"
          value={newCustomer.name}
          onChange={(e) =>
            setNewCustomer({ ...newCustomer, name: e.target.value })
          }
        />
        <input
          className="w-full border p-2 rounded"
          placeholder="Email"
          value={newCustomer.email}
          onChange={(e) =>
            setNewCustomer({ ...newCustomer, email: e.target.value })
          }
        />
        <input
          className="w-full border p-2 rounded"
          placeholder="Phone"
          value={newCustomer.phone}
          onChange={(e) =>
            setNewCustomer({ ...newCustomer, phone: e.target.value })
          }
        />
        <input
          className="w-full border p-2 rounded"
          placeholder="Address"
          value={newCustomer.address}
          onChange={(e) =>
            setNewCustomer({ ...newCustomer, address: e.target.value })
          }
        />
        <select
          className="w-full border p-2 rounded"
          value={newCustomer.salesmen_id || ""}
          onChange={(e) =>
            setNewCustomer({
              ...newCustomer,
              salesmen_id: Number(e.target.value),
            })
          }
        >
          <option value="">Select Salesman</option>
          {salesmen.map((salesman: any) => (
            <option key={salesman.id} value={salesman.id}>
              {salesman.name}
            </option>
          ))}
        </select>
        <select
          className="w-full border p-2 rounded"
          value={newCustomer.status || ""}
          onChange={(e) =>
            setNewCustomer({ ...newCustomer, status: e.target.value })
          }
        >
          <option value="">Select Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={handleAddOrUpdateCustomer}
        >
          {newCustomer.id ? "Update Customer" : "Add Customer"}
        </button>
        {newCustomer.id && (
          <button
            className="ml-2 bg-gray-500 text-white px-3 py-2 rounded"
            onClick={clearForm}
          >
            Cancel Edit
          </button>
        )}
        {alertMsg && <div className="mt-2 font-medium">{alertMsg}</div>}
      </div>

      {/* All Customers List */}
      <div className="space-y-2">
        <h3 className="font-semibold">📃 All Customers</h3>
        {customers.map((customer, i) => (
          <div
            key={i}
            className="border-b py-2 flex items-center justify-between"
          >
            <div>
              <div className="font-semibold">{customer.name}</div>
              <div className="text-sm text-gray-600">{customer.email}</div>
              <div className="text-sm text-gray-600">{customer.phone}</div>
              <div className="text-sm text-gray-600">{customer.address}</div>
              <div className="text-sm text-gray-400">{customer.status}</div>
              <div className="text-sm text-gray-400">{customer.created_at}</div>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleEditCustomer(customer)}
                className="text-blue-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteCustomer(customer.id)}
                className="text-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
