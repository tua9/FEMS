import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

import App from "./App";
import "./styles/index.css";

// Auth guards
import RoleRedirect from "@/features/auth/components/RoleRedirect";
import RootHome from "@/features/auth/components/RootHome";

// Route Modules
import PublicRoutes from "./routes/publicRoutes";
import StudentRoutes from "./routes/studentRoutes";
import LecturerRoutes from "./routes/lecturerRoutes";
import AdminRoutes from "./routes/adminRoutes";
import TechnicianRoutes from "./routes/technicianRoutes";

createRoot(document.getElementById("root")).render(
 <StrictMode>
 <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
 <BrowserRouter>
 <Routes>
 <Route element={<App />}>
 {/* Public routes */}
 {PublicRoutes()}

 {/* Root "/" → role dashboard if logged in, else public report landing */}
 <Route index element={<RootHome />} />

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
 </GoogleOAuthProvider>
 </StrictMode>,
);
