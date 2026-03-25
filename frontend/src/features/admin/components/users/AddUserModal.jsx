import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useUserStore } from '@/stores/useUserStore';
import { toast } from 'sonner';

const AddUserModal = ({ isOpen, onClose, user, onUserUpdated }) => {
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

 const handleSubmit = async (e) => {
 e.preventDefault();

 const userData = {
 username,
 displayName: name,
 email,
 role: role,
 ...(password ? { password } : {})
 };

 try {
 if (isEdit && user) {
 await updateUser(user._id, userData);
 toast.success(`User ${name} updated successfully`);
 } else {
 await createUser(userData);
 toast.success(`User ${name} created successfully`);
 }
 if (onUserUpdated) onUserUpdated();
 onClose();
 } catch (error) {
 toast.error("Failed to save user records.");
 }
 };

 if (!isOpen) return null;

 const inputClasses = "w-full bg-slate-50/50 dark:bg-slate-900/50 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-800 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-[#1E2B58] dark:focus:ring-blue-500 outline-none transition-all";
 const labelClasses = "text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 mb-2 block";

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
 <span className="px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 border-indigo-100 dark:border-indigo-900/30 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 shadow-sm">
 {isEdit ? 'Edit Mode' : 'Creation Mode'}
 </span>
 </div>

 <h3 className="text-2xl font-black text-[#1E2B58] dark:text-white tracking-tight">
 {isEdit ? 'Update Identity Records' : 'Onboard New Identity'}
 </h3>
 <p className="text-[0.625rem] font-black text-[#1E2B58]/50 dark:text-white/40 uppercase tracking-widest mt-1">
 Systems Administration • User Management
 </p>
 </div>

 <div className="p-10 pt-0 overflow-y-auto no-scrollbar space-y-8 relative z-10 mt-6">
 <form id="userForm" onSubmit={handleSubmit} className="space-y-6">
 {/* Username Section */}
 <div className="p-6 rounded-3xl bg-white/40 dark:bg-slate-900/30 border-2 border-white dark:border-slate-700 shadow-sm">
 <label className={labelClasses}>Primary Username <span className="text-red-500">*</span></label>
 <div className="relative">
 <span className="material-symbols-outlined absolute left-4 top-3.5 text-slate-400 text-xl font-light">account_circle</span>
 <input
 type="text"
 value={username}
 onChange={e => setUsername(e.target.value)}
 readOnly={isEdit}
 required
 className={`${inputClasses} pl-12 ${isEdit ? 'opacity-60 cursor-not-allowed border-dashed' : ''}`}
 placeholder="Enter unique ID"
 />
 </div>
 </div>

 {/* Layout Grid */}
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <div className="space-y-1.5">
 <label className={labelClasses}>Display Name <span className="text-red-500">*</span></label>
 <input
 type="text"
 value={name}
 onChange={e => setName(e.target.value)}
 className={inputClasses}
 placeholder="e.g. Satoshi Nakamoto"
 required
 />
 </div>

 <div className="space-y-1.5">
 <label className={labelClasses}>Communication Email <span className="text-red-500">*</span></label>
 <input
 type="email"
 value={email}
 onChange={e => setEmail(e.target.value)}
 className={inputClasses}
 placeholder="satoshi@identity.net"
 required
 />
 </div>

 <div className="space-y-1.5 relative">
 <label className={labelClasses}>Security Level / Role <span className="text-red-500">*</span></label>
 <select
 value={role}
 onChange={e => setRole(e.target.value)}
 className={`${inputClasses} appearance-none cursor-pointer`}
 required
 >
 <option value="student">Student Account</option>
 <option value="lecturer">Lecturer Account</option>
 <option value="technician">Service Technician</option>
 <option value="admin">Systems Admin</option>
 </select>
 <span className="material-symbols-outlined absolute right-4 top-[42px] text-slate-400 pointer-events-none">expand_more</span>
 </div>

 <div className="space-y-1.5">
 <label className={labelClasses}>Organizational Unit</label>
 <input
 type="text"
 className={inputClasses}
 placeholder="e.g. Engineering"
 />
 </div>
 </div>

 {/* Profile Image - Simplified Aesthetic */}
 <div className="space-y-1.5 pt-2">
 <label className={labelClasses}>Profile Asset</label>
 <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-8 flex flex-col items-center justify-center text-center bg-slate-50/30 dark:bg-black/10 hover:bg-slate-50/50 transition-colors cursor-pointer group">
 <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 flex items-center justify-center text-indigo-500 mb-3 group-hover:scale-110 transition-transform shadow-sm">
 <span className="material-symbols-outlined">upload_file</span>
 </div>
 <p className="text-xs font-black text-slate-700 dark:text-slate-300">Click to upload avatar</p>
 <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-tight italic">Optimized for square dimensions</p>
 </div>
 </div>
 </form>
 </div>

 {/* Footer Section */}
 <div className="px-8 py-5 border-t border-black/8 dark:border-white/10 bg-black/3 dark:bg-white/3 flex flex-wrap items-center justify-between gap-4">
 <button
 onClick={onClose}
 className="px-6 py-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold text-[10px] uppercase tracking-widest transition-colors"
 >
 Discard Changes
 </button>
 <div className="flex gap-3">
 <button
 type="submit"
 form="userForm"
 disabled={isSubmitting}
 className={`px-8 py-3 bg-[#1A2B56] hover:bg-[#2A3B66] text-white rounded-xl font-black text-xs uppercase tracking-[0.15em] transition-all shadow-lg shadow-blue-900/20 active:scale-95 flex items-center gap-2 ${isSubmitting ? 'opacity-50 cursor-wait' : ''}`}
 >
 <span className="material-symbols-outlined text-sm">{isSubmitting ? 'hourglass_top' : (isEdit ? 'save_as' : 'how_to_reg')}</span>
 {isSubmitting ? 'Processing' : (isEdit ? 'Save Changes' : 'Confirm Registration')}
 </button>
 </div>
 </div>
 </div>
 </div>,
 document.body
 );
};

export default AddUserModal;
