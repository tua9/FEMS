import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { User } from '../../../types/admin.types';
import { adminApi } from '../../../services/api/adminApi';

interface UserDetailModalProps {
    isOpen: boolean;
    user: User | null;
    onClose: () => void;
    onEdit?: (user: User) => void;
    onUpdate?: () => void;
}

const UserDetailModal: React.FC<UserDetailModalProps> = ({ isOpen, user, onClose, onEdit, onUpdate }) => {
    const [status, setStatus] = useState<string>(user?.status || 'Active');
    const [isResetting, setIsResetting] = useState(false);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

    useEffect(() => {
        if (user) {
            setStatus(user.status);
        }
    }, [user, isOpen]);

    if (!isOpen || !user) return null;

    const handleResetPassword = async () => {
        if (!window.confirm(`Are you sure you want to reset the password for ${user.name}?`)) return;

        setIsResetting(true);
        try {
            await adminApi.resetPassword(user.id);
            alert(`A password reset link has been sent to ${user.email}`);
        } catch (error) {
            console.error("Reset password failed", error);
            alert("Failed to reset password. Please try again.");
        } finally {
            setIsResetting(false);
        }
    };

    const handleToggleStatus = async () => {
        const newStatus = status === 'Active' ? 'Inactive' : 'Active';
        const action = status === 'Active' ? 'deactivate' : 'activate';

        if (!window.confirm(`Are you sure you want to ${action} user ${user.name}?`)) return;

        setIsUpdatingStatus(true);
        try {
            await adminApi.updateUserStatus(user.id, newStatus);
            setStatus(newStatus);
            if (onUpdate) onUpdate();
        } catch (error) {
            console.error("Status update failed", error);
            alert(`Failed to ${action} user. Please try again.`);
        } finally {
            setIsUpdatingStatus(false);
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative w-full max-w-3xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-[40px] border border-white/50 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header Profile Section */}
                <div className="relative h-32 bg-[#1A2B56]">
                    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] rounded-t-[40px]"></div>
                    <div className="absolute -bottom-12 left-10 flex items-end gap-6 z-10">
                        <div className="relative">
                            {user.avatar ? (
                                <img src={user.avatar} alt={user.name} className="w-28 h-28 rounded-3xl border-4 border-white dark:border-slate-800 object-cover shadow-2xl" />
                            ) : (
                                <div className="w-28 h-28 rounded-3xl border-4 border-white dark:border-slate-800 bg-blue-100 text-[#1A2B56] flex items-center justify-center text-4xl font-black shadow-xl">
                                    {user.name.charAt(0)}
                                </div>
                            )}
                            <div className="absolute bottom-2 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-4 border-white dark:border-slate-800 shadow-sm"></div>
                        </div>
                        <div className="mb-4">
                            <h3 className="text-4xl font-black text-white tracking-tight drop-shadow-md -translate-y-7">{user.name}</h3>
                            <p className="text-[#1A2B56]/60 dark:text-blue-200/60 text-[10px] font-black uppercase tracking-[0.2em]">{user.role} • {user.id}</p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-10 pt-16 overflow-y-auto no-scrollbar grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* Left Column: Basic Info */}
                    <div className="md:col-span-2 space-y-8">
                        <div>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 ml-1">Account Overview</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-2xl bg-white/50 dark:bg-slate-900/40 border border-white dark:border-slate-700">
                                    <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Email Address</p>
                                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{user.email}</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-white/50 dark:bg-slate-900/40 border border-white dark:border-slate-700">
                                    <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Account Status</p>
                                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase ${status === 'Active' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
                                        }`}>
                                        {status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 ml-1">Recent Activity</h4>
                            <div className="space-y-3">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-900/20 border border-slate-100 dark:border-slate-800">
                                        <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-[#1A2B56] dark:text-blue-400 shadow-sm border border-slate-100 dark:border-slate-700">
                                            <span className="material-symbols-outlined text-lg">history</span>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Logged in from Safari Workspace</p>
                                            <p className="text-[10px] text-slate-400 font-medium">May 24, 2026 • 10:24 AM</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Actions */}
                    <div className="space-y-6">
                        <div className="p-6 rounded-3xl bg-[#1A2B56]/5 dark:bg-blue-400/5 border border-[#1A2B56]/10 dark:border-blue-400/10">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1A2B56] dark:text-blue-400 mb-4">Quick Actions</h4>
                            <div className="space-y-3">
                                <button
                                    onClick={() => onEdit && onEdit(user)}
                                    className="w-full flex items-center gap-3 p-3 rounded-2xl bg-[#1A2B56] text-white font-bold text-xs hover:opacity-90 transition-all shadow-lg shadow-blue-900/20"
                                >
                                    <span className="material-symbols-outlined text-lg">edit</span>
                                    Edit Profile
                                </button>
                                <button
                                    onClick={handleResetPassword}
                                    disabled={isResetting}
                                    className={`w-full flex items-center gap-3 p-3 rounded-2xl bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs border border-slate-200 dark:border-slate-600 hover:bg-slate-50 transition-all shadow-sm ${isResetting ? 'animate-pulse' : ''}`}
                                >
                                    <span className="material-symbols-outlined text-lg">{isResetting ? 'hourglass_top' : 'key'}</span>
                                    {isResetting ? 'Resetting...' : 'Reset Password'}
                                </button>
                                <button
                                    onClick={handleToggleStatus}
                                    disabled={isUpdatingStatus}
                                    className={`w-full flex items-center gap-3 p-3 rounded-2xl bg-white dark:bg-slate-700 font-bold text-xs border transition-all shadow-sm ${status === 'Active'
                                        ? 'text-red-500 border-red-100 dark:border-red-900/30 hover:bg-red-50 shadow-red-900/5'
                                        : 'text-emerald-600 border-emerald-100 dark:border-emerald-900/30 hover:bg-emerald-50 shadow-emerald-900/5'
                                        } ${isUpdatingStatus ? 'animate-pulse' : ''}`}
                                >
                                    <span className="material-symbols-outlined text-lg">
                                        {isUpdatingStatus ? 'hourglass_top' : (status === 'Active' ? 'person_off' : 'check_circle')}
                                    </span>
                                    {isUpdatingStatus ? 'Processing...' : (status === 'Active' ? 'Deactivate account' : 'Activate account')}
                                </button>
                            </div>
                        </div>

                        <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-700 border-dashed text-center">
                            <p className="text-[10px] text-slate-400 font-bold uppercase mb-2">Registration Date</p>
                            <p className="text-xs font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest">January 12, 2025</p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-8 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-end bg-slate-50/50 dark:bg-slate-900/30">
                    <button
                        onClick={onClose}
                        className="px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest text-[#1A2B56] dark:text-blue-400 hover:bg-white transition-all shadow-sm"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default UserDetailModal;
