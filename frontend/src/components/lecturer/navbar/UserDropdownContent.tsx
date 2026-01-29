import React from 'react';
import LogoutItem from './LogoutItem';
import UserInfoHeader from './UserInfoHeader';
import UserMenuItems from './UserMenuItems';

interface UserDropdownContentProps {
    onClose: () => void;
}

const UserDropdownContent: React.FC<UserDropdownContentProps> = ({ onClose }) => {
    return (
        <div className="absolute right-0 mt-3 w-72 bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
            <UserInfoHeader />
            <UserMenuItems onClose={onClose} />
            <LogoutItem onClose={onClose} />
        </div>
    );
};

export default UserDropdownContent;