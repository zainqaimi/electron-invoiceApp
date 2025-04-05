import AppContent from './components/AppContent';
import './index.css';
import { BrowserRouter } from "react-router-dom";

export default function App() {
  return (
    <BrowserRouter>
      <AppContent  />
    </BrowserRouter>
  )
}