import { BrowserRouter, Route, Routes } from "react-router";
import { Toaster, toast } from "sonner";
import LoginPage from "./pages/LoginPage/LoginPage";
import Logout from "./components/auth/Logout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import HomePage from "./pages/HomePage";
import { NavBar } from "./components/common/Navbar";

export default function App() {
  return (
    <>
      <Toaster richColors />
      <div className="flex justify-center">
        <BrowserRouter>
          <Routes>
            {/*public*/}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/home" element={<HomePage />} />
            {/*private*/}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<HomePage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}
