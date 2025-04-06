import AppContent from './components/AppContent';
import './index.css';
import { BrowserRouter, HashRouter } from "react-router-dom";
const Router =
  import.meta.env.MODE === "development" ? BrowserRouter : HashRouter;
export default function App() {
  return (
    <Router>
      <AppContent  />
    </Router>
  )
}