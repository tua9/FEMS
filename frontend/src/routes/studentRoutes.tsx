import { Route } from "react-router";
import StudentLayout from "@/layouts/StudentLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import HomePage from "@/pages/student/HomePage";
import { EquipmentCatalog } from "@/pages/shared/EquipmentCatalog";
import { HistoryPage } from "@/pages/shared/HistoryPage";
import ReportIssuePage from "@/pages/shared/ReportIssuePage";
import ProfilePage from "@/pages/student/Profile";
import ChangePasswordPage from "@/pages/shared/ChangePasswordPage";
import NotificationsPage from "@/pages/shared/NotificationsPage";

const StudentRoutes = () => (
  <Route element={<ProtectedRoute allowRoles={["student"]} />}>
    <Route element={<StudentLayout />}>
      <Route path="/student/dashboard" element={<HomePage />} />
      <Route path="/student/equipment" element={<EquipmentCatalog />} />
      <Route path="/student/history" element={<HistoryPage />} />
      <Route path="/student/borrow-history" element={<HistoryPage />} />
      <Route path="/student/report-issue" element={<ReportIssuePage />} />
      <Route path="/student/profile" element={<ProfilePage />} />
      <Route path="/student/change-password" element={<ChangePasswordPage />} />
      <Route path="/student/notifications" element={<NotificationsPage />} />
    </Route>
  </Route>
);

export default StudentRoutes;
