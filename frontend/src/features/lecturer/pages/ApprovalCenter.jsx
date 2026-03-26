import React, { useState, useMemo, useEffect } from 'react';
import { Laptop, Monitor, CheckCircle2, X, AlertTriangle, Loader2, ArrowRightLeft, Undo2 } from 'lucide-react';
import { toast } from 'sonner';

import { ApprovalFilter } from '../components/approval/ApprovalFilter';
import { ApprovalTable } from '../components/approval/ApprovalTable';
import { useBorrowRequestStore } from '@/stores/useBorrowRequestStore';
import { PageHeader } from '@/features/shared/components/PageHeader';

const ROWS_PER_PAGE = 10;

// ─── Component ────────────────────────────────────────────────────────────────

export const ApprovalCenter = () => {
 // ── Core state ────────────────────────────────────────────────────────────
 const pendingBorrowRequests = useBorrowRequestStore(state => state.pendingBorrowRequests);
 const fetchPendingBorrowRequests = useBorrowRequestStore(state => state.fetchPendingBorrowRequests);
 const loading = useBorrowRequestStore(state => state.loading);

 const fetchApprovedByMe = useBorrowRequestStore(state => state.fetchApprovedByMe);
 const approvedByMe = useBorrowRequestStore(state => state.approvedByMe);

 useEffect(() => {
 fetchPendingBorrowRequests();
 fetchApprovedByMe();
 }, [fetchPendingBorrowRequests, fetchApprovedByMe]);

 const mappedRequests = useMemo(() => {
 return pendingBorrowRequests
 .filter((r) => r.user_id?.role === 'student') // Only show student requests
 .map((r) => ({
 id: r._id,
 status: r.status,
 student: {
 name: r.borrowerId?.displayName || r.borrowerId?.username || 'Requested User',
 id: (r.borrowerId?._id || 'UID').substring(18).toUpperCase(), // Short ID from mongo _id
 initials: (r.borrowerId?.displayName || r.borrowerId?.username || 'US').substring(0, 2).toUpperCase(),
 statusColor: 'bg-green-500',
 avatar: r.borrowerId?.avatarUrl
 },
 equipment: {
 name: r.equipmentId?.name || r.roomId?.name || 'Unknown',
 asset: (r.equipmentId?._id || r.roomId?._id || 'ASSET').substring(18).toUpperCase(),
 icon: r.roomId ? Monitor : Laptop,
 type: (r.type === 'infrastructure' ? 'other' : (r.equipmentId?.category || 'other'))
 },
 period: {
 date: `${new Date(r.borrowDate || new Date()).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} – ${new Date(r.expectedReturnDate || new Date()).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}`,
 label: r.note || 'ACADEMIC PROJECT',
 labelColor: r.type === 'infrastructure' ? 'text-blue-500' : 'text-[#1E2B58] dark:text-blue-300'
 },
 }));
 }, [pendingBorrowRequests]);

 const requests = mappedRequests;

 // Active loans: approved (waiting handover) or handed_over (in use)
 const mappedActiveLoans = useMemo(() => {
   return approvedByMe
     .filter(r => r.status === 'approved' || r.status === 'handed_over')
     .map(r => ({
       id: r._id,
       status: r.status,
       student: {
         name: r.borrowerId?.displayName || r.borrowerId?.username || 'Unknown',
         id: (r.borrowerId?._id || 'UID').substring(18).toUpperCase(),
         initials: (r.borrowerId?.displayName || r.borrowerId?.username || 'US').substring(0, 2).toUpperCase(),
         avatar: r.borrowerId?.avatarUrl,
       },
       equipment: {
         name: r.equipmentId?.name || r.roomId?.name || 'Unknown',
         icon: r.roomId ? Monitor : Laptop,
       },
       returnDate: r.expectedReturnDate
         ? new Date(r.expectedReturnDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
         : '—',
       isOverdue: r.expectedReturnDate && new Date(r.expectedReturnDate) < new Date(),
     }));
 }, [approvedByMe]);

 const [handoveringId, setHandoveringId] = useState(null);
 const [returningId, setReturningId] = useState(null);

 const handleHandover = async (id) => {
   setHandoveringId(id);
   try {
     await handoverAction(id);
     await fetchApprovedByMe();
     toast.success('Equipment handed over successfully.');
   } catch (err) {
     toast.error(err?.response?.data?.message || 'Failed to handover equipment.');
   } finally {
     setHandoveringId(null);
   }
 };

 const handleReturn = async (id) => {
   setReturningId(id);
   try {
     await returnAction(id);
     await fetchApprovedByMe();
     toast.success('Equipment returned successfully.');
   } catch (err) {
     toast.error(err?.response?.data?.message || 'Failed to confirm return.');
   } finally {
     setReturningId(null);
   }
 };

 const [searchText, setSearchText] = useState('');
 const [showPanel, setShowPanel] = useState(false);
 const [statusFilter, setStatusFilter] = useState('all');
 const [typeFilter, setTypeFilter] = useState('all');
 const [currentPage, setCurrentPage] = useState(1);

 // ── Modal state ───────────────────────────────────────────────────────────
 const [approvingReq, setApprovingReq] = useState(null);
 const [rejectingReq, setRejectingReq] = useState(null);
 const [rejectReason, setRejectReason] = useState('');
 const [rejectError, setRejectError] = useState('');

 // ── Derived counts ────────────────────────────────────────────────────────
 const pendingCount = requests.filter(r => r.status === 'pending').length;

 // ── Filter logic ──────────────────────────────────────────────────────────
 const filteredRequests = useMemo(() => {
 const q = searchText.toLowerCase();
 return requests.filter(r => {
 if (statusFilter !== 'all' && r.status !== statusFilter) return false;
 if (typeFilter !== 'all' && r.equipment.type !== typeFilter) return false;
 if (q) {
 const matches =
 r.student.name.toLowerCase().includes(q) ||
 r.student.id.toLowerCase().includes(q) ||
 r.equipment.name.toLowerCase().includes(q) ||
 r.equipment.asset.toLowerCase().includes(q);
 if (!matches) return false;
 }
 return true;
 });
 }, [requests, searchText, statusFilter, typeFilter]);

 // ── Pagination ────────────────────────────────────────────────────────────
 const totalPages = Math.max(1, Math.ceil(filteredRequests.length / ROWS_PER_PAGE));
 const safePage = Math.min(currentPage, totalPages);
 const pagedItems = filteredRequests.slice((safePage - 1) * ROWS_PER_PAGE, safePage * ROWS_PER_PAGE);

 const handlePageChange = (page) => {
 if (page < 1 || page > totalPages) return;
 setCurrentPage(page);
 };

 // Reset to page 1 on filter change
 const handleSearchChange = (val) => { setSearchText(val); setCurrentPage(1); };
 const handleStatusChange = (val) => { setStatusFilter(val); setCurrentPage(1); };
 const handleTypeChange = (val) => { setTypeFilter(val); setCurrentPage(1); };

 const approveAction = useBorrowRequestStore(state => state.approveBorrowRequest);
 const rejectAction = useBorrowRequestStore(state => state.rejectBorrowRequest);
 const handoverAction = useBorrowRequestStore(state => state.handoverBorrowRequest);
 const returnAction = useBorrowRequestStore(state => state.returnBorrowRequest);

 // ── Approve logic ─────────────────────────────────────────────────────────
 const handleApprove = (req) => setApprovingReq(req);

 const confirmApprove = async () => {
 if (!approvingReq) return;
 try {
 await approveAction(approvingReq.id);
 toast.success(`Approved: ${approvingReq.student.name}'s request for ${approvingReq.equipment.name}.`);
 } catch (error) {
 toast.error(error?.response?.data?.message || `Failed to approve request.`);
 }
 setApprovingReq(null);
 setCurrentPage(1);
 };

 // ── Reject logic ──────────────────────────────────────────────────────────
 const handleReject = (req) => {
 setRejectingReq(req);
 setRejectReason('');
 setRejectError('');
 };

 const confirmReject = async (e) => {
 e.preventDefault();
 if (!rejectingReq) return;
 if (!rejectReason.trim()) { setRejectError('Please provide a reason for rejection.'); return; }

 try {
 await rejectAction(rejectingReq.id, rejectReason.trim());
 toast.success(`Rejected: ${rejectingReq.student.name}'s request.`);
 } catch (error) {
 toast.error(error?.response?.data?.message || `Failed to reject request.`);
 }
 setRejectingReq(null);
 setCurrentPage(1);
 };

 // ── Export Log ────────────────────────────────────────────────────────────
 const handleExportLog = () => {
 const header = 'Student Name,Student ID,Equipment,Asset ID,Period,Status\n';
 const rows = requests
 .map(r => `"${r.student.name}","${r.student.id}","${r.equipment.name}","${r.equipment.asset}","${r.period.date}","${r.status}"`)
 .join('\n');
 const blob = new Blob([header + rows], { type: 'text/csv' });
 const url = URL.createObjectURL(blob);
 const a = document.createElement('a');
 a.href = url;
 a.download = `approval-log-${new Date().toISOString().slice(0, 10)}.csv`;
 a.click();
 URL.revokeObjectURL(url);
 toast.success('Export complete The CSV file has been downloaded.');
 };

 // ── Quick reject reasons ──────────────────────────────────────────────────
 const QUICK_REASONS = [
 'Insufficient documentation',
 'Equipment unavailable',
 'Inappropriate use case',
 'Conflicting schedule',
 ];

 return (
 <div className="w-full">
 <main className="pt-6 sm:pt-8 pb-10 px-4 sm:px-6 w-full max-w-[90vw] xl:max-w-7xl mx-auto flex-1 flex flex-col overflow-hidden">
 <div className="w-full">

 {/* ── Header ──────────────────────────────────────────────── */}
 <div className="mb-8 md:mb-12">
 <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
 <PageHeader
 title="Approval Center"
 subtitle="Review pending equipment and facility borrow requests. All approvals are logged for academic compliance."
 className="items-start text-left md:mb-0 mb-0"
 />

 {/* Stats */}
 <div className="flex flex-row items-center gap-3 shrink-0 flex-wrap">
 <div className="dashboard-card px-5 md:px-8 py-4 md:py-6 rounded-3xl flex flex-col items-center justify-center min-w-28">
 <span className="text-3xl md:text-4xl font-black text-amber-500 leading-none mb-1">{pendingCount}</span>
 <span className="text-[0.625rem] font-bold uppercase tracking-[0.2em] text-[#1E2B58]/50 dark:text-white/50">Pending</span>
 </div>
 <div className="dashboard-card px-5 md:px-8 py-4 md:py-6 rounded-3xl flex flex-col items-center justify-center min-w-28">
 <span className="text-3xl md:text-4xl font-black text-blue-500 leading-none mb-1">
 {mappedActiveLoans.filter(l => l.status === 'approved').length}
 </span>
 <span className="text-[0.625rem] font-bold uppercase tracking-[0.2em] text-[#1E2B58]/50 dark:text-white/50">Awaiting Handover</span>
 </div>
 <div className="dashboard-card px-5 md:px-8 py-4 md:py-6 rounded-3xl flex flex-col items-center justify-center min-w-28">
 <span className="text-3xl md:text-4xl font-black text-indigo-500 leading-none mb-1">
 {mappedActiveLoans.filter(l => l.status === 'handed_over').length}
 </span>
 <span className="text-[0.625rem] font-bold uppercase tracking-[0.2em] text-[#1E2B58]/50 dark:text-white/50">In Use</span>
 </div>
 </div>
 </div>
 </div>

 {/* ── Filter bar ──────────────────────────────────────────── */}
 <ApprovalFilter
 searchText={searchText} onSearchChange={handleSearchChange}
 showPanel={showPanel} onTogglePanel={() => setShowPanel(p => !p)}
 statusFilter={statusFilter} onStatusFilterChange={handleStatusChange}
 typeFilter={typeFilter} onTypeFilterChange={handleTypeChange}
 onExportLog={handleExportLog}
 resultCount={filteredRequests.length}
 totalPending={pendingCount}
 />

 {/* ── Table ───────────────────────────────────────────────── */}
 {loading ? (
 <div className="py-20 flex justify-center">
 <Loader2 className="w-10 h-10 animate-spin text-[#1E2B58] opacity-20" />
 </div>
 ) : (
 <ApprovalTable
 items={pagedItems}
 totalPending={filteredRequests.length}
 currentPage={safePage}
 totalPages={totalPages}
 onPageChange={handlePageChange}
 onApprove={handleApprove}
 onReject={handleReject}
 />
 )}

 {/* ── Active Loans ─────────────────────────────────────────── */}
 {mappedActiveLoans.length > 0 && (
 <div className="mt-10">
 <h3 className="text-base font-extrabold text-[#1E2B58] dark:text-white mb-4 px-1">Active Loans</h3>
 <div className="dashboard-card rounded-3xl sm:rounded-4xl overflow-hidden">
 <div className="overflow-x-auto hide-scrollbar">
 <table className="w-full border-collapse min-w-[640px]">
 <thead>
 <tr className="thead-tint">
 <th className="px-6 py-4 text-left text-[0.625rem] font-black uppercase tracking-[0.2em] text-[#1E2B58]/50 dark:text-slate-400">Student</th>
 <th className="px-6 py-4 text-left text-[0.625rem] font-black uppercase tracking-[0.2em] text-[#1E2B58]/50 dark:text-slate-400">Equipment</th>
 <th className="px-6 py-4 text-left text-[0.625rem] font-black uppercase tracking-[0.2em] text-[#1E2B58]/50 dark:text-slate-400">Due Date</th>
 <th className="px-6 py-4 text-left text-[0.625rem] font-black uppercase tracking-[0.2em] text-[#1E2B58]/50 dark:text-slate-400">Status</th>
 <th className="px-6 py-4 text-right text-[0.625rem] font-black uppercase tracking-[0.2em] text-[#1E2B58]/50 dark:text-slate-400">Action</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-black/5 dark:divide-white/5">
 {mappedActiveLoans.map(loan => {
 const Icon = loan.equipment.icon;
 const isApproved = loan.status === 'approved';
 const isHandedOver = loan.status === 'handed_over';
 const isLoading = handoveringId === loan.id || returningId === loan.id;
 return (
 <tr key={loan.id} className="hover:bg-white/50 dark:hover:bg-white/5 transition-colors">
 <td className="px-6 py-4">
 <div className="flex items-center gap-3">
 <div className="w-9 h-9 rounded-full bg-[#1E2B58]/10 dark:bg-slate-700 flex items-center justify-center text-sm font-black text-[#1E2B58] dark:text-white shrink-0">
 {loan.student.avatar ? (
 <img src={loan.student.avatar} alt={loan.student.name} className="w-full h-full rounded-full object-cover" />
 ) : loan.student.initials}
 </div>
 <div>
 <p className="text-sm font-bold text-[#1E2B58] dark:text-white leading-none">{loan.student.name}</p>
 <p className="text-[0.625rem] text-slate-400 font-medium mt-0.5 uppercase tracking-wide">ID: {loan.student.id}</p>
 </div>
 </div>
 </td>
 <td className="px-6 py-4">
 <div className="flex items-center gap-2">
 <div className="w-8 h-8 rounded-full bg-[#1E2B58]/10 dark:bg-slate-800 flex items-center justify-center shrink-0">
 <Icon className="w-4 h-4 text-[#1E2B58] dark:text-slate-300" strokeWidth={2} />
 </div>
 <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{loan.equipment.name}</p>
 </div>
 </td>
 <td className="px-6 py-4">
 <p className={`text-sm font-bold ${loan.isOverdue ? 'text-red-500' : 'text-slate-700 dark:text-slate-300'}`}>
 {loan.returnDate}
 </p>
 {loan.isOverdue && (
 <p className="text-[0.625rem] font-black text-red-400 uppercase tracking-wide mt-0.5">Overdue</p>
 )}
 </td>
 <td className="px-6 py-4">
 {isApproved && (
 <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 text-[0.5625rem] font-black uppercase tracking-widest">
 <ArrowRightLeft className="w-3 h-3" /> Awaiting Handover
 </span>
 )}
 {isHandedOver && (
 <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 text-[0.5625rem] font-black uppercase tracking-widest">
 <CheckCircle2 className="w-3 h-3" /> In Use
 </span>
 )}
 </td>
 <td className="px-6 py-4 text-right">
 {isApproved && (
 <button
 onClick={() => handleHandover(loan.id)}
 disabled={isLoading}
 className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-blue-500 text-white text-[0.6875rem] font-bold hover:bg-blue-600 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 shadow-sm shadow-blue-500/20"
 >
 {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <ArrowRightLeft className="w-3 h-3" />}
 Handover
 </button>
 )}
 {isHandedOver && (
 <button
 onClick={() => handleReturn(loan.id)}
 disabled={isLoading}
 className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-500 text-white text-[0.6875rem] font-bold hover:bg-emerald-600 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 shadow-sm shadow-emerald-500/20"
 >
 {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Undo2 className="w-3 h-3" />}
 Confirm Return
 </button>
 )}
 </td>
 </tr>
 );
 })}
 </tbody>
 </table>
 </div>
 </div>
 </div>
 )}
 </div>
 </main>

 {/* ══ APPROVE CONFIRMATION MODAL ══════════════════════════════════ */}
 {approvingReq && (
 <div
 className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4"
 onClick={e => { if (e.target === e.currentTarget) setApprovingReq(null); }}
 >
 <div className="dashboard-card rounded-4xl p-8 w-full max-w-md shadow-2xl shadow-[#1E2B58]/20 relative animate-in fade-in zoom-in-95 duration-200">
 <button
 onClick={() => setApprovingReq(null)}
 className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#1E2B58]/10 dark:hover:bg-white/10 transition"
 >
 <X className="w-4 h-4 text-[#1E2B58]/60 dark:text-white/60" />
 </button>

 <div className="flex flex-col items-center text-center gap-4 mb-6">
 <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center">
 <CheckCircle2 className="w-7 h-7 text-emerald-500" />
 </div>
 <div>
 <p className="text-[0.625rem] font-black uppercase tracking-widest text-[#1E2B58]/50 dark:text-white/40 mb-1">Confirm Approval</p>
 <h3 className="text-xl font-black text-[#1E2B58] dark:text-white">Approve this request?</h3>
 </div>
 </div>

 {/* Request summary */}
 <div className="bg-white/40 dark:bg-slate-800/40 rounded-[1.25rem] p-4 mb-6 space-y-2 text-sm">
 <div className="flex justify-between">
 <span className="text-[#1E2B58]/60 dark:text-white/50 font-medium">Student</span>
 <span className="font-bold text-[#1E2B58] dark:text-white">{approvingReq.student.name}</span>
 </div>
 <div className="flex justify-between">
 <span className="text-[#1E2B58]/60 dark:text-white/50 font-medium">Equipment</span>
 <span className="font-bold text-[#1E2B58] dark:text-white">{approvingReq.equipment.name}</span>
 </div>
 <div className="flex justify-between">
 <span className="text-[#1E2B58]/60 dark:text-white/50 font-medium">Period</span>
 <span className="font-bold text-[#1E2B58] dark:text-white">{approvingReq.period.date}</span>
 </div>
 </div>

 <div className="flex gap-3">
 <button
 onClick={() => setApprovingReq(null)}
 className="flex-1 py-3.5 rounded-[1.25rem] font-bold text-sm border border-[#1E2B58]/20 dark:border-white/20 text-[#1E2B58]/70 dark:text-white/70 hover:bg-[#1E2B58]/5 dark:hover:bg-white/5 transition-all"
 >
 Cancel
 </button>
 <button
 onClick={confirmApprove}
 className="flex-[2] py-3.5 rounded-[1.25rem] font-bold text-sm bg-emerald-500 text-white hover:bg-emerald-600 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
 >
 <CheckCircle2 className="w-4 h-4" />
 Confirm Approve
 </button>
 </div>
 </div>
 </div>
 )}

 {/* ══ REJECT REASON MODAL ═════════════════════════════════════════ */}
 {rejectingReq && (
 <div
 className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4"
 onClick={e => { if (e.target === e.currentTarget) setRejectingReq(null); }}
 >
 <div className="dashboard-card rounded-4xl p-8 w-full max-w-md shadow-2xl shadow-[#1E2B58]/20 relative animate-in fade-in zoom-in-95 duration-200">
 <button
 onClick={() => setRejectingReq(null)}
 className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#1E2B58]/10 dark:hover:bg-white/10 transition"
 >
 <X className="w-4 h-4 text-[#1E2B58]/60 dark:text-white/60" />
 </button>

 <div className="flex flex-col items-center text-center gap-4 mb-6">
 <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center">
 <AlertTriangle className="w-7 h-7 text-red-500" />
 </div>
 <div>
 <p className="text-[0.625rem] font-black uppercase tracking-widest text-[#1E2B58]/50 dark:text-white/40 mb-1">Reject Request</p>
 <h3 className="text-xl font-black text-[#1E2B58] dark:text-white">{rejectingReq.student.name}</h3>
 <p className="text-xs text-[#1E2B58]/50 dark:text-white/40 font-medium mt-0.5">{rejectingReq.equipment.name} • {rejectingReq.period.date}</p>
 </div>
 </div>

 <form onSubmit={confirmReject} className="flex flex-col gap-4">
 {/* Quick reason chips */}
 <div className="flex flex-col gap-2">
 <p className="text-[0.625rem] font-black uppercase tracking-widest text-[#1E2B58]/50 dark:text-white/40">
 Quick Reasons
 </p>
 <div className="flex flex-wrap gap-2">
 {QUICK_REASONS.map(r => (
 <button
 key={r}
 type="button"
 onClick={() => setRejectReason(r)}
 className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all hover:scale-105 active:scale-95 ${rejectReason === r
 ? 'bg-red-500 text-white shadow-md shadow-red-500/20'
 : 'bg-white/40 dark:bg-slate-800/40 text-[#1E2B58] dark:text-white border border-[#1E2B58]/10 dark:border-white/10 hover:bg-white/60 dark:hover:bg-slate-700/50'
 }`}
 >
 {r}
 </button>
 ))}
 </div>
 </div>

 {/* Reason textarea */}
 <div className="flex flex-col gap-2">
 <label className="text-[0.625rem] font-black uppercase tracking-widest text-[#1E2B58]/50 dark:text-white/40">
 Reason for Rejection <span className="text-red-500">*</span>
 </label>
 <textarea
 rows={3}
 placeholder="Explain why this request is being rejected..."
 value={rejectReason}
 onChange={e => { setRejectReason(e.target.value); setRejectError(''); }}
 className="w-full bg-white/40 dark:bg-slate-800/50 border border-white/40 dark:border-slate-700/50 rounded-[1rem] px-4 py-3 text-sm font-medium text-[#1E2B58] dark:text-white placeholder:text-[#1E2B58]/30 dark:placeholder:text-white/30 outline-none focus:ring-2 focus:ring-red-400/30 transition-all resize-none"
 />
 {rejectError && (
 <p className="text-xs font-bold text-red-500 dark:text-red-400">{rejectError}</p>
 )}
 </div>

 <div className="flex gap-3 mt-1">
 <button
 type="button"
 onClick={() => setRejectingReq(null)}
 className="flex-1 py-3.5 rounded-[1.25rem] font-bold text-sm border border-[#1E2B58]/20 dark:border-white/20 text-[#1E2B58]/70 dark:text-white/70 hover:bg-[#1E2B58]/5 dark:hover:bg-white/5 transition-all"
 >
 Cancel
 </button>
 <button
 type="submit"
 className="flex-[2] py-3.5 rounded-[1.25rem] font-bold text-sm bg-red-500 text-white hover:bg-red-600 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-red-500/20 flex items-center justify-center gap-2"
 >
 <X className="w-4 h-4" />
 Submit Rejection
 </button>
 </div>
 </form>
 </div>
 </div>
 )}
 </div>
 );
};
