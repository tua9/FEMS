import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const links = [
    { name: 'Home', path: '/lecturer/dashboard' },
    { name: 'Room Status', path: '/lecturer/room-status' },
    { name: 'Equipment', path: '/lecturer/equipment' },
    { name: 'Borrow Approval', path: '/lecturer/approval' },
    { name: 'Usage Stats', path: '/lecturer/usage-stats' },
    { name: 'Report Issue', path: '/lecturer/report-issue' },
    { name: 'My History', path: '/lecturer/history' },
];

export const NavLinks: React.FC = () => {
    const location = useLocation();

    return (
        <div className="hidden lg:flex flex-wrap items-center gap-1 justify-center flex-grow overflow-x-auto hide-scrollbar">
            {links.map((link) => {
                const isActive = location.pathname.includes(link.path);
                return (
                    <Link
                        key={link.name}
                        to={link.path}
                        className={`px-3 py-2 text-[0.6875rem] font-bold transition-colors rounded-full whitespace-nowrap shrink-0 ${isActive
                            ? 'active-pill-premium px-5 text-[#1E2B58] dark:text-white'
                            : 'text-slate-600 hover:text-[#1E2B58] dark:text-slate-300 dark:hover:text-white'
                            }`}
                    >
                        {link.name}
                    </Link>
                );
            })}
        </div>
    );
};
