/**
 * DarkModeToggle — Nút bật/tắt dark mode.
 * Dùng chung cho tất cả role.
 */
import React from "react";
import { useDarkMode } from "@/hooks/useDarkMode";

const DarkModeToggle = () => {
 const { isDark, toggle } = useDarkMode();

 return (
 <button
 onClick={toggle}
 aria-label="Toggle dark mode"
 className="flex h-9 w-9 items-center justify-center rounded-full border border-[#1E2B58]/20 transition-all hover:bg-white/60 dark:border-white/20 dark:hover:bg-white/10"
 >
 <span className="material-symbols-outlined text-[18px] text-[#1E2B58] dark:text-white">
 {isDark ? "light_mode" : "dark_mode"}
 </span>
 </button>
 );
};

export default DarkModeToggle;
