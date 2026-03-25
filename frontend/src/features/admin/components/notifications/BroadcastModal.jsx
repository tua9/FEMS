import React, { useState, useEffect } from 'react';
import { userService } from '@/services/userService';
import { notificationService } from '@/services/notificationService';
import { Loader2 } from 'lucide-react';
import { createPortal } from 'react-dom';
import { toast } from 'sonner';

const BroadcastModal = ({ isOpen, onClose, onSuccess }) => {
 const [targetType, setTargetType] = useState('all');
 const [targetId, setTargetId] = useState('');
 const [title, setTitle] = useState('');
 const [message, setMessage] = useState('');
 const [loading, setLoading] = useState(false);
 const [sending, setSending] = useState(false);
 const [users, setUsers] = useState([]);

 useEffect(() => {
 if (isOpen && targetType === 'user' && users.length === 0) {
 fetchUsers();
 }
 }, [isOpen, targetType]);

 const fetchUsers = async () => {
 setLoading(true);
 try {
 const data = await userService.getAll();
 setUsers(data);
 } catch (error) {
 console.error('Failed to fetch users:', error);
 } finally {
 setLoading(false);
 }
 };

 const handleSubmit = async (e) => {
 e.preventDefault();
 if (!title || !message || (targetType !== 'all' && !targetId)) return;

 setSending(true);
 try {
 await notificationService.broadcast({
 targetType,
 targetId,
 title,
 message,
 type: 'general',
 to: '/student/notifications'
 });
 onSuccess();
 onClose();
 toast.success('Broadcast message sent successfully');
 } catch (error) {
 console.error('Failed to send broadcast:', error);
 toast.error('Failed to send broadcast message');
 } finally {
 setSending(false);
 }
 };

 if (!isOpen) return null;

 const inputClasses = "w-full bg-slate-50/50 dark:bg-slate-900/50 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-800 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-[#1E2B58] dark:focus:ring-blue-500 outline-none transition-all";
 const labelClasses = "text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 mb-2 block";

 return createPortal(
 <div className="fixed inset-0 z-[120] flex items-center justify-center px-4 py-6 bg-black/30 backdrop-blur-sm">
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
 <span className="px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 border-blue-100 dark:border-blue-900/30 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-sm">
 Broadcast Channel
 </span>
 </div>

 <h3 className="text-2xl font-black text-[#1E2B58] dark:text-white tracking-tight">
 Push System Update
 </h3>
 <p className="text-[0.625rem] font-black text-[#1E2B58]/50 dark:text-white/40 uppercase tracking-widest mt-1">
 Systems Administration • Mass Communication
 </p>
 </div>

 <div className="p-10 pt-0 overflow-y-auto no-scrollbar space-y-8 relative z-10 mt-6">
 <form id="broadcastForm" onSubmit={handleSubmit} className="space-y-6">
 
 {/* Target Selection Section */}
 <div className="p-6 rounded-3xl bg-white/40 dark:bg-slate-900/30 border-2 border-white dark:border-slate-700 shadow-sm">
 <label className={labelClasses}>Select Audience <span className="text-red-500">*</span></label>
 <div className="grid grid-cols-3 gap-3">
 {[
 { id: 'all', label: 'Everyone', icon: 'groups', color: 'blue' },
 { id: 'role', label: 'By Role', icon: 'shield', color: 'amber' },
 { id: 'user', label: 'Individual', icon: 'person', color: 'emerald' }
 ].map(t => (
 <button
 key={t.id}
 type="button"
 onClick={() => setTargetType(t.id)}
 className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all group ${
 targetType === t.id
 ? `border-${t.color}-500/50 bg-${t.color}-50 dark:bg-${t.color}-900/20 text-${t.color}-600 dark:text-${t.color}-400`
 : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 text-slate-400'
 }`}
 >
 <span className={`material-symbols-outlined text-2xl transition-transform group-hover:scale-110`}>{t.icon}</span>
 <span className="text-[10px] font-black uppercase tracking-widest">{t.label}</span>
 </button>
 ))}
 </div>
 </div>

 {/* Conditional Target Selectors */}
 {targetType === 'role' && (
 <div className="space-y-1.5 animate-in slide-in-from-top-2 duration-300">
 <label className={labelClasses}>Target Identity Group</label>
 <div className="relative">
 <select
 value={targetId}
 onChange={e => setTargetId(e.target.value)}
 className={`${inputClasses} appearance-none cursor-pointer`}
 required
 >
 <option value="">Choose a group...</option>
 <option value="student">All Students</option>
 <option value="lecturer">All Lecturers</option>
 <option value="technician">All Technicians</option>
 </select>
 <span className="material-symbols-outlined absolute right-4 top-3.5 text-slate-400 pointer-events-none">expand_more</span>
 </div>
 </div>
 )}

 {targetType === 'user' && (
 <div className="space-y-1.5 animate-in slide-in-from-top-2 duration-300">
 <label className={labelClasses}>Search Individual Account</label>
 <div className="relative">
 {loading ? (
 <div className={`${inputClasses} flex items-center gap-3 opacity-60`}>
 <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
 <span>Locating accounts...</span>
 </div>
 ) : (
 <>
 <select
 value={targetId}
 onChange={e => setTargetId(e.target.value)}
 className={`${inputClasses} appearance-none cursor-pointer`}
 required
 >
 <option value="">Select an identity...</option>
 {users.map(u => (
 <option key={u._id} value={u._id}>
 {u.displayName || u.username} ({u.role})
 </option>
 ))}
 </select>
 <span className="material-symbols-outlined absolute right-4 top-3.5 text-slate-400 pointer-events-none">search</span>
 </>
 )}
 </div>
 </div>
 )}

 {/* Message Details */}
 <div className="space-y-6">
 <div className="space-y-1.5">
 <label className={labelClasses}>Notification Title <span className="text-red-500">*</span></label>
 <input
 type="text"
 placeholder="e.g. Schedule Maintenance Notice"
 value={title}
 onChange={e => setTitle(e.target.value)}
 className={inputClasses}
 required
 />
 </div>
 <div className="space-y-1.5">
 <label className={labelClasses}>Broadcast Payload / Message <span className="text-red-500">*</span></label>
 <textarea
 placeholder="Detailed description of the broadcast..."
 value={message}
 onChange={e => setMessage(e.target.value)}
 rows={4}
 className={`${inputClasses} resize-none h-32 py-4`}
 required
 ></textarea>
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
 Abort Broadcast
 </button>
 <div className="flex gap-3">
 <button
 type="submit"
 form="broadcastForm"
 disabled={sending}
 className={`px-8 py-3 bg-[#1A2B56] hover:bg-[#2A3B66] text-white rounded-xl font-black text-xs uppercase tracking-[0.15em] transition-all shadow-lg shadow-blue-900/20 active:scale-95 flex items-center gap-2 ${sending ? 'opacity-50 cursor-wait' : ''}`}
 >
 <span className="material-symbols-outlined text-sm">{sending ? 'hourglass_top' : 'send'}</span>
 {sending ? 'Blasting...' : 'Initiate Broadcast'}
 </button>
 </div>
 </div>
 </div>
 </div>,
 document.body
 );
};

export default BroadcastModal;
