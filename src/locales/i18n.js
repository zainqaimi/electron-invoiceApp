
import { initReactI18next } from "react-i18next";
import en from "./en.json";
import ur from "./ur.json";
import i18next from "i18next";

i18next.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ur: { translation: ur },
  },
  lng: localStorage.getItem("lang") || "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18next;
