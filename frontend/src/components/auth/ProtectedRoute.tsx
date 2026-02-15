import { useAuthStore } from "@/stores/useAuthStore";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute() {
  const { accessToken, user, loading, refreshToken, fetchUserProfile } =
    useAuthStore();
  const [starting, setStarting] = useState(true);

  console.log("Protected Route: ", useAuthStore());

  const init = async () => {
    if (!accessToken) {
      await refreshToken();
    }

    if (accessToken && !user) {
      await fetchUserProfile();
    }

    setStarting(false);
  };

  useEffect(() => {
    init();
  }, []);

  if (starting || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
