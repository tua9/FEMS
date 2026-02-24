import { Outlet } from "react-router-dom";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute() {
  console.log("############# ProtectedRoute");

  const user = localStorage.getItem("user");
  console.log("user: ", user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
