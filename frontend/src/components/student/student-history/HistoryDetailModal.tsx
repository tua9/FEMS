import React from 'react';

interface HistoryDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const HistoryDetailModal: React.FC<HistoryDetailModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                onClick={onClose}
            />

            <div className="relative w-full max-w-2xl glass-main rounded-[2.5rem] overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="flex items-center justify-between px-10 py-8 border-b border-white/20">
                    <h2 className="text-xl font-extrabold text-navy-deep dark:text-white">
                        Transaction Details
                    </h2>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/40 text-slate-500"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="px-10 py-8 space-y-8">
                    <div className="flex items-center gap-6">
                        <div className="w-32 h-32 bg-white/60 dark:bg-slate-700 rounded-3xl flex items-center justify-center p-4 shadow-sm border border-white/40 overflow-hidden">
                            <img
                                src="https://picsum.photos/seed/lap/200/200"
                                alt="MacBook"
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <div>
                            <h3 className="text-2xl font-extrabold text-navy-deep dark:text-white mb-1">
                                MacBook Pro M1
                            </h3>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">
                                Device ID: FPT-LAP-082
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-y-8 gap-x-12">
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                                Transaction ID
                            </p>
                            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                                #TRX-99201-B
                            </p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                                Borrowing Period
                            </p>
                            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                                12 Oct - 19 Oct 2024
                            </p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                                Student Name
                            </p>
                            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                                Nguyen Van A
                            </p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                                Purpose
                            </p>
                            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                                Software Engineering Workshop
                            </p>
                        </div>
                    </div>

                    <div className="bg-white/30 dark:bg-white/5 rounded-3xl p-6 flex flex-wrap items-center gap-10">
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                                Current Status
                            </p>
                            <span className="bg-emerald-100/80 text-emerald-700 text-[10px] font-extrabold px-5 py-2 rounded-full uppercase tracking-widest border border-emerald-200/50">
                                Returned
                            </span>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                                Return Condition
                            </p>
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-emerald-500 text-lg">
                                    check_circle
                                </span>
                                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Excellent</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-10 pb-10 pt-2 flex gap-4">
                    <button className="w-full btn-navy-gradient text-white py-4 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg">
                        <span className="material-symbols-outlined text-lg">download</span>
                        Download Receipt
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HistoryDetailModal;