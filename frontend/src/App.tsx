import { useEffect } from "react";
import { Toaster } from "sonner";
import { Outlet } from "react-router";
import { ThemeProvider } from "./components/common/theme-provider";
import Footer from "./components/common/Footer";
import StudentNavBar from "./components/StudentNavbar";
import { useAuthStore } from "./stores/useAuthStore";

export default function App() {
  const { user, refreshToken } = useAuthStore();

  useEffect(() => {
    refreshToken();
  }, [refreshToken]);

  const role = user?.role;
  const isAuth = !!user;

  return (
    <>
      <Toaster richColors />
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <div className="m-0 flex min-h-screen w-full flex-col">
          {isAuth && role === "student" && <StudentNavBar />}
          <main className="flex flex-1 flex-col">
            <Outlet />
          </main>
          <Footer />
        </div>
      </ThemeProvider>
    </>
  );
}
