import { Link, useLocation } from "react-router-dom";

export const NavLinks = ({
  links,
}: {
  links: { name: string; path: string }[];
}) => {
  const location = useLocation();

  return (
    <div className="hide-scrollbar hidden flex-grow flex-wrap items-center justify-center gap-1 overflow-x-auto lg:flex">
      {links.map((link) => {
        const isActive = location.pathname.includes(link.path);
        return (
          <Link
            key={link.name}
            to={link.path}
            className={`shrink-0 rounded-full px-3 py-2 text-[0.6875rem] font-bold whitespace-nowrap transition-colors ${
              isActive
                ? "active-pill-premium px-5 text-[#1E2B58] dark:text-white"
                : "text-slate-600 hover:text-[#1E2B58] dark:text-slate-300 dark:hover:text-white"
            }`}
          >
            {link.name}
          </Link>
        );
      })}
    </div>
  );
};
