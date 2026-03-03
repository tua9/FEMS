import { BrowserRouter, Route, Routes } from "react-router";
import { Toaster } from "sonner";
import GuestRoute from "./components/auth/GuestRoute";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage/LoginPage";


// Student pages
import StudentDashboard from "./pages/student/Dashboard";
import StudentEquipmentList from "./pages/student/EquipmentList";
import StudentMyHistory from "./pages/student/MyHistory";
import StudentNotifications from "./pages/student/Notifications";
import StudentProfile from "./pages/student/Profile";
import StudentReportIssue from "./pages/student/ReportIssue";

// Lecturer pages
import { AcademicCalendar } from "./pages/lecturer/AcademicCalendar";
import { ApprovalCenter } from "./pages/lecturer/ApprovalCenter";
import { EquipmentCatalog } from "./pages/lecturer/EquipmentCatalog";
import LecturerChangePassword from "./pages/lecturer/LecturerChangePassword";
import LecturerDashboard from "./pages/lecturer/LecturerDashboard";
import LecturerNotifications from "./pages/lecturer/LecturerNotifications";
import LecturerProfile from "./pages/lecturer/LecturerProfile";
import { MyHistory } from "./pages/lecturer/MyHistory";
import { ReportIssueCenter } from "./pages/lecturer/ReportIssueCenter";
import { RoomStatusCenter } from "./pages/lecturer/RoomStatusCenter";
import { UsageStatsCenter } from "./pages/lecturer/UsageStatsCenter";

export default function App() {
  return (
    <>
      <Toaster richColors />
      <div className="flex justify-center w-full min-h-screen">
        <BrowserRouter>
          <Routes>
            {/*public*/}
            <Route element={<GuestRoute />}>
              <Route path="/login" element={<LoginPage />} />
            </Route>


            {/* student routes */}
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/equipment" element={<StudentEquipmentList />} />
            <Route path="/student/history" element={<StudentMyHistory />} />
            <Route path="/student/notifications" element={<StudentNotifications />} />
            <Route path="/student/profile" element={<StudentProfile />} />
            <Route path="/student/report-issue" element={<StudentReportIssue />} />

            {/* lecturer routes */}
            <Route path="/lecturer/dashboard" element={<LecturerDashboard />} />
            <Route path="/lecturer/equipment" element={<EquipmentCatalog />} />
            <Route path="/lecturer/history" element={<MyHistory />} />
            <Route path="/lecturer/room-status" element={<RoomStatusCenter />} />
            <Route path="/lecturer/approval" element={<ApprovalCenter />} />
            <Route path="/lecturer/usage-stats" element={<UsageStatsCenter />} />
            <Route path="/lecturer/report-issue" element={<ReportIssueCenter />} />
            <Route path="/lecturer/calendar" element={<AcademicCalendar />} />
            <Route path="/lecturer/profile" element={<LecturerProfile />} />
            <Route path="/lecturer/change-password" element={<LecturerChangePassword />} />
            <Route path="/lecturer/notifications" element={<LecturerNotifications />} />

            {/*private*/}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<HomePage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}
