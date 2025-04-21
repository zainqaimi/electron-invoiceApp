// import { useState, useEffect } from "react";
// import { Button } from "../components/ui/button";
// import { Input } from "../components/ui/input";
// import { Select } from "../components/ui/select";

// const InvoiceForm = () => {
//   const [customers, setCustomers] = useState([]);
//   const [salesmen, setSalesmen] = useState([]);
//   const [formData, setFormData] = useState({
//     customer_id: "",
//     salesman_id: "",
//     total_amount: 0,
//     paid_amount: 0,
//     discount: 0,
//     invoice_date: new Date(),
//     items: [],
//   });

//   useEffect(() => {
//     const fetchCustomers = async () => {
//       try {
//         const response = await window.electron.ipcRenderer.invoke(
//           "customer:getAll"
//         );
//         setCustomers(response);
//       } catch (error) {
//         console.error("Error fetching customers:", error);
//       }
//     };

//     const fetchSalesmen = async () => {
//       try {
//         const response = await window.electron.ipcRenderer.invoke(
//           "salesman:getAll"
//         );
//         setSalesmen(response);
//       } catch (error) {
//         console.error("Error fetching salesmen:", error);
//       }
//     };

//     fetchCustomers();
//     fetchSalesmen();
//   }, []);

//   const handleFormSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const invoiceData = { ...formData };
//       await window.electron.ipcRenderer.invoke("invoice:create", invoiceData);
//       alert("Invoice Created Successfully!");
//     } catch (error) {
//       console.error("Error creating invoice:", error);
//     }
//   };

//   return (
//     <div className="p-4">
//       <h2 className="text-xl mb-4">Create Invoice</h2>
//       <form onSubmit={handleFormSubmit}>
//         <div className="mb-4">
//           <label htmlFor="customer">Customer</label>
//           <Select
//             id="customer"
//             value={formData.customer_id}
//             onChange={(e) =>
//               setFormData({ ...formData, customer_id: e.target.value })
//             }
//           >
//             {customers.map((customer) => (
//               <Option key={customer.id} value={customer.id}>
//                 {customer.name}
//               </Option>
//             ))}
//           </Select>
//         </div>

//         <div className="mb-4">
//           <label htmlFor="salesman">Salesman</label>
//           <Select
//             id="salesman"
//             value={formData.salesman_id}
//             onChange={(e) =>
//               setFormData({ ...formData, salesman_id: e.target.value })
//             }
//           >
//             {salesmen.map((salesman) => (
//               <Option key={salesman.id} value={salesman.id}>
//                 {salesman.name}
//               </Option>
//             ))}
//           </Select>
//         </div>

//         <div className="mb-4">
//           <label htmlFor="invoice_date">Invoice Date</label>
//           <DatePicker
//             id="invoice_date"
//             value={formData.invoice_date}
//             onChange={(date) =>
//               setFormData({ ...formData, invoice_date: date })
//             }
//           />
//         </div>

//         <div className="mb-4">
//           <label htmlFor="total_amount">Total Amount</label>
//           <Input
//             type="number"
//             id="total_amount"
//             value={formData.total_amount}
//             onChange={(e) =>
//               setFormData({ ...formData, total_amount: +e.target.value })
//             }
//           />
//         </div>

//         <div className="mb-4">
//           <label htmlFor="paid_amount">Paid Amount</label>
//           <Input
//             type="number"
//             id="paid_amount"
//             value={formData.paid_amount}
//             onChange={(e) =>
//               setFormData({ ...formData, paid_amount: +e.target.value })
//             }
//           />
//         </div>

//         <div className="mb-4">
//           <label htmlFor="discount">Discount</label>
//           <Input
//             type="number"
//             id="discount"
//             value={formData.discount}
//             onChange={(e) =>
//               setFormData({ ...formData, discount: +e.target.value })
//             }
//           />
//         </div>

//         <Button type="submit">Create Invoice</Button>
//       </form>
//     </div>
//   );
// };

// export default InvoiceForm;
import React from "react";

function InvoiceForm() {
  return <div>InvoiceForm</div>;
}

export default InvoiceForm;
