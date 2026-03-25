import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { HistoryHeader } from '../../components/shared/history/HistoryHeader';
import { HistoryTabs } from '../../components/shared/history/HistoryTabs';
import { HistoryFilterBar } from '../../components/shared/history/HistoryFilterBar';
import { HistoryLoadingState } from '../../components/shared/history/HistoryLoadingState';
import { HistoryDetailModal } from '../../components/shared/history/HistoryDetailModal';
import { ReportHistoryTable } from '../../components/shared/history/ReportHistoryTable';
import { BorrowHistoryTable } from '../../components/shared/history/BorrowHistoryTable';
import { ApprovalHistoryTable } from '../../components/shared/history/ApprovalHistoryTable';
import BorrowCancelModal from '@/components/student/history/BorrowCancelModal';
import ReportCancelModal from '@/components/shared/history/ReportCancelModal';

import { useBorrowRequestStore } from '../../stores/useBorrowRequestStore';
import { useReportStore } from '../../stores/useReportStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { useHistoryMappings } from '../../hooks/useHistoryMappings';
// ─── Constants ────────────────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 6;

const FILTER_CONFIG= {
 report: { label: 'Severity', options: ['All', 'Critical', 'High', 'Medium', 'Low'], placeholder: 'Search by Report ID, category, or location…' },
 borrow: { label: 'Status', options: ['All', 'Pending', 'Approved', 'Borrowed', 'Returned', 'Overdue'], placeholder: 'Search by ID, course, or equipment…' },
 approval: { label: 'Decision', options: ['All', 'Approved', 'Rejected'], placeholder: 'Search by ID, student name, or equipment…' },
};

// ─── Component ────────────────────────────────────────────────────────────────

export const HistoryPage = () => {
 const location = useLocation();
 const { user } = useAuthStore();
 const isStudent = user?.role === 'student';

 // ── Stores ────────────────────────────────────────────────────────────────
 const {
 borrowRequests, approvedByMe,
 fetchMyBorrowRequests, fetchApprovedByMe,
 loading: borrowLoading, error: borrowError,
 cancelMyBorrowRequest,
 } = useBorrowRequestStore();

 const {
 myReports, fetchMyReports,
 loading: reportLoading, error: reportError,
 cancelMyReport,
 } = useReportStore();

 // Re-fetch every time the user navigates to this page
 useEffect(() => {
 fetchMyBorrowRequests();
 fetchMyReports();
 if (!isStudent) fetchApprovedByMe();
 }, [location.pathname, isStudent]);

 // ── Tab ───────────────────────────────────────────────────────────────────
 const [activeTab, setActiveTab] = useState('report');

 // ── Filters ───────────────────────────────────────────────────────────────
 const [searchTerm, setSearchTerm] = useState('');
 const [dateFilter, setDateFilter] = useState('Last 30 Days');
 const [statusFilter, setStatusFilter] = useState('All');

 // ── Pagination (per tab) ──────────────────────────────────────────────────
 const [reportPage, setReportPage] = useState(1);
 const [borrowPage, setBorrowPage] = useState(1);
 const [approvalPage, setApprovalPage] = useState(1);

 // ── Modals ────────────────────────────────────────────────────────────────
 const [modal, setModal] = useState(null);
 const [cancelTargetItem, setCancelTargetItem] = useState(null);
 const [cancelTargetReport, setCancelTargetReport] = useState(null);

 // ── Data mapping (via custom hook) ────────────────────────────────────────
 const { mappedReports, mappedBorrow, mappedApproval } = useHistoryMappings(
 myReports,
 borrowRequests,
 approvedByMe
 );

 // ── Handlers ──────────────────────────────────────────────────────────────
 const resetPage = () => {
 if (activeTab === 'report') setReportPage(1);
 if (activeTab === 'borrow') setBorrowPage(1);
 if (activeTab === 'approval') setApprovalPage(1);
 };

 const handleTabChange = (tab) => {
 setActiveTab(tab);
 setSearchTerm('');
 setStatusFilter('All');
 setDateFilter('Last 30 Days');
 setReportPage(1);
 setBorrowPage(1);
 setApprovalPage(1);
 };

 const handleSearchChange = (v) => { setSearchTerm(v); resetPage(); };
 const handleDateChange = (v) => { setDateFilter(v); resetPage(); };
 const handleStatusChange = (v) => { setStatusFilter(v); resetPage(); };

 const handleClearFilters = () => {
 setSearchTerm('');
 setDateFilter('Last 30 Days');
 setStatusFilter('All');
 resetPage();
 };

 const handleRetry = () => {
 fetchMyBorrowRequests();
 fetchMyReports();
 if (!isStudent) fetchApprovedByMe();
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

 const handleConfirmCancelBorrow = async (id, note) => {
 try {
 await cancelMyBorrowRequest(id, note);
 setCancelTargetItem(null);
 fetchMyBorrowRequests();
 } catch (error) {
 console.error(error);
 }
 };

 const handleConfirmCancelReport = async (note) => {
 if (!cancelTargetReport) return;
 try {
 await cancelMyReport(cancelTargetReport.original._id, note);
 setCancelTargetReport(null);
 fetchMyReports();
 } catch (error) {
 console.error(error);
 }
 };

 // ── Filtered & paged data ─────────────────────────────────────────────────
 const filteredReports = useMemo(() => {
 const q = searchTerm.toLowerCase();
 return mappedReports.filter(r => {
 const matchSearch = !q || r.id.toLowerCase().includes(q) || r.category.toLowerCase().includes(q) || r.location.toLowerCase().includes(q);
 const matchSeverity = statusFilter === 'All' || r.severity === statusFilter.toUpperCase();
 return matchSearch && matchSeverity;
 });
 }, [mappedReports, searchTerm, statusFilter]);

 const filteredBorrow = useMemo(() => {
 const q = searchTerm.toLowerCase();
 return mappedBorrow.filter(b => {
 const matchSearch = !q || b.id.toLowerCase().includes(q) || b.course.toLowerCase().includes(q) || b.equipmentName.toLowerCase().includes(q);
 const matchStatus = statusFilter === 'All' || b.status === statusFilter.toUpperCase();
 return matchSearch && matchStatus;
 });
 }, [mappedBorrow, searchTerm, statusFilter]);

 const filteredApproval = useMemo(() => {
 const q = searchTerm.toLowerCase();
 return mappedApproval.filter(a => {
 const matchSearch = !q || a.id.toLowerCase().includes(q) || a.studentName.toLowerCase().includes(q) || a.equipment.toLowerCase().includes(q);
 const matchDecision = statusFilter === 'All' || a.decision === statusFilter.toUpperCase();
 return matchSearch && matchDecision;
 });
 }, [mappedApproval, searchTerm, statusFilter]);

 const reportPages = Math.max(1, Math.ceil(filteredReports.length / ITEMS_PER_PAGE));
 const borrowPages = Math.max(1, Math.ceil(filteredBorrow.length / ITEMS_PER_PAGE));
 const approvalPages = Math.max(1, Math.ceil(filteredApproval.length / ITEMS_PER_PAGE));

 const pagedReports = filteredReports.slice((reportPage - 1) * ITEMS_PER_PAGE, reportPage * ITEMS_PER_PAGE);
 const pagedBorrow = filteredBorrow.slice((borrowPage - 1) * ITEMS_PER_PAGE, borrowPage * ITEMS_PER_PAGE);
 const pagedApproval = filteredApproval.slice((approvalPage - 1) * ITEMS_PER_PAGE, approvalPage * ITEMS_PER_PAGE);

 const hasActiveFilters = searchTerm !== '' || statusFilter !== 'All' || dateFilter !== 'Last 30 Days';
 const cfg = FILTER_CONFIG[activeTab];

 // ── Render ────────────────────────────────────────────────────────────────
 return (
 <div className="w-full">
 <main className="pt-6 sm:pt-24 pb-10 px-4 sm:px-6 w-full max-w-[90vw] xl:max-w-7xl mx-auto flex-1 flex flex-col overflow-hidden">
 <div className="w-full">
 <HistoryHeader />

 <HistoryTabs activeTab={activeTab} onTabChange={handleTabChange} hideApproval={isStudent} />

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
 <HistoryLoadingState
 loading={borrowLoading || reportLoading}
 error={borrowError || reportError}
 onRetry={handleRetry}
 />

 {!borrowLoading && !reportLoading && !borrowError && !reportError && (
 <>
 {activeTab === 'report' && (
 <ReportHistoryTable
 items={pagedReports}
 currentPage={reportPage}
 totalPages={reportPages}
 totalItems={filteredReports.length}
 onPageChange={setReportPage}
 onViewDetail={item => setModal({ type: 'report', item })}
 onCancel={item => setCancelTargetReport(item)}
 />
 )}

 {activeTab === 'borrow' && (
 <BorrowHistoryTable
 items={pagedBorrow}
 currentPage={borrowPage}
 totalPages={borrowPages}
 totalItems={filteredBorrow.length}
 onPageChange={setBorrowPage}
 onViewDetail={item => setModal({ type: 'borrow', item, mode: 'view' })}
 onEdit={item => setModal({ type: 'borrow', item, mode: 'edit' })}
 onCancel={item => setCancelTargetItem(item.original)}
 />
 )}

 {activeTab === 'approval' && !isStudent && (
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
 <HistoryDetailModal modal={modal} onClose={() => setModal(null)} />
 )}

 {cancelTargetItem && (
 <BorrowCancelModal
 item={cancelTargetItem}
 onClose={() => setCancelTargetItem(null)}
 onConfirm={(note) => handleConfirmCancelBorrow(cancelTargetItem._id, note)}
 />
 )}

 {cancelTargetReport && (
 <ReportCancelModal
 item={cancelTargetReport}
 onClose={() => setCancelTargetReport(null)}
 onConfirm={handleConfirmCancelReport}
 />
 )}
 </div>
 );
};

export default HistoryPage;
