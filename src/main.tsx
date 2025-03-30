// import App from "./App.tsx";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
// import { ThemeProvider } from "./context/theme-context.tsx";
import "./locales/i18n";
import App from "./App";
import { ThemeProvider } from "./context/theme-context";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>
);
