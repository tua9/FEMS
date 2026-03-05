import React, { useEffect, useState } from 'react';
import DamageReportTable from '../../components/admin/reports/DamageReportTable';
import ResolutionStats from '../../components/admin/reports/ResolutionStats';
import DamageReportDetailModal from '../../components/admin/reports/DamageReportDetailModal';
import TechnicianAssignmentModal from '../../components/admin/reports/TechnicianAssignmentModal';
import { adminApi } from '../../services/api/adminApi';
import { DamageReport, User } from '../../types/admin.types';

const DamageReports: React.FC = () => {
    const [reports, setReports] = useState<DamageReport[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Approved' | 'In Progress' | 'Resolved' | 'Rejected'>('All');
    const [priorityFilter, setPriorityFilter] = useState<'All' | 'High Priority' | 'Medium Priority' | 'Low Priority'>('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedReport, setSelectedReport] = useState<DamageReport | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [technicians, setTechnicians] = useState<User[]>([]);
    const reportsPerPage = 5;

    useEffect(() => {
        const fetchReportsData = async () => {
            try {
                const [reportsData, usersData] = await Promise.all([
                    adminApi.getDamageReports(),
                    adminApi.getUsersList()
                ]);
                setReports(reportsData);
                setTechnicians(usersData.filter(u => u.role === 'Technician'));
            } catch (error) {
                console.error("Failed to fetch reports data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReportsData();
    }, []);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, statusFilter, priorityFilter]);

    const handleOpenDetails = (report: DamageReport) => {
        setSelectedReport(report);
        setIsDetailModalOpen(true);
    };

    const handleApprove = (report: DamageReport) => {
        if (window.confirm(`Approve report ${report.id} and assign a technician for ${report.equipmentName}? Status will be set to 'Approved'.`)) {
            setReports(prev => prev.map(r => r.id === report.id ? { ...r, status: 'Approved' } : r));
        }
    };

    const handleReject = (report: DamageReport) => {
        if (window.confirm(`Are you sure you want to reject report ${report.id}?`)) {
            setReports(prev => prev.map(r => r.id === report.id ? { ...r, status: 'Rejected' } : r));
        }
    };

    const handleUndo = (report: DamageReport) => {
        if (window.confirm(`Restore report ${report.id} to Pending status?`)) {
            setReports(prev => prev.map(r => r.id === report.id ? { ...r, status: 'Pending' } : r));
        }
    };

    const handleOpenAssign = (report: DamageReport) => {
        setSelectedReport(report);
        setIsAssignModalOpen(true);
    };

    const handleConfirmAssign = (technician: User) => {
        if (!selectedReport) return;

        setReports(prev => prev.map(r =>
            r.id === selectedReport.id
                ? { ...r, status: 'In Progress', technicianId: technician.id, technicianName: technician.name }
                : r
        ));

        setIsAssignModalOpen(false);
        alert(`Assigned ${technician.name} to ${selectedReport.equipmentName}. Status is now 'In Progress'.`);
    };

    const handleQuickResolve = (report: DamageReport) => {
        if (window.confirm(`Mark ${report.id} as resolved? Status will be updated to 'Resolved'.`)) {
            setReports(prev => prev.map(r => r.id === report.id ? { ...r, status: 'Resolved' } : r));
        }
    };

    const filteredReports = reports.filter(report => {
        const matchesSearch =
            report.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            report.equipmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            report.reportedBy.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === 'All' || report.status === statusFilter;
        const matchesPriority = priorityFilter === 'All' || report.priority === priorityFilter;

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

    const pendingReports = reports.filter(r => r.status === 'Pending').length;
    const resolvedReports = reports.filter(r => r.status === 'Resolved').length;
    const criticalReports = reports.filter(r => r.priority === 'High Priority' && r.status !== 'Resolved').length;

    return (
        <div className="max-w-7xl mx-auto px-6 pb-16 relative">
            <div className="mb-8 px-2 flex flex-col md:flex-row md:items-end justify-between gap-6 mt-6">
                <div>
                    <h2 className="text-3xl font-extrabold text-[#1A2B56] dark:text-white tracking-tight">Damage Reports & Issues</h2>
                    <p className="text-slate-700 dark:text-slate-300 mt-1 font-medium">Track equipment issues, track maintenance and assign technicians.</p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-[#1A2B56] dark:text-white rounded-2xl font-bold text-sm shadow-md transition-all border border-slate-200 dark:border-slate-600">
                    <span className="material-symbols-outlined text-lg">download</span>
                    Export Data
                </button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div
                    onClick={() => {
                        if (statusFilter === 'Pending') setStatusFilter('All');
                        else { setStatusFilter('Pending'); setPriorityFilter('All'); }
                    }}
                    className="glass-card dark:!bg-slate-800/80 p-6 ambient-shadow flex items-center justify-between rounded-[24px] border border-white/40 dark:border-white/10 cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all group"
                >
                    <div>
                        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500 mb-1 transition-colors">Pending Reports</p>
                        <h3 className="text-3xl font-bold text-[#1A2B56] dark:text-white tracking-tight">{pendingReports}</h3>
                    </div>
                    <div className={`p-3 rounded-2xl transition-all duration-300 flex items-center justify-center ${statusFilter === 'Pending' ? 'text-red-500 bg-red-50 dark:bg-red-900/30' : 'text-slate-400 bg-slate-100/50 dark:bg-slate-700/50 group-hover:bg-red-50 dark:group-hover:bg-red-900/30 group-hover:text-red-500'}`}>
                        <span className="material-symbols-outlined text-3xl">report_problem</span>
                    </div>
                </div>
                <div
                    onClick={() => {
                        if (statusFilter === 'Resolved') setStatusFilter('All');
                        else { setStatusFilter('Resolved'); setPriorityFilter('All'); }
                    }}
                    className="glass-card dark:!bg-slate-800/80 p-6 ambient-shadow flex items-center justify-between rounded-[24px] border border-white/40 dark:border-white/10 cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all group"
                >
                    <div>
                        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500 mb-1 transition-colors">Resolved (This Month)</p>
                        <h3 className="text-3xl font-bold text-[#1A2B56] dark:text-white tracking-tight">{resolvedReports}</h3>
                    </div>
                    <div className={`p-3 rounded-2xl transition-all duration-300 flex items-center justify-center ${statusFilter === 'Resolved' ? 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30' : 'text-slate-400 bg-slate-100/50 dark:bg-slate-700/50 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/30 group-hover:text-emerald-500'}`}>
                        <span className="material-symbols-outlined text-3xl">task_alt</span>
                    </div>
                </div>
                <div
                    onClick={() => {
                        if (priorityFilter === 'High Priority') setPriorityFilter('All');
                        else { setPriorityFilter('High Priority'); setStatusFilter('All'); }
                    }}
                    className="glass-card dark:!bg-slate-800/80 p-6 ambient-shadow flex items-center justify-between rounded-[24px] border border-white/40 dark:border-white/10 cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all group"
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
                    <div className="bg-white/40 dark:bg-slate-800/60 p-8 ambient-shadow rounded-[32px] border border-white/40 dark:border-white/10 backdrop-blur-xl transition-all duration-300">
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
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value as any)}
                                        className="pl-4 pr-10 py-2.5 bg-white/70 dark:bg-slate-700 hover:bg-white dark:hover:bg-slate-600 rounded-2xl text-xs font-bold text-[#1A2B56] dark:text-blue-200 border border-white/80 dark:border-slate-500 shadow-sm transition-all focus:ring-0 outline-none cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20fill%3D%27none%27%20viewBox%3D%270%200%2020%2020%27%3E%3Cpath%20stroke%3D%27%236b7280%27%20stroke-linecap%3D%27round%27%20stroke-linejoin%3D%27round%27%20stroke-width%3D%271.5%27%20d%3D%27m6%208%204%204%204-4%27%2F%3E%3C%2Fsvg%3E')] bg-[length:18px_18px] bg-no-repeat bg-[right_10px_center] flex-shrink-0 min-w-[130px]"
                                    >
                                        <option value="All">All Status</option>
                                        <option value="Pending">Pending</option>
                                        <option value="Approved">Approved</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Resolved">Resolved</option>
                                        <option value="Rejected">Rejected</option>
                                    </select>
                                    <select
                                        value={priorityFilter}
                                        onChange={(e) => setPriorityFilter(e.target.value as any)}
                                        className="pl-4 pr-10 py-2.5 bg-white/70 dark:bg-slate-700 hover:bg-white dark:hover:bg-slate-600 rounded-2xl text-xs font-bold text-[#1A2B56] dark:text-blue-200 border border-white/80 dark:border-slate-500 shadow-sm transition-all focus:ring-0 outline-none cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20fill%3D%27none%27%20viewBox%3D%270%200%2020%2020%27%3E%3Cpath%20stroke%3D%27%236b7280%27%20stroke-linecap%3D%27round%27%20stroke-linejoin%3D%27round%27%20stroke-width%3D%271.5%27%20d%3D%27m6%208%204%204%204-4%27%2F%3E%3C%2Fsvg%3E')] bg-[length:18px_18px] bg-no-repeat bg-[right_10px_center] flex-shrink-0 min-w-[130px]"
                                    >
                                        <option value="All">All Priority</option>
                                        <option value="High Priority">High</option>
                                        <option value="Medium Priority">Medium</option>
                                        <option value="Low Priority">Low</option>
                                    </select>
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
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/40 dark:bg-slate-700 border border-white dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-600 transition-all disabled:opacity-50"
                                >
                                    <span className="material-symbols-outlined text-lg">chevron_left</span>
                                </button>

                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i + 1}
                                        onClick={() => setCurrentPage(i + 1)}
                                        className={`w-10 h-10 flex items-center justify-center rounded-xl font-semibold text-sm transition-all ${currentPage === i + 1
                                            ? 'bg-[#1A2B56] text-white shadow-md'
                                            : 'bg-white/40 dark:bg-slate-700 border border-white dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-600'
                                            }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}

                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages || totalPages === 0}
                                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/40 dark:bg-slate-700 border border-white dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-600 transition-all disabled:opacity-50"
                                >
                                    <span className="material-symbols-outlined text-lg">chevron_right</span>
                                </button>
                            </div>
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
                technicians={technicians}
                onClose={() => setIsAssignModalOpen(false)}
                onAssign={handleConfirmAssign}
                equipmentName={selectedReport?.equipmentName || ''}
            />
        </div>
    );
};

export default DamageReports;
