import React, { useEffect, useState } from 'react';
import BorrowingTable from '../../components/admin/borrowing/BorrowingTable';
import UpcomingReturnCards from '../../components/admin/borrowing/UpcomingReturnCards';
import ReturnCalendar from '../../components/admin/borrowing/ReturnCalendar';
import NewBorrowModal from '../../components/admin/borrowing/NewBorrowModal';
import BorrowingDetailModal from '../../components/admin/borrowing/BorrowingDetailModal';
import { adminApi } from '../../services/api/adminApi';
import { BorrowRecord } from '../../types/admin.types';
import { useLocation } from 'react-router-dom';

const BorrowingManagement: React.FC = () => {
    const location = useLocation();
    const [borrowRecords, setBorrowRecords] = useState<BorrowRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [isNewBorrowModalOpen, setIsNewBorrowModalOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<BorrowRecord | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<BorrowRecord['status'] | 'All'>('All');

    useEffect(() => {
        if (location.state && (location.state as any).status) {
            setStatusFilter((location.state as any).status);
        }
    }, [location.state]);

    const fetchBorrowingData = async () => {
        setLoading(true);
        try {
            const records = await adminApi.getBorrowingList();
            setBorrowRecords(records);
        } catch (error) {
            console.error("Failed to fetch borrowing data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBorrowingData();
    }, []);

    const handleUpdateStatus = async (id: string, status: BorrowRecord['status']) => {
        try {
            await adminApi.updateBorrowStatus(id, status);
            // Refresh local state
            setBorrowRecords(prev => prev.map(r => r.id === id ? { ...r, status } : r));
        } catch (error) {
            alert("Failed to update status");
        }
    };

    const handleAlert = async (id: string) => {
        try {
            await adminApi.sendBorrowAlert(id);
            alert("Alert sent successfully to the borrower.");
        } catch (error) {
            alert("Failed to send alert");
        }
    };

    const handleViewDetails = (record: BorrowRecord) => {
        setSelectedRecord(record);
        setIsDetailModalOpen(true);
    };

    const handleViewDetailsById = (recordId: string) => {
        const record = borrowRecords.find(r => r.id === recordId);
        if (record) {
            handleViewDetails(record);
        }
    };

    const parseDateRaw = (dateStr: string) => {
        const months: Record<string, number> = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
        const parts = dateStr.replace(',', '').split(' ');
        if (parts.length === 3) {
            return new Date(parseInt(parts[2]), months[parts[0]], parseInt(parts[1])).getTime();
        }
        return 0;
    };

    const sortedRecords = borrowRecords
        .filter(record => {
            const matchesSearch =
                record.borrowerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                record.equipmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                record.borrowerId.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesStatus = statusFilter === 'All' || record.status === statusFilter;

            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => parseDateRaw(a.dueDate) - parseDateRaw(b.dueDate));

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1A2B56] dark:border-blue-400"></div>
            </div>
        );
    }

    // Filter statuses for counts
    const pendingCount = borrowRecords.filter(r => r.status === 'Pending').length;
    const overdueCount = borrowRecords.filter(r => r.status === 'Overdue').length;
    const activeLoansCount = borrowRecords.filter(r => r.status === 'Approved').length;

    const isBlurred = isNewBorrowModalOpen || isDetailModalOpen;

    return (
        <div className="max-w-7xl mx-auto px-6 pb-16 relative">
            {/* Background Blur for Modals */}
            <div className={`transition-all duration-300 ${isBlurred ? 'filter blur-sm opacity-50 pointer-events-none' : ''}`}>
                <div className="mb-8 px-2 flex flex-col md:flex-row md:items-end justify-between gap-6 mt-6">
                    <div>
                        <h2 className="text-3xl font-extrabold text-[#1A2B56] dark:text-white tracking-tight">Borrowing & Circulation</h2>
                        <p className="text-slate-700 dark:text-slate-300 mt-1 font-semibold">Manage equipment loans, approvals, and upcoming returns.</p>
                    </div>
                    <button
                        onClick={() => setIsNewBorrowModalOpen(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-[#1A2B56] text-white rounded-2xl font-bold text-sm shadow-[0_10px_20px_rgba(26,43,86,0.3)] hover:opacity-90 transition-all border border-white/10"
                    >
                        <span className="material-symbols-outlined text-lg">add_circle</span>
                        Direct Allocation
                    </button>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Active Loans Card */}
                    <button
                        onClick={() => setStatusFilter('Approved')}
                        className={`group relative p-6 ambient-shadow flex items-center justify-between rounded-[24px] border transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl active:scale-95 text-left w-full backdrop-blur-xl
                            ${statusFilter === 'Approved'
                                ? 'bg-white/90 dark:bg-slate-800 border-blue-500 shadow-lg'
                                : 'bg-white/60 dark:bg-slate-800/60 border-white/60 dark:border-white/10 hover:bg-white/80 dark:hover:bg-slate-700'}
                        `}
                    >
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">Active Loans</p>
                            <h3 className="text-3xl font-extrabold text-[#1A2B56] dark:text-white">{activeLoansCount}</h3>
                        </div>
                        <div className={`p-3 rounded-2xl transition-all duration-300 ${statusFilter === 'Approved' ? 'text-blue-500 bg-blue-50 dark:bg-blue-900/40 shadow-sm' : 'text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-700/30'}`}>
                            <span className="material-symbols-outlined text-3xl">swap_horiz</span>
                        </div>
                    </button>

                    {/* Pending Approvals Card */}
                    <button
                        onClick={() => setStatusFilter('Pending')}
                        className={`group relative p-6 ambient-shadow flex items-center justify-between rounded-[24px] border transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl active:scale-95 text-left w-full backdrop-blur-xl
                            ${statusFilter === 'Pending'
                                ? 'bg-white/90 dark:bg-slate-800 border-amber-500 shadow-lg'
                                : 'bg-white/60 dark:bg-slate-800/60 border-white/60 dark:border-white/10 hover:bg-white/80 dark:hover:bg-slate-700'}
                        `}
                    >
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">Pending Approvals</p>
                            <h3 className="text-3xl font-extrabold text-[#1A2B56] dark:text-white">{pendingCount}</h3>
                        </div>
                        <div className={`p-3 rounded-2xl transition-all duration-300 ${statusFilter === 'Pending' ? 'text-amber-500 bg-amber-50 dark:bg-amber-900/40 shadow-sm' : 'text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-700/30'}`}>
                            <span className="material-symbols-outlined text-3xl">pending_actions</span>
                        </div>
                    </button>

                    {/* Overdue Returns Card */}
                    <button
                        onClick={() => setStatusFilter('Overdue')}
                        className={`group relative p-6 ambient-shadow flex items-center justify-between rounded-[24px] border transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl active:scale-95 text-left w-full backdrop-blur-xl
                            ${statusFilter === 'Overdue'
                                ? 'bg-white/90 dark:bg-slate-800 border-red-500 shadow-lg'
                                : 'bg-white/60 dark:bg-slate-800/60 border-white/60 dark:border-white/10 hover:bg-white/80 dark:hover:bg-slate-700'}
                        `}
                    >
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">Overdue Returns</p>
                            <h3 className="text-3xl font-extrabold text-[#1A2B56] dark:text-white">{overdueCount}</h3>
                        </div>
                        <div className={`p-3 rounded-2xl transition-all duration-300 ${statusFilter === 'Overdue' ? 'text-red-500 bg-red-50 dark:bg-red-900/40 shadow-sm' : 'text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-700/30'}`}>
                            <span className="material-symbols-outlined text-3xl">warning</span>
                        </div>
                        {overdueCount > 0 && (
                            <span className="absolute top-3 right-3 flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                            </span>
                        )}
                    </button>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
                    {/* Main Table Area */}
                    <div className="xl:col-span-2 space-y-8">
                        <div className="bg-white/40 dark:bg-slate-800/60 p-8 ambient-shadow rounded-[32px] border border-white/40 dark:border-white/10 backdrop-blur-xl transition-all duration-300">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                                <h4 className="font-extrabold text-[#1A2B56] dark:text-white text-lg">Loan Requests & Active Borrowings</h4>

                                <div className="flex items-center gap-3">
                                    <div className="relative w-full sm:w-64 bg-white/60 dark:bg-slate-700/50 rounded-xl border border-white/80 dark:border-slate-600 p-0.5 transition-all focus-within:ring-2 focus-within:ring-[#1A2B56]/10">
                                        <div className="relative flex items-center">
                                            <span className="material-symbols-outlined absolute left-3 text-slate-400 text-sm">search</span>
                                            <input
                                                className="w-full pl-9 pr-3 py-2 bg-transparent border-none rounded-xl text-xs font-medium focus:ring-0 transition-all outline-none placeholder:text-slate-400 dark:text-white"
                                                placeholder="Search user or item..."
                                                type="text"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                            />
                                            {searchQuery && (
                                                <button
                                                    onClick={() => setSearchQuery('')}
                                                    className="absolute right-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                                >
                                                    <span className="material-symbols-outlined text-sm">close</span>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <select
                                            value={statusFilter}
                                            onChange={(e) => setStatusFilter(e.target.value as any)}
                                            className="appearance-none pl-3 pr-8 py-2.5 bg-white/70 dark:bg-slate-700 hover:bg-white dark:hover:bg-slate-600 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 border border-white/80 dark:border-slate-500 shadow-sm transition-all outline-none cursor-pointer"
                                        >
                                            <option value="All">All Status</option>
                                            <option value="Pending">Pending</option>
                                            <option value="Approved">Approved</option>
                                            <option value="Overdue">Overdue</option>
                                            <option value="Returned">Returned</option>
                                            <option value="Rejected">Rejected</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <BorrowingTable
                                records={sortedRecords}
                                onApprove={(id) => handleUpdateStatus(id, 'Approved')}
                                onReject={(id) => handleUpdateStatus(id, 'Rejected')}
                                onReturn={(id) => handleUpdateStatus(id, 'Returned')}
                                onAlert={handleAlert}
                                onViewDetails={handleViewDetails}
                            />
                        </div>

                        <UpcomingReturnCards records={borrowRecords} onViewDetails={handleViewDetails} />
                    </div>

                    {/* Sidebar Area */}
                    <div className="xl:col-span-1">
                        <ReturnCalendar records={borrowRecords} onViewDetails={handleViewDetailsById} />
                    </div>
                </div>
            </div>

            {/* Modals */}
            <NewBorrowModal
                isOpen={isNewBorrowModalOpen}
                onClose={() => setIsNewBorrowModalOpen(false)}
            />

            <BorrowingDetailModal
                isOpen={isDetailModalOpen}
                record={selectedRecord}
                onClose={() => setIsDetailModalOpen(false)}
                onApprove={(id) => handleUpdateStatus(id, 'Approved')}
                onReject={(id) => handleUpdateStatus(id, 'Rejected')}
                onReturn={(id) => handleUpdateStatus(id, 'Returned')}
                onAlert={handleAlert}
            />
        </div>
    );
};

export default BorrowingManagement;
