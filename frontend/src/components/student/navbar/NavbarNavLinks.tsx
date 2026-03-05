import React from 'react';
import { Link } from 'react-router-dom';

interface NavLink {
    name: string;
    path: string;
}

interface NavbarNavLinksProps {
    links: NavLink[];
    currentPath: string;
}

const NavbarNavLinks: React.FC<NavbarNavLinksProps> = ({ links, currentPath }) => {
    return (
        <ul className="hidden md:flex items-center gap-4 lg:gap-8 font-medium text-sm">
            {links.map((link) => (
                <li key={link.path}>
                    <Link
                        to={link.path}
                        className={`px-4 py-1.5 transition-all duration-300 rounded-2xl ${currentPath === link.path
                            ? 'bg-white/60 dark:bg-slate-700/60 backdrop-blur-md shadow-sm border border-white/80 dark:border-slate-600 text-[#1A2B56] dark:text-white font-bold'
                            : 'text-slate-600 hover:text-[#1A2B56] dark:text-slate-300 dark:hover:text-white hover:bg-white/30'
                            }`}
                    >
                        {link.name}
                    </Link>
                </li>
            ))}
        </ul>
    );
};

export default NavbarNavLinks;