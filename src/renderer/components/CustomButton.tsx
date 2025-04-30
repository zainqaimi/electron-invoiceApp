import { Button } from "../components/ui/button";
import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface CustomButtonProps {
  label: string;
  onClick?: () => void;
  variant?: "default" | "outline" | "ghost" | "link";
  size?: "sm" | "md" | "lg";
  icon?: LucideIcon;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
  to?: string;
}

export default function CustomButton({
  label,
  onClick,
  variant = "default",
  size = "md",
  icon: Icon,
  disabled = false,
  className = "",
  type = "button",
  to,
}: CustomButtonProps) {
  const content = (
    <div className="gap-1 flex items-center text-blue-500">
      {label}
      {Icon && <Icon className="w-4 h-4 mr-2 " />}
    </div>
  );

  if (to) {
    return (
      <Button
        variant={variant}
        size={size === "sm" ? "sm" : size === "lg" ? "lg" : undefined}
        asChild
        className={className}
        disabled={disabled}
      >
        <Link to={to}>{content}</Link>
      </Button>
    );
  }

  return (
    <Button
      variant={variant}
      size={size === "sm" ? "sm" : size === "lg" ? "lg" : undefined}
      onClick={onClick}
      disabled={disabled}
      className={className}
      type={type}
    >
      {content}
    </Button>
  );
}
