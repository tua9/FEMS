import React from 'react';
import UserInfoHeader from './UserInfoHeader';
import UserMenuItems from './UserMenuItems';
import LogoutItem from './LogoutItem';

interface UserDropdownContentProps {
    onClose: () => void;
}

const UserDropdownContent: React.FC<UserDropdownContentProps> = ({ onClose }) => {
    return (
        <div
            className="absolute right-0 mt-3 w-[18rem] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-[#1E2B58]/[0.08] dark:border-white/10 rounded-3xl shadow-2xl shadow-[#1E2B58]/12 dark:shadow-black/40 z-50 overflow-hidden"
            style={{ animation: 'fadeInDown 0.18s cubic-bezier(0.16, 1, 0.3, 1)' }}
        >
            {/* User info — clickable, navigates to /lecturer/profile */}
            <UserInfoHeader />

            {/* Section label */}
            <div className="px-5 pt-3 pb-1">
                <p className="text-[0.5625rem] font-black uppercase tracking-[0.18em] text-[#1E2B58]/30 dark:text-white/30">
                    Quick Access
                </p>
            </div>

            {/* Menu items */}
            <UserMenuItems onClose={onClose} />

            {/* Logout */}
            <LogoutItem onClose={onClose} />
        </div>
    );
};

export default UserDropdownContent;
