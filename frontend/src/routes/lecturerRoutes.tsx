import { Route } from "react-router";
import LecturerLayout from "@/layouts/LecturerLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import LecturerDashboard from "@/pages/lecturer/LecturerDashboard";
import { EquipmentCatalog } from "@/pages/lecturer/EquipmentCatalog";
import { MyHistory } from "@/pages/lecturer/MyHistory";
import { RoomStatusCenter } from "@/pages/lecturer/RoomStatusCenter";
import { ApprovalCenter } from "@/pages/lecturer/ApprovalCenter";
import { UsageStatsCenter } from "@/pages/lecturer/UsageStatsCenter";
import { ReportIssueCenter } from "@/pages/lecturer/ReportIssueCenter";
import AcademicCalendar from "@/pages/lecturer/AcademicCalendar";
import ProfilePage from "@/pages/lecturer/Profile";
import LecturerChangePassword from "@/pages/lecturer/LecturerChangePassword";
import LecturerNotifications from "@/pages/lecturer/LecturerNotifications";

const LecturerRoutes = () => (
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
      <Route path="/lecturer/profile" element={<ProfilePage />} />
      <Route path="/lecturer/change-password" element={<LecturerChangePassword />} />
      <Route path="/lecturer/notifications" element={<LecturerNotifications />} />
    </Route>
  </Route>
);

export default LecturerRoutes;
