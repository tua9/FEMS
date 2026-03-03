// src/main.tsx (hoặc index.tsx)
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom"; // ← sửa import đúng

import App from "./App.tsx";
import "./styles/index.css";

// Guest & Protected
import GuestRoute from "./components/auth/GuestRoute.tsx";

// Pages
import LoginPage from "./pages/LoginPage.tsx";
import HomePage from "./pages/HomePage.tsx";
import EquipmentPage from "./pages/EquipmentPage.tsx";
import BorrowHistory from "./pages/BorrowHistoryPage.tsx";
import ReportPage from "./pages/ReportPage.tsx";

// Lecturer pages
import { EquipmentCatalog } from "./pages/lecturer/EquipmentCatalog.tsx";
import { MyHistory } from "./pages/lecturer/MyHistory.tsx";
import { RoomStatusCenter } from "./pages/lecturer/RoomStatusCenter.tsx";
import { ApprovalCenter } from "./pages/lecturer/ApprovalCenter.tsx";
import { UsageStatsCenter } from "./pages/lecturer/UsageStatsCenter.tsx";
import { ReportIssueCenter } from "./pages/lecturer/ReportIssueCenter.tsx";
import AcademicCalendar from "./pages/lecturer/AcademicCalendar.tsx";
import LecturerProfile from "./pages/lecturer/LecturerProfile.tsx";
import LecturerChangePassword from "./pages/lecturer/LecturerChangePassword.tsx";
import LecturerNotifications from "./pages/lecturer/LecturerNotifications.tsx";
import LecturerDashboard from "./pages/lecturer/LecturerDashboard.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* App là layout chung (nếu có Navbar, Sidebar, Footer...) */}
        <Route element={<App />}>
          {/* Public routes - chỉ cho guest (chưa login) */}
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<LoginPage />} />
          </Route>

          {/* Root "/" → redirect theo role (student / lecturer / chưa login) */}
          {/* Student routes - yêu cầu role student */}
          <Route path="/student/dashboard" element={<HomePage />} />
          <Route path="/student/equipments" element={<EquipmentPage />} />
          <Route path="/student/borrow-history" element={<BorrowHistory />} />
          <Route path="/student/report-issue" element={<ReportPage />} />

          {/* Lecturer routes - yêu cầu role lecturer */}
          <Route path="/lecturer/dashboard" element={<LecturerDashboard />} />
          <Route path="/lecturer/equipment" element={<EquipmentCatalog />} />
          <Route path="/lecturer/history" element={<MyHistory />} />
          <Route path="/lecturer/room-status" element={<RoomStatusCenter />} />
          <Route path="/lecturer/approval" element={<ApprovalCenter />} />
          <Route path="/lecturer/usage-stats" element={<UsageStatsCenter />} />
          <Route
            path="/lecturer/report-issue"
            element={<ReportIssueCenter />}
          />
          <Route path="/lecturer/calendar" element={<AcademicCalendar />} />
          <Route path="/lecturer/profile" element={<LecturerProfile />} />
          <Route
            path="/lecturer/change-password"
            element={<LecturerChangePassword />}
          />
          <Route
            path="/lecturer/notifications"
            element={<LecturerNotifications />}
          />

          {/* 404 - catch all */}
          <Route path="*" element={<div>404 - Trang không tồn tại</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
