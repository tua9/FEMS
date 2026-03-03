import { Navigate, Outlet } from "react-router-dom";

const StudentRoute = () => {
  const role = localStorage.getItem("role");

  if (!role) {
    return <Navigate to="/login" replace />;
  }

  if (role !== "student") {
    return;
  }

  return <Outlet />;
};

export default StudentRoute;
