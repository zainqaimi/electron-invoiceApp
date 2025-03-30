import { StatsCard } from "../../components/StatsCard";
import { ChartAreaInteractive } from "../../components/chart-area-interactive";
import { DataTable } from "../../components/DataTable";
import data from "../inventory/data.json";
import { TrendingDownIcon, TrendingUpIcon } from "lucide-react";
function Dashboard() {
  const stats = [
    {
      title: "Total Products",
      value: "1,250",
      description: "Stock available",
      icon: TrendingUpIcon,
      trend: "up",
      percentage: "5%",
      footerText: "Updated daily",
    },
    {
      title: "Total Companies",
      value: "345",
      description: "Active suppliers",
      icon: TrendingDownIcon,
      trend: "down",
      percentage: "2%",
      footerText: "Supplier count fluctuating",
    },
        {
      title: "Total Products",
      value: "1,250",
      description: "Stock available",
      icon: TrendingUpIcon,
      trend: "up",
      percentage: "5%",
      footerText: "Updated daily",
    },
    {
      title: "Total Companies",
      value: "345",
      description: "Active suppliers",
      icon: TrendingDownIcon,
      trend: "down",
      percentage: "2%",
      footerText: "Supplier count fluctuating",
    },
  ];

  return (
    <div className="flex flex-1 flex-col gap-4">
      {/* <LanguageToggle/> */}
      {/* <div className="@container/main flex flex-1 flex-col gap-2"> */}
        {/* <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6"> */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4 lg:px-6">
      {stats.map((stat, index) => (
        <StatsCard key={index} {...stat} />
      ))}
    </div>
          <div className="px-4 lg:px-6">
            <ChartAreaInteractive />
          </div>
          <DataTable data={data} />
        {/* </div> */}
      {/* </div> */}
    </div>
  );
}
export default Dashboard;
