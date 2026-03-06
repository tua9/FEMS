import React, { useState } from 'react';
import { createPortal } from 'react-dom';

interface NewBorrowModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const NewBorrowModal: React.FC<NewBorrowModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

            <div className="relative w-full max-w-2xl hover:transform-none hover:shadow-2xl dark:!bg-slate-800/70 rounded-[32px] border border-white/50 dark:border-white/10 shadow-2xl bg-white/70 backdrop-blur-xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200/50 dark:border-slate-700/50">
                    <div>
                        <h3 className="text-xl font-extrabold text-[#1A2B56] dark:text-white">Create Direct Allocation</h3>
                        <p className="text-xs text-slate-500 font-semibold mt-1">Manually assign equipment to user without request.</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
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
                <div className="p-6 border-t border-slate-200/50 dark:border-slate-700/50 flex items-center justify-end gap-3 bg-slate-50/50 dark:bg-slate-800/50">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-xl font-bold text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                        Cancel
                    </button>
                    <button className="px-8 py-2.5 rounded-xl font-bold text-sm bg-[#1A2B56] hover:bg-[#2A3B66] text-white shadow-lg transition-colors flex items-center gap-2">
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
