import { useNavigate } from "react-router";
import { Button } from "../ui/button";
import { useAuthStore } from "@/stores/useAuthStore";

export default function Logout() {
  const { signOut } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <Button
      className="w-full border-0"
      variant="destructive"
      onClick={handleLogout}
    >
      Logout
    </Button>
  );
}
