import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface UserMenuItemsProps {
    onClose: () => void;
}

const MENU_ITEMS = [
    {
        to: '/lecturer/profile',
        icon: 'person',
        label: 'My Profile',
        description: 'View personal information',
        iconBg: 'bg-blue-50 dark:bg-blue-900/20',
        iconColor: 'text-blue-500 dark:text-blue-400',
        activeBg: 'bg-blue-500 dark:bg-blue-500',
    },
    {
        to: '/lecturer/change-password',
        icon: 'key',
        label: 'Change Password',
        description: 'Update account security',
        iconBg: 'bg-amber-50 dark:bg-amber-900/20',
        iconColor: 'text-amber-500 dark:text-amber-400',
        activeBg: 'bg-amber-500 dark:bg-amber-500',
    },
    {
        to: '/lecturer/history',
        icon: 'history',
        label: 'My History',
        description: 'Borrow & report records',
        iconBg: 'bg-violet-50 dark:bg-violet-900/20',
        iconColor: 'text-violet-500 dark:text-violet-400',
        activeBg: 'bg-violet-500 dark:bg-violet-500',
    },
    {
        to: '/lecturer/usage-stats',
        icon: 'bar_chart',
        label: 'Usage Statistics',
        description: 'Equipment & room analytics',
        iconBg: 'bg-emerald-50 dark:bg-emerald-900/20',
        iconColor: 'text-emerald-500 dark:text-emerald-400',
        activeBg: 'bg-emerald-500 dark:bg-emerald-500',
    },
] as const;

const UserMenuItems: React.FC<UserMenuItemsProps> = ({ onClose }) => {
    const navigate  = useNavigate();
    const location  = useLocation();

    const handleClick = (to: string) => {
        onClose();
        navigate(to);
    };

    return (
        <div className="py-1.5 px-2">
            {MENU_ITEMS.map((item) => {
                const isActive = location.pathname === item.to;
                return (
                    <button
                        key={item.to}
                        type="button"
                        onClick={() => handleClick(item.to)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left group ${
                            isActive
                                ? 'bg-[#1E2B58]/[0.05] dark:bg-white/[0.06]'
                                : 'hover:bg-[#1E2B58]/[0.03] dark:hover:bg-white/[0.04]'
                        }`}
                    >
                        {/* Icon */}
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                            isActive
                                ? `${item.activeBg}`
                                : `${item.iconBg} group-hover:scale-105`
                        }`}>
                            <span className={`material-symbols-rounded text-[16px] ${
                                isActive ? 'text-white' : item.iconColor
                            }`}>
                                {item.icon}
                            </span>
                        </div>

                        {/* Text */}
                        <div className="flex-1 min-w-0">
                            <p className={`text-[0.8125rem] font-bold leading-tight ${
                                isActive
                                    ? 'text-[#1E2B58] dark:text-white'
                                    : 'text-slate-700 dark:text-slate-200'
                            }`}>
                                {item.label}
                            </p>
                            <p className="text-[0.6875rem] text-slate-400 dark:text-slate-500 mt-0.5 truncate">
                                {item.description}
                            </p>
                        </div>

                        {/* Active dot / arrow */}
                        {isActive ? (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#1E2B58] dark:bg-blue-400 shrink-0" />
                        ) : (
                            <span className="material-symbols-rounded text-[14px] text-slate-300 dark:text-slate-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0">
                                chevron_right
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
};

export default UserMenuItems;
