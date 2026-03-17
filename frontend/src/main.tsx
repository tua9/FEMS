import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";

import App from "./App.tsx";
import "./styles/index.css";

// Auth guards
import RoleRedirect from "./components/auth/RoleRedirect.tsx";

// Route Modules
import PublicRoutes from "./routes/publicRoutes.tsx";
import StudentRoutes from "./routes/studentRoutes.tsx";
import LecturerRoutes from "./routes/lecturerRoutes.tsx";
import AdminRoutes from "./routes/adminRoutes.tsx";
import TechnicianRoutes from "./routes/technicianRoutes.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<App />}>
          {/* Public routes */}
          {PublicRoutes()}

          {/* Root "/" → redirect theo role */}
          <Route path="/" element={<RoleRedirect />} />

          {/* Role-based routes */}
          {StudentRoutes()}
          {LecturerRoutes()}
          {AdminRoutes()}
          {TechnicianRoutes()}

          {/* 404 / Catch-all */}
          <Route path="*" element={<RoleRedirect />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);

