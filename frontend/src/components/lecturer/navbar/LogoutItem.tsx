import { useAuthStore } from "@/stores/useAuthStore";
import { LogOut } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

interface LogoutItemProps {
  onClose: () => void;
}

const LogoutItem: React.FC<LogoutItemProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const { signOut } = useAuthStore();

  const handleLogout = async () => {
    onClose();
    await signOut();
    navigate("/login", { replace: true });
  };

  return (
    <div className="border-t border-[#1E2B58]/6 p-2 dark:border-white/10">
      <button
        type="button"
        onClick={handleLogout}
        className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 transition-all hover:bg-red-50 dark:hover:bg-red-900/20"
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-red-50 transition-colors group-hover:bg-red-100 dark:bg-red-900/20 dark:group-hover:bg-red-900/30">
          <LogOut className="h-4 w-4 text-red-500" />
        </div>
        <span className="text-[0.8125rem] font-bold text-red-500 dark:text-red-400">
          Log Out
        </span>
      </button>
    </div>
  );
};

export default LogoutItem;
