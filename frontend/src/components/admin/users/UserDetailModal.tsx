import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { User } from '../../../types/user';
import { useUserStore } from '../../../stores/useUserStore';
import { toast } from 'sonner';

interface UserDetailModalProps {
    isOpen: boolean;
    user: User | null;
    onClose: () => void;
    onEdit?: (user: User) => void;
    onUpdate?: () => void;
}

const UserDetailModal: React.FC<UserDetailModalProps> = ({ isOpen, user, onClose, onEdit, onUpdate }) => {
    const [status, setStatus] = useState<string>(user?.isActive !== false ? 'Active' : 'Inactive');
    const [isResetting, setIsResetting] = useState(false);
    
    const updateUser = useUserStore(state => state.updateUser);
    const isUpdatingStatus = useUserStore(state => state.loading);

    useEffect(() => {
        if (user) {
            setStatus(user.isActive !== false ? 'Active' : 'Inactive');
        }
    }, [user, isOpen]);

    if (!isOpen || !user) return null;

    const handleResetPassword = async () => {
        setIsResetting(true);
        try {
            // Mocking reset password logic
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success(`A password reset link has been sent to ${user.email}`);
        } catch (error) {
            toast.error("Failed to reset password. Please try again.");
        } finally {
            setIsResetting(false);
        }
    };

    const handleToggleStatus = async () => {
        const actionLabel = status === 'Active' ? 'deactivated' : 'activated';

        try {
            const newIsActive = status !== 'Active';
            // We can now use isActive field directly
            await updateUser(user._id, { isActive: newIsActive } as any);
            setStatus(newIsActive ? 'Active' : 'Inactive');
            toast.success(`User ${user.displayName} has been ${actionLabel}`);
            if (onUpdate) onUpdate();
        } catch (error) {
            toast.error(`Failed to update user status.`);
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6 bg-black/30 backdrop-blur-sm">
            <style dangerouslySetInnerHTML={{
                __html: `
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            ` }} />
            {/* Backdrop */}
            <div
                className="absolute inset-0"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative w-full max-w-2xl dashboard-card rounded-4xl shadow-2xl shadow-[#1E2B58]/20 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">

                {/* Header Section */}
                <div className="px-10 pt-8 pb-6 relative border-b border-black/8 dark:border-white/10">
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-8 w-8 h-8 flex items-center justify-center text-[#1E2B58]/50 hover:text-[#1E2B58] hover:bg-[#1E2B58]/8 dark:text-white/50 dark:hover:text-white dark:hover:bg-white/10 rounded-full transition-colors z-20"
                    >
                        <span className="material-symbols-outlined text-xl">close</span>
                    </button>

                    <div className="flex items-center gap-4 mb-3">
                        <span className={`px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 shadow-sm ${status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:border-emerald-900/20' : 'bg-red-50 text-red-600 border-red-100 dark:border-red-900/20'}`}>
                            {status}
                        </span>
                        <span className="px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 border-indigo-100 dark:border-indigo-900/30 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 shadow-sm">
                            {user.role}
                        </span>
                    </div>

                    <h3 className="text-2xl font-black text-[#1E2B58] dark:text-white tracking-tight uppercase">{user.displayName}</h3>
                    <p className="text-[0.625rem] font-black text-[#1E2B58]/50 dark:text-white/40 uppercase tracking-widest mt-1">User ID: {user._id}</p>
                </div>

                <div className="p-10 pt-0 overflow-y-auto no-scrollbar space-y-8 relative z-10 mt-6">
                    {/* Profile Header Card */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-6 rounded-3xl bg-white/40 dark:bg-slate-900/30 border-2 border-white dark:border-slate-700 shadow-sm flex flex-col items-center justify-center text-center">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Profile Identity</h4>
                            <div className="relative group mb-4">
                                {user.avatarUrl ? (
                                    <img src={user.avatarUrl} alt={user.displayName} className="w-24 h-24 rounded-3xl border-4 border-white dark:border-slate-800 object-cover shadow-2xl transition-transform duration-500 group-hover:scale-105" />
                                ) : (
                                    <div className="w-24 h-24 rounded-3xl border-4 border-white dark:border-slate-800 bg-blue-100 dark:bg-blue-900/40 text-[#1A2B56] dark:text-blue-400 flex items-center justify-center text-3xl font-black shadow-xl">
                                        {user.displayName?.charAt(0) || user.username?.charAt(0)}
                                    </div>
                                )}
                                <div className={`absolute bottom-1 right-1 w-5 h-5 rounded-full border-4 border-white dark:border-slate-800 shadow-sm animate-pulse ${status === 'Active' ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                            </div>
                            <p className="font-black text-slate-800 dark:text-white leading-tight">{user.username}</p>
                            <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mt-1 uppercase">Official Nickname</p>
                        </div>

                        <div className="flex flex-col gap-4">
                            <div className="p-6 rounded-3xl bg-white/40 dark:bg-slate-900/30 border-2 border-white dark:border-slate-700 shadow-sm grow flex flex-col justify-center">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Primary Email</h4>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-500 flex items-center justify-center border-2 border-blue-100 dark:border-blue-900/30">
                                        <span className="material-symbols-outlined text-xl">mail</span>
                                    </div>
                                    <p className="font-black text-slate-800 dark:text-white leading-tight truncate">{user.email}</p>
                                </div>
                            </div>
                            <div className="p-6 rounded-3xl bg-white/40 dark:bg-slate-900/30 border-2 border-white dark:border-slate-700 shadow-sm grow flex flex-col justify-center">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Member Since</h4>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 flex items-center justify-center border-2 border-emerald-100 dark:border-emerald-900/30">
                                        <span className="material-symbols-outlined text-xl">verified</span>
                                    </div>
                                    <p className="font-black text-slate-800 dark:text-white leading-tight">January 12, 2025</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Activity Timeline */}
                    <div>
                        <h4 className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-400 mb-6 flex items-center gap-3">
                            <span className="w-8 h-0.5 bg-slate-200 dark:bg-slate-700"></span>
                            Recent Security Logs
                        </h4>
                        <div className="space-y-4">
                            {[1, 2].map(i => (
                                <div key={i} className="flex items-center gap-4 p-5 rounded-3xl bg-slate-50/50 dark:bg-slate-900/20 border-2 border-slate-200 dark:border-slate-800 transition-all hover:bg-white dark:hover:bg-slate-900/40">
                                    <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center text-[#1A2B56] dark:text-blue-400 shadow-sm border-2 border-slate-200 dark:border-slate-700">
                                        <span className="material-symbols-outlined text-[20px]">history</span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-black text-slate-800 dark:text-white leading-tight">Authenticated from Secure Terminal</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mt-1">May 24, 2026 • 10:24 AM</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer Section */}
                <div className="px-8 py-5 border-t border-black/8 dark:border-white/10 bg-black/3 dark:bg-white/3 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex gap-3">
                        {onEdit && (
                            <button
                                onClick={() => onEdit(user)}
                                className="px-6 py-2.5 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 text-[#1E2B58] dark:text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-sm hover:shadow-md hover:bg-slate-50 dark:hover:bg-slate-700/80 flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined text-lg">edit_note</span>
                                Edit Profile
                            </button>
                        )}
                        <button
                            onClick={handleResetPassword}
                            disabled={isResetting}
                            className={`px-6 py-2.5 bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-sm hover:bg-slate-200 flex items-center gap-2 ${isResetting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <span className="material-symbols-outlined text-lg">{isResetting ? 'hourglass_top' : 'lock_reset'}</span>
                            {isResetting ? 'Processing' : 'Reset Pass'}
                        </button>
                        <button
                            onClick={handleToggleStatus}
                            disabled={isUpdatingStatus}
                            className={`px-6 py-2.5 border-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-sm flex items-center gap-2 ${status === 'Active'
                                ? 'bg-red-50 text-red-600 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30'
                                : 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/30'
                                } ${isUpdatingStatus ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <span className="material-symbols-outlined text-lg">{isUpdatingStatus ? 'hourglass_top' : (status === 'Active' ? 'person_off' : 'verified_user')}</span>
                            {isUpdatingStatus ? 'Updating' : (status === 'Active' ? 'Deactivate' : 'Activate')}
                        </button>
                    </div>
                    <button
                        onClick={onClose}
                        className="px-6 py-3 bg-[#1A2B56] hover:bg-[#2A3B66] text-white rounded-xl font-black text-xs uppercase tracking-[0.15em] transition-all shadow-lg shadow-blue-900/20"
                    >
                        Dismiss View
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default UserDetailModal;
