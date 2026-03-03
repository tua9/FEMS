import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../stores/useAuthStore";

type Props = {
  allowRoles: string[];
};

const ProtectedRoute = ({ allowRoles }: Props) => {
  const { user } = useAuthStore();
  const role = user?.role;

  if (role && allowRoles.includes(role)) {
    return <Outlet />;
  }

  return <Navigate to="/login" replace />;
};

export default ProtectedRoute;
