import { Route } from "react-router";
import LecturerLayout from "@/layouts/LecturerLayout";
import ProtectedRoute from "@/features/auth/components/ProtectedRoute";
import LecturerDashboard from "@/features/lecturer/pages/LecturerDashboard";
import LecturerBorrowManagementPage from "@/features/lecturer/pages/LecturerBorrowManagementPage";
import { HistoryPage } from "@/features/shared/pages/HistoryPage";
import ReportIssuePage from "@/features/shared/pages/ReportIssuePage";
import AcademicCalendar from "@/features/lecturer/pages/AcademicCalendar";
import ProfilePage from "@/features/lecturer/pages/Profile";
import ChangePasswordPage from "@/features/shared/pages/ChangePasswordPage";
import NotificationsPage from "@/features/shared/pages/NotificationsPage";

const LecturerRoutes = () => (
 <Route element={<ProtectedRoute allowRoles={["lecturer"]} />}>
 <Route element={<LecturerLayout />}>
 <Route path="/lecturer/dashboard" element={<LecturerDashboard />} />
 <Route path="/lecturer/equipment" element={<LecturerBorrowManagementPage />} />
 <Route path="/lecturer/history" element={<HistoryPage />} />
 <Route path="/lecturer/report-issue" element={<ReportIssuePage />} />
 <Route path="/lecturer/calendar" element={<AcademicCalendar />} />
 <Route path="/lecturer/profile" element={<ProfilePage />} />
 <Route path="/lecturer/change-password" element={<ChangePasswordPage />} />
 <Route path="/lecturer/notifications" element={<NotificationsPage />} />
 </Route>
 </Route>
);

export default LecturerRoutes;
