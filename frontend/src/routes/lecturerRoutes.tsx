import { Route } from "react-router";
import LecturerLayout from "@/layouts/LecturerLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import LecturerDashboard from "@/pages/lecturer/LecturerDashboard";
import { EquipmentCatalog } from "@/pages/shared/EquipmentCatalog";
import { HistoryPage } from "@/pages/shared/HistoryPage";
import { RoomStatusCenter } from "@/pages/lecturer/RoomStatusCenter";
import { ApprovalCenter } from "@/pages/lecturer/ApprovalCenter";
import { UsageStatsCenter } from "@/pages/lecturer/UsageStatsCenter";
import ReportIssuePage from "@/pages/shared/ReportIssuePage";
import AcademicCalendar from "@/pages/lecturer/AcademicCalendar";
import ProfilePage from "@/pages/lecturer/Profile";
import ChangePasswordPage from "@/pages/shared/ChangePasswordPage";
// import LecturerNotifications from "@/pages/lecturer/LecturerNotifications";

const LecturerRoutes = () => (
  <Route element={<ProtectedRoute allowRoles={["lecturer"]} />}>
    <Route element={<LecturerLayout />}>
      <Route path="/lecturer/dashboard" element={<LecturerDashboard />} />
      <Route path="/lecturer/equipment" element={<EquipmentCatalog />} />
      <Route path="/lecturer/history" element={<HistoryPage />} />
      <Route path="/lecturer/room-status" element={<RoomStatusCenter />} />
      <Route path="/lecturer/approval" element={<ApprovalCenter />} />
      <Route path="/lecturer/usage-stats" element={<UsageStatsCenter />} />
      <Route path="/lecturer/report-issue" element={<ReportIssuePage />} />
      <Route path="/lecturer/calendar" element={<AcademicCalendar />} />
      <Route path="/lecturer/profile" element={<ProfilePage />} />
      <Route path="/lecturer/change-password" element={<ChangePasswordPage />} />
      {/* <Route path="/lecturer/notifications" element={<LecturerNotifications />} /> */}
    </Route>
  </Route>
);

export default LecturerRoutes;
