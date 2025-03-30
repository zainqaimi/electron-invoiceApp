import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Switch } from "../components/ui/switch";
import { Label } from "../components/ui/label";

export default function LanguageToggle() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "ur" : "en";
    i18n.changeLanguage(newLang);
    localStorage.setItem("lang", newLang);
    document.documentElement.setAttribute("lang", newLang);
  };

  useEffect(() => {
    const savedLang = localStorage.getItem("lang") || "en";
    i18n.changeLanguage(savedLang);
    document.documentElement.setAttribute("lang", savedLang);
  }, []);

  return (
    <div className="flex items-center space-x-2">
      <Label htmlFor="language-switch">{i18n.language === "en" ? "Eng" : "urdu"}</Label>
      <Switch id="language-switch" checked={i18n.language === "ur"} onCheckedChange={toggleLanguage} />
    </div>
  );
}
