import React from 'react';

interface UserInfoHeaderProps {
    userName?: string; // Sau: truyền từ context
}

const UserInfoHeader: React.FC<UserInfoHeaderProps> = ({ userName = 'Nguyen Van A' }) => {
    return (
        <div className="px-6 py-5 border-b border-white/15 dark:border-slate-700/50">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Signed in as
            </p>
            <p className="text-base font-bold text-[var(--navy-deep)] dark:text-white truncate">
                {userName}
            </p>
        </div>
    );
};

export default UserInfoHeader;