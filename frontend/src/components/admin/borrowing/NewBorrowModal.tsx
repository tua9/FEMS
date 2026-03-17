import React, { useState } from 'react';
import { createPortal } from 'react-dom';

interface NewBorrowModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const NewBorrowModal: React.FC<NewBorrowModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6 bg-black/30 backdrop-blur-sm">
            <div className="absolute inset-0" onClick={onClose}></div>

            <div className="relative w-full max-w-2xl dashboard-card rounded-4xl shadow-2xl shadow-[#1E2B58]/20 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex items-center justify-between px-8 py-6 border-b border-black/8 dark:border-white/10">
                    <div>
                        <p className="text-[0.625rem] font-black uppercase tracking-widest text-[#1E2B58]/50 dark:text-white/40 mb-0.5">Direct Allocation</p>
                        <h3 className="text-xl font-extrabold text-[#1E2B58] dark:text-white">Create Direct Allocation</h3>
                        <p className="text-xs text-slate-400 font-medium mt-0.5">Manually assign equipment to user without request.</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-[#1E2B58]/50 hover:text-[#1E2B58] hover:bg-[#1E2B58]/8 dark:text-white/50 dark:hover:text-white dark:hover:bg-white/10 transition-colors"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto custom-scrollbar">
                    <form className="space-y-6">
                        {/* Assignment Target */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-extrabold text-[#1A2B56] dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">User Details</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">Search User <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-4 top-3 text-slate-400">search</span>
                                        <input
                                            type="text"
                                            className="w-full pl-12 pr-4 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl py-3 text-sm focus:ring-2 focus:ring-[#1A2B56] dark:focus:ring-blue-500 outline-none transition-all dark:text-white"
                                            placeholder="Name, Email or ID"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">User Role</label>
                                    <input
                                        type="text"
                                        disabled
                                        className="w-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-500 outline-none"
                                        placeholder="Auto-filled"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Equipment Details */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-extrabold text-[#1A2B56] dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">Equipment Details</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">Search Equipment <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-4 top-3 text-slate-400">devices</span>
                                        <input
                                            type="text"
                                            className="w-full pl-12 pr-4 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl py-3 text-sm focus:ring-2 focus:ring-[#1A2B56] dark:focus:ring-blue-500 outline-none transition-all dark:text-white"
                                            placeholder="Scan barcode or type ID"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">Current Status</label>
                                    <input
                                        type="text"
                                        disabled
                                        className="w-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-500 outline-none"
                                        placeholder="Auto-filled"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Schedule */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-extrabold text-[#1A2B56] dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">Schedule & Terms</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">Start Date <span className="text-red-500">*</span></label>
                                    <input
                                        type="date"
                                        className="w-full bg-white/30 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#1A2B56] dark:focus:ring-blue-500 outline-none transition-all dark:text-white backdrop-blur-sm"
                                        defaultValue="2024-10-24"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">Expected Return Date <span className="text-red-500">*</span></label>
                                    <input
                                        type="date"
                                        className="w-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#1A2B56] dark:focus:ring-blue-500 outline-none transition-all dark:text-white"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">Notes / Purpose</label>
                                <textarea
                                    className="w-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#1A2B56] dark:focus:ring-blue-500 outline-none transition-all dark:text-white min-h-[80px] resize-y"
                                    placeholder="Purpose of allocation..."
                                ></textarea>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="px-8 py-5 border-t border-black/8 dark:border-white/10 flex items-center justify-end gap-3 bg-black/3 dark:bg-white/3">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 rounded-[1.25rem] font-bold text-sm border border-[#1E2B58]/15 dark:border-white/15 text-[#1E2B58]/70 dark:text-white/70 hover:bg-[#1E2B58]/5 dark:hover:bg-white/5 transition-all"
                    >
                        Cancel
                    </button>
                    <button className="px-8 py-3 rounded-[1.25rem] font-bold text-sm bg-[#1E2B58] hover:bg-[#151f40] hover:scale-[1.02] active:scale-95 text-white shadow-lg shadow-[#1E2B58]/20 transition-all flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">check_circle</span>
                        Allocate Equipment
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default NewBorrowModal;
