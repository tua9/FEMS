import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../stores/useAuthStore";

const ROLE_HOME= {
 student: "/student/dashboard",
 lecturer: "/lecturer/dashboard",
 technician: "/technician/dashboard",
 admin: "/admin/dashboard",
};

const RoleRedirect = () => {
 const { user, isInitialized } = useAuthStore();

 if (!isInitialized) {
 return (
 <div className="flex min-h-screen w-full items-center justify-center bg-[#e0eafc] dark:bg-[#0f172a]">
 <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#1E2B58] border-t-transparent dark:border-blue-400 dark:border-t-transparent" />
 </div>
 );
 }

 const target = user?.role ? (ROLE_HOME[user.role] ?? "/") : "/login";
 return <Navigate to={target} replace />;
};

export default RoleRedirect;
