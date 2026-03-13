import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";

import App from "./App.tsx";
import "./styles/index.css";

// Layouts
import AdminLayout from "./layouts/AdminLayout.tsx";
import LecturerLayout from "./layouts/LecturerLayout.tsx";
import StudentLayout from "./layouts/StudentLayout.tsx";
import TechnicianLayout from "./layouts/TechnicianLayout.tsx";

// Auth guards
import GuestRoute from "./components/auth/GuestRoute.tsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.tsx";
import RoleRedirect from "./components/auth/RoleRedirect.tsx";

// Student Pages
import BorrowHistory from "./pages/student/BorrowHistoryPage.tsx";
import EquipmentPage from "./pages/student/EquipmentPage.tsx";
import HomePage from "./pages/student/HomePage.tsx";
import LoginPage from "./pages/student/LoginPage.tsx";
import ForgotPasswordPage from "./pages/student/ForgotPasswordPage.tsx";
import ReportPage from "./pages/student/ReportPage.tsx";
import GuestReportPage from "./pages/guest/GuestReportPage.tsx";

// Shared pages
import NotificationsPage from "./pages/shared/NotificationsPage.tsx";

// Lecturer pages
import AcademicCalendar from "./pages/lecturer/AcademicCalendar.tsx";
import { ApprovalCenter } from "./pages/lecturer/ApprovalCenter.tsx";
import { EquipmentCatalog } from "./pages/lecturer/EquipmentCatalog.tsx";
import LecturerChangePassword from "./pages/lecturer/LecturerChangePassword.tsx";
import LecturerDashboard from "./pages/lecturer/LecturerDashboard.tsx";
import LecturerNotifications from "./pages/lecturer/LecturerNotifications.tsx";
import LecturerProfile from "./pages/lecturer/LecturerProfile.tsx";
import { MyHistory } from "./pages/lecturer/MyHistory.tsx";
import { ReportIssueCenter } from "./pages/lecturer/ReportIssueCenter.tsx";
import { RoomStatusCenter } from "./pages/lecturer/RoomStatusCenter.tsx";
import { UsageStatsCenter } from "./pages/lecturer/UsageStatsCenter.tsx";

// Admin pages
import AdminNotifications from "./pages/admin/AdminNotifications.tsx";
import AdminBorrowing from "./pages/admin/BorrowingManagement.tsx";
import AdminReports from "./pages/admin/DamageReports.tsx";
import AdminDashboard from "./pages/admin/Dashboard.tsx";
import AdminEquipment from "./pages/admin/EquipmentManagement.tsx";
import AdminUsers from "./pages/admin/UserManagement.tsx";

// Technician pages
import TechnicianDashboard from "./pages/technician/Dashboard.tsx";
import TechnicianEquipment from "./pages/technician/EquipmentInventory.tsx";
import TechnicianHandover from "./pages/technician/HandoverManagement.tsx";
import TechnicianReports from "./pages/technician/PerformanceInsights.tsx";
import TechnicianProfile from "./pages/technician/Profile.tsx";
import TechnicianTaskDetails from "./pages/technician/TaskDetails.tsx";
import TechnicianTaskList from "./pages/technician/TaskList.tsx";
import TechnicianNotifications from "./pages/technician/TechnicianNotifications.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<App />}>
          {/* Public routes – chỉ cho guest (chưa login) */}
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          </Route>

          {/* Public route – guest report (không cần login) */}
          <Route path="/report-issue" element={<GuestReportPage />} />

          {/* Root "/" → redirect theo role */}
          <Route path="/" element={<RoleRedirect />} />

          {/* Student routes – yêu cầu role student */}
          <Route element={<ProtectedRoute allowRoles={["student"]} />}>
            <Route element={<StudentLayout />}>
              <Route path="/student/dashboard" element={<HomePage />} />
              <Route path="/student/equipment" element={<EquipmentPage />} />
              <Route path="/student/borrow-history" element={<BorrowHistory />} />
              <Route path="/student/report-issue" element={<ReportPage />} />
              <Route path="/student/profile" element={<LecturerProfile />} />
              <Route
                path="/student/change-password"
                element={<LecturerChangePassword />}
              />
              <Route path="/student/notifications" element={<NotificationsPage />} />
            </Route>
          </Route>

          {/* Lecturer routes */}
          <Route element={<ProtectedRoute allowRoles={["lecturer"]} />}>
            <Route element={<LecturerLayout />}>
              <Route path="/lecturer/dashboard" element={<LecturerDashboard />} />
              <Route path="/lecturer/equipment" element={<EquipmentCatalog />} />
              <Route path="/lecturer/history" element={<MyHistory />} />
              <Route path="/lecturer/room-status" element={<RoomStatusCenter />} />
              <Route path="/lecturer/approval" element={<ApprovalCenter />} />
              <Route path="/lecturer/usage-stats" element={<UsageStatsCenter />} />
              <Route path="/lecturer/report-issue" element={<ReportIssueCenter />} />
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
            </Route>
          </Route>

          {/* Admin routes */}
          <Route element={<ProtectedRoute allowRoles={["admin"]} />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/equipment" element={<AdminEquipment />} />
              <Route path="/admin/borrowing" element={<AdminBorrowing />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/reports" element={<AdminReports />} />
              <Route path="/admin/notifications" element={<AdminNotifications />} />
              {/* Reuse shared profile/password pages */}
              <Route path="/admin/profile" element={<LecturerProfile />} />
              <Route path="/admin/change-password" element={<LecturerChangePassword />} />
            </Route>
          </Route>

          {/* Technician routes */}
          <Route element={<ProtectedRoute allowRoles={["technician"]} />}>
            <Route element={<TechnicianLayout />}>
              <Route path="/technician/dashboard" element={<TechnicianDashboard />} />
              <Route path="/technician/tasks" element={<TechnicianTaskList />} />
              <Route path="/technician/tasks/:id" element={<TechnicianTaskDetails />} />
              <Route path="/technician/equipment" element={<TechnicianEquipment />} />
              <Route path="/technician/handover" element={<TechnicianHandover />} />
              <Route path="/technician/reports" element={<TechnicianReports />} />
              <Route path="/technician/profile" element={<TechnicianProfile />} />
              <Route
                path="/technician/change-password"
                element={<LecturerChangePassword />}
              />
              <Route
                path="/technician/notifications"
                element={<TechnicianNotifications />}
              />
            </Route>
          </Route>

          {/* 404 / Catch-all */}
          <Route path="*" element={<RoleRedirect />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
