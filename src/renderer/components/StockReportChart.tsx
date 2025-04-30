import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useState } from "react";

const data = [
  { month: "Jan", stockIn: 4000, stockOut: 2400 },
  { month: "Feb", stockIn: 3000, stockOut: 1398 },
  { month: "Mar", stockIn: 5000, stockOut: 2000 },
  { month: "Apr", stockIn: 6000, stockOut: 2780 },
  { month: "May", stockIn: 2000, stockOut: 1908 },
  { month: "Jun", stockIn: 3000, stockOut: 2390 },
  { month: "Jul", stockIn: 4000, stockOut: 3490 },
  { month: "Aug", stockIn: 6000, stockOut: 4000 },
  { month: "Sep", stockIn: 5000, stockOut: 3000 },
  { month: "Oct", stockIn: 3000, stockOut: 2000 },
  { month: "Nov", stockIn: 4000, stockOut: 2500 },
  { month: "Dec", stockIn: 3000, stockOut: 1500 },
];

const stockInColor = "#00c0f3";
const stockInHoverColor = "#0090b3"; // Thoda darker blue
const stockOutColor = "#7d30d8";
const stockOutHoverColor = "#5c20a3"; // Thoda darker purple

export default function StockReportChart() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleMouseEnter = (index: number) => {
    setActiveIndex(index);
  };

  const handleMouseLeave = () => {
    setActiveIndex(null);
  };

  return (
    <Card className="h-[420px] p-4 flex flex-col justify-between">
      <div className="flex justify-between items-center">
        <CardTitle>Stock Report</CardTitle>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-[#00c0f3]" />
            <span className="text-muted-foreground">Stock In</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-[#7d30d8]" />
            <span className="text-muted-foreground">Stock Out</span>
          </div>
        </div>
      </div>
      <CardContent className="h-[320px] p-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} onMouseLeave={handleMouseLeave}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip cursor={{ fill: "rgba(0, 0, 0, 0.05)" }} />
            <Bar
              dataKey="stockIn"
              stackId="a"
              radius={[4, 4, 0, 0]}
              onMouseEnter={(_, index) => handleMouseEnter(index)}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-in-${index}`}
                  fill={
                    activeIndex === index ? stockInHoverColor : stockInColor
                  }
                />
              ))}
            </Bar>
            <Bar
              dataKey="stockOut"
              stackId="a"
              radius={[4, 4, 0, 0]}
              onMouseEnter={(_, index) => handleMouseEnter(index)}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-out-${index}`}
                  fill={
                    activeIndex === index ? stockOutHoverColor : stockOutColor
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
