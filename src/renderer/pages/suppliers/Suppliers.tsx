import React, { useEffect, useState } from "react";

type Supplier = {
  id: number | null;
  name: string;
  contact_number: string;
  company_name: string;
  created_at: string;
};

type Company = {
  id: number;
  name: string;
};

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [form, setForm] = useState<Supplier>({
    id: null,
    name: "",
    contact_number: "",
    company_name: "",
    created_at: "",
  });
  const [alertMsg, setAlertMsg] = useState("");

  const fetchSuppliers = async () => {
    const data = await window.electron.ipcRenderer.invoke("suppliers:get");
    setSuppliers(data);
  };

  const fetchCompanies = async () => {
    const data = await window.electron.ipcRenderer.invoke("companies:get");
    setCompanies(data);
  };

  useEffect(() => {
    fetchSuppliers();
    fetchCompanies();
  }, []);

  const handleSave = async () => {
    if (!form.name || !form.contact_number || !form.company_name) {
      setAlertMsg("❌ Name, contact, and company are required.");
      return;
    }

    try {
      if (form.id) {
        await window.electron.ipcRenderer.invoke(
          "suppliers:update",
          form.id,
          form
        );
        setAlertMsg("✅ Supplier updated!");
      } else {
        await window.electron.ipcRenderer.invoke("suppliers:create", form);
        setAlertMsg("✅ Supplier added!");
      }

      setForm({
        id: null,
        name: "",
        contact_number: "",
        company_name: "",
        created_at: "",
      });
      fetchSuppliers();
    } catch (err: any) {
      setAlertMsg(`❌ Error: ${err.message}`);
    }
  };

  const handleEdit = (supplier: Supplier) => {
    setForm(supplier);
    setAlertMsg("");
  };

  const handleDelete = async (id: number) => {
    await window.electron.ipcRenderer.invoke("suppliers:delete", id);
    fetchSuppliers();
    setAlertMsg("✅ Supplier deleted.");
  };

  return (
    <div className="p-4 space-y-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold">📦 Suppliers</h2>

      {/* Form */}
      <div className="space-y-2 border p-4 rounded-xl shadow">
        <h3 className="font-semibold">
          {form.id ? "✏️ Edit Supplier" : "➕ Add Supplier"}
        </h3>
        <input
          className="w-full border p-2 rounded"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="w-full border p-2 rounded"
          placeholder="Contact Number"
          value={form.contact_number}
          onChange={(e) => setForm({ ...form, contact_number: e.target.value })}
        />
        <select
          className="w-full border p-2 rounded"
          value={form.company_name}
          onChange={(e) => setForm({ ...form, company_name: e.target.value })}
        >
          <option value="">Select Company</option>
          {companies.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={handleSave}
        >
          {form.id ? "Update Supplier" : "Add Supplier"}
        </button>

        {form.id && (
          <button
            className="ml-2 bg-gray-500 text-white px-3 py-2 rounded"
            onClick={() =>
              setForm({
                id: null,
                name: "",
                contact_number: "",
                company_name: "",
                created_at: "",
              })
            }
          >
            Cancel Edit
          </button>
        )}

        {alertMsg && <div className="mt-2 font-medium">{alertMsg}</div>}
      </div>

      {/* Supplier List */}
      <div className="space-y-2">
        <h3 className="font-semibold">📃 All Suppliers</h3>
        {suppliers.map((s) => (
          <div
            key={s.id}
            className="border-b py-2 flex items-center justify-between"
          >
            <div>
              <div className="font-semibold">{s.name}</div>
              <div className="text-sm text-gray-600">{s.contact_number}</div>
              <div className="text-sm text-gray-600">{s.company_name}</div>
              <div className="text-sm text-gray-400">{s.created_at}</div>
            </div>
            <div className="space-x-2">
              <button onClick={() => handleEdit(s)} className="text-blue-600">
                Edit
              </button>
              <button
                onClick={() => handleDelete(s.id!)}
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
