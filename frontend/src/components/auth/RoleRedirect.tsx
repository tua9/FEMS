import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "../../stores/useAuthStore";

const RoleRedirect = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const role = user?.role;

  useEffect(() => {
    if (!role) {
      navigate("/login", { replace: true });
      return;
    }

    if (role === "student") {
      navigate("/student/dashboard", { replace: true });
    } else if (["lecturer", "technician", "admin"].includes(role)) {
      navigate("/lecturer/dashboard", { replace: true });
    } else {
      navigate("/login", { replace: true });
    }
  }, [role, navigate]);

  return null;
};

export default RoleRedirect;
