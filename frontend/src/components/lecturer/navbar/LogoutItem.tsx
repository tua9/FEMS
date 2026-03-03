import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

interface LogoutItemProps {
    onClose: () => void;
}

const LogoutItem: React.FC<LogoutItemProps> = ({ onClose }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('userRole');
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        sessionStorage.clear();
        onClose();
        navigate('/login');
    };

    return (
        <div className="border-t border-[#1E2B58]/[0.06] dark:border-white/10 p-2">
            <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all group"
            >
                <div className="w-8 h-8 rounded-xl bg-red-50 dark:bg-red-900/20 group-hover:bg-red-100 dark:group-hover:bg-red-900/30 flex items-center justify-center shrink-0 transition-colors">
                    <LogOut className="w-4 h-4 text-red-500" />
                </div>
                <span className="text-[0.8125rem] font-bold text-red-500 dark:text-red-400">
                    Log Out
                </span>
            </button>
        </div>
    );
};

export default LogoutItem;
