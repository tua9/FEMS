/**
 * NavLinks — Pill-style navigation links với active indicator.
 * Dùng chung cho tất cả role.
 */
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import type { NavLinkItem } from "./types";

interface NavLinksProps {
  links: NavLinkItem[];
}

const NavLinks: React.FC<NavLinksProps> = ({ links }) => {
  const location = useLocation();

  return (
    <nav className="hide-scrollbar hidden flex-1 items-center justify-center gap-1 overflow-x-auto lg:flex">
      {links.map((link) => {
        const isActive = location.pathname.startsWith(link.path);
        return (
          <Link
            key={link.path}
            to={link.path}
            aria-current={isActive ? "page" : undefined}
            className="relative shrink-0 rounded-full px-4 py-2 text-[0.6875rem] font-bold whitespace-nowrap transition-colors duration-200"
          >
            {/* Shared layout pill — Magic Motion */}
            {isActive && (
              <motion.span
                layoutId="nav-active-pill"
                className="absolute inset-0 rounded-full bg-white shadow-md dark:bg-white/15"
                transition={{ type: "spring", stiffness: 400, damping: 35 }}
              />
            )}
            <span
              className={`relative z-10 ${
                isActive
                  ? "text-[#1E2B58] dark:text-white"
                  : "text-slate-500 hover:text-[#1E2B58] dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              {link.name}
            </span>
          </Link>
        );
      })}
    </nav>
  );
};

export default NavLinks;
