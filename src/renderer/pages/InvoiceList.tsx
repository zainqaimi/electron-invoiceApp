// import { useEffect, useState } from "react";
// import { Button } from "../components/ui/button";

// interface Invoice {
//   id: number;
//   customer_name: string;
//   total_amount: number;
//   paid_amount: number;
//   balance_due: number;
//   invoice_date: string;
// }

// const InvoiceList = () => {
//   const [invoices, setInvoices] = useState<Invoice[]>([]);

//   useEffect(() => {
//     const fetchInvoices = async () => {
//       try {
//         const response = await window.electron.ipcRenderer.invoke(
//           "invoice:getAll"
//         );
//         setInvoices(response);
//       } catch (error) {
//         console.error("Error fetching invoices:", error);
//       }
//     };
//     fetchInvoices();
//   }, []);

//   return (
//     <div className="p-4">
//       <h2 className="text-xl mb-4">Invoice List</h2>
//       <Table>
//         <thead>
//           <tr>
//             <th>Invoice ID</th>
//             <th>Customer Name</th>
//             <th>Total Amount</th>
//             <th>Paid Amount</th>
//             <th>Balance Due</th>
//             <th>Invoice Date</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {invoices.map((invoice) => (
//             <tr key={invoice.id}>
//               <td>{invoice.id}</td>
//               <td>{invoice.customer_name}</td>
//               <td>{invoice.total_amount}</td>
//               <td>{invoice.paid_amount}</td>
//               <td>{invoice.balance_due}</td>
//               <td>{invoice.invoice_date}</td>
//               <td>
//                 <Tooltip content="View Details">
//                   <Button
//                     onClick={() =>
//                       window.electron.ipcRenderer.invoke(
//                         "invoice:details",
//                         invoice.id
//                       )
//                     }
//                   >
//                     View
//                   </Button>
//                 </Tooltip>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </Table>
//     </div>
//   );
// };

// export default InvoiceList;
import React from "react";

function InvoiceList() {
  return <div>InvoiceList</div>;
}

export default InvoiceList;
