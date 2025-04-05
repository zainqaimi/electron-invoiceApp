import { StatsCard } from "@/renderer/components/StatsCard"
import { TrendingDownIcon, TrendingUpIcon } from "lucide-react"
import { useTranslation } from "react-i18next"

function Customers() {
  const {t} = useTranslation()
const customers = [
  {
    title: `${t("sidebar.totalCustomers")}`,
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
]
  return (
    <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4 lg:px-6">
            {customers.map((stat, index) => (
              <StatsCard key={index} {...stat} />
            ))}
          </div>
    <div>{t("sidebar.customers")}</div>
    </>
  )
}

export default Customers