import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, FileText, Laptop, CheckCircle2, XCircle, AlertTriangle, ArrowRight } from 'lucide-react';

import { HistoryHeader } from '../../components/lecturer/history/HistoryHeader';
import { HistoryTabs } from '../../components/lecturer/history/HistoryTabs';
import { HistoryFilterBar } from '../../components/lecturer/history/HistoryFilterBar';

import {
    ReportHistoryTable,
    ReportHistoryItem,
    ALL_REPORT_HISTORY,
    ReportSeverity,
} from '../../components/lecturer/history/ReportHistoryTable';

import {
    BorrowHistoryTable,
    BorrowHistoryItem,
    ALL_BORROW_HISTORY,
    BorrowStatus,
} from '../../components/lecturer/history/BorrowHistoryTable';

import {
    ApprovalHistoryTable,
    ApprovalHistoryItem,
    ALL_APPROVAL_HISTORY,
} from '../../components/lecturer/history/ApprovalHistoryTable';

// ─── Constants ────────────────────────────────────────────────────────────────

type Tab = 'report' | 'borrow' | 'approval';

const ITEMS_PER_PAGE = 6;

const SEVERITY_COLORS: Record<ReportSeverity, string> = {
    CRITICAL: 'text-red-600 bg-red-100 border-red-200 dark:bg-red-900/30 dark:text-red-400',
    HIGH:     'text-orange-600 bg-orange-100 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400',
    MEDIUM:   'text-yellow-600 bg-yellow-100 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400',
    LOW:      'text-blue-600 bg-blue-100 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400',
};

// ─── Detail Modal ─────────────────────────────────────────────────────────────

type ModalItem =
    | { type: 'report';   item: ReportHistoryItem   }
    | { type: 'borrow';   item: BorrowHistoryItem   }
    | { type: 'approval'; item: ApprovalHistoryItem };

// ─── Component ────────────────────────────────────────────────────────────────

export const MyHistory: React.FC = () => {
    const navigate = useNavigate();

    // ── Tab ────────────────────────────────────────────────────────────────────
    const [activeTab, setActiveTab] = useState<Tab>('report');

    // ── Filters (shared across tabs, reset on tab change) ─────────────────────
    const [searchTerm,    setSearchTerm]    = useState('');
    const [dateFilter,    setDateFilter]    = useState('Last 30 Days');
    const [statusFilter,  setStatusFilter]  = useState('All');

    // ── Pagination (per tab) ───────────────────────────────────────────────────
    const [reportPage,   setReportPage]   = useState(1);
    const [borrowPage,   setBorrowPage]   = useState(1);
    const [approvalPage, setApprovalPage] = useState(1);

    // ── Detail modal ───────────────────────────────────────────────────────────
    const [modal, setModal] = useState<ModalItem | null>(null);

    // ── Tab change resets filters + page ──────────────────────────────────────
    const handleTabChange = (tab: Tab) => {
        setActiveTab(tab);
        setSearchTerm('');
        setStatusFilter('All');
        setDateFilter('Last 30 Days');
        setReportPage(1);
        setBorrowPage(1);
        setApprovalPage(1);
    };

    const resetPage = () => {
        if (activeTab === 'report')   setReportPage(1);
        if (activeTab === 'borrow')   setBorrowPage(1);
        if (activeTab === 'approval') setApprovalPage(1);
    };

    const handleSearchChange = (v: string)  => { setSearchTerm(v);   resetPage(); };
    const handleDateChange   = (v: string)  => { setDateFilter(v);   resetPage(); };
    const handleStatusChange = (v: string)  => { setStatusFilter(v); resetPage(); };

    const handleClearFilters = () => {
        setSearchTerm('');
        setDateFilter('Last 30 Days');
        setStatusFilter('All');
        resetPage();
    };

    // ── Filter + paginate: Report History ─────────────────────────────────────
    const filteredReports = useMemo(() => {
        const q = searchTerm.toLowerCase();
        return ALL_REPORT_HISTORY.filter(r => {
            const matchSearch = !q || r.id.toLowerCase().includes(q) || r.category.toLowerCase().includes(q) || r.location.toLowerCase().includes(q);
            const matchSeverity = statusFilter === 'All' || r.severity === statusFilter.toUpperCase();
            return matchSearch && matchSeverity;
        });
    }, [searchTerm, statusFilter]);

    const reportPages   = Math.max(1, Math.ceil(filteredReports.length / ITEMS_PER_PAGE));
    const pagedReports  = filteredReports.slice((reportPage - 1) * ITEMS_PER_PAGE, reportPage * ITEMS_PER_PAGE);

    // ── Filter + paginate: Borrow History ─────────────────────────────────────
    const filteredBorrow = useMemo(() => {
        const q = searchTerm.toLowerCase();
        return ALL_BORROW_HISTORY.filter(b => {
            const matchSearch = !q || b.id.toLowerCase().includes(q) || b.course.toLowerCase().includes(q) || b.equipmentName.toLowerCase().includes(q);
            const matchStatus = statusFilter === 'All' || b.status === statusFilter.toUpperCase() as BorrowStatus;
            return matchSearch && matchStatus;
        });
    }, [searchTerm, statusFilter]);

    const borrowPages   = Math.max(1, Math.ceil(filteredBorrow.length / ITEMS_PER_PAGE));
    const pagedBorrow   = filteredBorrow.slice((borrowPage - 1) * ITEMS_PER_PAGE, borrowPage * ITEMS_PER_PAGE);

    // ── Filter + paginate: Approval History ───────────────────────────────────
    const filteredApproval = useMemo(() => {
        const q = searchTerm.toLowerCase();
        return ALL_APPROVAL_HISTORY.filter(a => {
            const matchSearch   = !q || a.id.toLowerCase().includes(q) || a.studentName.toLowerCase().includes(q) || a.equipment.toLowerCase().includes(q);
            const matchDecision = statusFilter === 'All' || a.decision === statusFilter.toUpperCase();
            return matchSearch && matchDecision;
        });
    }, [searchTerm, statusFilter]);

    const approvalPages  = Math.max(1, Math.ceil(filteredApproval.length / ITEMS_PER_PAGE));
    const pagedApproval  = filteredApproval.slice((approvalPage - 1) * ITEMS_PER_PAGE, approvalPage * ITEMS_PER_PAGE);

    // ── hasActiveFilters ───────────────────────────────────────────────────────
    const hasActiveFilters = searchTerm !== '' || statusFilter !== 'All' || dateFilter !== 'Last 30 Days';

    // ── Per-tab filter config ─────────────────────────────────────────────────
    const FILTER_CONFIG: Record<Tab, { label: string; options: string[]; placeholder: string }> = {
        report:   { label: 'Severity', options: ['All', 'Critical', 'High', 'Medium', 'Low'],  placeholder: 'Search by Report ID, category, or location…'  },
        borrow:   { label: 'Status',   options: ['All', 'Borrowed', 'Returned', 'Overdue'],    placeholder: 'Search by ID, course, or equipment…'            },
        approval: { label: 'Decision', options: ['All', 'Approved', 'Rejected'],               placeholder: 'Search by ID, student name, or equipment…'      },
    };

    // ── Export CSV ─────────────────────────────────────────────────────────────
    const handleExportCsv = () => {
        let headers = '';
        let rows    = '';

        if (activeTab === 'report') {
            headers = 'Report ID,Date,Category,Location,Block,Severity,Status\n';
            rows    = filteredReports.map(r => `"${r.id}","${r.date}","${r.category}","${r.location}","${r.block}","${r.severity}","${r.status}"`).join('\n');
        } else if (activeTab === 'borrow') {
            headers = 'Request ID,Course,Group,Equipment,Borrow Period,Return Date,Status\n';
            rows    = filteredBorrow.map(b => `"${b.id}","${b.course}","${b.group}","${b.equipmentName}","${b.period}","${b.returnDate}","${b.status}"`).join('\n');
        } else {
            headers = 'Request ID,Student Name,Student ID,Equipment,Request Date,Decided Date,Decision,Reason\n';
            rows    = filteredApproval.map(a => `"${a.id}","${a.studentName}","${a.studentId}","${a.equipment}","${a.requestDate}","${a.decidedDate}","${a.decision}","${a.reason ?? ''}"`).join('\n');
        }

        const blob = new Blob([headers + rows], { type: 'text/csv' });
        const url  = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href     = url;
        link.download = `history-${activeTab}-${new Date().toISOString().slice(0, 10)}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    };

    // ── Filter config for current tab ─────────────────────────────────────────
    const cfg = FILTER_CONFIG[activeTab];

    // ─────────────────────────────────────────────────────────────────────────

    return (
        <div className="w-full">
            <main className="pt-6 sm:pt-8 pb-10 px-4 sm:px-6 w-full max-w-[90vw] xl:max-w-7xl mx-auto flex-1 flex flex-col overflow-hidden">
                <div className="w-full">
                    <HistoryHeader />

                    {/* Tabs */}
                    <HistoryTabs activeTab={activeTab} onTabChange={handleTabChange} />

                    {/* Filter bar */}
                    <HistoryFilterBar
                        searchPlaceholder={cfg.placeholder}
                        searchTerm={searchTerm}
                        onSearchChange={handleSearchChange}
                        dateFilter={dateFilter}
                        onDateFilterChange={handleDateChange}
                        filterLabel={cfg.label}
                        filterOptions={cfg.options}
                        statusFilter={statusFilter}
                        onStatusFilterChange={handleStatusChange}
                        hasActiveFilters={hasActiveFilters}
                        onClearFilters={handleClearFilters}
                        onExportCsv={handleExportCsv}
                    />

                    {/* Tables */}
                    <div className="transition-all duration-300">

                        {activeTab === 'report' && (
                            <ReportHistoryTable
                                items={pagedReports}
                                currentPage={reportPage}
                                totalPages={reportPages}
                                totalItems={filteredReports.length}
                                onPageChange={setReportPage}
                                onViewDetail={item => setModal({ type: 'report', item })}
                            />
                        )}

                        {activeTab === 'borrow' && (
                            <BorrowHistoryTable
                                items={pagedBorrow}
                                currentPage={borrowPage}
                                totalPages={borrowPages}
                                totalItems={filteredBorrow.length}
                                onPageChange={setBorrowPage}
                                onViewDetail={item => setModal({ type: 'borrow', item })}
                            />
                        )}

                        {activeTab === 'approval' && (
                            <ApprovalHistoryTable
                                items={pagedApproval}
                                currentPage={approvalPage}
                                totalPages={approvalPages}
                                totalItems={filteredApproval.length}
                                onPageChange={setApprovalPage}
                                onViewDetail={item => setModal({ type: 'approval', item })}
                            />
                        )}
                    </div>
                </div>
            </main>

            {/* ── Detail Modals ─────────────────────────────────────────────── */}
            {modal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4"
                    onClick={e => { if (e.target === e.currentTarget) setModal(null); }}
                >
                    <div className="glass-card rounded-[2rem] p-8 w-full max-w-md shadow-2xl shadow-[#1E2B58]/20 relative animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
                        {/* Close */}
                        <button
                            onClick={() => setModal(null)}
                            className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#1E2B58]/10 dark:hover:bg-white/10 transition"
                        >
                            <X className="w-4 h-4 text-[#1E2B58]/60 dark:text-white/60" />
                        </button>

                        {/* ── Report detail ─────────────────────────────────── */}
                        {modal.type === 'report' && (() => {
                            const r = modal.item;
                            const Icon = r.icon;
                            return (
                                <>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-12 h-12 rounded-[1rem] bg-[#1E2B58]/10 dark:bg-white/5 flex items-center justify-center">
                                            <Icon className="w-6 h-6 text-[#1E2B58] dark:text-white" strokeWidth={1.5} />
                                        </div>
                                        <div>
                                            <p className="text-[0.625rem] font-black uppercase tracking-widest text-[#1E2B58]/50 dark:text-white/40">Report Detail</p>
                                            <h3 className="text-lg font-black text-[#1E2B58] dark:text-white">{r.id}</h3>
                                        </div>
                                    </div>
                                    <div className="space-y-3 bg-white/40 dark:bg-slate-800/40 rounded-[1.25rem] p-5 mb-6">
                                        {[
                                            ['Category',  r.category],
                                            ['Location',  `${r.location}, ${r.block}`],
                                            ['Date',      r.date],
                                        ].map(([k, v]) => (
                                            <div key={k} className="flex justify-between text-sm">
                                                <span className="text-[#1E2B58]/60 dark:text-white/50 font-medium">{k}</span>
                                                <span className="font-bold text-[#1E2B58] dark:text-white">{v}</span>
                                            </div>
                                        ))}
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-[#1E2B58]/60 dark:text-white/50 font-medium">Severity</span>
                                            <span className={`text-[0.625rem] font-bold px-3 py-1 rounded-full border uppercase tracking-wider ${SEVERITY_COLORS[r.severity]}`}>{r.severity}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm pt-2 border-t border-[#1E2B58]/10 dark:border-white/10">
                                            <span className="text-[#1E2B58]/60 dark:text-white/50 font-medium">Status</span>
                                            <span className={`text-[0.625rem] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider ${
                                                r.status === 'RESOLVED'    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                                : r.status === 'IN PROGRESS' ? 'bg-[#1E2B58] text-white'
                                                : 'bg-slate-200 text-slate-700 dark:bg-slate-700/50 dark:text-slate-400'
                                            }`}>{r.status}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <button onClick={() => { setModal(null); navigate('/lecturer/report-issue'); }} className="flex-1 py-3 rounded-[1.25rem] font-bold text-sm bg-[#1E2B58] text-white hover:bg-[#151f40] hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-[#1E2B58]/20 flex items-center justify-center gap-2">
                                            <FileText className="w-4 h-4" /> Report Again <ArrowRight className="w-3.5 h-3.5" />
                                        </button>
                                        <button onClick={() => setModal(null)} className="flex-1 py-3 rounded-[1.25rem] font-bold text-sm border border-[#1E2B58]/20 dark:border-white/20 text-[#1E2B58]/70 dark:text-white/70 hover:bg-[#1E2B58]/5 transition-all">
                                            Close
                                        </button>
                                    </div>
                                </>
                            );
                        })()}

                        {/* ── Borrow detail ─────────────────────────────────── */}
                        {modal.type === 'borrow' && (() => {
                            const b = modal.item;
                            const Icon = b.icon;
                            return (
                                <>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-12 h-12 rounded-[1rem] bg-[#1E2B58]/10 dark:bg-white/5 flex items-center justify-center">
                                            <Icon className="w-6 h-6 text-[#1E2B58] dark:text-white" />
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
                                    <div className="space-y-3 bg-white/40 dark:bg-slate-800/40 rounded-[1.25rem] p-5 mb-6">
                                        {[
                                            ['Equipment', b.equipmentName],
                                            ['Course',    b.course],
                                            ['Group',     b.group],
                                            ['Period',    b.period],
                                            ['Returned',  b.returnDate],
                                        ].map(([k, v]) => (
                                            <div key={k} className="flex justify-between text-sm">
                                                <span className="text-[#1E2B58]/60 dark:text-white/50 font-medium">{k}</span>
                                                <span className="font-bold text-[#1E2B58] dark:text-white">{v}</span>
                                            </div>
                                        ))}
                                        <div className="flex justify-between items-center text-sm pt-2 border-t border-[#1E2B58]/10 dark:border-white/10">
                                            <span className="text-[#1E2B58]/60 dark:text-white/50 font-medium">Status</span>
                                            <span className={`text-[0.625rem] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider ${
                                                b.status === 'RETURNED' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                                : b.status === 'OVERDUE' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                : 'bg-[#1E2B58] text-white'
                                            }`}>{b.status}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <button onClick={() => { setModal(null); navigate('/lecturer/equipment'); }} className="flex-1 py-3 rounded-[1.25rem] font-bold text-sm bg-[#1E2B58] text-white hover:bg-[#151f40] hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-[#1E2B58]/20 flex items-center justify-center gap-2">
                                            <Laptop className="w-4 h-4" /> Borrow Again <ArrowRight className="w-3.5 h-3.5" />
                                        </button>
                                        <button onClick={() => setModal(null)} className="flex-1 py-3 rounded-[1.25rem] font-bold text-sm border border-[#1E2B58]/20 dark:border-white/20 text-[#1E2B58]/70 dark:text-white/70 hover:bg-[#1E2B58]/5 transition-all">
                                            Close
                                        </button>
                                    </div>
                                </>
                            );
                        })()}

                        {/* ── Approval detail ───────────────────────────────── */}
                        {modal.type === 'approval' && (() => {
                            const a = modal.item;
                            return (
                                <>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className={`w-12 h-12 rounded-[1rem] flex items-center justify-center ${a.decision === 'APPROVED' ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                                            {a.decision === 'APPROVED'
                                                ? <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                                                : <XCircle     className="w-6 h-6 text-red-600 dark:text-red-400" />
                                            }
                                        </div>
                                        <div>
                                            <p className="text-[0.625rem] font-black uppercase tracking-widest text-[#1E2B58]/50 dark:text-white/40">Approval Detail</p>
                                            <h3 className="text-lg font-black text-[#1E2B58] dark:text-white">{a.id}</h3>
                                        </div>
                                    </div>
                                    <div className="space-y-3 bg-white/40 dark:bg-slate-800/40 rounded-[1.25rem] p-5 mb-6">
                                        {[
                                            ['Student',    `${a.studentName} (${a.studentId})`],
                                            ['Equipment',  a.equipment],
                                            ['Requested',  a.requestDate],
                                            ['Decided',    a.decidedDate],
                                        ].map(([k, v]) => (
                                            <div key={k} className="flex justify-between text-sm">
                                                <span className="text-[#1E2B58]/60 dark:text-white/50 font-medium">{k}</span>
                                                <span className="font-bold text-[#1E2B58] dark:text-white text-right ml-4">{v}</span>
                                            </div>
                                        ))}
                                        <div className="flex justify-between items-center text-sm pt-2 border-t border-[#1E2B58]/10 dark:border-white/10">
                                            <span className="text-[#1E2B58]/60 dark:text-white/50 font-medium">Decision</span>
                                            <span className={`text-[0.625rem] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider ${
                                                a.decision === 'APPROVED'
                                                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                            }`}>{a.decision}</span>
                                        </div>
                                        {a.reason && (
                                            <div className="pt-2 border-t border-[#1E2B58]/10 dark:border-white/10">
                                                <p className="text-[0.625rem] font-bold uppercase tracking-wider text-[#1E2B58]/50 dark:text-white/40 mb-1">Rejection Reason</p>
                                                <p className="text-sm text-[#1E2B58] dark:text-white font-medium">{a.reason}</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex gap-3">
                                        <button onClick={() => { setModal(null); navigate('/lecturer/approval'); }} className="flex-1 py-3 rounded-[1.25rem] font-bold text-sm bg-[#1E2B58] text-white hover:bg-[#151f40] hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-[#1E2B58]/20 flex items-center justify-center gap-2">
                                            View Approvals <ArrowRight className="w-3.5 h-3.5" />
                                        </button>
                                        <button onClick={() => setModal(null)} className="flex-1 py-3 rounded-[1.25rem] font-bold text-sm border border-[#1E2B58]/20 dark:border-white/20 text-[#1E2B58]/70 dark:text-white/70 hover:bg-[#1E2B58]/5 transition-all">
                                            Close
                                        </button>
                                    </div>
                                </>
                            );
                        })()}
                    </div>
                </div>
            )}
        </div>
    );
};
