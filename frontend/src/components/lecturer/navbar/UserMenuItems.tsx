import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";

interface UserMenuItemsProps {
  onClose: () => void;
}

const getMenuItems = (role: string) => {
  const prefix = role === "student" ? "/student" : "/lecturer";
  return [
    {
      to: `${prefix}/profile`,
      icon: "person",
      label: "My Profile",
      description: "View personal information",
      iconBg: "bg-blue-50 dark:bg-blue-900/20",
      iconColor: "text-blue-500 dark:text-blue-400",
      activeBg: "bg-blue-500 dark:bg-blue-500",
    },
    {
      to: `${prefix}/change-password`,
      icon: "key",
      label: "Change Password",
      description: "Update account security",
      iconBg: "bg-amber-50 dark:bg-amber-900/20",
      iconColor: "text-amber-500 dark:text-amber-400",
      activeBg: "bg-amber-500 dark:bg-amber-500",
    },
    {
      to: role === "student" ? "/student/borrow-history" : "/lecturer/history",
      icon: "history",
      label: "My History",
      description: "Borrow & report records",
      iconBg: "bg-violet-50 dark:bg-violet-900/20",
      iconColor: "text-violet-500 dark:text-violet-400",
      activeBg: "bg-violet-500 dark:bg-violet-500",
    },
    ...(role !== "student"
      ? [
          {
            to: "/lecturer/usage-stats",
            icon: "bar_chart",
            label: "Usage Statistics",
            description: "Equipment & room analytics",
            iconBg: "bg-emerald-50 dark:bg-emerald-900/20",
            iconColor: "text-emerald-500 dark:text-emerald-400",
            activeBg: "bg-emerald-500 dark:bg-emerald-500",
          },
        ]
      : []),
  ];
};

const UserMenuItems: React.FC<UserMenuItemsProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();
  const role = user?.role || "student";
  const menuItems = getMenuItems(role);

  const handleClick = (to: string) => {
    onClose();
    navigate(to);
  };

  return (
    <div className="px-2 py-1.5">
      {menuItems.map((item: any) => {
        const isActive = location.pathname === item.to;
        return (
          <button
            key={item.to}
            type="button"
            onClick={() => handleClick(item.to)}
            className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all ${
              isActive
                ? "bg-[#1E2B58]/[0.05] dark:bg-white/[0.06]"
                : "hover:bg-[#1E2B58]/[0.03] dark:hover:bg-white/[0.04]"
            }`}
          >
            {/* Icon */}
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-all ${
                isActive
                  ? `${item.activeBg}`
                  : `${item.iconBg} group-hover:scale-105`
              }`}
            >
              <span
                className={`material-symbols-rounded text-[16px] ${
                  isActive ? "text-white" : item.iconColor
                }`}
              >
                {item.icon}
              </span>
            </div>

            {/* Text */}
            <div className="min-w-0 flex-1">
              <p
                className={`text-[0.8125rem] leading-tight font-bold ${
                  isActive
                    ? "text-[#1E2B58] dark:text-white"
                    : "text-slate-700 dark:text-slate-200"
                }`}
              >
                {item.label}
              </p>
              <p className="mt-0.5 truncate text-[0.6875rem] text-slate-400 dark:text-slate-500">
                {item.description}
              </p>
            </div>

            {/* Active dot / arrow */}
            {isActive ? (
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#1E2B58] dark:bg-blue-400" />
            ) : (
              <span className="material-symbols-rounded shrink-0 text-[14px] text-slate-300 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100 dark:text-slate-600">
                chevron_right
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default UserMenuItems;
