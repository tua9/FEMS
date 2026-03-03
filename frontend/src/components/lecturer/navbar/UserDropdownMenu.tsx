import React from 'react';
import UserAvatarButton from './UserAvatarButton';
import UserDropdownContent from './UserDropdownContent';

interface UserDropdownMenuProps {
    isOpen: boolean;
    toggle: () => void;
    close: () => void;
}

const UserDropdownMenu: React.FC<UserDropdownMenuProps> = ({ isOpen, toggle, close }) => {
    return (
        <div className="relative">
            <UserAvatarButton onClick={toggle} />
            {isOpen && <UserDropdownContent onClose={close} />}
        </div>
    );
};

export default UserDropdownMenu;