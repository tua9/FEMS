import { Route } from "react-router";
import GuestRoute from "@/features/auth/components/GuestRoute";
import LoginPage from "@/features/auth/pages/LoginPage";
import ForgotPasswordPage from "@/features/auth/pages/ForgotPasswordPage";
import GuestReportPage from "@/features/guest/pages/GuestReportPage";

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
