import React from 'react';
import { useNavigate } from 'react-router-dom';

const UserInfoHeader: React.FC = () => {
    const navigate = useNavigate();

    return (
        <button
            type="button"
            onClick={() => navigate('/lecturer/profile')}
            className="w-full text-left px-5 py-4 border-b border-[#1E2B58]/[0.06] dark:border-white/10 hover:bg-[#1E2B58]/[0.02] dark:hover:bg-white/[0.02] transition-colors group"
        >
            {/* Avatar + name row */}
            <div className="flex items-center gap-3">
                <div className="relative shrink-0">
                    <div className="w-11 h-11 rounded-2xl overflow-hidden ring-2 ring-[#1E2B58]/15 dark:ring-white/20 shadow-md">
                        <img
                            alt="Dr. Alex Rivers"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBzXuttG3iy6AOmS--FZFw64NpKFCoLUVOzqJ7BfgkAvr3mQ-26f6OTnJxbQLGIKix0NHo8wv8i2cdNaP1JhYr2GWNx2_Ut-AmXECWfKkn8opPTw2-HDc0UaDYEQR1xyn6F8z1HSyj6Op6CkzX8lfGuo48WunE-d4W0bqD3aXKmIzwgDeue06pjKryGyY8x0T4KCUGj2VQGLrPbNKHV3DlrZQpfbzH9rEzIsTX0PtsbQxU8KL-9xXoEaRac9zf7ww_qHSOwYRrya3jg"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    {/* Online indicator */}
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white dark:border-slate-900" />
                </div>

                <div className="flex-1 min-w-0">
                    <p className="text-[0.8125rem] font-extrabold text-[#1E2B58] dark:text-white truncate leading-tight group-hover:text-[#1E2B58] dark:group-hover:text-white">
                        Dr. Alex Rivers
                    </p>
                    <p className="text-[0.6875rem] font-semibold text-slate-400 dark:text-slate-500 mt-0.5 truncate">
                        alex.rivers@university.edu.vn
                    </p>
                </div>

                {/* Arrow indicator */}
                <span className="material-symbols-rounded text-[16px] text-[#1E2B58]/20 dark:text-white/20 group-hover:text-[#1E2B58]/50 dark:group-hover:text-white/50 group-hover:translate-x-0.5 transition-all shrink-0">
                    chevron_right
                </span>
            </div>

            {/* Role badge + quick stats */}
            <div className="mt-3 flex items-center justify-between gap-2">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#1E2B58]/[0.06] dark:bg-white/10 rounded-lg">
                    <span className="material-symbols-rounded text-[13px] text-[#1E2B58] dark:text-blue-400">school</span>
                    <span className="text-[0.5625rem] font-black uppercase tracking-[0.12em] text-[#1E2B58]/70 dark:text-blue-400">
                        Senior Lecturer
                    </span>
                </div>

                {/* Mini stats */}
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-[0.625rem] font-bold text-[#1E2B58]/40 dark:text-white/40">
                        <span className="material-symbols-rounded text-[12px]">inventory_2</span>
                        <span>24</span>
                    </div>
                    <div className="flex items-center gap-1 text-[0.625rem] font-bold text-[#1E2B58]/40 dark:text-white/40">
                        <span className="material-symbols-rounded text-[12px]">build_circle</span>
                        <span>7</span>
                    </div>
                </div>
            </div>
        </button>
    );
};

export default UserInfoHeader;
