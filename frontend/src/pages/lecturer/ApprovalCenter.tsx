import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Laptop, Bot, Camera, Video, TabletSmartphone, Monitor, Mic, CheckCircle2, X, AlertTriangle } from 'lucide-react';

import { ApprovalFilter, StatusFilter, TypeFilter } from '../../components/lecturer/approval/ApprovalFilter';
import { ApprovalTable, BorrowRequest, RequestStatus } from '../../components/lecturer/approval/ApprovalTable';
import { PageHeader } from '@/components/shared/PageHeader';

// ─── Mock Data ────────────────────────────────────────────────────────────────

const INITIAL_REQUESTS: BorrowRequest[] = [
    {
        id: '1', status: 'pending',
        student: { name: 'Johnathan Chen',  id: 'SE160942', initials: 'JC', statusColor: 'bg-green-500',  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCfuRg14RB8L82_FoAlVQA_zqV5d9SHL4U-S7gWG1p9SasteiZbFIkYYxMz0W8L7A3ZOa55oq3vIh3VKfC7cQnOcp8nC8aI0XPhICNvmfbLuc7Ja3PCFR4yogzq_7_xmSNQmQ-sQ_eG1BCyrhXEO41yAjIPampX7AdK9YoWWoWPaK1GgAYTamgWoTuzUxABad5ceGIjNJkCSaiEzD0KNWCpmx0-7xXUN3EQ1aOnf5fRef4CAwWnK6gnsv5aVSYvu-aajEmVTugkvH1P' },
        equipment: { name: 'MacBook Pro M2',       asset: 'FPT-LAP-082', icon: Laptop,          type: 'laptop'    },
        period:    { date: '24 Oct – 27 Oct 2024', label: 'ACADEMIC PROJECT', labelColor: 'text-[#1E2B58] dark:text-blue-300' },
    },
    {
        id: '2', status: 'pending',
        student: { name: 'Sarah Nguyen',    id: 'SE154432', initials: 'SN', statusColor: 'bg-green-500',  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBwxnUoHlVaJw2tQTpJ27nrY6Sk4izzYmvaXbPYiH_twnbu6FJxoqKSRZeGMCKdPP277hkO0BVIuaCcEW59AezBs92M4cgc1D1_8BOTVQcm6h5futrQwlkg7d5ztd8hUCslRAuMvX6GsjWHpdqOuVdLEP4uEk9GRS3ToIQ5K7yrlO9X-tQOqYWaT9lPCR-X9eiXO7i7VJlF4I6iqOVDgL7nPq_EPdhxPXSSKwEIdBoiTzLN_uLb6QWu31dNquN-W2DaOyi41oWKkyIz' },
        equipment: { name: 'Arduino Robotics Kit', asset: 'FPT-ROB-15',  icon: Bot,             type: 'other'     },
        period:    { date: '26 Oct 2024',           label: '08:00 AM – 05:00 PM', labelColor: 'text-slate-500 dark:text-slate-400' },
    },
    {
        id: '3', status: 'pending',
        student: { name: 'Mark Peterson',   id: 'AI170291', initials: 'MP', statusColor: 'bg-yellow-500', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDuk5PpjiiG1ii0_EPkJ--aHglfUFCy4dVk8KHMeb02gVWotBou9GvCcCRSE6goB6vfXreZhT6loZUL9E94m2AkJsm1Aq0KjrbgoK1JSb-KPVW1cxD5ZUgOf9t41NxdSIbYeXxd7sftp8xqEGb5JGwtidWsKGdDyDL4vTMdTu-npAIE1PJuGYM3bXXlF2Khb4k7N6objyPN4b6W0nrwL-dagsbdNmIlXKuDt58iXSKjiR-JHeJJ6MoHdQV2_NVeWKPX2lZUCHO-gIY3' },
        equipment: { name: '4K Sony DSLR',         asset: 'FPT-CAM-102', icon: Camera,          type: 'camera'    },
        period:    { date: '25 Oct – 26 Oct 2024', label: 'EXTERNAL EVENT', labelColor: 'text-orange-500 dark:text-orange-400' },
    },
    {
        id: '4', status: 'pending',
        student: { name: 'Emily Watson',    id: 'SE162017', initials: 'EW', statusColor: 'bg-green-500' },
        equipment: { name: 'iPad Air 5th Gen',     asset: 'FPT-TAB-055', icon: TabletSmartphone, type: 'tablet'   },
        period:    { date: '28 Oct – 30 Oct 2024', label: 'RESEARCH',      labelColor: 'text-purple-500 dark:text-purple-400' },
    },
    {
        id: '5', status: 'pending',
        student: { name: 'Daniel Kim',      id: 'SE158891', initials: 'DK', statusColor: 'bg-green-500' },
        equipment: { name: '4K Laser Projector',   asset: 'FPT-PJ-014',  icon: Video,           type: 'projector' },
        period:    { date: '29 Oct 2024',           label: 'CLASS DEMO',    labelColor: 'text-[#1E2B58] dark:text-blue-300' },
    },
    {
        id: '6', status: 'pending',
        student: { name: 'Lisa Chen',       id: 'SE163344', initials: 'LC', statusColor: 'bg-gray-400' },
        equipment: { name: 'UltraWide Monitor',    asset: 'FPT-MN-033',  icon: Monitor,         type: 'monitor'  },
        period:    { date: '1 Nov – 3 Nov 2024',   label: 'RESEARCH',      labelColor: 'text-purple-500 dark:text-purple-400' },
    },
    {
        id: '7', status: 'pending',
        student: { name: 'Alex Brown',      id: 'SE155123', initials: 'AB', statusColor: 'bg-green-500' },
        equipment: { name: 'MacBook Air M2',       asset: 'FPT-LAP-095', icon: Laptop,          type: 'laptop'   },
        period:    { date: '31 Oct – 5 Nov 2024',  label: 'ACADEMIC PROJECT', labelColor: 'text-[#1E2B58] dark:text-blue-300' },
    },
    {
        id: '8', status: 'pending',
        student: { name: 'Ryan Smith',      id: 'AI168774', initials: 'RS', statusColor: 'bg-yellow-500' },
        equipment: { name: 'Sony A7 IV Camera',    asset: 'FPT-CAM-011', icon: Camera,          type: 'camera'   },
        period:    { date: '2 Nov 2024',            label: 'EXTERNAL EVENT', labelColor: 'text-orange-500 dark:text-orange-400' },
    },
    {
        id: '9', status: 'pending',
        student: { name: 'Jessica Lee',     id: 'SE157901', initials: 'JL', statusColor: 'bg-green-500' },
        equipment: { name: 'Dell XPS 15',          asset: 'FPT-LAP-097', icon: Laptop,          type: 'laptop'   },
        period:    { date: '4 Nov – 7 Nov 2024',   label: 'RESEARCH',      labelColor: 'text-purple-500 dark:text-purple-400' },
    },
    {
        id: '10', status: 'pending',
        student: { name: 'Michael Park',    id: 'SE164820', initials: 'MP', statusColor: 'bg-green-500' },
        equipment: { name: 'Epson Projector',      asset: 'FPT-PJ-022',  icon: Video,           type: 'projector' },
        period:    { date: '5 Nov 2024',            label: 'CLASS DEMO',    labelColor: 'text-[#1E2B58] dark:text-blue-300' },
    },
    {
        id: '11', status: 'pending',
        student: { name: 'Sophia Davis',    id: 'SE161503', initials: 'SD', statusColor: 'bg-green-500' },
        equipment: { name: 'Samsung Galaxy Tab',   asset: 'FPT-TAB-061', icon: TabletSmartphone, type: 'tablet'  },
        period:    { date: '6 Nov – 8 Nov 2024',   label: 'ACADEMIC PROJECT', labelColor: 'text-[#1E2B58] dark:text-blue-300' },
    },
    {
        id: '12', status: 'pending',
        student: { name: 'James Wilson',    id: 'AI172090', initials: 'JW', statusColor: 'bg-gray-400' },
        equipment: { name: 'Focusrite Interface',  asset: 'FPT-AUD-007', icon: Mic,             type: 'audio'    },
        period:    { date: '7 Nov 2024',            label: 'PERSONAL USE',  labelColor: 'text-slate-500 dark:text-slate-400' },
    },
    {
        id: '13', status: 'pending',
        student: { name: 'Olivia Taylor',   id: 'AI169335', initials: 'OT', statusColor: 'bg-yellow-500' },
        equipment: { name: 'Canon EOS R6',         asset: 'FPT-CAM-019', icon: Camera,          type: 'camera'   },
        period:    { date: '9 Nov – 10 Nov 2024',  label: 'EXTERNAL EVENT', labelColor: 'text-orange-500 dark:text-orange-400' },
    },
    {
        id: '14', status: 'pending',
        student: { name: 'Noah Martinez',   id: 'SE165280', initials: 'NM', statusColor: 'bg-green-500' },
        equipment: { name: 'LG 4K Display',        asset: 'FPT-MN-044',  icon: Monitor,         type: 'monitor'  },
        period:    { date: '10 Nov 2024',           label: 'CLASS DEMO',    labelColor: 'text-[#1E2B58] dark:text-blue-300' },
    },
];

const ROWS_PER_PAGE = 5;
const TOTAL_STAT = 128; // total historical count (fixed display stat)

// ─── Component ────────────────────────────────────────────────────────────────

export const ApprovalCenter: React.FC = () => {
    const location = useLocation();

    // ── Core state ────────────────────────────────────────────────────────────
    const [requests,     setRequests]     = useState<BorrowRequest[]>(INITIAL_REQUESTS);
    const [searchText,   setSearchText]   = useState('');
    const [showPanel,    setShowPanel]    = useState(false);
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
    const [typeFilter,   setTypeFilter]   = useState<TypeFilter>('all');
    const [currentPage,  setCurrentPage]  = useState(1);

    // ── Modal state ───────────────────────────────────────────────────────────
    const [approvingReq, setApprovingReq] = useState<BorrowRequest | null>(null);
    const [rejectingReq, setRejectingReq] = useState<BorrowRequest | null>(null);
    const [rejectReason, setRejectReason] = useState('');
    const [rejectError,  setRejectError]  = useState('');

    // ── Toast state ───────────────────────────────────────────────────────────
    const [toast, setToast] = useState<{ type: 'success' | 'info'; message: string } | null>(null);

    // ── Handle navigation from Equipment Catalog (new borrow request) ─────────
    useEffect(() => {
        const state = location.state as { newBorrowRequest?: { equipmentTitle: string } } | null;
        if (state?.newBorrowRequest) {
            showToast('info', `Your borrow request for "${state.newBorrowRequest.equipmentTitle}" has been submitted and is pending review.`);
        }
    }, []);

    // ── Toast helper ──────────────────────────────────────────────────────────
    const showToast = (type: 'success' | 'info', message: string) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 5000);
    };

    // ── Derived counts ────────────────────────────────────────────────────────
    const pendingCount   = requests.filter(r => r.status === 'pending').length;

    // ── Filter logic ──────────────────────────────────────────────────────────
    const filteredRequests = useMemo(() => {
        const q = searchText.toLowerCase();
        return requests.filter(r => {
            if (statusFilter !== 'all' && r.status !== statusFilter) return false;
            if (typeFilter   !== 'all' && r.equipment.type !== typeFilter) return false;
            if (q) {
                const matches =
                    r.student.name.toLowerCase().includes(q) ||
                    r.student.id.toLowerCase().includes(q)   ||
                    r.equipment.name.toLowerCase().includes(q) ||
                    r.equipment.asset.toLowerCase().includes(q);
                if (!matches) return false;
            }
            return true;
        });
    }, [requests, searchText, statusFilter, typeFilter]);

    // ── Pagination ────────────────────────────────────────────────────────────
    const totalPages = Math.max(1, Math.ceil(filteredRequests.length / ROWS_PER_PAGE));
    const safePage   = Math.min(currentPage, totalPages);
    const pagedItems = filteredRequests.slice((safePage - 1) * ROWS_PER_PAGE, safePage * ROWS_PER_PAGE);

    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    // Reset to page 1 on filter change
    const handleSearchChange    = (val: string) => { setSearchText(val);    setCurrentPage(1); };
    const handleStatusChange    = (val: StatusFilter) => { setStatusFilter(val); setCurrentPage(1); };
    const handleTypeChange      = (val: TypeFilter)   => { setTypeFilter(val);   setCurrentPage(1); };

    // ── Approve logic ─────────────────────────────────────────────────────────
    const handleApprove = (req: BorrowRequest) => setApprovingReq(req);

    const confirmApprove = () => {
        if (!approvingReq) return;
        setRequests(prev => prev.map(r =>
            r.id === approvingReq.id ? { ...r, status: 'approved' as RequestStatus } : r
        ));
        showToast('success', `Approved: ${approvingReq.student.name}'s request for ${approvingReq.equipment.name}.`);
        setApprovingReq(null);
        setCurrentPage(1);
    };

    // ── Reject logic ──────────────────────────────────────────────────────────
    const handleReject = (req: BorrowRequest) => {
        setRejectingReq(req);
        setRejectReason('');
        setRejectError('');
    };

    const confirmReject = (e: React.FormEvent) => {
        e.preventDefault();
        if (!rejectingReq) return;
        if (!rejectReason.trim()) { setRejectError('Please provide a reason for rejection.'); return; }
        setRequests(prev => prev.map(r =>
            r.id === rejectingReq.id ? { ...r, status: 'rejected' as RequestStatus } : r
        ));
        showToast('info', `Rejected: ${rejectingReq.student.name}'s request for ${rejectingReq.equipment.name}.`);
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
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement('a');
        a.href = url;
        a.download = `approval-log-${new Date().toISOString().slice(0,10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        showToast('success', 'Export complete! The CSV file has been downloaded.');
    };

    // ── Quick reject reasons ──────────────────────────────────────────────────
    const QUICK_REASONS = [
        'Insufficient documentation',
        'Equipment unavailable',
        'Inappropriate use case',
        'Conflicting schedule',
    ];

    // ─────────────────────────────────────────────────────────────────────────

    return (
        <div className="w-full">                <main className="pt-6 sm:pt-8 pb-10 px-4 sm:px-6 w-full max-w-[90vw] xl:max-w-7xl mx-auto flex-1 flex flex-col overflow-hidden">
                <div className="w-full">

                    {/* ── Toast notification ──────────────────────────────────── */}
                    {toast && (
                        <div className={`mb-6 flex items-start gap-3 px-5 py-4 rounded-[1.25rem] border text-sm font-medium animate-in fade-in slide-in-from-top-3 duration-300 ${
                            toast.type === 'success'
                                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                                : 'bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-400'
                        }`}>
                            {toast.type === 'success'
                                ? <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                                : <span className="material-symbols-outlined text-[1.25rem] shrink-0 mt-0.5 leading-none">info</span>
                            }
                            <span className="flex-1">{toast.message}</span>
                            <button onClick={() => setToast(null)} className="shrink-0 opacity-60 hover:opacity-100 transition-opacity">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    {/* ── Header ──────────────────────────────────────────────── */}
                    <div className="mb-8 md:mb-12">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <PageHeader
                                title="Approval Center"
                                subtitle="Review pending equipment and facility borrow requests. All approvals are logged for academic compliance."
                                className="items-start! text-left! md:mb-0 mb-0"
                            />

                            {/* Stats */}
                            <div className="flex flex-row items-center gap-4 shrink-0">
                                <div className="dashboard-card px-6 md:px-10 py-5 md:py-7 rounded-3xl md:rounded-4xl flex flex-col items-center justify-center min-w-32 md:min-w-40">
                                    <span className="text-4xl md:text-5xl font-black text-[#1E2B58] dark:text-white leading-none mb-1.5">
                                        {pendingCount}
                                    </span>
                                    <span className="text-[0.625rem] font-bold uppercase tracking-[0.2em] text-[#1E2B58]/50 dark:text-white/50">Pending</span>
                                </div>
                                <div className="dashboard-card px-6 md:px-10 py-5 md:py-7 rounded-3xl md:rounded-4xl flex flex-col items-center justify-center min-w-32 md:min-w-40">
                                    <span className="text-4xl md:text-5xl font-black text-slate-500 dark:text-slate-300 leading-none mb-1.5">
                                        {TOTAL_STAT}
                                    </span>
                                    <span className="text-[0.625rem] font-bold uppercase tracking-[0.2em] text-slate-500/70 dark:text-slate-400/70">Total</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Filter bar ──────────────────────────────────────────── */}
                    <ApprovalFilter
                        searchText={searchText}        onSearchChange={handleSearchChange}
                        showPanel={showPanel}          onTogglePanel={() => setShowPanel(p => !p)}
                        statusFilter={statusFilter}    onStatusFilterChange={handleStatusChange}
                        typeFilter={typeFilter}        onTypeFilterChange={handleTypeChange}
                        onExportLog={handleExportLog}
                        resultCount={filteredRequests.length}
                        totalPending={pendingCount}
                    />

                    {/* ── Table ───────────────────────────────────────────────── */}
                    <ApprovalTable
                        items={pagedItems}
                        totalPending={filteredRequests.length}
                        currentPage={safePage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        onApprove={handleApprove}
                        onReject={handleReject}
                    />
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
                                            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all hover:scale-105 active:scale-95 ${
                                                rejectReason === r
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
