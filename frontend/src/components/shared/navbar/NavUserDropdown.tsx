/**
 * NavUserDropdown — Avatar button + dropdown menu dùng chung mọi role.
 *
 * - Avatar click → mở/đóng dropdown
 * - Dropdown: UserInfoHeader + Quick Access links (theo role) + Logout
 * - Framer Motion: fade + slide down khi mở/đóng
 */
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
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

// NOTE: Only `y` on the outer motion.div — opacity is intentionally
// kept OFF the wrapper. When opacity < 1 is set on a parent, the browser
// composites the whole subtree into a separate GPU layer which makes
// backdrop-filter invisible until the animation finishes (~0.5 s delay).
// Instead we animate opacity on the inner glass <motion.div> via `glassVariants`.
const wrapperVariants = {
  hidden: { y: -8 },
  visible: {
    y: 0,
    transition: {
      duration: 0.2,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
  exit: {
    y: -6,
    transition: { duration: 0.15 },
  },
};

const glassVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.18, ease: "easeOut" } },
  exit: { opacity: 0, transition: { duration: 0.12 } },
};

// ── NavUserDropdown ───────────────────────────────────────────────────────────

const NavUserDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
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

  // ── Compute portal position from button bounding rect ─────────────────────
  const [dropdownPos, setDropdownPos] = useState<{ top: number; right: number }>({ top: 0, right: 0 });

  const updatePos = () => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    // Anchor below the navbar pill (fixed top-4 + h-[4.25rem] = 84px), with 8px gap
    const navbar = document.querySelector("header[class*='fixed'][class*='rounded-full']");
    const navbarBottom = navbar
      ? navbar.getBoundingClientRect().bottom
      : rect.bottom;
    setDropdownPos({
      top: navbarBottom + 8,
      right: window.innerWidth - rect.right,
    });
  };

  const handleToggle = () => {
    if (!isOpen) updatePos();
    setIsOpen((p) => !p);
  };

  useEffect(() => {
    if (!isOpen) return;
    window.addEventListener("resize", updatePos);
    window.addEventListener("scroll", updatePos, true);
    return () => {
      window.removeEventListener("resize", updatePos);
      window.removeEventListener("scroll", updatePos, true);
    };
  }, [isOpen]);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (
        buttonRef.current?.contains(e.target as Node) ||
        dropdownRef.current?.contains(e.target as Node)
      ) return;
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
    <>
      {/* ── Avatar button ── */}
      <button
        ref={buttonRef}
        onClick={handleToggle}
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

      {/* ── Dropdown portal — rendered to document.body to escape all
              stacking contexts (will-change-transform, filters, etc.)        ── */}
      {createPortal(
        <AnimatePresence>
          {isOpen && (
            // Outer wrapper: only y-translate, NO opacity — opacity on a
            // parent creates a GPU compositing layer that breaks
            // backdrop-filter (causes ~0.5 s blur delay on open).
            <motion.div
              ref={dropdownRef}
              variants={wrapperVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{
                position: "fixed",
                top: dropdownPos.top,
                right: dropdownPos.right,
                zIndex: 9999,
                width: "18rem",
              }}
            >
              {/* Glass surface: opacity is animated HERE so backdrop-filter
                  is always active, even during the fade-in.              */}
              <motion.div
                variants={glassVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className={[
                  "overflow-hidden rounded-2xl",
                  "bg-white/30 backdrop-saturate-150",
                  "border border-white/60",
                  "shadow-[0_8px_32px_0_rgba(0,0,0,0.12)]",
                  "dark:bg-slate-900/40",
                  "dark:border-white/15",
                  "dark:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.7)]",
                ].join(" ")}
                style={{
                  WebkitBackdropFilter: "blur(20px) saturate(160%)",
                  backdropFilter: "blur(20px) saturate(160%)",
                }}
              >
                {/* ── User info header ── */}
                <button
                  type="button"
                  onClick={() => go(profileRoute[role] ?? "/lecturer/profile")}
                  className="group w-full border-b border-black/10 px-5 py-4 text-left transition-colors hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/8"
                >
                  <div className="flex items-center gap-3">
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
                      <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-400 dark:border-slate-900" />
                    </div>
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
                            ? "bg-black/8 dark:bg-white/12"
                            : "hover:bg-black/6 dark:hover:bg-white/10"
                        }`}
                      >
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
                <div className="border-t border-black/10 p-2 dark:border-white/15">
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
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};

export default NavUserDropdown;
