import React, { useEffect, useState } from 'react';
import CustomDropdown from '../../components/shared/CustomDropdown';
import DamageReportTable from '../../components/admin/reports/DamageReportTable';
import Pagination from '../../components/shared/Pagination';
import ResolutionStats from '../../components/admin/reports/ResolutionStats';
import DamageReportDetailModal from '../../components/admin/reports/DamageReportDetailModal';
import TechnicianAssignmentModal from '../../components/admin/reports/TechnicianAssignmentModal';
import { useReportStore } from '../../stores/useReportStore';
import { useUserStore } from '../../stores/useUserStore';
import type { Report } from '../../types/report';
import type { User } from '../../types/user';
import { PageHeader } from '@/components/shared/PageHeader';
import { toast } from 'sonner';

const DamageReports: React.FC = () => {
    const { reports, loading, fetchAllReports, updateReportStatus } = useReportStore();
    const { users, fetchAllUsers } = useUserStore();

    const [isExporting, setIsExporting] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'All' | 'pending' | 'approved' | 'processing' | 'fixed' | 'rejected'>('All');
    const [priorityFilter, setPriorityFilter] = useState<'All' | 'High Priority' | 'Medium Priority' | 'Low Priority'>('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const reportsPerPage = 5;

    useEffect(() => {
        fetchAllReports();
        fetchAllUsers();
    }, [fetchAllReports, fetchAllUsers]);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, statusFilter, priorityFilter]);

    const handleOpenDetails = (report: Report) => {
        setSelectedReport(report);
        setIsDetailModalOpen(true);
    };

    const handleApprove = async (report: Report) => {
        try {
            await updateReportStatus(report._id, 'approved');
            toast.success(`Report ${report._id.slice(-8).toUpperCase()} approved`);
        } catch (error) {
            toast.error('Failed to approve report');
        }
    };

    const handleReject = async (report: Report) => {
        try {
            await updateReportStatus(report._id, 'rejected');
            toast.success(`Report ${report._id.slice(-8).toUpperCase()} rejected`);
        } catch (error) {
            toast.error('Failed to reject report');
        }
    };

    const handleUndo = async (report: Report) => {
        try {
            await updateReportStatus(report._id, 'pending');
            toast.success(`Report ${report._id.slice(-8).toUpperCase()} restored to pending`);
        } catch (error) {
            toast.error('Failed to restore report');
        }
    };

    const handleOpenAssign = (report: Report) => {
        setSelectedReport(report);
        setIsAssignModalOpen(true);
    };

    const handleConfirmAssign = async (technician: User) => {
        if (!selectedReport) return;

        try {
            // Updated to pass technician ID to the store
            await updateReportStatus(selectedReport._id, 'processing', technician._id);
            setIsAssignModalOpen(false);
            toast.success(`Assigned to ${technician.displayName || technician.username}. Status is now 'In Progress'.`);
        } catch (error) {
            toast.error('Failed to assign technician');
        }
    };

    const handleQuickResolve = async (report: Report) => {
        try {
            await updateReportStatus(report._id, 'fixed');
            toast.success(`Report ${report._id.slice(-8).toUpperCase()} resolved successfully`);
        } catch (error) {
            toast.error('Failed to resolve report');
        }
    };

    const filteredReports = reports.filter(report => {
        const eqName = typeof report.equipment_id === 'object' ? report.equipment_id?.name : 'Unknown';
        const reporter = typeof report.user_id === 'object' ? report.user_id?.displayName || report.user_id?.username : 'Unknown';

        const matchesSearch =
            report._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (eqName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (reporter || '').toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === 'All' || report.status === statusFilter;
        const matchesPriority = priorityFilter === 'All' || 
            (priorityFilter === 'High Priority' && report.priority === 'high') ||
            (priorityFilter === 'Medium Priority' && report.priority === 'medium') ||
            (priorityFilter === 'Low Priority' && report.priority === 'low');

        return matchesSearch && matchesStatus && matchesPriority;
    });

    const totalPages = Math.ceil(filteredReports.length / reportsPerPage);
    const indexOfLastReport = currentPage * reportsPerPage;
    const indexOfFirstReport = indexOfLastReport - reportsPerPage;
    const paginatedReports = filteredReports.slice(indexOfFirstReport, indexOfLastReport);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1A2B56] dark:border-blue-400"></div>
            </div>
        );
    }

    const pendingReports = reports.filter(r => r.status === 'pending').length;
    const resolvedReports = reports.filter(r => r.status === 'fixed').length;
    const criticalReports = reports.filter(r => r.priority === 'high').length;

    // ─── Export CSV ───────────────────────────────────────────────────────────────
    const handleExportData = () => {
        setIsExporting(true);

        // Export the currently filtered list (or all if no filter active)
        const dataToExport = filteredReports.length > 0 ? filteredReports : reports;

        const headers = [
            'Report ID',
            'Equipment Name',
            'Issue Description',
            'Reported By',
            'Date Reported',
            'Status',
            'Priority',
            'Assigned Technician',
        ];

        const escape = (val: string) => `"${(val ?? '').replace(/"/g, '""')}"`;

        const rows = dataToExport.map(r => [
            escape(r._id),
            escape(typeof r.equipment_id === 'object' ? r.equipment_id?.name || '' : ''),
            escape(r.description || ''),
            escape(typeof r.user_id === 'object' ? r.user_id?.displayName || r.user_id?.username || '' : ''),
            escape(r.createdAt || ''),
            escape(r.status),
            escape('Medium'), // Priority mock
            escape('—'),
        ].join(','));

        const csvContent = [headers.join(','), ...rows].join('\n');
        const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        const timestamp = new Date().toISOString().slice(0, 10);
        link.href = url;
        link.download = `FEMS_DamageReports_${timestamp}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        setTimeout(() => setIsExporting(false), 800);
    };

    return (
        <div className="max-w-7xl mx-auto px-6 pt-6 sm:pt-8 pb-16 relative">
            <div className="mb-8 px-2 flex flex-col md:flex-row md:items-center justify-between gap-6 mt-2">
                <PageHeader
                    title="Damage Reports & Issues"
                    subtitle="Track equipment issues, maintenance status and assign technicians."
                    className="items-start! text-left! mb-0!"
                />
                <button
                    onClick={handleExportData}
                    disabled={isExporting || reports.length === 0}
                    className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-[#1A2B56] dark:text-white rounded-2xl font-bold text-sm shadow-md transition-all border border-slate-200 dark:border-slate-600 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 shrink-0"
                >
                    <span className={`material-symbols-outlined text-lg ${isExporting ? 'animate-bounce' : ''}`}>
                        {isExporting ? 'hourglass_top' : 'download'}
                    </span>
                    {isExporting ? 'Exporting...' : 'Export Data'}
                </button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div
                    onClick={() => {
                        if (statusFilter === 'pending') setStatusFilter('All');
                        else { setStatusFilter('pending'); setPriorityFilter('All'); }
                    }}
                    className="dashboard-card p-6 flex items-center justify-between rounded-3xl cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all group"
                >
                    <div>
                        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500 mb-1 transition-colors">Pending Reports</p>
                        <h3 className="text-3xl font-bold text-[#1A2B56] dark:text-white tracking-tight">{pendingReports}</h3>
                    </div>
                    <div className={`p-3 rounded-2xl transition-all duration-300 flex items-center justify-center ${statusFilter === 'pending' ? 'text-red-500 bg-red-50 dark:bg-red-900/30' : 'text-slate-400 bg-slate-100/50 dark:bg-slate-700/50 group-hover:bg-red-50 dark:group-hover:bg-red-900/30 group-hover:text-red-500'}`}>
                        <span className="material-symbols-outlined text-3xl">report_problem</span>
                    </div>
                </div>
                <div
                    onClick={() => {
                        if (statusFilter === 'fixed') setStatusFilter('All');
                        else { setStatusFilter('fixed'); setPriorityFilter('All'); }
                    }}
                    className="dashboard-card p-6 flex items-center justify-between rounded-3xl cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all group"
                >
                    <div>
                        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500 mb-1 transition-colors">Fixed Reports</p>
                        <h3 className="text-3xl font-bold text-[#1A2B56] dark:text-white tracking-tight">{resolvedReports}</h3>
                    </div>
                    <div className={`p-3 rounded-2xl transition-all duration-300 flex items-center justify-center ${statusFilter === 'fixed' ? 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30' : 'text-slate-400 bg-slate-100/50 dark:bg-slate-700/50 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/30 group-hover:text-emerald-500'}`}>
                        <span className="material-symbols-outlined text-3xl">task_alt</span>
                    </div>
                </div>
                <div
                    onClick={() => {
                        if (priorityFilter === 'High Priority') setPriorityFilter('All');
                        else { setPriorityFilter('High Priority'); setStatusFilter('All'); }
                    }}
                    className="dashboard-card p-6 flex items-center justify-between rounded-3xl cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all group"
                >
                    <div>
                        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500 mb-1 transition-colors">Critical Issues</p>
                        <h3 className="text-3xl font-bold text-[#1A2B56] dark:text-white tracking-tight">{criticalReports}</h3>
                    </div>
                    <div className={`p-3 rounded-2xl transition-all duration-300 flex items-center justify-center ${priorityFilter === 'High Priority' ? 'text-amber-500 bg-amber-50 dark:bg-amber-900/30' : 'text-slate-400 bg-slate-100/50 dark:bg-slate-700/50 group-hover:bg-amber-50 dark:group-hover:bg-amber-900/30 group-hover:text-amber-500'}`}>
                        <span className="material-symbols-outlined text-3xl">warning</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Main Table Area */}
                <div className="xl:col-span-2 space-y-8">
                    <div className="dashboard-card p-8 rounded-4xl transition-all duration-300">
                        <div className="flex flex-row items-center justify-between gap-6 mb-8">
                            <h4 className="font-extrabold text-[#1A2B56] dark:text-white text-lg whitespace-nowrap">Report Management</h4>

                            <div className="flex items-center gap-3 flex-1 justify-end max-w-4xl">
                                <div className="relative flex-1 max-w-md bg-white/60 dark:bg-slate-700/50 rounded-2xl border border-white/80 dark:border-slate-600 p-0.5 shadow-sm">
                                    <div className="relative flex items-center">
                                        <span className="material-symbols-outlined absolute left-3.5 text-slate-400 text-lg font-light">search</span>
                                        <input
                                            className="w-full pl-11 pr-4 py-2.5 bg-transparent border-none rounded-2xl text-xs font-medium leading-none focus:ring-0 transition-all outline-none placeholder:text-slate-400 dark:text-white"
                                            placeholder="Search report ID, equipment or reporter..."
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="dashboard-card rounded-3xl! flex items-center gap-0 p-1 shrink-0">
                                    <CustomDropdown
                                        value={statusFilter}
                                        options={[
                                            { value: 'All', label: 'All Status' },
                                            { value: 'pending', label: 'Pending' },
                                            { value: 'approved', label: 'Approved' },
                                            { value: 'processing', label: 'In Progress' },
                                            { value: 'fixed', label: 'Fixed' },
                                            { value: 'rejected', label: 'Rejected' },
                                        ]}
                                        onChange={v => setStatusFilter(v as any)}
                                        align="right"
                                    />

                                    <div className="h-5 w-px bg-[#1E2B58]/10 dark:bg-white/10 mx-1" />

                                    <CustomDropdown
                                        value={priorityFilter}
                                        options={[
                                            { value: 'All', label: 'All Priority' },
                                            { value: 'High Priority', label: 'High' },
                                            { value: 'Medium Priority', label: 'Medium' },
                                            { value: 'Low Priority', label: 'Low' },
                                        ]}
                                        onChange={v => setPriorityFilter(v as any)}
                                        align="right"
                                    />

                                    <div className="h-5 w-px bg-[#1E2B58]/10 dark:bg-white/10 mx-1" />

                                    <button
                                        onClick={() => { setStatusFilter('All'); setPriorityFilter('All'); setSearchQuery(''); }}
                                        className="flex items-center justify-center w-9 h-9 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                                        title="Reset filters"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">filter_alt_off</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <DamageReportTable
                            reports={paginatedReports}
                            onOpenDetails={handleOpenDetails}
                            onApprove={handleApprove}
                            onReject={handleReject}
                            onUndo={handleUndo}
                            onAssign={handleOpenAssign}
                            onResolve={handleQuickResolve}
                        />

                        <div className="mt-8 flex items-center justify-between px-2">
                            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                Showing {paginatedReports.length} of {filteredReports.length} results
                            </p>
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                            />
                        </div>
                    </div>
                </div>

                {/* Sidebar Area */}
                <div className="xl:col-span-1">
                    <ResolutionStats reports={reports} />
                </div>
            </div>

            {/* Modals */}
            <DamageReportDetailModal
                isOpen={isDetailModalOpen}
                report={selectedReport}
                onClose={() => setIsDetailModalOpen(false)}
                onApprove={handleApprove}
                onReject={handleReject}
                onUndo={handleUndo}
                onAssign={handleOpenAssign}
                onResolve={handleQuickResolve}
            />

            <TechnicianAssignmentModal
                isOpen={isAssignModalOpen}
                technicians={users.filter(u => u.role === 'technician')}
                reports={reports}
                onClose={() => setIsAssignModalOpen(false)}
                onAssign={handleConfirmAssign}
                equipmentName={typeof selectedReport?.equipment_id === 'object' ? selectedReport?.equipment_id?.name || '' : ''}
            />
        </div>
    );
};

export default DamageReports;
