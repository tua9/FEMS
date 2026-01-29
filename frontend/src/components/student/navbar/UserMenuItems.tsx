import React from 'react';
import { Link } from 'react-router-dom';

interface UserMenuItemsProps {
    onClose: () => void;
}

const menuItems = [
    { to: '/profile', icon: 'person', label: 'Personal Profile' },
    { to: '/change-password', icon: 'key', label: 'Change Password' },
];

const UserMenuItems: React.FC<UserMenuItemsProps> = ({ onClose }) => {
    return (
        <div className="py-2">
            {menuItems.map((item) => (
                <Link
                    key={item.to}
                    to={item.to}
                    onClick={onClose}
                    className="flex items-center gap-3 px-5 py-3 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
                >
                    <span className="material-symbols-outlined text-xl text-slate-500 dark:text-slate-400">{item.icon}</span>
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                        {item.label}
                    </span>
                </Link>
            ))}
        </div>
    );
};

export default UserMenuItems;