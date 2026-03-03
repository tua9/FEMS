import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "@/stores/useAuthStore";

export default function GuestRoute() {
  const { user } = useAuthStore();

  if (user) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
}
