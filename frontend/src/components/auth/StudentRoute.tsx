import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../stores/useAuthStore";

const StudentRoute = () => {
  const { user } = useAuthStore();
  const role = user?.role;

  if (!role) {
    return <Navigate to="/login" replace />;
  }

  if (role !== "student") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default StudentRoute;
