import { Route } from "react-router";
import GuestRoute from "@/components/auth/GuestRoute";
import LoginPage from "@/pages/student/LoginPage";
import ForgotPasswordPage from "@/pages/student/ForgotPasswordPage";
import GuestReportPage from "@/pages/guest/GuestReportPage";

const PublicRoutes = () => (
 <>
 {/* Public routes – chỉ cho guest (chưa login) */}
 <Route element={<GuestRoute />}>
 <Route path="/login" element={<LoginPage />} />
 <Route path="/forgot-password" element={<ForgotPasswordPage />} />
 </Route>

 {/* Public route – guest report (không cần login) */}
 <Route path="/report-issue" element={<GuestReportPage />} />
 </>
);

export default PublicRoutes;
