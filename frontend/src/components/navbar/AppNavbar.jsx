/**
 * AppNavbar — Shared navbar for all roles (admin | lecturer | student | technician).
 * Uses unified sub-components from @/components/shared/navbar/.
 */
import React from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { cn } from "@/lib/utils";
import NavBrand from "@/components/shared/navbar/NavBrand";
import NavLinks from "@/components/shared/navbar/NavLinks";
import DarkModeToggle from "@/components/shared/navbar/DarkModeToggle";
import NavNotificationBell from "@/components/shared/navbar/NavNotificationBell";
import NavUserDropdown from "@/components/shared/navbar/NavUserDropdown";

const AppNavbar = ({
 portalLabel,
 links,
 brandIcon = "school",
}) => {
 const { user } = useAuthStore();

 return (
 <header
 className={cn(
 // 1. Layout & Floating Pill Shape
 "fixed top-4 left-4 right-4 z-50 mx-auto flex h-[4.25rem] max-w-7xl items-center justify-between rounded-full px-6 transition-all duration-300 md:px-8",
 // 2. Light Mode — extreme transparency + deep float shadow
 "bg-white/20 backdrop-blur-lg border border-white/60 shadow-[0_8px_24px_0_rgba(0,0,0,0.15)]",
 // 3. Dark Mode — extreme transparency + stronger wide shadow to pop against dark backgrounds
 "dark:bg-slate-900/30 dark:backdrop-blur-lg dark:border dark:border-white/40 dark:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.85)]"
 )}
 >
 {/* ── Brand ── */}
 <NavBrand portalLabel={portalLabel} brandIcon={brandIcon} />

 {/* ── Nav links (hidden on mobile, pill-style active state) ── */}
 <NavLinks links={links} />

 {/* ── Right actions ── */}
 <div className="flex items-center gap-3">
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
 </header>
 );
};

export default AppNavbar;
