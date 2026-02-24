import { BrowserRouter, Route, Routes } from "react-router";
import { Toaster } from "sonner";
import LoginPage from "./pages/LoginPage/LoginPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import HomePage from "./pages/HomePage";
import GuestRoute from "./components/auth/GuestRoute";

export default function App() {
  return (
    <>
      <Toaster richColors />
      <div className="flex justify-center">
        <BrowserRouter>
          <Routes>
            {/*public*/}
            <Route element={<GuestRoute />}>
              <Route path="/login" element={<LoginPage />} />
            </Route>

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
