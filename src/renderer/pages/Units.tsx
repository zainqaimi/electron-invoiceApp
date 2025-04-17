import { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

type Unit = {
  id: number;
  name: string;
};

export default function Units() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState<number | null>(null);

  const fetchUnits = async () => {
    const result = await window.electron.ipcRenderer.invoke("units:get");
    setUnits(result);
  };

  useEffect(() => {
    fetchUnits();
  }, []);

  // const handleSubmit = async () => {
  //   if (!name.trim()) return;

  //   if (editId) {
  //     await window.electron.ipcRenderer.invoke("units:update", editId, name);
  //   } else {
  //     await window.electron.ipcRenderer.invoke("units:create", name);
  //   }

  //   setName("");
  //   setEditId(null);
  //   fetchUnits();
  // };

  const handleSubmit = async () => {
    if (!name.trim()) {
      console.error("Name is required!");
      return;
    }

    if (editId) {
      await window.electron.ipcRenderer.invoke("units:update", editId, {
        name,
      });
    } else {
      await window.electron.ipcRenderer.invoke("units:create", { name });
    }

    setName(""); // Clear input field
    setEditId(null); // Reset edit mode
    fetchUnits(); // Reload units
  };

  const handleEdit = (unit: Unit) => {
    setName(unit.name);
    setEditId(unit.id);
  };

  const handleDelete = async (id: number) => {
    await window.electron.ipcRenderer.invoke("units:delete", id);
    fetchUnits();
  };

  return (
    <div className="p-4 space-y-4">
      <Card>
        <CardContent className="space-y-4 p-4">
          <Label>Unit Name</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., piece, dozen, crate"
          />
          <div className="flex gap-2">
            <Button onClick={handleSubmit}>
              {editId ? "Update" : "Add Unit"}
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
          <h2 className="text-lg font-semibold">Units List</h2>
          {units.map((unit) => (
            <div
              key={unit.id}
              className="border p-2 rounded flex justify-between items-center"
            >
              <span>{unit.name}</span>
              <div className="flex gap-2">
                <Button onClick={() => handleEdit(unit)}>Edit</Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(unit.id)}
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
