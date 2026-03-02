import React, { useState } from 'react';
import { createPortal } from 'react-dom';

interface AddUserModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const generateUserId = () => `USER-${Math.floor(1000 + Math.random() * 9000)}`;

const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose }) => {
    const [userId, setUserId] = useState(generateUserId());
    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

            <div className="relative w-full max-w-2xl hover:transform-none dark:!bg-slate-800/70 rounded-[32px] border border-white/50 dark:border-white/10 shadow-2xl bg-white/70 backdrop-blur-xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200/50 dark:border-slate-700/50">
                    <div>
                        <h3 className="text-xl font-extrabold text-[#1A2B56] dark:text-white">Add New User</h3>
                        <p className="text-xs text-slate-500 font-semibold mt-1">Create a new account and assign roles.</p>
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
                    <form className="space-y-5">
                        {/* User ID */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">User ID <span className="text-red-500">*</span></label>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <span className="material-symbols-outlined absolute left-4 top-3 text-slate-400 text-[18px]">badge</span>
                                    <input
                                        type="text"
                                        value={userId}
                                        onChange={e => setUserId(e.target.value)}
                                        className="w-full pl-11 pr-4 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl py-3 text-sm font-bold text-[#1A2B56] dark:text-blue-300 focus:ring-2 focus:ring-[#1A2B56] dark:focus:ring-blue-500 outline-none transition-all tracking-wider"
                                        placeholder="USER-0000"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setUserId(generateUserId())}
                                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 text-xs font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap"
                                >
                                    <span className="material-symbols-outlined text-[16px]">autorenew</span>
                                    Auto
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">Full Name <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    className="w-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#1A2B56] dark:focus:ring-blue-500 outline-none transition-all dark:text-white"
                                    placeholder="e.g. John Doe"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">Email <span className="text-red-500">*</span></label>
                                <input
                                    type="email"
                                    className="w-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#1A2B56] dark:focus:ring-blue-500 outline-none transition-all dark:text-white"
                                    placeholder="john.doe@university.edu"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">Role <span className="text-red-500">*</span></label>
                                <select className="w-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#1A2B56] dark:focus:ring-blue-500 outline-none transition-all dark:text-white appearance-none">
                                    <option value="">Select Role</option>
                                    <option value="Student">Student</option>
                                    <option value="Lecturer">Lecturer</option>
                                    <option value="Technician">Technician</option>
                                    <option value="Manager">Manager</option>
                                    <option value="Admin">Super Admin</option>
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">Department</label>
                                <input
                                    type="text"
                                    className="w-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#1A2B56] dark:focus:ring-blue-500 outline-none transition-all dark:text-white"
                                    placeholder="e.g. Computer Science"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5 pt-2">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">Profile Image</label>
                            <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-2xl p-6 flex flex-col items-center justify-center text-center bg-white/30 dark:bg-slate-900/30 hover:bg-white/60 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group">
                                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-500 dark:text-blue-400 rounded-full mb-3 group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined">cloud_upload</span>
                                </div>
                                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Upload Avatar</p>
                                <p className="text-[10px] text-slate-500 mt-1">PNG, JPG (Square, max 500kb)</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                            <input type="checkbox" id="sendEmail" className="w-4 h-4 rounded text-[#1A2B56] focus:ring-[#1A2B56] dark:bg-slate-800 dark:border-slate-600" defaultChecked />
                            <label htmlFor="sendEmail" className="text-sm text-slate-600 dark:text-slate-400 font-semibold cursor-pointer">
                                Send welcome email with login instructions
                            </label>
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
                        <span className="material-symbols-outlined text-sm">person_add</span>
                        Create User
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default AddUserModal;
