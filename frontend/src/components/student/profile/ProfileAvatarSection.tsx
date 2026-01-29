import React from 'react';

interface ProfileAvatarSectionProps {
    name: string;
    studentId: string;
    status: string;
    avatar: string;
}

const ProfileAvatarSection: React.FC<ProfileAvatarSectionProps> = ({
    name,
    studentId,
    status,
    avatar,
}) => {
    return (
        <div className="lg:w-1/3 p-12 flex flex-col items-center justify-center text-center border-b lg:border-b-0 lg:border-r border-white/30 dark:border-white/5">
            {/* Avatar */}
            <div className="relative group mb-8">
                <div className="w-48 h-48 rounded-[2rem] overflow-hidden ring-4 ring-white dark:ring-slate-700 shadow-2xl bg-slate-200 dark:bg-slate-700">
                    <img
                        alt={`${name} profile`}
                        className="w-full h-full object-cover"
                        src={avatar}
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/192?text=No+Image';
                        }}
                    />
                </div>
            </div>

            {/* Name */}
            <h2 className="text-2xl font-extrabold text-navy-deep dark:text-white">
                {name}
            </h2>

            {/* Student ID */}
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mt-1">
                {studentId}
            </p>

            {/* Status Badge */}
            <div className="mt-8 flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-black uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                {status}
            </div>
        </div>
    );
};

export default ProfileAvatarSection;