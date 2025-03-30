import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { useCompany } from "../../hooks/useCompany";

export default function CompanyRegister() {
  const { createCompany } = useCompany();
  const [formData, setFormData] = useState({
    companyName: "",
    address: "",
    phone: "",
    taxId: "",
    logo: "",
  });

  const handleChange = (e:any) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    await createCompany(formData);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle>Company Registration</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input type="text" name="companyName" placeholder="Company Name" required onChange={handleChange} />
            <Input type="text" name="address" placeholder="Address" required onChange={handleChange} />
            <Input type="tel" name="phone" placeholder="Phone Number" onChange={handleChange} />
            <Input type="text" name="taxId" placeholder="Tax ID" onChange={handleChange} />
            <Input type="file" name="logo" accept="image/*" onChange={handleChange} />
            <Button type="submit" className="w-full">Register Company</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
