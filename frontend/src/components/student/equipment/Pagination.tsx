import React from 'react';

const Pagination: React.FC = () => {
    return (
        <div className="flex items-center justify-center gap-3 pt-10">
            <button className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-navy-deep">
                <span className="material-symbols-outlined">chevron_left</span>
            </button>

            <button className="w-10 h-10 btn-navy-gradient text-white rounded-full flex items-center justify-center font-extrabold text-xs shadow-lg">
                1
            </button>
            <button className="w-10 h-10 flex items-center justify-center text-slate-600 font-bold text-xs hover:bg-white/50 rounded-full">
                2
            </button>
            <button className="w-10 h-10 flex items-center justify-center text-slate-600 font-bold text-xs hover:bg-white/50 rounded-full">
                3
            </button>

            <span className="px-2 text-slate-400">...</span>

            <button className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-navy-deep">
                <span className="material-symbols-outlined">chevron_right</span>
            </button>
        </div>
    );
};

export default Pagination;