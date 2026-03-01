import { Toaster } from "sonner";
import { NavBar } from "./components/common/NavBar";
import { Outlet } from "react-router";
import { ThemeProvider } from "./components/common/theme-provider";
import Footer from "./components/common/Footer";

export default function App() {
  return (
    <>
      <Toaster richColors />
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <div className="container w-[90%] p-1">
          <header className="my-4 mb-6">
            <NavBar></NavBar>
          </header>
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
