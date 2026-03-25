import { Route } from "react-router";
import LecturerLayout from "@/layouts/LecturerLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import LecturerDashboard from "@/pages/lecturer/LecturerDashboard";
import { EquipmentCatalog } from "@/pages/shared/EquipmentCatalog";
import { HistoryPage } from "@/pages/shared/HistoryPage";
import { ApprovalCenter } from "@/pages/lecturer/ApprovalCenter";
import UsageStats from "@/pages/lecturer/UsageStats";
import ReportIssuePage from "@/pages/shared/ReportIssuePage";
import AcademicCalendar from "@/pages/lecturer/AcademicCalendar";
import ProfilePage from "@/pages/lecturer/Profile";
import ChangePasswordPage from "@/pages/shared/ChangePasswordPage";
import NotificationsPage from "@/pages/shared/NotificationsPage";

const LecturerRoutes = () => (
 <Route element={<ProtectedRoute allowRoles={["lecturer"]} />}>
 <Route element={<LecturerLayout />}>
 <Route path="/lecturer/dashboard" element={<LecturerDashboard />} />
 <Route path="/lecturer/equipment" element={<EquipmentCatalog />} />
 <Route path="/lecturer/history" element={<HistoryPage />} />
 <Route path="/lecturer/approval" element={<ApprovalCenter />} />
 <Route path="/lecturer/usage-stats" element={<UsageStats />} />
 <Route path="/lecturer/report-issue" element={<ReportIssuePage />} />
 <Route path="/lecturer/calendar" element={<AcademicCalendar />} />
 <Route path="/lecturer/profile" element={<ProfilePage />} />
 <Route path="/lecturer/change-password" element={<ChangePasswordPage />} />
 <Route path="/lecturer/notifications" element={<NotificationsPage />} />
 </Route>
 </Route>
);

export default LecturerRoutes;
