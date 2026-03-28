import { Route } from "react-router";
import TechnicianLayout from "@/layouts/TechnicianLayout";
import ProtectedRoute from "@/features/auth/components/ProtectedRoute";
import TechnicianDashboard from "@/features/technician/pages/Dashboard";
import TechnicianTaskList from "@/features/technician/pages/TaskList";
import TechnicianTaskDetails from "@/features/technician/pages/TaskDetails";
import TechnicianEquipment from "@/features/technician/pages/EquipmentInventory";
import TechnicianProfile from "@/features/technician/pages/Profile";
import ChangePasswordPage from "@/features/shared/pages/ChangePasswordPage";
import NotificationsPage from "@/features/shared/pages/NotificationsPage";

const TechnicianRoutes = () => (
 <Route element={<ProtectedRoute allowRoles={["technician"]} />}>
 <Route element={<TechnicianLayout />}>
 <Route path="/technician/dashboard" element={<TechnicianDashboard />} />
 <Route path="/technician/tasks" element={<TechnicianTaskList />} />
 <Route path="/technician/tasks/:id" element={<TechnicianTaskDetails />} />
 <Route path="/technician/equipment" element={<TechnicianEquipment />} />
 <Route path="/technician/profile" element={<TechnicianProfile />} />
 <Route path="/technician/change-password" element={<ChangePasswordPage />} />
 <Route path="/technician/notifications" element={<NotificationsPage />} />
 </Route>
 </Route>
);

export default TechnicianRoutes;
