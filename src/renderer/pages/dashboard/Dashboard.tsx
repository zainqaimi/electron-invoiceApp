// import { StatsCard } from ".";
import { StatsCard } from "@/renderer/components/StatsCard";
import StockReportChart from "@/renderer/components/StockReportChart";
import DataTable from "@/renderer/components/DataTable";
import { ArrowRight, TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import QuickActions from "@/renderer/components/QuickActions";
import CustomButton from "@/renderer/components/CustomButton";
function Dashboard() {
  const stats = [
    {
      title: "Total Products",
      value: "1,250",
      description: "Stock available",
      icon: TrendingUpIcon,
      // trend: "up",
      // percentage: "5%",
      // footerText: "Updated daily",
    },
    {
      title: "Total Companies",
      value: "345",
      description: "Active suppliers",
      icon: TrendingDownIcon,
      // trend: "down",
      // percentage: "2%",
      // footerText: "Supplier count fluctuating",
    },
    {
      title: "Total Products",
      value: "1,250",
      description: "Stock available",
      icon: TrendingUpIcon,
      // trend: "up",
      // percentage: "5%",
      // footerText: "Updated daily",
    },
    {
      title: "Total Companies",
      value: "345",
      description: "Active suppliers",
      icon: TrendingDownIcon,
      // trend: "down",
      // percentage: "2%",
      // footerText: "Supplier count fluctuating",
    },
  ];

  const columns = [
    { key: "image", label: "Image", isImage: true },
    { key: "name", label: "Product", sortable: true },
    { key: "sales", label: "Sales", sortable: true },
    { key: "category", label: "Category", sortable: true },
  ];

  const data = [
    {
      image: "https://via.placeholder.com/50",
      name: "Product A",
      sales: 120,
      category: "Electronics",
    },
    { image: "", name: "Product B", sales: 80, category: "Clothing" },
    {
      image: "https://via.placeholder.com/50",
      name: "Product C",
      sales: 200,
      category: "Furniture",
    },
    {
      image: "https://via.placeholder.com/50",
      name: "Product A",
      sales: 120,
      category: "Electronics",
    },
    { image: "", name: "Product B", sales: 80, category: "Clothing" },
    {
      image: "https://via.placeholder.com/50",
      name: "Product C",
      sales: 200,
      category: "Furniture",
    },
    {
      image: "https://via.placeholder.com/50",
      name: "Product A",
      sales: 120,
      category: "Electronics",
    },
    { image: "", name: "Product B", sales: 80, category: "Clothing" },
    {
      image: "https://via.placeholder.com/50",
      name: "Product C",
      sales: 200,
      category: "Furniture",
    },
  ];
  return (
    <div className="flex flex-1 flex-col gap-4">
      {/* <div className="px-4 lg:px-6 grid grid-cols-1 items-center md:grid-cols-2 lg:grid-cols-3 gap-4"> */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 px-4 lg:px-6">
        {stats.map((stat, index) => (
          <div className="min-h-[100px]">
            <StatsCard key={index} {...stat} />
          </div>
        ))}
        <div className="col-span-1 lg:col-span-2">
          <QuickActions />
        </div>
      </div>
      {/* </div> */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4 lg:px-6">
        <div className="col-span-1 lg:col-span-2">
          <StockReportChart />
        </div>
        <DataTable
          title="Top Products"
          actionButton={
            <CustomButton
              label="See All"
              to="/inventory"
              variant="link"
              icon={ArrowRight}
            />
          }
          columns={columns}
          data={data}
          loading={false}
          fixedHeight="290px"
        />
      </div>
    </div>
  );
}
export default Dashboard;
