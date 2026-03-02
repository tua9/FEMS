import React from 'react';

const AdminFooter: React.FC = () => {
    return (
        <footer className="max-w-7xl mx-auto px-6 py-10 mt-auto text-center relative z-10">
            <div className="flex justify-center gap-8 mb-6 text-[#1A2B56] dark:text-slate-400 opacity-70">
                <span className="material-symbols-outlined text-2xl">school</span>
                <span className="material-symbols-outlined text-2xl">verified_user</span>
                <span className="material-symbols-outlined text-2xl">biotech</span>
            </div>
            <p className="text-[10px] font-black text-slate-600 dark:text-slate-500 uppercase tracking-[0.4em]">Facility & Equipment Management System — F-EMS 2024</p>
        </footer>
    );
};

export default AdminFooter;
