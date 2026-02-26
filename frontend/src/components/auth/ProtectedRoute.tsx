import { Outlet } from "react-router-dom";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute() {
  console.log("############# ProtectedRoute");
  const user = JSON.parse(localStorage.getItem("user") || "null");
  console.log("user: ", user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
