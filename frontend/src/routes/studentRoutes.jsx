import { Route } from "react-router";
import StudentLayout from "@/layouts/StudentLayout";
import ProtectedRoute from "@/features/auth/components/ProtectedRoute";
import HomePage from "@/features/student/pages/HomePage";
import StudentBorrowPage from "@/features/student/pages/StudentBorrowPage";
import { HistoryPage } from "@/features/shared/pages/HistoryPage";
import ReportIssuePage from "@/features/shared/pages/ReportIssuePage";
import ProfilePage from "@/features/student/pages/Profile";
import ChangePasswordPage from "@/features/shared/pages/ChangePasswordPage";
import NotificationsPage from "@/features/shared/pages/NotificationsPage";

const StudentRoutes = () => (
 <Route element={<ProtectedRoute allowRoles={["student"]} />}>
 <Route element={<StudentLayout />}>
 <Route path="/student/dashboard" element={<HomePage />} />
 <Route path="/student/equipment" element={<StudentBorrowPage />} />
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
