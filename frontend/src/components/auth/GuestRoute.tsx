import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../stores/useAuthStore";

const ROLE_HOME: Record<string, string> = {
  student:    "/student/dashboard",
  lecturer:   "/lecturer/dashboard",
  technician: "/technician/dashboard",
  admin:      "/admin/dashboard",
};

export default function GuestRoute() {
  const { user, isInitialized } = useAuthStore();

  // Not yet determined — wait
  if (!isInitialized) return null;

  if (user) {
    const home = ROLE_HOME[user.role] ?? "/";
    return <Navigate to={home} replace />;
  }

  return <Outlet />;
}
