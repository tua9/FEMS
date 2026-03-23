import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../stores/useAuthStore";

const ROLE_HOME: Record<string, string> = {
  student:    "/student/dashboard",
  lecturer:   "/lecturer/dashboard",
  technician: "/technician/dashboard",
  admin:      "/admin/dashboard",
};

const RoleRedirect = () => {
  const { user, isInitialized } = useAuthStore();

  // Wait until refreshToken() has finished before deciding where to send the user
  if (!isInitialized) return null;

  const target = user?.role ? (ROLE_HOME[user.role] ?? "/") : "/login";
  return <Navigate to={target} replace />;
};

export default RoleRedirect;
