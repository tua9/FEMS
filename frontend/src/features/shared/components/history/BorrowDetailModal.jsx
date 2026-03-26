import React from 'react';
import { Laptop, AlertTriangle, ArrowRight, Edit3, Ban } from 'lucide-react';
import { BorrowEditForm } from './BorrowEditForm';
import BorrowCancelModal from '@/features/student/components/history/BorrowCancelModal';
import { useBorrowRequestStore } from '@/stores/useBorrowRequestStore';

// ─── Props ────────────────────────────────────────────────────────────────────

// ─── Component ────────────────────────────────────────────────────────────────

export const BorrowDetailModal = ({ item: b, initialMode = 'view', onClose, onBorrowAgain }) => {
 const Icon = b.icon || Laptop;
 const [mode, setMode] = React.useState(initialMode);
 const [showCancelModal, setShowCancelModal] = React.useState(false);
 const { cancelMyBorrowRequest, fetchMyBorrowRequests } = useBorrowRequestStore();

 const handleCancel = async (note) => {
 await cancelMyBorrowRequest(b.original._id, note);
 await fetchMyBorrowRequests();
 setShowCancelModal(false);
 onClose();
 };

 return (
 <>
 <div className="flex items-center gap-3 mb-6">
 <div className="w-12 h-12 rounded-[1rem] bg-[#1E2B58]/10 dark:bg-white/5 flex items-center justify-center overflow-hidden">
 {(b.original?.equipmentId)?.img ? (
 <img src={(b.original.equipmentId).img} alt={b.equipmentName} className="w-full h-full object-cover" />
 ) : (
 <Icon className="w-6 h-6 text-[#1E2B58] dark:text-white" />
 )}
 </div>
 <div>
 <p className="text-[0.625rem] font-black uppercase tracking-widest text-[#1E2B58]/50 dark:text-white/40">Borrow Detail</p>
 <h3 className="text-lg font-black text-[#1E2B58] dark:text-white">{b.id}</h3>
 </div>
 </div>

 {b.status === 'OVERDUE' && (
 <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 rounded-[1rem] p-3 mb-4">
 <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
 <p className="text-xs font-bold text-red-600 dark:text-red-400">This item is overdue. Please return it as soon as possible.</p>
 </div>
 )}

 {mode === 'edit' ? (
 <BorrowEditForm
 item={b}
 onSuccess={onClose}
 onCancel={() => initialMode === 'edit' ? onClose() : setMode('view')}
 />
 ) : (
 <>
 <div className="space-y-3 bg-white/40 dark:bg-slate-800/40 rounded-[1.25rem] p-5 mb-6">
 {[
 ['Equipment', b.equipmentName],
 ['Course/Class', b.course],
 ['Group', b.group],
 ['Period', b.period],
 ['Purpose', b.original.note || ''],
 ].map(([k, v]) => (
 <div key={k} className="flex justify-between text-sm">
 <span className="text-[#1E2B58]/60 dark:text-white/50 font-medium">{k}</span>
 <span className="font-bold text-[#1E2B58] dark:text-white text-right break-words max-w-[65%]">{v}</span>
 </div>
 ))}

 <div className="flex justify-between items-center text-sm pt-2 border-t border-[#1E2B58]/10 dark:border-white/10">
 <span className="text-[#1E2B58]/60 dark:text-white/50 font-medium">Status</span>
 <span className={`text-[0.625rem] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider ${b.status === 'RETURNED' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
 : b.status === 'OVERDUE' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
 : b.status === 'PENDING' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
 : b.status === 'APPROVED' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
 : 'bg-[#1E2B58] text-white'
 }`}>
 {b.status}
 </span>
 </div>
 </div>

 <div className="flex gap-3">
 {b.status === 'PENDING' ? (
 <>
 <button
 onClick={() => setShowCancelModal(true)}
 className="flex-1 py-3 rounded-[1.25rem] font-bold text-sm bg-red-500 text-white hover:bg-red-600 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-red-500/20 flex items-center justify-center gap-2"
 >
 <Ban className="w-4 h-4" /> Cancel
 </button>
 </>
 ) : (
 <button
 onClick={onBorrowAgain}
 className="flex-1 py-3 rounded-[1.25rem] font-bold text-sm bg-[#1E2B58] text-white hover:bg-[#151f40] hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-[#1E2B58]/20 flex items-center justify-center gap-2"
 >
 <Laptop className="w-4 h-4" /> Borrow Again <ArrowRight className="w-3.5 h-3.5" />
 </button>
 )}

 <button
 onClick={onClose}
 className="flex-1 py-3 rounded-[1.25rem] font-bold text-sm border border-[#1E2B58]/20 dark:border-white/20 text-[#1E2B58]/70 dark:text-white/70 hover:bg-[#1E2B58]/5 transition-all"
 >
 Close
 </button>
 </div>
 </>
 )}
 {showCancelModal && (
 <BorrowCancelModal
 item={b.original}
 onClose={() => setShowCancelModal(false)}
 onConfirm={handleCancel}
 />
 )}
 </>
 );
};
