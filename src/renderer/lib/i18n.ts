import i18next from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: { translation: { dashboard: "Dashboard", reports: "Reports", settings: "Settings" } },
  ur: { translation: { dashboard: "ڈیش بورڈ", reports: "رپورٹس", settings: "ترتیبات" } },
};

i18next.use(initReactI18next).init({
  resources,
  lng: "en",
  interpolation: { escapeValue: false },
});

export default i18next;
