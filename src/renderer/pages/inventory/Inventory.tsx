import { TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import { DataTable } from "@/renderer/components/DataTable";
import data from "./data.json";
import { useTranslation } from "react-i18next";
import { StatsCard } from "@/renderer/components/StatsCard";
function Inventory() {
  const { t } = useTranslation();
  const Products = [
    {
      title: `${t("sidebar.totalProducts")}`,
      value: "1500",
      description: "credit",
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
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 px-4 lg:px-6">
        {Products.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>
      <DataTable data={data} />
    </>
  );
}

export default Inventory;
