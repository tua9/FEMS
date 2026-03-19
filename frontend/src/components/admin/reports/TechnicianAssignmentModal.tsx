import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import type { User } from '../../../types/user';

interface TechnicianAssignmentModalProps {
    isOpen: boolean;
    technicians: User[];
    onClose: () => void;
    onAssign: (technician: User) => void;
    equipmentName: string;
}

const TechnicianAssignmentModal: React.FC<TechnicianAssignmentModalProps> = ({
    isOpen,
    technicians,
    onClose,
    onAssign,
    equipmentName
}) => {
    const [searchQuery, setSearchQuery] = useState('');

    if (!isOpen) return null;

    const filteredTechnicians = technicians.filter(tech => {
        const name = tech.displayName || tech.username || '';
        const email = tech.email || '';
        return name.toLowerCase().includes(searchQuery.toLowerCase()) ||
               email.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const getWorkloadStyle = (count: number = 0) => {
        if (count >= 5) return 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800/50';
        if (count >= 3) return 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/50';
        return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50';
    };

    const getWorkloadText = (count: number = 0) => {
        if (count >= 5) return 'Heavy Load';
        if (count >= 3) return 'Medium Load';
        return 'Available';
    };

    return createPortal(
        <div className="fixed inset-0 z-[110] flex items-center justify-center px-4 py-6 bg-black/30 backdrop-blur-sm">
            {/* Backdrop */}
            <div
                className="absolute inset-0"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative w-full max-w-lg dashboard-card rounded-4xl shadow-2xl shadow-[#1E2B58]/20 overflow-hidden flex flex-col max-h-[80vh] animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="px-8 pt-7 pb-5 border-b border-black/8 dark:border-white/10 relative">
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center text-[#1E2B58]/50 hover:text-[#1E2B58] hover:bg-[#1E2B58]/8 dark:text-white/50 dark:hover:text-white dark:hover:bg-white/10 rounded-full transition-colors"
                    >
                        <span className="material-symbols-outlined text-lg">close</span>
                    </button>

                    <p className="text-[0.625rem] font-black uppercase tracking-widest text-[#1E2B58]/50 dark:text-white/40 mb-0.5">Assignment</p>
                    <h3 className="text-xl font-extrabold text-[#1E2B58] dark:text-white">Assign Technician</h3>
                    <p className="text-xs text-slate-400 font-medium mt-0.5 uppercase tracking-widest">
                        For: {equipmentName}
                    </p>

                    {/* Search Bar */}
                    <div className="mt-5 relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#1E2B58]/40 dark:text-white/40 text-lg">search</span>
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-white/40 bg-white/40 dark:border-slate-700/50 dark:bg-slate-800/50 outline-none text-sm font-medium text-[#1E2B58] dark:text-white placeholder:text-[#1E2B58]/30 dark:placeholder:text-white/30 focus:ring-2 focus:ring-[#1E2B58]/25 transition-all"
                        />
                    </div>
                </div>

                {/* Technicians List */}
                <div className="flex-1 overflow-y-auto p-4 pt-0 space-y-2 no-scrollbar">
                    {filteredTechnicians.length > 0 ? (
                        filteredTechnicians.map((tech) => (
                            <button
                                key={tech._id}
                                onClick={() => onAssign(tech)}
                                className="w-full flex items-center justify-between p-4 rounded-3xl hover:bg-blue-50/50 dark:hover:bg-blue-900/10 border-2 border-transparent hover:border-blue-100/50 dark:hover:border-blue-800/20 transition-all group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-[#1A2B56] text-white flex items-center justify-center font-bold text-lg">
                                        {(tech.displayName || tech.username || 'T').charAt(0)}
                                    </div>
                                    <div className="text-left">
                                        <p className="font-black text-slate-800 dark:text-white leading-tight transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
                                            {tech.displayName || tech.username}
                                        </p>
                                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-1 uppercase tracking-widest">{tech.email}</p>
                                    </div>
                                </div>
                                <div className={`px-4 py-1.5 rounded-xl border-2 text-[10px] font-black uppercase tracking-widest shadow-sm ${getWorkloadStyle(0)}`}>
                                    <div className="flex flex-col items-center">
                                        <span>{getWorkloadText(0)}</span>
                                        <span className="opacity-70 mt-0.5">0 tasks</span>
                                    </div>
                                </div>
                            </button>
                        ))
                    ) : (
                        <div className="text-center py-12">
                            <span className="material-symbols-outlined text-4xl text-slate-200 dark:text-slate-700 mb-2">person_search</span>
                            <p className="text-slate-400 dark:text-slate-500 font-bold text-sm">No technicians found.</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-8 py-4 border-t border-black/8 dark:border-white/10 bg-black/3 dark:bg-white/3 text-center">
                    <p className="text-[0.625rem] font-black text-[#1E2B58]/40 dark:text-white/30 uppercase tracking-widest italic">
                        Select a technician to complete approval and start maintenance.
                    </p>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default TechnicianAssignmentModal;
