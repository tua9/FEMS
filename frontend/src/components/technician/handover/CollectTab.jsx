import React, { useState } from 'react';
import {
 MOCK_ACTIVE_LOANS,
 getLoanStatusStyle,
} from '@/data/technician/mockHandover';
import HandoverDetailModal from './HandoverDetailModal';
import {
 MODAL_OVERLAY,
 MODAL_CARD,
 MODAL_FOOTER,
 CLOSE_BTN,
 BTN_SECONDARY,
} from '@/components/technician/common/modalStyles';

// ── Convert ActiveLoan → HandoverDetailRecord ─────────────────────────────────
function toDetailRecord(loan) {
 const statusClass =
 loan.status === 'Overdue' ? 'bg-red-100 text-red-600' :
 loan.status === 'Due Today' ? 'bg-yellow-100 text-yellow-700' :
 'bg-blue-50 text-blue-600';
 const initials = loan.borrower.name
 .split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();

 return {
 id: loan.id,
 title: loan.id,
 badge: { label: loan.status, className: statusClass },
 person: {
 name: loan.borrower.name,
 sub: `${loan.borrower.department ?? ''} · ${loan.borrower.idLabel}`,
 initials,
 avatarBg: 'bg-slate-100',
 avatarColor: 'text-slate-700',
 email: loan.borrower.email,
 },
 meta: [
 { label: 'Items Held', value: loan.itemNames, icon: 'inventory_2' },
 { label: 'Borrowed On', value: loan.borrowedDate, icon: 'calendar_today' },
 { label: 'Return Due', value: loan.dueLabel, icon: loan.dueIcon },
 { label: 'Item Count', value: `${loan.itemCount} item${loan.itemCount > 1 ? 's' : ''}`, icon: 'numbers' },
 ],
 items: loan.items,
 timeline: loan.timeline,
 notes: loan.notes,
 };
}

// ── Mark Returned confirmation modal ─────────────────────────────────────────
const MarkReturnedModal = ({ loan, onClose, onConfirm }) => {
 const initials = loan.borrower.name
 .split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();

 return (
 <div className={MODAL_OVERLAY} onClick={onClose}>
 <div
 className={`${MODAL_CARD} max-w-md`}
 onClick={(e) => e.stopPropagation()}
 >
 {/* Header */}
 <div className="px-7 pt-7 pb-5 flex items-start justify-between">
 <div className="flex items-center gap-4">
 <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center">
 <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400 text-2xl">assignment_turned_in</span>
 </div>
 <div>
 <h2 className="text-base font-extrabold text-slate-800 dark:text-white">Mark as Returned</h2>
 <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Confirm equipment return for this loan</p>
 </div>
 </div>
 <button onClick={onClose} className={CLOSE_BTN}>
 <span className="material-symbols-outlined text-lg">close</span>
 </button>
 </div>

 <div className="mx-7 border-t border-slate-100 dark:border-white/10" />

 {/* Body */}
 <div className="px-7 py-6 space-y-5">
 {/* Borrower info */}
 <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
 {loan.borrower.avatar ? (
 <img src={loan.borrower.avatar} alt={loan.borrower.name} className="w-10 h-10 rounded-full object-cover border border-slate-200" />
 ) : (
 <div className="w-10 h-10 rounded-full bg-[#1A2B56]/10 dark:bg-white/10 flex items-center justify-center font-bold text-[#1A2B56] dark:text-white text-xs">
 {initials}
 </div>
 )}
 <div>
 <p className="text-sm font-bold text-slate-800 dark:text-white">{loan.borrower.name}</p>
 <p className="text-[11px] text-slate-500 dark:text-slate-400">{loan.borrower.idLabel}</p>
 </div>
 </div>

 {/* Items summary */}
 <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-2">
 <div className="flex items-center gap-2">
 <span className="material-symbols-outlined text-slate-400 text-base">inventory_2</span>
 <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
 {loan.itemCount} Item{loan.itemCount > 1 ? 's' : ''} to Return
 </p>
 </div>
 <p className="text-[11px] text-slate-500 dark:text-slate-400 pl-6">{loan.itemNames}</p>
 </div>

 {/* Due label */}
 <div className="flex items-center gap-2 px-1">
 <span className={`material-symbols-outlined text-base ${loan.dueColor === 'red' ? 'text-red-500' :
 loan.dueColor === 'yellow' ? 'text-yellow-600' : 'text-slate-400'
 }`}>{loan.dueIcon}</span>
 <p className={`text-xs font-semibold ${loan.dueColor === 'red' ? 'text-red-500' :
 loan.dueColor === 'yellow' ? 'text-yellow-600' : 'text-slate-600 dark:text-slate-300'
 }`}>{loan.dueLabel}</p>
 </div>

 <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
 Please verify that all items have been physically received and are in acceptable condition before confirming.
 </p>
 </div>

 {/* Footer */}
 <div className={MODAL_FOOTER}>
 <button onClick={onClose} className={BTN_SECONDARY}>Cancel</button>
 <button
 onClick={() => onConfirm(loan.id)}
 className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
 >
 <span className="material-symbols-outlined text-base">check_circle</span>
 Confirm Return
 </button>
 </div>
 </div>
 </div>
 );
};

const LoanCard = ({ loan, onDetails, onMarkReturned }) => {
 const st = getLoanStatusStyle(loan.status);

 const dueTextColor =
 loan.dueColor === 'red' ? 'text-red-500' :
 loan.dueColor === 'yellow' ? 'text-yellow-600' : 'text-slate-700 dark:text-slate-200';

 const initials = loan.borrower.name
 .split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();

 return (
 <div className={`dashboard-card rounded-3xl border-2 ${st.border} dark:border-white/10 overflow-hidden flex flex-col`}>
 <div className="p-6 flex-1">
 {/* Header row */}
 <div className="flex justify-between items-start mb-4">
 <div className="flex items-center gap-3">
 {loan.borrower.avatar ? (
 <img src={loan.borrower.avatar} alt={loan.borrower.name} className="w-10 h-10 rounded-full border border-slate-200 dark:border-white/10 object-cover" />
 ) : (
 <div className="w-10 h-10 rounded-full bg-[#1A2B56]/10 dark:bg-white/10 flex items-center justify-center font-bold text-[#1A2B56] dark:text-white text-xs">
 {initials}
 </div>
 )}
 <div>
 <h3 className="text-sm font-bold text-slate-900 dark:text-white">{loan.borrower.name}</h3>
 <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
 {loan.borrower.idLabel}
 </p>
 </div>
 </div>
 <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-tight ${st.badge}`}>
 {loan.status}
 </span>
 </div>

 {/* Items held */}
 <div className="space-y-3 mb-6">
 <div className="flex items-start gap-3">
 <span className="material-symbols-outlined text-slate-400 text-lg">inventory_2</span>
 <div>
 <p className="text-xs font-bold text-slate-900 dark:text-white">{loan.itemCount} Items Held</p>
 <p className="text-[10px] text-slate-500 dark:text-slate-400">{loan.itemNames}</p>
 </div>
 </div>
 <div className="flex items-start gap-3">
 <span className={`material-symbols-outlined text-lg ${dueTextColor}`}>{loan.dueIcon}</span>
 <div>
 <p className={`text-xs font-bold ${dueTextColor}`}>{loan.dueLabel}</p>
 <p className="text-[10px] text-slate-400">Borrowed: {loan.borrowedDate}</p>
 </div>
 </div>
 </div>
 </div>

 {/* Footer buttons */}
 <div className="p-4 bg-white/10 dark:bg-white/5 border-t border-slate-200 dark:border-white/10 flex gap-2">
 <button
 onClick={onDetails}
 className="flex-1 tech-pill dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
 >
 <span className="material-symbols-outlined text-base">info</span>
 Details
 </button>
 <button
 onClick={onMarkReturned}
 className="flex-1 bg-emerald-500/10 dark:bg-emerald-500/15 hover:bg-emerald-600 hover:text-white text-emerald-700 dark:text-emerald-400 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 border border-emerald-200 dark:border-emerald-500/30"
 >
 <span className="material-symbols-outlined text-base">assignment_turned_in</span>
 Mark Returned
 </button>
 </div>
 </div>
 );
};

// ── Tab component ─────────────────────────────────────────────────────────────
const CollectTab = () => {
 const [loans, setLoans] = useState([...MOCK_ACTIVE_LOANS]);
 const [search, setSearch] = useState('');
 const [detail, setDetail] = useState(null);
 const [returnLoan, setReturnLoan] = useState(null);
 const [toast, setToast] = useState(null);

 React.useEffect(() => {
 if (!toast) return;
 const t = setTimeout(() => setToast(null), 3500);
 return () => clearTimeout(t);
 }, [toast]);

 const handleConfirmReturn = (id) => {
 const loan = loans.find((l) => l.id === id);
 setLoans((prev) => prev.filter((l) => l.id !== id));
 setReturnLoan(null);
 if (loan) setToast(`${loan.borrower.name} — equipment marked as returned`);
 };

 const filtered = loans.filter(
 (l) =>
 l.borrower.name.toLowerCase().includes(search.toLowerCase()) ||
 l.borrower.idLabel.toLowerCase().includes(search.toLowerCase()),
 );

 return (
 <>
 <div>
 {/* Search + count bar */}
 <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
 <div className="relative w-full md:w-96">
 <input
 value={search}
 onChange={(e) => setSearch(e.target.value)}
 placeholder="Filter by Borrower or ID"
 className="w-full pl-12 pr-4 py-3 tech-pill dark:text-white rounded-2xl text-sm border border-white/30 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-[#1A2B56]/30 placeholder-slate-400 dark:placeholder-slate-500"
 />
 <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
 </div>
 <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
 Active Loans: {loans.length}
 </span>
 </div>

 {/* Cards grid */}
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
 {filtered.map((loan) => (
 <LoanCard
 key={loan.id}
 loan={loan}
 onDetails={() => setDetail(toDetailRecord(loan))}
 onMarkReturned={() => setReturnLoan(loan)}
 />
 ))}
 {filtered.length === 0 && (
 <p className="col-span-3 text-center py-16 text-slate-400 font-semibold">
 No active loans found.
 </p>
 )}
 </div>
 </div>

 {detail && <HandoverDetailModal record={detail} onClose={() => setDetail(null)} />}

 {returnLoan && (
 <MarkReturnedModal
 loan={returnLoan}
 onClose={() => setReturnLoan(null)}
 onConfirm={handleConfirmReturn}
 />
 )}

 {toast && (
 <div
 className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-sm font-semibold text-white"
 style={{
 background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
 border: '1px solid rgba(255,255,255,0.15)',
 backdropFilter: 'blur(10px)',
 }}
 >
 <span className="material-symbols-outlined text-xl">check_circle</span>
 {toast}
 </div>
 )}
 </>
 );
};

export default CollectTab;
