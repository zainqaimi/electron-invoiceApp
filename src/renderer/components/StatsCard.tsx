import { Badge } from "./ui/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  trend: any;
  percentage: string;
  footerText: string;
}

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  percentage,
  footerText,
}: StatsCardProps) {
  return (
    <Card className="@container/card">
      <CardHeader className="relative">
        <CardDescription>{title}</CardDescription>
        <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
          {value}
        </CardTitle>
        <div className="absolute right-4 top-4">
          <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
            <Icon className="size-3" />
            {trend === "up" ? "+" : "-"}
            {percentage}
          </Badge>
        </div>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          {description} <Icon className="size-4" />
        </div>
        <div className="text-muted-foreground">{footerText}</div>
      </CardFooter>
    </Card>
  );
}
