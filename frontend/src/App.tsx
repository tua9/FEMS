import { Toaster } from "sonner";
import { Outlet } from "react-router";
import { ThemeProvider } from "./components/common/theme-provider";
import Footer from "./components/common/Footer";
import StudentNavBar from "./components/lecturer/navbar/StudentNavbar";

export default function App() {
  return (
    <>
      <Toaster richColors />
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <div className="m-0 w-full">
          <Outlet /> {/* Nơi render các route con */}
          {/* <Button
            onClick={async () => {
              const user = await authService.fetchUserProfile();
              console.log("✅Success fetching user profile");
              console.log("User = ", user);
            }}
          >
            Fetch Profile
          </Button> */}
          <Footer />
        </div>
      </ThemeProvider>
    </>
  );
}
