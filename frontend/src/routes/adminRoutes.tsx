import { Route } from "react-router";
import AdminLayout from "@/layouts/AdminLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminEquipment from "@/pages/admin/EquipmentManagement";
import AdminBorrowing from "@/pages/admin/BorrowingManagement";
import AdminUsers from "@/pages/admin/UserManagement";
import AdminReports from "@/pages/admin/DamageReports";
import NotificationsPage from "@/pages/shared/NotificationsPage";
import ProfilePage from "@/pages/admin/Profile";
import ChangePasswordPage from "@/pages/shared/ChangePasswordPage";

const AdminRoutes = () => (
  <Route element={<ProtectedRoute allowRoles={["admin"]} />}>
    <Route element={<AdminLayout />}>
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/equipment" element={<AdminEquipment />} />
      <Route path="/admin/borrowing" element={<AdminBorrowing />} />
      <Route path="/admin/users" element={<AdminUsers />} />
      <Route path="/admin/reports" element={<AdminReports />} />
      <Route path="/admin/notifications" element={<NotificationsPage />} />
      <Route path="/admin/profile" element={<ProfilePage />} />
      <Route path="/admin/change-password" element={<ChangePasswordPage />} />
    </Route>
  </Route>
);

export default AdminRoutes;
