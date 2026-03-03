import React from 'react';

interface UserAvatarButtonProps {
    onClick: () => void;
}

const UserAvatarButton: React.FC<UserAvatarButtonProps> = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden ring-2 ring-[var(--navy-deep)] dark:ring-blue-500 shadow-md focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900 transition-all"
            aria-label="Open user menu"
        >
            <img
                alt="User avatar"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCEN1b793kY1IzuwH6AhBg4THRAhN-JBovYTje7ZGjazVNDtsu72U8fdYKy3MV0FmBn6PnnfScPedB4SaDBi6FfEqWdfSW7-0juht7C7_0pbGixLlk-XDsLVX61ZkXNWPVX_EBgSECgI4cbyyg2m3-VMBFi6rGN6wtHQu3wpjb-5L0kc70b0oGrsm0Sr625B7i9oTGud7IUOqDOZD140FWMyoc2eBRCRxaPP5DvbeELgk2tzfSJVM6uVR6Jd17tE4lsy3IjlCo_u2PF" // Sau: từ user context
            />
        </button>
    );
};

export default UserAvatarButton;