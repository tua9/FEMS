import { Route } from "react-router";
import TechnicianLayout from "@/layouts/TechnicianLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import TechnicianDashboard from "@/pages/technician/Dashboard";
import DashboardWorkOrders from "@/pages/technician/DashboardWorkOrders";
import TechnicianTaskList from "@/pages/technician/TaskList";
import TechnicianTaskDetails from "@/pages/technician/TaskDetails";
import TechnicianReports from "@/pages/technician/PerformanceInsights";
import TechnicianProfile from "@/pages/technician/Profile";
import EquipmentManagement from "@/pages/admin/EquipmentManagement";
import BorrowingManagement from "@/pages/admin/BorrowingManagement";
import ChangePasswordPage from "@/pages/shared/ChangePasswordPage";
import NotificationsPage from "@/pages/shared/NotificationsPage";

const TechnicianRoutes = () => (
  <Route element={<ProtectedRoute allowRoles={["technician"]} />}>
    <Route element={<TechnicianLayout />}>
      <Route path="/technician/dashboard" element={<TechnicianDashboard />} />
      <Route path="/technician/dashboard/work-orders" element={<DashboardWorkOrders />} />
      <Route path="/technician/tasks" element={<TechnicianTaskList />} />
      <Route path="/technician/tasks/:id" element={<TechnicianTaskDetails />} />
      <Route path="/technician/equipment" element={<EquipmentManagement />} />
      <Route path="/technician/borrowing" element={<BorrowingManagement />} />
      <Route path="/technician/reports" element={<TechnicianReports />} />
      <Route path="/technician/profile" element={<TechnicianProfile />} />
      <Route path="/technician/change-password" element={<ChangePasswordPage />} />
      <Route path="/technician/notifications" element={<NotificationsPage />} />
    </Route>
  </Route>
);

export default TechnicianRoutes;
