import { BrowserRouter, Route, Routes } from "react-router";
import { Toaster, toast } from "sonner";
import LoginPage from "./pages/LoginPage/LoginPage";
import Logout from "./components/auth/Logout";
import ProtectedRoute from "./components/auth/ProtectedRoute";

export default function App() {
  return (
    <>
      <Toaster richColors />
      <BrowserRouter>
        <Routes>
          {/*public*/}
          <Route path="/login" element={<LoginPage />} />

          {/*private*/}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Logout />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
