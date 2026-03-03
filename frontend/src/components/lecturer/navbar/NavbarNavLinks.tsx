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
                        className={`pb-1 transition-colors duration-200 ${currentPath === link.path
                                ? 'text-[var(--navy-deep)] dark:text-blue-400 border-b-2 border-[var(--navy-deep)] dark:border-blue-400 font-semibold'
                                : 'text-slate-600 hover:text-[var(--navy-deep)] dark:text-slate-300 dark:hover:text-blue-400'
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