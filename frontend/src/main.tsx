import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./styles/index.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import GuestRoute from "./components/auth/GuestRoute.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.tsx";
import HomePage from "./pages/HomePage.tsx";
import EquipmentPage from "./pages/EquipmentPage.tsx";
import BorrowHistory from "./pages/BorrowHistoryPage.tsx";
import ReportPage from "./pages/ReportPage.tsx";
import TechnicianLayout from "./components/technician/TechnicianLayout.tsx";
import { technicianRoutes } from "./routes/technicianRoutes.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Login - standalone, no NavBar/Footer */}
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* Student pages - protected, with NavBar/Footer */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<App />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/equipments" element={<EquipmentPage />} />
            <Route path="/borrow-history" element={<BorrowHistory />} />
            <Route path="/report-issue" element={<ReportPage />} />
          </Route>
        </Route>

        {/* Technician Routes - protected */}
        <Route element={<ProtectedRoute />}>
          <Route path="/technician" element={<TechnicianLayout />}>
            {technicianRoutes}
          </Route>
        </Route>

        {/* 404 */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
