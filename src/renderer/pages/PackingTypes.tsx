import { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

type PackingType = {
  id: number;
  name: string;
};

export default function PackingTypes() {
  const [types, setTypes] = useState<PackingType[]>([]);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState<number | null>(null);

  const fetchTypes = async () => {
    const result = await window.electron.ipcRenderer.invoke(
      "packing_types:get"
    );

    setTypes(result);
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  // const handleSubmit = async () => {
  //   if (!name.trim()) return;

  //   if (editId) {
  //     await window.electron.ipcRenderer.invoke(
  //       "packing_types:update",
  //       editId,
  //       name
  //     );
  //   } else {
  //     await window.electron.ipcRenderer.invoke("packing_types:create", name);
  //   }

  //   setName("");
  //   setEditId(null);
  //   fetchTypes();
  // };

  const handleSubmit = async () => {
    if (!name.trim()) {
      console.error("Name is required!");
      return;
    }

    if (editId) {
      await window.electron.ipcRenderer.invoke("packing_types:update", editId, {
        name,
      });
    } else {
      await window.electron.ipcRenderer.invoke("packing_types:create", {
        name,
      });
    }

    setName(""); // Clear input field
    setEditId(null); // Reset edit mode
    fetchTypes(); // Reload packing types
  };

  const handleEdit = (type: PackingType) => {
    setName(type.name);
    setEditId(type.id);
  };

  const handleDelete = async (id: number) => {
    await window.electron.ipcRenderer.invoke("packing_types:delete", id);
    fetchTypes();
  };

  return (
    <div className="p-4 space-y-4">
      <Card>
        <CardContent className="space-y-4 p-4">
          <Label>Packing Type</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., box, bottle, pouch"
          />
          <div className="flex gap-2">
            <Button onClick={handleSubmit}>
              {editId ? "Update" : "Add Type"}
            </Button>
            {editId && (
              <Button variant="ghost" onClick={() => setEditId(null)}>
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 space-y-2">
          <h2 className="text-lg font-semibold">Packing Types</h2>
          {types.map((type) => (
            <div
              key={type.id}
              className="border p-2 rounded flex justify-between items-center"
            >
              <span>{type.name}</span>
              <div className="flex gap-2">
                <Button onClick={() => handleEdit(type)}>Edit</Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(type.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
