import React, { useEffect, useRef, useState } from "react";
import { NavLinks } from "./NavLinks";
import NotificationIcon from "./NotificationIcon";
import UserDropdownMenu from "./UserDropdownMenu";
import { useDarkMode } from "@/hooks/useDarkMode";
import { useAuthStore } from "@/stores/useAuthStore";

interface NavLink {
  name: string;
  path: string;
}

interface AppNavbarProps {
  /** Portal label shown under the F-EMS brand (e.g. "STUDENT PORTAL") */
  portalLabel: string;
  /** Navigation links for this role */
  links: NavLink[];
  /** Material Symbols icon name for the brand logo. Defaults to 'school' */
  brandIcon?: string;
}

const AppNavbar: React.FC<AppNavbarProps> = ({ portalLabel, links, brandIcon = 'school' }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { isDark, toggle } = useDarkMode();
  const { user } = useAuthStore();

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isDropdownOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen]);

  return (
    <header className="fixed top-6 right-0 left-0 z-50 flex justify-center px-[1%]">
      <nav className="extreme-glass flex w-full max-w-[1400px] items-center justify-between rounded-[32px] px-8 py-3 shadow-2xl shadow-slate-900/10 dark:shadow-none">

        {/* ── Brand ── */}
        <div className="flex min-w-[160px] items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white/20 bg-[#1E2B58] text-white shadow-lg">
            <span className="material-symbols-rounded text-xl">{brandIcon}</span>
          </div>
          <div>
            <h1 className="text-base leading-none font-extrabold tracking-tight text-[#1E2B58] dark:text-white">
              F-EMS
            </h1>
            <p className="mt-1 text-[8px] font-black tracking-[0.15em] text-[#1E2B58] uppercase opacity-70 dark:text-slate-400">
              {portalLabel}
            </p>
          </div>
        </div>

        {/* ── Nav links (pill-style) ── */}
        <NavLinks links={links} />

        {/* ── Right actions ── */}
        <div className="flex min-w-[160px] items-center justify-end gap-4">
          {/* Dark-mode toggle + Notifications */}
          <div className="flex items-center gap-2 border-r border-[#1E2B58]/10 pr-4 dark:border-white/10">
            <button
              onClick={toggle}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#1E2B58]/30 transition-all hover:bg-white/40 dark:border-white/40 dark:hover:bg-white/10"
              aria-label="Toggle dark mode"
            >
              <span className="material-symbols-outlined text-[18px] text-[#1E2B58] dark:text-white">
                {isDark ? "light_mode" : "dark_mode"}
              </span>
            </button>
            <NotificationIcon />
          </div>

          {/* User name + avatar dropdown */}
          <div ref={dropdownRef} className="flex items-center gap-3">
            {user && (
              <div className="hidden text-right xl:block">
                <p className="text-[11px] leading-none font-extrabold text-[#1E2B58] dark:text-white">
                  {user.displayName}
                </p>
                <p className="mt-1 text-[8px] font-bold tracking-tighter text-slate-500 uppercase dark:text-slate-400">
                  {user.role}
                </p>
              </div>
            )}
            <UserDropdownMenu
              isOpen={isDropdownOpen}
              toggle={() => setIsDropdownOpen((prev) => !prev)}
              close={() => setIsDropdownOpen(false)}
            />
          </div>
        </div>

      </nav>
    </header>
  );
};

export default AppNavbar;
