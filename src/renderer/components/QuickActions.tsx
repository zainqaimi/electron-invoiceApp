// QuickActions.tsx
import { Card, CardContent } from "../components/ui/card";
import {
  EqualApproximatelyIcon,
  FilePlus,
  PackagePlus,
  Truck,
  Upload,
} from "lucide-react";

export default function QuickActions() {
  const actions = [
    {
      icon: <FilePlus className="w-5 h-5" />,
      label: "Create Order",
      shortcut: "ctrl + n",
    },
    {
      icon: <PackagePlus className="w-5 h-5" />,
      label: "Add Product",
      shortcut: "ctrl + p",
    },
    {
      icon: <Truck className="w-5 h-5" />,
      label: "Add Supplier",
      shortcut: "ctrl + k",
    },
    {
      icon: <Upload className="w-5 h-5" />,
      label: "Export",
      shortcut: "ctrl + s",
    },
    {
      icon: <EqualApproximatelyIcon className="w-5 h-5" />,
      label: "import",
      shortcut: "ctrl + s",
    },
  ];

  return (
    <Card className="h-40 overflow-hidden">
      <CardContent className="p-4 space-y-1 ">
        {actions.map((action, index) => (
          <div
            key={index}
            className="flex items-center justify-between hover:bg-muted rounded-md cursor-pointer px-2"
          >
            <div className="flex items-center gap-3">
              {action.icon}
              <span className="font-medium text-muted-foreground">
                {action.label}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              {action.shortcut}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
