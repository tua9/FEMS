/**
 * AppNavbar — Shared navbar for all roles (admin | lecturer | student | technician).
 * Uses unified sub-components from @/features/shared/components/navbar/.
 */
import React, { useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import NavBrand from "@/features/shared/components/navbar/NavBrand";
import NavLinks from "@/features/shared/components/navbar/NavLinks";
import NavMobileMenu from "@/features/shared/components/navbar/NavMobileMenu";
import DarkModeToggle from "@/features/shared/components/navbar/DarkModeToggle";
import NavNotificationBell from "@/features/shared/components/navbar/NavNotificationBell";
import NavUserDropdown from "@/features/shared/components/navbar/NavUserDropdown";

const AppNavbar = ({
  portalLabel,
  links,
  brandIcon = "school",
}) => {
  const { user } = useAuthStore();
  const isChatOpen = useChatStore((s) => s.isChatOpen);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header
      className={cn(
        // 1. Layout & Floating Pill Shape
        "fixed top-4 left-4 right-4 z-40 mx-auto flex h-[4.25rem] max-w-7xl items-center justify-between rounded-full px-6 transition-all duration-300 md:px-8",
        // Ẩn trên mobile khi AI chat đang mở
        isChatOpen ? "hidden sm:flex" : "flex",
        // 2. Light Mode — extreme transparency + deep float shadow
        "bg-white/20 backdrop-blur-lg border border-white/60 shadow-[0_8px_24px_0_rgba(0,0,0,0.15)]",
        // 3. Dark Mode — extreme transparency + stronger wide shadow to pop against dark backgrounds
        "dark:bg-slate-900/30 dark:backdrop-blur-lg dark:border dark:border-white/40 dark:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.85)]"
      )}
    >
      {/* ── Brand & Mobile Toggle ── */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/40 text-[#1E2B58] transition-all hover:bg-white/60 active:scale-95 dark:bg-white/5 dark:text-white lg:hidden"
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
        <NavBrand portalLabel={portalLabel} brandIcon={brandIcon} />
      </div>

      {/* ── Nav links (hidden on mobile, pill-style active state) ── */}
      <NavLinks links={links} />

      {/* ── Right actions ── */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Separator + icon group */}
        <div className="flex items-center gap-1 border-r border-slate-200/80 pr-3 dark:border-white/10">
          <DarkModeToggle />
          <NavNotificationBell />
        </div>

        {/* User display name + avatar dropdown */}
        <div className="flex items-center gap-2.5">
          {user && (
            <div className="hidden text-right xl:block">
              <p className="text-[11px] font-extrabold leading-none text-slate-800 dark:text-white">
                {user.displayName}
              </p>
              <p className="mt-1 text-[8px] font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">
                {user.role}
              </p>
            </div>
          )}
          <NavUserDropdown />
        </div>
      </div>

      {/* ── Mobile menu overlay ── */}
      <NavMobileMenu 
        isOpen={isMenuOpen} 
        links={links} 
        onClose={() => setIsMenuOpen(false)} 
      />
    </header>
  );
};

export default AppNavbar;
