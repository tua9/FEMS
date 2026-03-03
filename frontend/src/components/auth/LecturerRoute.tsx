import { Navigate, Outlet } from "react-router-dom";

const LecturerRoute = () => {
  const role = localStorage.getItem("role");

  if (role !== "lecturer") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default LecturerRoute;
