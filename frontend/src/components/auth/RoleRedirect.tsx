// src/components/auth/RoleRedirect.tsx
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const RoleRedirect = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  useEffect(() => {
    // Tránh redirect loop bằng cách kiểm tra path hiện tại (tùy chọn)
    const currentPath = window.location.pathname;

    if (!role) {
      if (currentPath !== "/login") {
        navigate("/login", { replace: true });
      }
      return;
    }

    if (role === "student" && !currentPath.startsWith("/student")) {
      navigate("/student/dashboard", { replace: true });
    } else if (role === "lecturer" && !currentPath.startsWith("/lecturer")) {
      navigate("/lecturer/dashboard", { replace: true });
    } else {
      // Role không hợp lệ → về login
      navigate("/login", { replace: true });
    }
  }, [role, navigate]);

  // Có thể hiển thị loading nếu cần
  return null; // hoặc <div>Đang chuyển hướng...</div>
};

export default RoleRedirect;
