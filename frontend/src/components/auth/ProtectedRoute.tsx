import { Navigate, Outlet } from "react-router-dom";

type Props = {
  allowRoles: string[];
};

const ProtectedRoute = ({ allowRoles }: Props) => {
  const role = localStorage.getItem("role");

  if (role && allowRoles.includes(role)) {
    return <Outlet />;
  }

  return <Navigate to="/login" replace />;
};

export default ProtectedRoute;
