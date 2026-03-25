import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../stores/useAuthStore";

const ProtectedRoute = ({ allowRoles }) => {
 const { user, isInitialized } = useAuthStore();

 // refreshToken() hasn't finished yet — hold here, do NOT redirect
 if (!isInitialized) {
 return (
 <div className="flex min-h-screen items-center justify-center">
 <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-[#1E2B58] dark:border-blue-400" />
 </div>
 );
 }

 const role = user?.role;

 if (role && allowRoles.includes(role)) {
 return <Outlet />;
 }

 return <Navigate to="/login" replace />;
};

export default ProtectedRoute;
