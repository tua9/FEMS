/**
 * NavUserDropdown — Avatar button + dropdown menu dùng chung mọi role.
 *
 * - Avatar click → mở/đóng dropdown
 * - Dropdown: UserInfoHeader + Quick Access links (theo role) + Logout
 * - Framer Motion: fade + slide down khi mở/đóng
 */
import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";

// ── Per-role Quick Access menu items ─────────────────────────────────────────

interface MenuItem {
  to: string;
  icon: string;
  label: string;
  description: string;
  iconBg: string;
  iconColor: string;
}

const MENU_ITEMS: Record<string, MenuItem[]> = {
  admin: [
    {
      to: "/admin/profile",
      icon: "person",
      label: "My Profile",
      description: "View personal information",
      iconBg: "bg-blue-50 dark:bg-blue-900/20",
      iconColor: "text-blue-500 dark:text-blue-400",
    },
    {
      to: "/admin/change-password",
      icon: "key",
      label: "Change Password",
      description: "Update account security",
      iconBg: "bg-amber-50 dark:bg-amber-900/20",
      iconColor: "text-amber-500 dark:text-amber-400",
    },
    {
      to: "/admin/dashboard",
      icon: "bar_chart",
      label: "Dashboard",
      description: "System overview & analytics",
      iconBg: "bg-emerald-50 dark:bg-emerald-900/20",
      iconColor: "text-emerald-500 dark:text-emerald-400",
    },
  ],
  technician: [
    {
      to: "/technician/profile",
      icon: "person",
      label: "My Profile",
      description: "View personal information",
      iconBg: "bg-blue-50 dark:bg-blue-900/20",
      iconColor: "text-blue-500 dark:text-blue-400",
    },
    {
      to: "/technician/tasks",
      icon: "assignment",
      label: "My Tasks",
      description: "View active task list",
      iconBg: "bg-violet-50 dark:bg-violet-900/20",
      iconColor: "text-violet-500 dark:text-violet-400",
    },
    {
      to: "/technician/reports",
      icon: "bar_chart",
      label: "Performance",
      description: "View performance insights",
      iconBg: "bg-emerald-50 dark:bg-emerald-900/20",
      iconColor: "text-emerald-500 dark:text-emerald-400",
    },
  ],
  student: [
    {
      to: "/student/profile",
      icon: "person",
      label: "My Profile",
      description: "View personal information",
      iconBg: "bg-blue-50 dark:bg-blue-900/20",
      iconColor: "text-blue-500 dark:text-blue-400",
    },
    {
      to: "/student/change-password",
      icon: "key",
      label: "Change Password",
      description: "Update account security",
      iconBg: "bg-amber-50 dark:bg-amber-900/20",
      iconColor: "text-amber-500 dark:text-amber-400",
    },
    {
      to: "/student/borrow-history",
      icon: "history",
      label: "My History",
      description: "Borrow & report records",
      iconBg: "bg-violet-50 dark:bg-violet-900/20",
      iconColor: "text-violet-500 dark:text-violet-400",
    },
  ],
  lecturer: [
    {
      to: "/lecturer/profile",
      icon: "person",
      label: "My Profile",
      description: "View personal information",
      iconBg: "bg-blue-50 dark:bg-blue-900/20",
      iconColor: "text-blue-500 dark:text-blue-400",
    },
    {
      to: "/lecturer/change-password",
      icon: "key",
      label: "Change Password",
      description: "Update account security",
      iconBg: "bg-amber-50 dark:bg-amber-900/20",
      iconColor: "text-amber-500 dark:text-amber-400",
    },
    {
      to: "/lecturer/history",
      icon: "history",
      label: "My History",
      description: "Borrow & report records",
      iconBg: "bg-violet-50 dark:bg-violet-900/20",
      iconColor: "text-violet-500 dark:text-violet-400",
    },
    {
      to: "/lecturer/usage-stats",
      icon: "bar_chart",
      label: "Usage Statistics",
      description: "Equipment & room analytics",
      iconBg: "bg-emerald-50 dark:bg-emerald-900/20",
      iconColor: "text-emerald-500 dark:text-emerald-400",
    },
  ],
};

// ── Animation variants ────────────────────────────────────────────────────────

const dropdownVariants = {
  hidden: { opacity: 0, y: -8, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.2,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
  exit: {
    opacity: 0,
    y: -6,
    scale: 0.97,
    transition: { duration: 0.15 },
  },
};

// ── NavUserDropdown ───────────────────────────────────────────────────────────

const NavUserDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuthStore();

  const role = user?.role ?? "student";
  const menuItems = MENU_ITEMS[role] ?? MENU_ITEMS.student;

  const profileRoute: Record<string, string> = {
    student: "/student/profile",
    lecturer: "/lecturer/profile",
    admin: "/admin/profile",
    technician: "/technician/profile",
  };

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      )
        setIsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  const go = (path: string) => {
    setIsOpen(false);
    navigate(path);
  };

  const handleLogout = async () => {
    setIsOpen(false);
    await signOut();
    navigate("/login", { replace: true });
  };

  return (
    <div ref={containerRef} className="relative">
      {/* ── Avatar button ── */}
      <button
        onClick={() => setIsOpen((p) => !p)}
        aria-label="Open user menu"
        aria-expanded={isOpen}
        className="h-9 w-9 overflow-hidden rounded-full ring-2 ring-[#1E2B58] shadow-md transition-all hover:ring-4 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-white sm:h-10 sm:w-10 dark:ring-blue-500 dark:focus:ring-offset-slate-900"
      >
        {user?.avatarUrl ? (
          <img
            alt={user.displayName}
            src={user.avatarUrl}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#1E2B58] text-sm font-bold text-white">
            {user?.displayName?.charAt(0).toUpperCase() ?? "?"}
          </div>
        )}
      </button>

      {/* ── Dropdown ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={[
              // Shape & layout
              "absolute right-0 z-50 mt-3 w-72 overflow-hidden rounded-3xl",
              // Glass pane — light
              "bg-white/70 backdrop-blur-[28px]",
              // Glass pane — dark
              "dark:bg-slate-950/40 dark:backdrop-blur-[28px]",
              // Specular highlight border
              "ring-1 ring-inset ring-black/5 dark:ring-white/12",
              // Float shadow
              "shadow-2xl shadow-[#1E2B58]/10 dark:shadow-black/50",
            ].join(" ")}
          >
            {/* ── User info header ── */}
            <button
              type="button"
              onClick={() => go(profileRoute[role] ?? "/lecturer/profile")}
              className="group w-full border-b border-black/6 px-5 py-4 text-left transition-colors hover:bg-[#1E2B58]/4 dark:border-white/8 dark:hover:bg-white/5"
            >
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="relative shrink-0">
                  <div className="h-11 w-11 overflow-hidden rounded-2xl shadow-md ring-2 ring-[#1E2B58]/15 dark:ring-white/20">
                    {user?.avatarUrl ? (
                      <img
                        alt={user.displayName}
                        src={user.avatarUrl}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-[#1E2B58] text-sm font-bold text-white">
                        {user?.displayName?.charAt(0).toUpperCase() ?? "?"}
                      </div>
                    )}
                  </div>
                  {/* Online dot */}
                  <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-400 dark:border-slate-900" />
                </div>

                {/* Name + email */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[0.8125rem] font-extrabold leading-tight text-[#1E2B58] dark:text-white">
                    {user?.displayName ?? "—"}
                  </p>
                  <p className="mt-0.5 truncate text-[0.6875rem] font-semibold text-slate-500 dark:text-slate-400">
                    {user?.email ?? ""}
                  </p>
                </div>

                <span className="material-symbols-rounded shrink-0 text-base text-[#1E2B58]/20 transition-all group-hover:translate-x-0.5 group-hover:text-[#1E2B58]/50 dark:text-white/20 dark:group-hover:text-white/50">
                  chevron_right
                </span>
              </div>

              {/* Role badge */}
              <div className="mt-3">
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#1E2B58]/6 px-2.5 py-1 dark:bg-white/10">
                  <span className="material-symbols-rounded text-[13px] text-[#1E2B58] dark:text-blue-400">
                    school
                  </span>
                  <span className="text-[0.5625rem] font-black uppercase tracking-[0.12em] text-[#1E2B58]/70 dark:text-blue-400">
                    {user?.role ?? ""}
                  </span>
                </span>
              </div>
            </button>

            {/* ── Quick Access label ── */}
            <div className="px-5 pb-1 pt-3">
              <p className="text-[0.5625rem] font-black uppercase tracking-[0.18em] text-[#1E2B58]/30 dark:text-white/30">
                Quick Access
              </p>
            </div>

            {/* ── Menu items ── */}
            <div className="px-2 py-1.5">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.to;
                return (
                  <button
                    key={item.to}
                    type="button"
                    onClick={() => go(item.to)}
                    className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all ${
                      isActive
                        ? "bg-[#1E2B58]/8 dark:bg-white/8"
                        : "hover:bg-[#1E2B58]/5 dark:hover:bg-white/6"
                    }`}
                  >
                    {/* Icon */}
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-all ${
                        isActive
                          ? "bg-[#1E2B58] dark:bg-blue-500"
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
                        className={`text-[0.8125rem] font-bold leading-tight ${
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
                      <span className="material-symbols-rounded shrink-0 text-sm text-slate-300 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100 dark:text-slate-600">
                        chevron_right
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* ── Logout ── */}
            <div className="border-t border-black/6 p-2 dark:border-white/8">
              <button
                type="button"
                onClick={handleLogout}
                className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 transition-all hover:bg-red-500/8 dark:hover:bg-red-400/10"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-red-500/8 transition-colors group-hover:bg-red-500/15 dark:bg-red-400/10 dark:group-hover:bg-red-400/20">
                  <LogOut className="h-4 w-4 text-red-500 dark:text-red-400" />
                </div>
                <span className="text-[0.8125rem] font-bold text-red-500 dark:text-red-400">
                  Log Out
                </span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NavUserDropdown;
