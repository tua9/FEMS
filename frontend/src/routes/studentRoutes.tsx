import { Route } from "react-router";
import StudentLayout from "@/layouts/StudentLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import HomePage from "@/pages/student/HomePage";
import EquipmentPage from "@/pages/student/EquipmentPage";
import BorrowHistory from "@/pages/student/BorrowHistoryPage";
import ReportPage from "@/pages/student/ReportPage";
import ProfilePage from "@/pages/student/Profile";
import LecturerChangePassword from "@/pages/lecturer/LecturerChangePassword";
import NotificationsPage from "@/pages/shared/NotificationsPage";

const StudentRoutes = () => (
  <Route element={<ProtectedRoute allowRoles={["student"]} />}>
    <Route element={<StudentLayout />}>
      <Route path="/student/dashboard" element={<HomePage />} />
      <Route path="/student/equipment" element={<EquipmentPage />} />
      <Route path="/student/borrow-history" element={<BorrowHistory />} />
      <Route path="/student/report-issue" element={<ReportPage />} />
      <Route path="/student/profile" element={<ProfilePage />} />
      <Route path="/student/change-password" element={<LecturerChangePassword />} />
      <Route path="/student/notifications" element={<NotificationsPage />} />
    </Route>
  </Route>
);

export default StudentRoutes;
