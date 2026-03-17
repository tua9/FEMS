import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { X, FileText, Laptop, CheckCircle2, XCircle, AlertTriangle, ArrowRight, Monitor, Cable, Router, Cpu, Mic, Camera, TabletSmartphone, MonitorCog } from 'lucide-react';

import { HistoryHeader } from '../../components/lecturer/history/HistoryHeader';
import { HistoryTabs } from '../../components/lecturer/history/HistoryTabs';
import { HistoryFilterBar } from '../../components/lecturer/history/HistoryFilterBar';

import {
    ReportHistoryTable,
    type ReportHistoryItem,
    type ReportSeverity,
} from '../../components/lecturer/history/ReportHistoryTable';

import {
    BorrowHistoryTable,
    type BorrowHistoryItem,
    type BorrowStatus,
} from '../../components/lecturer/history/BorrowHistoryTable';

import {
    ApprovalHistoryTable,
    type ApprovalHistoryItem,
} from '../../components/lecturer/history/ApprovalHistoryTable';

import { useBorrowRequestStore } from '../../stores/useBorrowRequestStore';
import { useReportStore } from '../../stores/useReportStore';
import type { BorrowRequestEquipment, BorrowRequestRoom, BorrowRequestUser } from '@/types/borrowRequest';

// ─── Constants ────────────────────────────────────────────────────────────────

type Tab = 'report' | 'borrow' | 'approval';

const ITEMS_PER_PAGE = 6;

const SEVERITY_COLORS: Record<string, string> = {
    CRITICAL: 'text-red-600 bg-red-100 border-red-200 dark:bg-red-900/30 dark:text-red-400',
    HIGH: 'text-orange-600 bg-orange-100 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400',
    MEDIUM: 'text-yellow-600 bg-yellow-100 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400',
    LOW: 'text-blue-600 bg-blue-100 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400',
};

// Maps DB equipment.category → Lucide icon
const CATEGORY_ICONS: Record<string, any> = {
    'laptop':        Laptop,
    'pc_lab':        MonitorCog,
    'iot_kit':       Cpu,
    'tablet':        TabletSmartphone,
    'camera':        Camera,
    'audio':         Mic,
    'network':       Router,
    'cable':         Cable,
    'electrical':    AlertTriangle,
    'infrastructure': Monitor,
    'it_device':     Laptop,
    'other':         FileText,
};

// ─── Detail Modal ─────────────────────────────────────────────────────────────

type ModalItem =
    | { type: 'report'; item: ReportHistoryItem }
    | { type: 'borrow'; item: BorrowHistoryItem }
    | { type: 'approval'; item: ApprovalHistoryItem };

// ─── Component ────────────────────────────────────────────────────────────────

export const MyHistory: React.FC = () => {
    const navigate = useNavigate();
    const location  = useLocation();

    // ── Stores ────────────────────────────────────────────────────────────────
    const { borrowRequests, approvedByMe, fetchMyBorrowRequests, fetchApprovedByMe, loading: borrowLoading, error: borrowError } = useBorrowRequestStore();
    const { myReports, fetchMyReports, loading: reportLoading, error: reportError } = useReportStore();

    // Re-fetch every time the user navigates to this page
    useEffect(() => {
        fetchMyBorrowRequests();
        fetchMyReports();
        fetchApprovedByMe();
    }, [location.pathname]);

    // ── Tab ────────────────────────────────────────────────────────────────────
    const [activeTab, setActiveTab] = useState<Tab>('report');

    // ── Filters (shared across tabs, reset on tab change) ─────────────────────
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFilter, setDateFilter] = useState('Last 30 Days');
    const [statusFilter, setStatusFilter] = useState('All');

    // ── Pagination (per tab) ───────────────────────────────────────────────────
    const [reportPage, setReportPage] = useState(1);
    const [borrowPage, setBorrowPage] = useState(1);
    const [approvalPage, setApprovalPage] = useState(1);

    // ── Detail modal ───────────────────────────────────────────────────────────
    const [modal, setModal] = useState<ModalItem | null>(null);

    // ── Mapping Data ──────────────────────────────────────────────────────────
    const mappedReports = useMemo<ReportHistoryItem[]>(() => {
        if (!myReports) return [];

        // DB type → display label
        const TYPE_LABEL: Record<string, string> = {
            'equipment':      'Equipment',
            'infrastructure': 'Infrastructure',
            'other':          'Other',
        };
        // DB type → icon
        const TYPE_ICON: Record<string, any> = {
            'equipment':      Laptop,
            'infrastructure': AlertTriangle,
            'other':          FileText,
        };

        return myReports.map((r: any) => {
            const room = (r.room_id && typeof r.room_id === 'object') ? r.room_id : null;
            const eq   = (r.equipment_id && typeof r.equipment_id === 'object') ? r.equipment_id : null;
            const locationLabel = room?.name || eq?.name || 'Unknown';

            const type = (r.type || 'other').toLowerCase();

            return {
                id:       `#${(r._id as string)?.substring(18).toUpperCase() || 'ID'}`,
                date:     r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A',
                category: TYPE_LABEL[type] ?? 'Other',
                location: locationLabel,
                block:    '-',
                severity: (r.severity?.toUpperCase() as ReportSeverity) || 'MEDIUM',
                status:   (r.status?.toUpperCase() as any) || 'PENDING',
                icon:     TYPE_ICON[type] ?? FileText,
                description: r.description,
                img:      r.img,
            };
        });
    }, [myReports]);

    const mappedBorrow = useMemo<BorrowHistoryItem[]>(() => {
        if (!borrowRequests) return [];
        return borrowRequests.map(b => {
            const statusMap: Record<string, BorrowStatus> = {
                'pending': 'PENDING' as any,
                'approved': 'APPROVED' as any,
                'handed_over': 'BORROWED',
                'returned': 'RETURNED',
                'rejected': 'REJECTED' as any
            };

            let status = statusMap[b.status] || 'BORROWED';

            if (status === 'BORROWED' && b.return_date && new Date(b.return_date) < new Date()) {
                status = 'OVERDUE';
            }

            const extractClassInfo = (note: string) => {
                if (!note) return null;
                const coursePattern = /([A-Z]{2,3}\d{4})/i;
                const roomPattern = /(?:Phòng|Room|Lớp|Class)\s*([A-Z]*\d+[A-Z]*)/i;
                const courseMatch = note.match(coursePattern);
                const roomMatch = note.match(roomPattern);
                if (courseMatch) return courseMatch[0];
                if (roomMatch) return roomMatch[0];
                return null;
            };

            const eq = b.equipment_id as any;
            const rm = b.room_id as any;
            const roomName = (rm && typeof rm === 'object' ? rm.name : null);
            const smartClassInfo = roomName || extractClassInfo(b.note || '') || 'Academic Use';

            return {
                id: (eq && typeof eq === 'object' ? eq.qr_code : null) 
                    || (rm && typeof rm === 'object' ? rm.name : null) 
                    || `#REQ-${(b._id as string)?.substring(18).toUpperCase() || '....'}`,
                course: smartClassInfo,
                group: b.type === 'equipment' ? 'Equipment Request' : (b.type || 'Infrastructure'),
                equipmentName: (eq && typeof eq === 'object' ? eq.name : null)
                               || (rm && typeof rm === 'object' ? rm.name : null)
                               || 'Asset',
                icon: CATEGORY_ICONS[(eq?.category || '').toLowerCase()] || (b.room_id ? Monitor : Laptop),
                period: `${b.borrow_date ? new Date(b.borrow_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : '?'} – ${b.return_date ? new Date(b.return_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : '?'}`,
                returnDate: b.note || '-',
                status: status as BorrowStatus
            };
        });
    }, [borrowRequests]);

    const mappedApproval = useMemo<ApprovalHistoryItem[]>(() => {
        return approvedByMe.map(a => {
            const user = a.user_id as BorrowRequestUser;
            const equipment = a.equipment_id as BorrowRequestEquipment;
            const room = a.room_id as BorrowRequestRoom;

            return {
                id: `#APP-${(a._id as string).substring(18).toUpperCase()}`,
                studentName: user?.displayName || 'User',
                studentId: (user?._id as string || '').substring(18).toUpperCase(),
                equipment: equipment?.name || room?.name || 'Asset',
                requestDate: a.borrow_date ? new Date(a.borrow_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '?',
                decidedDate: a.updatedAt ? new Date(a.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '?',
                decision: a.status === 'approved' ? 'APPROVED' : 'REJECTED',
                reason: a.note?.split('| Rejection Reason: ')[1] || undefined
            };
        });
    }, [approvedByMe]);

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
        if (activeTab === 'report') setReportPage(1);
        if (activeTab === 'borrow') setBorrowPage(1);
        if (activeTab === 'approval') setApprovalPage(1);
    };

    const handleSearchChange = (v: string) => { setSearchTerm(v); resetPage(); };
    const handleDateChange = (v: string) => { setDateFilter(v); resetPage(); };
    const handleStatusChange = (v: string) => { setStatusFilter(v); resetPage(); };

    const handleClearFilters = () => {
        setSearchTerm('');
        setDateFilter('Last 30 Days');
        setStatusFilter('All');
        resetPage();
    };

    const filteredReports = useMemo(() => {
        const q = searchTerm.toLowerCase();
        return mappedReports.filter(r => {
            const matchSearch = !q || r.id.toLowerCase().includes(q) || r.category.toLowerCase().includes(q) || r.location.toLowerCase().includes(q);
            const matchSeverity = statusFilter === 'All' || r.severity === statusFilter.toUpperCase();
            return matchSearch && matchSeverity;
        });
    }, [mappedReports, searchTerm, statusFilter]);

    const reportPages = Math.max(1, Math.ceil(filteredReports.length / ITEMS_PER_PAGE));
    const pagedReports = filteredReports.slice((reportPage - 1) * ITEMS_PER_PAGE, reportPage * ITEMS_PER_PAGE);

    const filteredBorrow = useMemo(() => {
        const q = searchTerm.toLowerCase();
        return mappedBorrow.filter(b => {
            const matchSearch = !q || b.id.toLowerCase().includes(q) || b.course.toLowerCase().includes(q) || b.equipmentName.toLowerCase().includes(q);
            const matchStatus = statusFilter === 'All' || b.status === statusFilter.toUpperCase() as BorrowStatus;
            return matchSearch && matchStatus;
        });
    }, [mappedBorrow, searchTerm, statusFilter]);

    const borrowPages = Math.max(1, Math.ceil(filteredBorrow.length / ITEMS_PER_PAGE));
    const pagedBorrow = filteredBorrow.slice((borrowPage - 1) * ITEMS_PER_PAGE, borrowPage * ITEMS_PER_PAGE);

    const filteredApproval = useMemo(() => {
        const q = searchTerm.toLowerCase();
        return mappedApproval.filter(a => {
            const matchSearch = !q || a.id.toLowerCase().includes(q) || a.studentName.toLowerCase().includes(q) || a.equipment.toLowerCase().includes(q);
            const matchDecision = statusFilter === 'All' || a.decision === statusFilter.toUpperCase();
            return matchSearch && matchDecision;
        });
    }, [mappedApproval, searchTerm, statusFilter]);

    const approvalPages = Math.max(1, Math.ceil(filteredApproval.length / ITEMS_PER_PAGE));
    const pagedApproval = filteredApproval.slice((approvalPage - 1) * ITEMS_PER_PAGE, approvalPage * ITEMS_PER_PAGE);

    const hasActiveFilters = searchTerm !== '' || statusFilter !== 'All' || dateFilter !== 'Last 30 Days';

    const FILTER_CONFIG: Record<Tab, { label: string; options: string[]; placeholder: string }> = {
        report: { label: 'Severity', options: ['All', 'Critical', 'High', 'Medium', 'Low'], placeholder: 'Search by Report ID, category, or location…' },
        borrow: { label: 'Status', options: ['All', 'Pending', 'Approved', 'Borrowed', 'Returned', 'Overdue'], placeholder: 'Search by ID, course, or equipment…' },
        approval: { label: 'Decision', options: ['All', 'Approved', 'Rejected'], placeholder: 'Search by ID, student name, or equipment…' },
    };

    const handleExportCsv = () => {
        let headers = '';
        let rows = '';

        if (activeTab === 'report') {
            headers = 'Report ID,Date,Category,Location,Block,Severity,Status\n';
            rows = filteredReports.map(r => `"${r.id}","${r.date}","${r.category}","${r.location}","${r.block}","${r.severity}","${r.status}"`).join('\n');
        } else if (activeTab === 'borrow') {
            headers = 'Asset ID,Class,Equipment,Borrow Period,Purpose,Status\n';
            rows = filteredBorrow.map(b => `"${b.id}","${b.course}","${b.equipmentName}","${b.period}","${b.returnDate}","${b.status}"`).join('\n');
        } else {
            headers = 'Request ID,Student Name,Student ID,Equipment,Request Date,Decided Date,Decision,Reason\n';
            rows = filteredApproval.map(a => `"${a.id}","${a.studentName}","${a.studentId}","${a.equipment}","${a.requestDate}","${a.decidedDate}","${a.decision}","${a.reason ?? ''}"`).join('\n');
        }

        const blob = new Blob([headers + rows], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `history-${activeTab}-${new Date().toISOString().slice(0, 10)}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const cfg = FILTER_CONFIG[activeTab];

    return (
        <div className="w-full">
            <main className="pt-6 sm:pt-8 pb-10 px-4 sm:px-6 w-full max-w-[90vw] xl:max-w-7xl mx-auto flex-1 flex flex-col overflow-hidden">
                <div className="w-full">
                    <HistoryHeader />

                    <HistoryTabs activeTab={activeTab} onTabChange={handleTabChange} />

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

                    <div className="transition-all duration-300">
                        {(borrowLoading || reportLoading) ? (
                            <div className="py-20 flex flex-col items-center justify-center gap-4">
                                <span className="material-symbols-outlined animate-spin text-4xl text-[#1E2B58]/20">progress_activity</span>
                                <p className="text-sm font-bold text-[#1E2B58]/40 uppercase tracking-widest">Syncing History Data...</p>
                            </div>
                        ) : (borrowError || reportError) ? (
                            <div className="py-20 flex flex-col items-center justify-center gap-3">
                                <span className="material-symbols-outlined text-4xl text-red-400">error</span>
                                <p className="text-sm font-bold text-red-500 uppercase tracking-widest">Failed to load data</p>
                                <p className="text-xs text-red-400/80">{borrowError || reportError}</p>
                                <button
                                    onClick={() => { fetchMyBorrowRequests(); fetchMyReports(); fetchApprovedByMe(); }}
                                    className="mt-2 px-6 py-2 rounded-full bg-[#1E2B58] text-white text-xs font-bold hover:scale-105 transition"
                                >
                                    Retry
                                </button>
                            </div>
                        ) : (
                            <>
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
                            </>
                        )}
                    </div>
                </div>
            </main>

            {modal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4"
                    onClick={e => { if (e.target === e.currentTarget) setModal(null); }}
                >
                    <div className="glass-card rounded-[2rem] p-8 w-full max-w-md shadow-2xl shadow-[#1E2B58]/20 relative animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                        <button
                            onClick={() => setModal(null)}
                            className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#1E2B58]/10 dark:hover:bg-white/10 transition"
                        >
                            <X className="w-4 h-4 text-[#1E2B58]/60 dark:text-white/60" />
                        </button>

                        {modal.type === 'report' && (() => {
                            const r = modal.item;
                            const Icon = r.icon || FileText;
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
                                            ['Category', r.category],
                                            ['Location', `${r.location}, ${r.block}`],
                                            ['Date', r.date],
                                        ].map(([k, v]) => (
                                            <div key={k} className="flex justify-between text-sm">
                                                <span className="text-[#1E2B58]/60 dark:text-white/50 font-medium">{k}</span>
                                                <span className="font-bold text-[#1E2B58] dark:text-white">{v}</span>
                                            </div>
                                        ))}

                                        {r.description && (
                                            <div className="pt-2 border-t border-[#1E2B58]/10 dark:border-white/10">
                                                <span className="text-[#1E2B58]/60 dark:text-white/50 font-medium text-sm block mb-1">Description</span>
                                                <p className="text-[#1E2B58] dark:text-white/90 text-sm font-medium leading-relaxed bg-white/30 dark:bg-slate-900/30 p-3 rounded-xl border border-white/40 dark:border-white/5">{r.description}</p>
                                            </div>
                                        )}

                                        {r.img && (
                                            <div className="pt-2 border-t border-[#1E2B58]/10 dark:border-white/10">
                                                <span className="text-[#1E2B58]/60 dark:text-white/50 font-medium text-sm block mb-2">Evidence Image</span>
                                                <div className="rounded-xl overflow-hidden border border-[#1E2B58]/10 dark:border-white/10 max-h-48 flex justify-center bg-black/5 dark:bg-black/20">
                                                    <img src={r.img} alt="Evidence" className="object-contain max-h-48 w-full" />
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex justify-between items-center text-sm pt-2 border-t border-[#1E2B58]/10 dark:border-white/10">
                                            <span className="text-[#1E2B58]/60 dark:text-white/50 font-medium">Severity</span>
                                            <span className={`text-[0.625rem] font-bold px-3 py-1 rounded-full border uppercase tracking-wider ${SEVERITY_COLORS[r.severity] || SEVERITY_COLORS['MEDIUM']}`}>{r.severity}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm pt-2 border-t border-[#1E2B58]/10 dark:border-white/10">
                                            <span className="text-[#1E2B58]/60 dark:text-white/50 font-medium">Status</span>
                                            <span className={`text-[0.625rem] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider ${r.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
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

                        {modal.type === 'borrow' && (() => {
                            const b = modal.item;
                            const Icon = b.icon || Laptop;
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
                                            ['Course/Class', b.course],
                                            ['Group', b.group],
                                            ['Period', b.period],
                                            ['Purpose', b.returnDate],
                                        ].map(([k, v]) => (
                                            <div key={k} className="flex justify-between text-sm">
                                                <span className="text-[#1E2B58]/60 dark:text-white/50 font-medium">{k}</span>
                                                <span className="font-bold text-[#1E2B58] dark:text-white">{v}</span>
                                            </div>
                                        ))}
                                        <div className="flex justify-between items-center text-sm pt-2 border-t border-[#1E2B58]/10 dark:border-white/10">
                                            <span className="text-[#1E2B58]/60 dark:text-white/50 font-medium">Status</span>
                                            <span className={`text-[0.625rem] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider ${b.status === 'RETURNED' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                                : b.status === 'OVERDUE' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                    : b.status === 'PENDING' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                                        : b.status === 'APPROVED' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
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

                        {modal.type === 'approval' && (() => {
                            const a = modal.item;
                            return (
                                <>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className={`w-12 h-12 rounded-[1rem] flex items-center justify-center ${a.decision === 'APPROVED' ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                                            {a.decision === 'APPROVED'
                                                ? <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                                                : <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                                            }
                                        </div>
                                        <div>
                                            <p className="text-[0.625rem] font-black uppercase tracking-widest text-[#1E2B58]/50 dark:text-white/40">Approval Detail</p>
                                            <h3 className="text-lg font-black text-[#1E2B58] dark:text-white">{a.id}</h3>
                                        </div>
                                    </div>
                                    <div className="space-y-3 bg-white/40 dark:bg-slate-800/40 rounded-[1.25rem] p-5 mb-6">
                                        {[
                                            ['Student', `${a.studentName} (${a.studentId})`],
                                            ['Equipment', a.equipment],
                                            ['Requested', a.requestDate],
                                            ['Decided', a.decidedDate],
                                        ].map(([k, v]) => (
                                            <div key={k} className="flex justify-between text-sm">
                                                <span className="text-[#1E2B58]/60 dark:text-white/50 font-medium">{k}</span>
                                                <span className="font-bold text-[#1E2B58] dark:text-white text-right ml-4">{v}</span>
                                            </div>
                                        ))}
                                        <div className="flex justify-between items-center text-sm pt-2 border-t border-[#1E2B58]/10 dark:border-white/10">
                                            <span className="text-[#1E2B58]/60 dark:text-white/50 font-medium">Decision</span>
                                            <span className={`text-[0.625rem] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider ${a.decision === 'APPROVED'
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
                                            View Student Requests <ArrowRight className="w-3.5 h-3.5" />
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
