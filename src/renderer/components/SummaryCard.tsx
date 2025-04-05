import { Card, } from "../components/ui/card";
import { ReactNode } from "react";

interface SummaryCardProps {
  icon?: ReactNode;
  value: string;
  label: string;
  bgColor?: string;
}

export function SummaryCard({ icon, value, label, bgColor }: SummaryCardProps) {
  return (
    <Card  className="w-600  flex items-center p-4 space-x-4 shadow-md bg-white rounded-xl">
      <div className={`p-3 rounded-full ${bgColor || 'bg-gray-200'}`}>{icon}</div>
      <div>
        <p className="text-lg sm:text-xl font-bold">{value}</p>
        <p className="text-xs sm:text-sm text-gray-500">{label}</p>
      </div>
    </Card>
  );
}
 

