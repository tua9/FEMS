import { useNavigate } from "react-router";
import { Button } from "../ui/button";
import { useAuthStore } from "@/stores/useAuthStore";

export default function Logout() {
  const { signOut } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    console.log("log out");
    try {
      await signOut();
      console.log("finish logout");

      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const user = useAuthStore((s) => s.user);

  return (
    <>
      <Button
        className="w-full border-0"
        variant="destructive"
        onClick={handleLogout}
      >
        Logout
      </Button>
    </>
  );
}
