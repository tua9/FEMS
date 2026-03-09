import { useAuthStore } from "@/stores/useAuthStore";
import React from "react";

interface UserAvatarButtonProps {
  onClick: () => void;
}

const UserAvatarButton: React.FC<UserAvatarButtonProps> = ({ onClick }) => {
  const { user } = useAuthStore();

  return (
    <button
      onClick={onClick}
      className="h-9 w-9 overflow-hidden rounded-full ring-2 ring-[#1E2B58] shadow-md transition-all focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-white sm:h-10 sm:w-10 dark:ring-blue-500 dark:focus:ring-offset-slate-900"
      aria-label="Open user menu"
    >
      {user?.avatarUrl ? (
        <img
          alt={user.displayName}
          className="h-full w-full object-cover"
          src={user.avatarUrl}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-[#1E2B58] text-sm font-bold text-white">
          {user?.displayName?.charAt(0).toUpperCase() ?? "?"}
        </div>
      )}
    </button>
  );
};

export default UserAvatarButton;
