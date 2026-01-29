import React from 'react';
import { Link } from 'react-router-dom';

const ProfileActions: React.FC = () => {
    return (
        <div className="mt-16 flex flex-col sm:flex-row items-center gap-4">
            <Link
                to="/change-password"
                className="w-full sm:w-auto btn-navy-gradient text-white px-10 py-4 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-3 shadow-lg"
            >
                Change Password
                <span className="material-symbols-outlined text-lg">key</span>
            </Link>

            {/* Có thể thêm nút khác sau này: Edit Profile, Upload Avatar, Logout... */}
        </div>
    );
};

export default ProfileActions;