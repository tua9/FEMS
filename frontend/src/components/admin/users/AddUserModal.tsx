import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { User } from '../../../types/user';
import { useUserStore } from '../../../stores/useUserStore';

interface AddUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    user?: User | null;
    onUserUpdated?: () => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose, user, onUserUpdated }) => {
    const isEdit = !!user;
    const [username, setUsername] = useState(user?.username || '');
    const [name, setName] = useState(user?.displayName || '');
    const [email, setEmail] = useState(user?.email || '');
    const [role, setRole] = useState(user?.role || 'student');
    const [password] = useState('');

    const createUser = useUserStore(state => state.createUser);
    const updateUser = useUserStore(state => state.updateUser);
    const isSubmitting = useUserStore(state => state.loading);

    useEffect(() => {
        if (user) {
            setUsername(user.username);
            setName(user.displayName);
            setEmail(user.email);
            setRole(user.role);
        } else {
            setUsername('');
            setName('');
            setEmail('');
            setRole('student');
        }
    }, [user, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const userData = {
            username,
            displayName: name,
            email,
            role: role as any,
            ...(password ? { password } : {})
        };

        try {
            if (isEdit && user) {
                await updateUser(user._id, userData);
            } else {
                await createUser(userData as any);
            }
            if (onUserUpdated) onUserUpdated();
            onClose();
        } catch (error) {
            console.error("Failed to save user", error);
        }
    };

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6 bg-black/30 backdrop-blur-sm">
            <div className="absolute inset-0" onClick={onClose}></div>

            <div className="relative w-full max-w-2xl dashboard-card rounded-4xl shadow-2xl shadow-[#1E2B58]/20 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex items-center justify-between px-8 py-6 border-b border-black/8 dark:border-white/10">
                    <div>
                        <p className="text-[0.625rem] font-black uppercase tracking-widest text-[#1E2B58]/50 dark:text-white/40 mb-0.5">
                            {isEdit ? 'Edit Record' : 'New User'}
                        </p>
                        <h3 className="text-xl font-extrabold text-[#1E2B58] dark:text-white">
                            {isEdit ? 'Edit User Profile' : 'Add New User'}
                        </h3>
                        <p className="text-xs text-slate-400 font-medium mt-0.5">
                            {isEdit ? 'Update account information and permissions.' : 'Create a new account and assign roles.'}
                        </p>
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
                    <form id="userForm" onSubmit={handleSubmit} className="space-y-5">
                        {/* Username */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">Username <span className="text-red-500">*</span></label>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <span className="material-symbols-outlined absolute left-4 top-3 text-slate-400 text-[18px]">badge</span>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={e => setUsername(e.target.value)}
                                        readOnly={isEdit}
                                        className={`w-full pl-11 pr-4 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl py-3 text-sm font-bold text-[#1A2B56] dark:text-blue-300 focus:ring-2 focus:ring-[#1A2B56] dark:focus:ring-blue-500 outline-none transition-all tracking-wider ${isEdit ? 'opacity-60 cursor-not-allowed' : ''}`}
                                        placeholder="Username"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">Full Name <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className="w-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#1A2B56] dark:focus:ring-blue-500 outline-none transition-all dark:text-white"
                                    placeholder="e.g. John Doe"
                                    required
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">Email <span className="text-red-500">*</span></label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="w-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#1A2B56] dark:focus:ring-blue-500 outline-none transition-all dark:text-white"
                                    placeholder="john.doe@university.edu"
                                    required
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">Role <span className="text-red-500">*</span></label>
                                <select
                                    value={role}
                                    onChange={e => setRole(e.target.value as any)}
                                    className="w-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#1A2B56] dark:focus:ring-blue-500 outline-none transition-all dark:text-white appearance-none"
                                >
                                    <option value="Student">Student</option>
                                    <option value="Lecturer">Lecturer</option>
                                    <option value="Technician">Technician</option>
                                    <option value="Manager">Manager</option>
                                    <option value="Super Admin">Super Admin</option>
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
                                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{isEdit ? 'Change Avatar' : 'Upload Avatar'}</p>
                                <p className="text-[10px] text-slate-500 mt-1">PNG, JPG (Square, max 500kb)</p>
                            </div>
                        </div>

                        {!isEdit && (
                            <div className="flex items-center gap-3 pt-2">
                                <input type="checkbox" id="sendEmail" className="w-4 h-4 rounded text-[#1A2B56] focus:ring-[#1A2B56] dark:bg-slate-800 dark:border-slate-600" defaultChecked />
                                <label htmlFor="sendEmail" className="text-sm text-slate-600 dark:text-slate-400 font-semibold cursor-pointer">
                                    Send welcome email with login instructions
                                </label>
                            </div>
                        )}
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
                    <button
                        type="submit"
                        form="userForm"
                        disabled={isSubmitting}
                        className={`px-8 py-3 rounded-[1.25rem] font-bold text-sm bg-[#1E2B58] hover:bg-[#151f40] hover:scale-[1.02] active:scale-95 text-white shadow-lg shadow-[#1E2B58]/20 transition-all flex items-center gap-2 ${isSubmitting ? 'animate-pulse' : ''}`}
                    >
                        <span className="material-symbols-outlined text-sm">{isSubmitting ? 'hourglass_top' : (isEdit ? 'save' : 'person_add')}</span>
                        {isSubmitting ? 'Saving...' : (isEdit ? 'Update User' : 'Create User')}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default AddUserModal;
