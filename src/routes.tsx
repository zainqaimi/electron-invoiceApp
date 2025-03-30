import { lazy } from "react";
import { RouteObject } from "react-router-dom";

const Dashboard = lazy(() => import("./pages/dashboard/Dashboard"));
const CreateOrder = lazy(() => import("./pages/createOrder/CreateOrder"));
const Inventory = lazy(() => import("./pages/inventory/Inventory"));
const Customers = lazy(() => import("./pages/customers/Customers"));
const Suppliers = lazy(() => import("./pages/suppliers/Suppliers"));
const Expenses = lazy(() => import("./pages/expenses/Expenses"));
const Reports = lazy(() => import("./pages/Reports"));
const Settings = lazy(() => import("./pages/Settings"));



const routes: RouteObject[] = [
  { path: "/", element: <Dashboard /> },
  { path: "/createOrder", element: <CreateOrder /> },
  { path: "/inventory", element: <Inventory /> },
  { path: "/customers" , element: <Customers/>},
  { path: "/suppliers" , element: <Suppliers/>},
  { path: "/expenses" , element: <Expenses/>},
  { path: "/reports", element: <Reports /> },
  { path: "/settings", element: <Settings /> },
];

export default routes;
