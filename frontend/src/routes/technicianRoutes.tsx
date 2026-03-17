import { Route } from "react-router";
import TechnicianLayout from "@/layouts/TechnicianLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import TechnicianDashboard from "@/pages/technician/Dashboard";
import TechnicianTaskList from "@/pages/technician/TaskList";
import TechnicianTaskDetails from "@/pages/technician/TaskDetails";
import TechnicianEquipment from "@/pages/technician/EquipmentInventory";
import TechnicianHandover from "@/pages/technician/HandoverManagement";
import TechnicianReports from "@/pages/technician/PerformanceInsights";
import TechnicianProfile from "@/pages/technician/Profile";
import LecturerChangePassword from "@/pages/lecturer/LecturerChangePassword";
import TechnicianNotifications from "@/pages/technician/TechnicianNotifications";

const TechnicianRoutes = () => (
  <Route element={<ProtectedRoute allowRoles={["technician"]} />}>
    <Route element={<TechnicianLayout />}>
      <Route path="/technician/dashboard" element={<TechnicianDashboard />} />
      <Route path="/technician/tasks" element={<TechnicianTaskList />} />
      <Route path="/technician/tasks/:id" element={<TechnicianTaskDetails />} />
      <Route path="/technician/equipment" element={<TechnicianEquipment />} />
      <Route path="/technician/handover" element={<TechnicianHandover />} />
      <Route path="/technician/reports" element={<TechnicianReports />} />
      <Route path="/technician/profile" element={<TechnicianProfile />} />
      <Route path="/technician/change-password" element={<LecturerChangePassword />} />
      <Route path="/technician/notifications" element={<TechnicianNotifications />} />
    </Route>
  </Route>
);

export default TechnicianRoutes;
