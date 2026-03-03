import React from 'react';

const NavbarBrand: React.FC = () => {
    return (
        <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 sm:w-10 h-8 sm:h-10 bg-[var(--navy-deep)] rounded-full flex items-center justify-center text-white shrink-0">
                <span className="material-symbols-outlined text-xl sm:text-2xl font-bold">category</span>
            </div>
            <div className="hidden sm:block">
                <h1 className="font-extrabold text-base sm:text-lg leading-tight text-[var(--navy-deep)] dark:text-white">
                    F-EMS
                </h1>
                <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider opacity-70 text-[var(--navy-deep)] dark:text-slate-400">
                    Student Portal
                </p>
            </div>
        </div>
    );
};

export default NavbarBrand;