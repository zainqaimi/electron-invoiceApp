import React, { useEffect, useState } from "react";

type CompanyImage = { name: string; data: number[] } | string | null;
type CompanyData = {
  id: number | null;
  name: string;
  email: string;
  phone: string;
  address: string;
  logo: CompanyImage;
  created_at: string;
  logoPreview?: string | null;
};
type CompanyLogo = string | null;

export default function Company() {
  const [companies, setCompanies] = useState<CompanyData[]>([]);
  const [newCompany, setNewCompany] = useState<CompanyData>({
    id: null,
    name: "",
    email: "",
    phone: "",
    address: "",
    logo: null,
    created_at: "",
  });
  const [alertMsg, setAlertMsg] = useState<string>("");
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const fetchCompanies = async () => {
    const result = await window.electron.ipcRenderer.invoke("companies:get");

    const updated = result.map((company: any) => ({
      ...company,
      logoPreview: getBase64Image(company.logo),
    }));

    setCompanies(updated);
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const clearForm = () => {
    setNewCompany({
      id: null,
      name: "",
      email: "",
      phone: "",
      address: "",
      logo: null,
      created_at: "", // Reset created_at as well
    });
    setLogo(null);
    setLogoPreview(null);
  };

  const getBase64Image = (img: string | null): string | null => {
    if (!img) return null;

    if (img.startsWith("data:image/")) {
      return img;
    }

    try {
      const base64 = (window.electron.fs as any).readFileBase64(img);
      return base64 ? `data:image/png;base64,${base64}` : null;
    } catch (err) {
      console.error("Base64 conversion failed:", err);
      return null;
    }
  };

  function getImageExt(filePath: string): string {
    const ext = filePath.split(".").pop()?.toLowerCase();
    if (!ext) return "png";
    if (ext === "jpg") return "jpeg";
    return ext;
  }

  const handleAddOrUpdateCompany = async () => {
    if (!newCompany.name || !newCompany.email || !newCompany.phone) {
      setAlertMsg("❌ Sab fields required hain!");
      return;
    }

    let finalLogo: CompanyLogo = null;

    if (newCompany.id) {
      // Edit Mode
      if (logo) {
        // Naya logo selected
        try {
          const base64Image = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(logo);
          });
          finalLogo = base64Image;
        } catch (err) {
          console.error("❌ Error converting logo to base64:", err);
          setAlertMsg("❌ Logo conversion failed.");
          return;
        }
      } else {
        // Logo unchanged
        finalLogo = "UNCHANGED";
      }

      const companyData = { ...newCompany, logo: finalLogo };

      try {
        await window.electron.ipcRenderer.invoke(
          "companies:update",
          newCompany.id,
          companyData
        );
        setAlertMsg("✅ Company updated successfully!");
        clearForm();
        fetchCompanies();
      } catch (err: any) {
        console.error("❌ Error updating company:", err);
        setAlertMsg(`❌ Error: ${err.message}`);
      }
    } else {
      // Create Mode
      if (logo) {
        try {
          const base64Image = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(logo);
          });
          finalLogo = base64Image;
        } catch (err) {
          console.error("❌ Error converting logo to base64:", err);
          setAlertMsg("❌ Logo conversion failed.");
          return;
        }
      }

      const companyData = { ...newCompany, logo: finalLogo };

      try {
        await window.electron.ipcRenderer.invoke(
          "companies:create",
          companyData
        );
        setAlertMsg("✅ New company added!");
        clearForm();
        fetchCompanies();
      } catch (err: any) {
        console.error("❌ Error creating company:", err);
        setAlertMsg(`❌ Error: ${err.message}`);
      }
    }
  };
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setLogo(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleEditCompany = (company: CompanyData) => {
    setNewCompany({
      id: company.id,
      name: company.name,
      email: company.email,
      phone: company.phone,
      address: company.address,
      logo: company.logo,
      created_at: company.created_at, // Populate created_at
    });
    setLogo(null);
    setLogoPreview(
      company.logo && typeof company.logo === "string"
        ? getBase64Image(company.logo)
        : null
    );
    setAlertMsg("");
  };

  const handleDeleteCompany = async (id: any) => {
    if (id !== null) {
      // Ensure id is not null before passing it to the function
      await window.electron.ipcRenderer.invoke("companies:delete", id);
      fetchCompanies();
      setAlertMsg("✅ Company deleted");
    } else {
      setAlertMsg("❌ Invalid company ID.");
    }
  };

  return (
    <div className="p-4 space-y-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold">🏢 Companies</h2>

      {/* Add/Edit Company Form */}
      <div className="space-y-2 border p-4 rounded-xl shadow">
        <h3 className="font-semibold">
          {newCompany.id ? "✏️ Edit Company" : "➕ Add New Company"}
        </h3>
        <input
          className="w-full border p-2 rounded"
          placeholder="Name"
          value={newCompany.name}
          onChange={(e) =>
            setNewCompany({ ...newCompany, name: e.target.value })
          }
        />
        <input
          className="w-full border p-2 rounded"
          placeholder="Email"
          value={newCompany.email}
          onChange={(e) =>
            setNewCompany({ ...newCompany, email: e.target.value })
          }
        />
        <input
          className="w-full border p-2 rounded"
          placeholder="Phone"
          value={newCompany.phone}
          onChange={(e) =>
            setNewCompany({ ...newCompany, phone: e.target.value })
          }
        />
        <input
          className="w-full border p-2 rounded"
          placeholder="Address"
          value={newCompany.address}
          onChange={(e) =>
            setNewCompany({ ...newCompany, address: e.target.value })
          }
        />

        <input
          className="w-full border p-2 rounded"
          type="file"
          accept="image/*"
          onChange={handleLogoChange}
        />
        {logoPreview && (
          <img
            src={logoPreview}
            alt="Preview"
            className="w-24 h-24 object-cover rounded-full"
          />
        )}

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={handleAddOrUpdateCompany}
        >
          {newCompany.id ? "Update Company" : "Add Company"}
        </button>
        {newCompany.id && (
          <button
            className="ml-2 bg-gray-500 text-white px-3 py-2 rounded"
            onClick={clearForm}
          >
            Cancel Edit
          </button>
        )}
        {alertMsg && <div className="mt-2 font-medium">{alertMsg}</div>}
      </div>

      {/* All Companies List */}
      <div className="space-y-2">
        <h3 className="font-semibold">📃 All Companies</h3>
        {companies.map((company, i) => (
          <div
            key={i}
            className="border-b py-2 flex items-center justify-between"
          >
            <div className="flex items-center space-x-2">
              {company.logoPreview && (
                <img
                  src={company.logoPreview}
                  className="w-10 h-10 rounded-full object-cover"
                  alt="Company"
                />
              )}
              <div>
                <div className="font-semibold">{company.name}</div>
                <div className="text-sm text-gray-600">{company.email}</div>
                <div className="text-sm text-gray-600">{company.phone}</div>
                <div className="text-sm text-gray-600">{company.address}</div>
                <div className="text-sm text-gray-400">
                  {company.created_at}
                </div>
              </div>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleEditCompany(company)}
                className="text-blue-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteCompany(company.id)}
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
