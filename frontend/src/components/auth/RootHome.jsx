import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";
import GuestReportPage from "@/pages/guest/GuestReportPage";

const ROLE_HOME = {
 student: "/student/dashboard",
 lecturer: "/lecturer/dashboard",
 technician: "/technician/dashboard",
 admin: "/admin/dashboard",
};

/**
 * "/" — wait for session check, then send logged-in users to their dashboard;
 * otherwise show the public report landing (same as guest home).
 */
export default function RootHome() {
 const { user, isInitialized } = useAuthStore();

 if (!isInitialized) {
 return (
 <div className="flex min-h-screen w-full items-center justify-center bg-[#e0eafc] dark:bg-[#0f172a]">
 <div className="flex flex-col items-center gap-4">
 <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#1E2B58] border-t-transparent dark:border-blue-400 dark:border-t-transparent" />
 <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Loading…</p>
 </div>
 </div>
 );
 }

 if (user?.role && ROLE_HOME[user.role]) {
 return <Navigate to={ROLE_HOME[user.role]} replace />;
 }

 return <GuestReportPage />;
}
