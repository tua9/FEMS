import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AdminUser } from '../../../types/admin.types';
import { adminApi } from '../../../services/api/adminApi';

interface UserDetailModalProps {
    isOpen: boolean;
    AdminUser: AdminUser | null;
    onClose: () => void;
    onEdit?: (AdminUser: AdminUser) => void;
    onUpdate?: () => void;
}

const UserDetailModal: React.FC<UserDetailModalProps> = ({ isOpen, AdminUser, onClose, onEdit, onUpdate }) => {
    const [status, setStatus] = useState<string>(AdminUser?.status || 'Active');
    const [isResetting, setIsResetting] = useState(false);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

    useEffect(() => {
        if (AdminUser) {
            setStatus(AdminUser.status);
        }
    }, [AdminUser, isOpen]);

    if (!isOpen || !AdminUser) return null;

    const handleResetPassword = async () => {
        if (!window.confirm(`Are you sure you want to reset the password for ${AdminUser.name}?`)) return;

        setIsResetting(true);
        try {
            await adminApi.resetPassword(AdminUser.id);
            alert(`A password reset link has been sent to ${AdminUser.email}`);
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

        if (!window.confirm(`Are you sure you want to ${action} AdminUser ${AdminUser.name}?`)) return;

        setIsUpdatingStatus(true);
        try {
            await adminApi.updateUserStatus(AdminUser.id, newStatus);
            setStatus(newStatus);
            if (onUpdate) onUpdate();
        } catch (error) {
            console.error("Status update failed", error);
            alert(`Failed to ${action} AdminUser. Please try again.`);
        } finally {
            setIsUpdatingStatus(false);
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
            <div className="relative w-full max-w-3xl glass-card rounded-[2rem] shadow-2xl shadow-[#1E2B58]/20 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">

                {/* Header Profile Section with Blended background */}
                <div className="relative min-h-[220px] overflow-hidden">
                    {/* Background Glow/Pattern */}
                    <div className="absolute inset-0 bg-[#1A2B56] opacity-10 blur-3xl scale-150"></div>
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>

                    {/* Soft blending gradient */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 dark:via-slate-800/50 to-white/95 dark:to-slate-800/95"></div>

                    <button
                        onClick={onClose}
                        className="absolute top-8 right-8 w-11 h-11 flex items-center justify-center bg-white/20 hover:bg-white/40 text-slate-700 dark:text-white rounded-full backdrop-blur-xl transition-all z-20 border-2 border-white/30"
                    >
                        <span className="material-symbols-outlined text-xl">close</span>
                    </button>

                    <div className="relative pt-16 pb-8 px-12 flex items-center gap-8 z-10">
                        <div className="relative group">
                            {AdminUser.avatar ? (
                                <img src={AdminUser.avatar} alt={AdminUser.name} className="w-28 h-28 rounded-3xl border-4 border-white dark:border-slate-800 object-cover shadow-2xl transition-transform duration-500 group-hover:scale-105" />
                            ) : (
                                <div className="w-28 h-28 rounded-3xl border-4 border-white dark:border-slate-800 bg-blue-100 dark:bg-blue-900/40 text-[#1A2B56] dark:text-blue-400 flex items-center justify-center text-4xl font-black shadow-xl">
                                    {AdminUser.name.charAt(0)}
                                </div>
                            )}
                            <div className="absolute bottom-2 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-4 border-white dark:border-slate-800 shadow-sm animate-pulse"></div>
                        </div>
                        <div>
                            <h3 className="text-4xl font-black text-[#1A2B56] dark:text-white tracking-tight mb-2 uppercase">{AdminUser.name}</h3>
                            <div className="flex items-center gap-3">
                                <span className="px-4 py-1.5 rounded-2xl bg-[#1A2B56] dark:bg-blue-900/40 text-white dark:text-blue-400 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-900/20 border border-transparent">
                                    {AdminUser.role}
                                </span>
                                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">ID: {AdminUser.id}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="px-12 pb-12 overflow-y-auto no-scrollbar grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10">

                    {/* Left Column: Basic Info */}
                    <div className="md:col-span-2 space-y-10">
                        <div>
                            <h4 className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-400 mb-6 flex items-center gap-3">
                                <span className="w-8 h-0.5 bg-slate-200 dark:bg-slate-700"></span>
                                Account Overview
                            </h4>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="p-6 rounded-3xl bg-white/40 dark:bg-slate-900/30 border-2 border-white dark:border-slate-700 shadow-sm group hover:border-blue-100 dark:hover:border-blue-900/30 transition-colors">
                                    <div className="flex items-center gap-2 mb-2 text-slate-400">
                                        <span className="material-symbols-outlined text-sm">mail</span>
                                        <p className="text-[10px] font-bold uppercase">Email Address</p>
                                    </div>
                                    <p className="text-sm font-black text-slate-800 dark:text-slate-200 truncate">{AdminUser.email}</p>
                                </div>
                                <div className="p-6 rounded-3xl bg-white/40 dark:bg-slate-900/30 border-2 border-white dark:border-slate-700 shadow-sm group hover:border-emerald-100 dark:hover:border-emerald-900/30 transition-colors">
                                    <div className="flex items-center gap-2 mb-2 text-slate-400">
                                        <span className="material-symbols-outlined text-sm">settings_account_box</span>
                                        <p className="text-[10px] font-bold uppercase">Account Status</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 shadow-sm ${status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:border-emerald-900/20' : 'bg-red-50 text-red-600 border-red-100 dark:border-red-900/20'
                                        }`}>
                                        {status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-400 mb-6 flex items-center gap-3">
                                <span className="w-8 h-0.5 bg-slate-200 dark:bg-slate-700"></span>
                                Recent Activity
                            </h4>
                            <div className="space-y-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="flex items-center gap-4 p-5 rounded-3xl bg-slate-50/50 dark:bg-slate-900/20 border-2 border-slate-200 dark:border-slate-800 transition-all hover:bg-white dark:hover:bg-slate-900/40">
                                        <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center text-[#1A2B56] dark:text-blue-400 shadow-sm border-2 border-slate-200 dark:border-slate-700">
                                            <span className="material-symbols-outlined text-[20px]">history</span>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-black text-slate-800 dark:text-white leading-tight">Logged in from Safari Workspace</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mt-1">May 24, 2026 • 10:24 AM</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Actions */}
                    <div className="space-y-6">
                        <div className="px-6 py-8 rounded-[40px] bg-[#1A2B56] dark:bg-slate-900 text-white shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                            <h5 className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-200/40 mb-5">Security & Access</h5>
                            <div className="space-y-2.5 relative z-10">
                                <button
                                    onClick={() => onEdit && onEdit(AdminUser)}
                                    className="w-full h-[44px] flex items-center justify-center gap-2.5 bg-white/10 hover:bg-white/20 rounded-[20px] transition-all border-2 border-white/10 font-black text-[9px] uppercase tracking-[0.15em] group/btn shadow-sm whitespace-nowrap"
                                >
                                    <span className="material-symbols-outlined text-[16px] opacity-70 group-hover/btn:opacity-100 transition-opacity">edit_note</span>
                                    <span className="mt-0.5">Edit Profile</span>
                                </button>
                                <button
                                    onClick={handleResetPassword}
                                    disabled={isResetting}
                                    className={`w-full h-[44px] flex items-center justify-center gap-2.5 rounded-[20px] transition-all border-2 border-white/10 font-black text-[9px] uppercase tracking-[0.15em] group/btn shadow-sm whitespace-nowrap ${isResetting ? 'bg-white/5 cursor-wait' : 'bg-white/10 hover:bg-white/20'}`}
                                >
                                    <span className="material-symbols-outlined text-[16px] opacity-70 group-hover/btn:opacity-100 transition-opacity">{isResetting ? 'hourglass_top' : 'lock_reset'}</span>
                                    <span className="mt-0.5">{isResetting ? 'Processing' : 'Reset Password'}</span>
                                </button>
                                <button
                                    onClick={handleToggleStatus}
                                    disabled={isUpdatingStatus}
                                    className={`w-full h-[44px] flex items-center justify-center gap-2.5 rounded-[20px] transition-all border-2 font-black text-[9px] uppercase tracking-[0.15em] shadow-lg group/btn whitespace-nowrap ${status === 'Active'
                                        ? 'bg-red-500/80 hover:bg-red-500 border-white/10 shadow-red-900/20'
                                        : 'bg-emerald-500/80 hover:bg-emerald-500 border-white/10 shadow-emerald-900/20'
                                        } ${isUpdatingStatus ? 'opacity-50 cursor-wait' : ''}`}
                                >
                                    <span className="material-symbols-outlined text-[16px] opacity-90 group-hover/btn:opacity-100 transition-opacity">
                                        {isUpdatingStatus ? 'hourglass_top' : (status === 'Active' ? 'person_off' : 'verified_user')}
                                    </span>
                                    <span className="mt-0.5">{isUpdatingStatus ? 'Updating' : (status === 'Active' ? 'Deactivate' : 'Activate')}</span>
                                </button>
                            </div>
                        </div>

                        <div className="p-8 rounded-[40px] border-2 border-slate-200 dark:border-slate-700 border-dashed text-center">
                            <span className="material-symbols-outlined text-xl text-slate-300 dark:text-slate-600 mb-4 block">verified</span>
                            <p className="text-[10px] text-slate-400 font-black tracking-widest uppercase mb-1">Signed up on</p>
                            <p className="text-sm font-black text-slate-700 dark:text-slate-300 tracking-tight">January 12, 2025</p>
                        </div>
                    </div>
                </div>

                {/* Footer Section */}
                <div className="px-12 py-8 border-t border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-900/20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse border border-white dark:border-slate-800 shadow-sm"></div>
                        <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest italic">Identity Verified</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="px-8 py-3 bg-[#1A2B56] hover:bg-[#2A3B66] text-white rounded-2xl font-black text-xs uppercase tracking-[0.15em] transition-all shadow-xl shadow-blue-900/20 active:scale-95"
                    >
                        Return to List
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default UserDetailModal;
