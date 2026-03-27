import { Route } from "react-router";
import AdminLayout from "@/layouts/AdminLayout";
import ProtectedRoute from "@/features/auth/components/ProtectedRoute";
import AdminDashboard from "@/features/admin/pages/Dashboard";
import AdminEquipment from "@/features/admin/pages/EquipmentManagement";
import AdminBorrowing from "@/features/admin/pages/BorrowingManagement";
import AdminUsers from "@/features/admin/pages/UserManagement";
import AdminReports from "@/features/admin/pages/DamageReports";
import ScheduleManagement from "@/features/admin/pages/ScheduleManagement";
import NotificationsPage from "@/features/shared/pages/NotificationsPage";
import ProfilePage from "@/features/admin/pages/Profile";
import ChangePasswordPage from "@/features/shared/pages/ChangePasswordPage";

const AdminRoutes = () => (
 <Route element={<ProtectedRoute allowRoles={["admin"]} />}>
 <Route element={<AdminLayout />}>
 <Route path="/admin/dashboard" element={<AdminDashboard />} />
 <Route path="/admin/equipment" element={<AdminEquipment />} />
 <Route path="/admin/borrowing" element={<AdminBorrowing />} />
 <Route path="/admin/users" element={<AdminUsers />} />
 <Route path="/admin/reports" element={<AdminReports />} />
 <Route path="/admin/schedule" element={<ScheduleManagement />} />
 <Route path="/admin/notifications" element={<NotificationsPage />} />
 <Route path="/admin/profile" element={<ProfilePage />} />
 <Route path="/admin/change-password" element={<ChangePasswordPage />} />
 </Route>
 </Route>
);

export default AdminRoutes;
