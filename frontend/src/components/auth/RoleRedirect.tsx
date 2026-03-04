import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "../../stores/useAuthStore";

const ROLE_HOME: Record<string, string> = {
  student:    "/student/dashboard",
  lecturer:   "/lecturer/dashboard",
  technician: "/technician/dashboard",
  admin:      "/lecturer/dashboard",
};

const RoleRedirect = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const role = user?.role;

  useEffect(() => {
    const target = role ? (ROLE_HOME[role] ?? "/login") : "/login";
    navigate(target, { replace: true });
  }, [role, navigate]);

  return null;
};

export default RoleRedirect;
