/**
 * AppNavbar — Shared navbar for all roles (admin | lecturer | student | technician).
 * Uses unified sub-components from @/components/shared/navbar/.
 */
import React from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import NavBrand from "@/components/shared/navbar/NavBrand";
import NavLinks from "@/components/shared/navbar/NavLinks";
import DarkModeToggle from "@/components/shared/navbar/DarkModeToggle";
import NavNotificationBell from "@/components/shared/navbar/NavNotificationBell";
import NavUserDropdown from "@/components/shared/navbar/NavUserDropdown";

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

const AppNavbar: React.FC<AppNavbarProps> = ({
  portalLabel,
  links,
  brandIcon = "school",
}) => {
  const { user } = useAuthStore();

  return (
    <header className="fixed left-0 right-0 top-6 z-50 flex justify-center px-[1%]">
      <nav className="extreme-glass flex w-full max-w-350 items-center justify-between rounded-4xl px-8 py-3 shadow-2xl shadow-slate-900/10 dark:shadow-none">

        {/* ── Brand ── */}
        <NavBrand portalLabel={portalLabel} brandIcon={brandIcon} />

        {/* ── Nav links ── */}
        <NavLinks links={links} />

        {/* ── Right actions ── */}
        <div className="flex min-w-40 items-center justify-end gap-4">
          {/* Dark mode + Notifications */}
          <div className="flex items-center gap-2 border-r border-[#1E2B58]/10 pr-4 dark:border-white/10">
            <DarkModeToggle />
            <NavNotificationBell />
          </div>

          {/* User name + Avatar dropdown */}
          <div className="flex items-center gap-3">
            {user && (
              <div className="hidden text-right xl:block">
                <p className="text-[11px] font-extrabold leading-none text-[#1E2B58] dark:text-white">
                  {user.displayName}
                </p>
                <p className="mt-1 text-[8px] font-bold uppercase tracking-tighter text-slate-500 dark:text-slate-400">
                  {user.role}
                </p>
              </div>
            )}
            <NavUserDropdown />
          </div>
        </div>

      </nav>
    </header>
  );
};

export default AppNavbar;
