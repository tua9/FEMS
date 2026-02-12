import { BrowserRouter, Route, Routes } from "react-router";
import { Toaster, toast } from "sonner";
import LoginPage from "./pages/LoginPage";


export default function App() {
  return <>
    <Toaster richColors />
    <BrowserRouter>
      <Routes>
        {/*public*/}
        <Route path="/" element={<div>Home</div>} />
        <Route path="/login" element={<LoginPage />} />

        {/*private*/}
      </Routes>
    </BrowserRouter>
  </>
}
