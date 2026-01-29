import React from 'react';

const ProfileHeader: React.FC = () => {
    return (
        <div className="mb-10">
            <h1 className="text-4xl font-extrabold text-navy-deep dark:text-white mb-2 tracking-tight">
                Student Profile
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
                Manage your personal information and account security.
            </p>
        </div>
    );
};

export default ProfileHeader;