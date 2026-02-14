import { useAuthStore } from "@/stores/useAuthStore";
import { Outlet } from "react-router-dom";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute() {
  const { accessToken, user, loading } = useAuthStore();

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
