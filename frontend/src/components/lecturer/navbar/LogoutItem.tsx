import React from 'react';
import { Link } from 'react-router-dom';

interface LogoutItemProps {
    onClose: () => void;
}

const LogoutItem: React.FC<LogoutItemProps> = ({ onClose }) => {
    return (
        <div className="border-t border-white/15 dark:border-slate-700/50 py-2">
            <Link
                to="/login"
                onClick={onClose}
                className="flex items-center gap-3 px-5 py-3 hover:bg-red-500/10 transition-colors"
            >
                <span className="material-symbols-outlined text-xl text-red-500">logout</span>
                <span className="text-sm font-semibold text-red-600 dark:text-red-400">Log Out</span>
            </Link>
        </div>
    );
};

export default LogoutItem;