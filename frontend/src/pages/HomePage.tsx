import { NavBar } from "@/components/common/NavBar";
import { Button } from "@/components/ui/button";
import { authService } from "@/services/authService";

export default function HomePage() {
  // set Page type Enum

  return (
    <>
      <div className="container h-screen border">
        <header className="flex items-center justify-center">
          <NavBar></NavBar>
        </header>
        <div>Home Page</div>
        <Button
          onClick={async () => {
            const user = await authService.fetchUserProfile();
            console.log("✅Success fetching user profile");
            console.log("User = ", user);
          }}
        >
          Fetch Profile
        </Button>
      </div>
    </>
  );
}
