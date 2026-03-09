import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../stores/useAuthStore";

type Props = {
  allowRoles: string[];
};

const ProtectedRoute = ({ allowRoles }: Props) => {
  const { user, loading } = useAuthStore();

  // Đang chờ refreshToken hoàn thành — chưa biết user là ai
  if (loading) {
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
