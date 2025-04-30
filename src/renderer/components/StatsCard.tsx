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
  title?: string;
  value?: string;
  description?: string;
  icon: LucideIcon;
  trend?: any;
  percentage?: string;
  footerText?: string;
}

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  footerText,
}: StatsCardProps) {
  return (
    <Card className="min-h-[140px]flex flex-col justify-between p-4">
      <CardHeader className="p-0">
        <CardDescription className="text-sm text-muted-foreground">
          {title}
        </CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums">
          {value}
        </CardTitle>
      </CardHeader>
      <CardFooter className="p-0 flex-col items-start gap-2 text-sm">
        <div className="line-clamp-1 flex items-center gap-2 font-medium">
          {description} <Icon className="size-4" />
        </div>
        <div className="text-muted-foreground">{footerText}</div>
      </CardFooter>
    </Card>
  );
}
