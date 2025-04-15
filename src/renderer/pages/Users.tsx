import { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

type User = {
  id: number;
  image: string;
  name: string;
  email: string;
  password: string;
  created_at?: string;
  is_logged_in?: boolean;
};

type UserFormData = {
  image: string;
  name: string;
  email: string;
  password: string;
  confirmPass: string;
};

const defaultUser: UserFormData = {
  image: "",
  name: "",
  email: "",
  password: "",
  confirmPass: "",
};

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState<UserFormData>(defaultUser);
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const users = await window.electron.ipcRenderer.invoke("users:get");
      setUsers(users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (editId) {
        await window.electron.ipcRenderer.invoke("users:update", editId, form);
        console.log("User updated:", editId);
      } else {
        const newId = await window.electron.ipcRenderer.invoke(
          "users:create",
          form
        );
        console.log("User created with ID:", newId);
      }

      fetchUsers();
      resetForm();
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm({ ...form, image: reader.result as string });
    };
    if (file) reader.readAsDataURL(file);
  };

  const handleEdit = (user: User) => {
    setForm({
      name: user.name || "",
      email: user.email || "",
      password: user.password || "",
      confirmPass: user.password || "",
      image: user.image || "",
    });

    setEditId(user.id);
  };

  const handleDelete = async (id: number) => {
    await window.electron.ipcRenderer.invoke("users:delete", id);
    fetchUsers();
  };

  const handleLogin = async (user: User) => {
    const result = await window.electron.ipcRenderer.invoke(
      "users:checkPassword",
      user.email,
      user.password
    );
    if (result.success) {
      alert("Login successful");
      fetchUsers();
    } else {
      alert(result.message || "Login failed");
    }
  };

  const handleLogout = async (id: number) => {
    await window.electron.ipcRenderer.invoke("users:logout", id);
    alert("User logged out");
    fetchUsers();
  };

  const resetForm = () => {
    setForm(defaultUser);
    setEditId(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      <Card>
        <CardContent className="space-y-4 p-4">
          <h2 className="text-xl font-semibold">
            {editId ? "Edit User" : "Add User"}
          </h2>
          <div>
            <Label>Name</Label>
            <Input name="name" value={form.name} onChange={handleChange} />
          </div>
          <div>
            <Label>Email</Label>
            <Input name="email" value={form.email} onChange={handleChange} />
          </div>
          <div>
            <Label>Password</Label>
            <Input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Confirm Password</Label>
            <Input
              type="password"
              name="confirmPass"
              value={form.confirmPass}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>Image</Label>
            <Input type="file" accept="image/*" onChange={handleImage} />
            {form.image && (
              <img
                src={form.image}
                alt="Preview"
                className="h-20 w-20 object-cover rounded mt-2"
              />
            )}
          </div>
          <Button onClick={handleSubmit}>{editId ? "Update" : "Create"}</Button>
          {editId && (
            <Button variant="ghost" onClick={resetForm}>
              Cancel
            </Button>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 space-y-2">
          <h2 className="text-xl font-semibold">User List</h2>
          {users.map((user) => (
            <div key={user.id} className="border p-2 rounded space-y-1">
              {user.image && (
                <img
                  src={user.image}
                  alt="User"
                  className="h-16 w-16 rounded-full object-cover"
                />
              )}
              <p>
                <strong>Name:</strong> {user.name}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                {user.is_logged_in ? "✅ Logged In" : "❌ Logged Out"}
              </p>
              <div className="flex gap-2">
                <Button onClick={() => handleEdit(user)}>Edit</Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(user.id)}
                >
                  Delete
                </Button>
                {!user.is_logged_in ? (
                  <Button onClick={() => handleLogin(user)}>Login</Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => handleLogout(user.id)}
                  >
                    Logout
                  </Button>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
