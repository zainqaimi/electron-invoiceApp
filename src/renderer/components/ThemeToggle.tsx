import { useContext } from "react";
import { Moon, Sun } from "lucide-react";
import { ThemeContext } from "../context/theme-context";
import { Button } from "./ui/button";

export function ThemeToggle() {
  const themeContext = useContext(ThemeContext);
  if (!themeContext) return null;

  return (
    <Button
      onClick={themeContext.toggleTheme}
      className="p-2 rounded-md"
       variant="ghost"
    >
      {themeContext.theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
    </Button>
  );
}
