import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { AdminUser } from '../../../types/admin.types';

interface TechnicianAssignmentModalProps {
    isOpen: boolean;
    technicians: AdminUser[];
    onClose: () => void;
    onAssign: (technician: AdminUser) => void;
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

    const filteredTechnicians = technicians.filter(tech =>
        tech.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tech.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative w-full max-w-lg bg-white/95 dark:bg-slate-800/95 backdrop-blur-2xl rounded-[40px] border-2 border-white/50 dark:border-white/10 shadow-3xl overflow-hidden flex flex-col max-h-[80vh] animate-in fade-in zoom-in duration-300">

                {/* Header */}
                <div className="p-8 pb-4 relative">
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-full transition-colors text-slate-400"
                    >
                        <span className="material-symbols-outlined text-lg">close</span>
                    </button>

                    <h3 className="text-2xl font-black text-[#1A2B56] dark:text-white tracking-tight">Assign Technician</h3>
                    <p className="text-slate-500 dark:text-slate-400 font-bold text-xs mt-1 uppercase tracking-widest">
                        For: {equipmentName}
                    </p>

                    {/* Search Bar */}
                    <div className="mt-6 relative group">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-slate-100/50 dark:bg-slate-900/30 border-2 border-transparent focus:border-blue-500/20 rounded-[20px] outline-none text-sm font-medium transition-all dark:text-white dark:placeholder:text-slate-500"
                        />
                    </div>
                </div>

                {/* Technicians List */}
                <div className="flex-1 overflow-y-auto p-4 pt-0 space-y-2 no-scrollbar">
                    {filteredTechnicians.length > 0 ? (
                        filteredTechnicians.map((tech) => (
                            <button
                                key={tech.id}
                                onClick={() => onAssign(tech)}
                                className="w-full flex items-center justify-between p-4 rounded-3xl hover:bg-blue-50/50 dark:hover:bg-blue-900/10 border-2 border-transparent hover:border-blue-100/50 dark:hover:border-blue-800/20 transition-all group"
                            >
                                <div className="flex items-center gap-4">
                                    {tech.avatar ? (
                                        <img src={tech.avatar} alt={tech.name} className="w-12 h-12 rounded-2xl object-cover border-2 border-white dark:border-slate-700 shadow-sm" />
                                    ) : (
                                        <div className="w-12 h-12 rounded-2xl bg-[#1A2B56] text-white flex items-center justify-center font-bold text-lg">
                                            {tech.name.charAt(0)}
                                        </div>
                                    )}
                                    <div className="text-left">
                                        <p className="font-black text-slate-800 dark:text-white leading-tight transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">{tech.name}</p>
                                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-1 uppercase tracking-widest">{tech.email}</p>
                                    </div>
                                </div>
                                <div className={`px-4 py-1.5 rounded-xl border-2 text-[10px] font-black uppercase tracking-widest shadow-sm ${getWorkloadStyle(tech.assignedTasks)}`}>
                                    <div className="flex flex-col items-center">
                                        <span>{getWorkloadText(tech.assignedTasks)}</span>
                                        <span className="opacity-70 mt-0.5">{tech.assignedTasks || 0} tasks</span>
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
                <div className="p-6 border-t border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-900/30 text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">
                        Select a technician to complete approval and start maintenance.
                    </p>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default TechnicianAssignmentModal;
