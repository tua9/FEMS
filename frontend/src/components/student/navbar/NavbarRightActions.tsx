import React from 'react';

import { useDarkMode } from '@/hooks/useDarkMode';
import UserDropdownMenu from './UserDropdownMenu';
import NotificationIcon from './NotificationIcon';

interface NavbarRightActionsProps {
    isDropdownOpen: boolean;
    onToggleDropdown: () => void;
    onCloseDropdown: () => void;
}

const NavbarRightActions: React.FC<NavbarRightActionsProps> = ({
    isDropdownOpen,
    onToggleDropdown,
    onCloseDropdown,
}) => {
    const { isDark, toggle } = useDarkMode();

    return (
        <div className="flex items-center gap-3 sm:gap-4">
            <button
                onClick={toggle}
                className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full hover:bg-white/30 dark:hover:bg-slate-700/30 transition-colors text-slate-600 dark:text-slate-300"
                aria-label="Toggle dark mode"
            >
                <span className="material-symbols-outlined text-xl">
                    {isDark ? 'light_mode' : 'dark_mode'}
                </span>
            </button>

            <NotificationIcon />

            <UserDropdownMenu
                isOpen={isDropdownOpen}
                toggle={onToggleDropdown}
                close={onCloseDropdown}
            />
        </div>
    );
};

export default NavbarRightActions;