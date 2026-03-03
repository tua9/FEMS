import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./styles/index.css";
import { BrowserRouter, Route, Routes } from "react-router";
import GuestRoute from "./components/auth/GuestRoute.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.tsx";
import HomePage from "./pages/HomePage.tsx";
import EquipmentPage from "./pages/EquipmentPage.tsx";
import BorrowHistory from "./pages/BorrowHistoryPage.tsx";
import ReportPage from "./pages/ReportPage.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          {/*public*/}
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<LoginPage />} />
          </Route>

          <Route path="/equipments" element={<EquipmentPage />} />
          <Route path="/borrow-history" element={<BorrowHistory />} />
          <Route path="/report-issue" element={<ReportPage />} />

          {/*private*/}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<HomePage />} />
          </Route>

          {/*404*/}
          <Route path="*" element={<div>404 Not Found</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
