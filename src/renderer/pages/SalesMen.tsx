import React, { useEffect, useState } from "react";

type Salesman = {
  id: number | null;
  name: string;
  contact_number: string;
  email: string;
  company_name: string;
  address: string;
  joining_date: string;
  created_at: string;
};

export default function SalesMen() {
  const [salesmen, setSalesmen] = useState<Salesman[]>([]);
  const [companies, setCompanies] = useState<string[]>([]);
  const [newSalesman, setNewSalesman] = useState<Salesman>({
    id: null,
    name: "",
    contact_number: "",
    email: "",
    company_name: "",
    address: "",
    joining_date: "",
    created_at: "",
  });
  const [alertMsg, setAlertMsg] = useState<string>("");

  const fetchSalesmen = async () => {
    const result = await window.electron.ipcRenderer.invoke("salesmen:get");
    setSalesmen(result);
  };
  const fetchCompanies = async () => {
    const result = await window.electron.ipcRenderer.invoke("companies:get");
    const names = result.map((c: any) => c.name);
    setCompanies(names);
  };
  useEffect(() => {
    fetchCompanies();
    fetchSalesmen();
  }, []);

  const clearForm = () => {
    setNewSalesman({
      id: null,
      name: "",
      contact_number: "",
      email: "",
      company_name: "",
      address: "",
      joining_date: "",
      created_at: "",
    });
  };

  const handleAddOrUpdate = async () => {
    if (
      !newSalesman.name ||
      !newSalesman.company_name ||
      !newSalesman.joining_date
    ) {
      setAlertMsg("❌ Name, Company Name & Joining Date are required.");
      return;
    }

    try {
      if (newSalesman.id) {
        await window.electron.ipcRenderer.invoke(
          "salesmen:update",
          newSalesman.id,
          newSalesman
        );
        setAlertMsg("✅ Salesman updated.");
      } else {
        await window.electron.ipcRenderer.invoke(
          "salesmen:create",
          newSalesman
        );
        setAlertMsg("✅ New salesman added.");
      }
      clearForm();
      fetchSalesmen();
    } catch (err: any) {
      setAlertMsg(`❌ Error: ${err.message}`);
    }
  };

  const handleEdit = (s: Salesman) => {
    setNewSalesman(s);
    setAlertMsg("");
  };

  const handleDelete = async (id: number | null) => {
    if (id === null) return;
    await window.electron.ipcRenderer.invoke("salesmen:delete", id);
    fetchSalesmen();
    setAlertMsg("✅ Salesman deleted.");
  };

  return (
    <div className="p-4 space-y-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold">🧍 Salesmen</h2>

      <div className="space-y-2 border p-4 rounded-xl shadow">
        <h3 className="font-semibold">
          {newSalesman.id ? "✏️ Edit Salesman" : "➕ Add New Salesman"}
        </h3>
        <input
          className="w-full border p-2 rounded"
          placeholder="Name"
          value={newSalesman.name}
          onChange={(e) =>
            setNewSalesman({ ...newSalesman, name: e.target.value })
          }
        />
        <input
          className="w-full border p-2 rounded"
          placeholder="Contact Number"
          value={newSalesman.contact_number}
          onChange={(e) =>
            setNewSalesman({ ...newSalesman, contact_number: e.target.value })
          }
        />
        <input
          className="w-full border p-2 rounded"
          placeholder="Email"
          value={newSalesman.email}
          onChange={(e) =>
            setNewSalesman({ ...newSalesman, email: e.target.value })
          }
        />
        <select
          className="w-full border p-2 rounded"
          value={newSalesman.company_name}
          onChange={(e) =>
            setNewSalesman({ ...newSalesman, company_name: e.target.value })
          }
        >
          <option value="">Select Company</option>
          {companies.map((company, index) => (
            <option key={index} value={company}>
              {company}
            </option>
          ))}
        </select>

        <input
          className="w-full border p-2 rounded"
          placeholder="Address"
          value={newSalesman.address}
          onChange={(e) =>
            setNewSalesman({ ...newSalesman, address: e.target.value })
          }
        />
        <input
          className="w-full border p-2 rounded"
          type="date"
          value={newSalesman.joining_date}
          onChange={(e) =>
            setNewSalesman({ ...newSalesman, joining_date: e.target.value })
          }
        />

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={handleAddOrUpdate}
        >
          {newSalesman.id ? "Update Salesman" : "Add Salesman"}
        </button>
        {newSalesman.id && (
          <button
            className="ml-2 bg-gray-500 text-white px-3 py-2 rounded"
            onClick={clearForm}
          >
            Cancel Edit
          </button>
        )}
        {alertMsg && <div className="mt-2 font-medium">{alertMsg}</div>}
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold">📃 All Salesmen</h3>
        {salesmen.map((s, i) => (
          <div
            key={i}
            className="border-b py-2 flex items-center justify-between"
          >
            <div>
              <div className="font-semibold">{s.name}</div>
              <div className="text-sm text-gray-600">{s.email}</div>
              <div className="text-sm text-gray-600">{s.contact_number}</div>
              <div className="text-sm text-gray-600">{s.company_name}</div>
              <div className="text-sm text-gray-600">{s.address}</div>
              <div className="text-sm text-gray-400">
                Joined: {s.joining_date}
              </div>
              <div className="text-sm text-gray-400">Added: {s.created_at}</div>
            </div>
            <div className="space-x-2">
              <button onClick={() => handleEdit(s)} className="text-blue-600">
                Edit
              </button>
              <button
                onClick={() => handleDelete(s.id)}
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
