import React, { useEffect, useState } from 'react';
import CustomDropdown from '../../components/shared/CustomDropdown';
import BorrowingTable from '../../components/admin/borrowing/BorrowingTable';
import UpcomingReturnCards from '../../components/admin/borrowing/UpcomingReturnCards';
import ReturnCalendar from '../../components/admin/borrowing/ReturnCalendar';
import NewBorrowModal from '../../components/admin/borrowing/NewBorrowModal';
import BorrowingDetailModal from '../../components/admin/borrowing/BorrowingDetailModal';
import { useBorrowRequestStore } from '../../stores/useBorrowRequestStore';
import type { BorrowRequest } from '../../types/borrowRequest';
import { PageHeader } from '@/components/shared/PageHeader';
import { toast } from 'sonner';

const BorrowingManagement: React.FC = () => {
    const borrowRecords = useBorrowRequestStore(state => state.borrowRequests);
    const loading = useBorrowRequestStore(state => state.loading);
    const fetchAll = useBorrowRequestStore(state => state.fetchAllBorrowRequests);
    const approveRequest = useBorrowRequestStore(state => state.approveBorrowRequest);
    const rejectRequest = useBorrowRequestStore(state => state.rejectBorrowRequest);
    const returnRequest = useBorrowRequestStore(state => state.returnBorrowRequest);
    const handoverRequest = useBorrowRequestStore(state => state.handoverBorrowRequest);
    const remindRequest = useBorrowRequestStore(state => state.remindBorrowRequest);

    const [isNewBorrowModalOpen, setIsNewBorrowModalOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<BorrowRequest | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('pending');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    const handleUpdateStatus = async (id: string, action: 'approved' | 'handed_over' | 'returned' | 'rejected') => {
        try {
            if (action === 'approved') await approveRequest(id);
            else if (action === 'handed_over') await handoverRequest(id);
            else if (action === 'returned') await returnRequest(id);
            else if (action === 'rejected') await rejectRequest(id);
            
            toast.success(`Request ${action} successfully`);
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to update status");
        }
    };

    const handleAlert = async (id: string) => {
        try {
            await remindRequest(id);
            toast.success("Reminder sent successfully to borrower");
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to send reminder");
        }
    };

    const handleViewDetails = (record: BorrowRequest) => {
        setSelectedRecord(record);
        setIsDetailModalOpen(true);
    };

    const handleViewDetailsById = (recordId: string) => {
        const record = borrowRecords.find(r => r._id === recordId);
        if (record) {
            handleViewDetails(record);
        }
    };

    const parseDateRaw = (dateStr: string) => {
        return new Date(dateStr).getTime();
    };

    const sortedRecords = borrowRecords
        .filter(record => {
            const borrower = typeof record.user_id === 'object' ? record.user_id?.displayName : 'Unknown';
            const equipment = typeof record.equipment_id === 'object' ? record.equipment_id?.name : 'Unknown Room/Item';

            const matchesSearch =
                borrower?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                equipment?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                record._id.toLowerCase().includes(searchQuery.toLowerCase());

            // Handle multi-status filtering for Active Loans (Handed Over + Overdue)
            const isRecOverdue = record.status === 'overdue' || (record.status === 'handed_over' && new Date(record.return_date) < new Date());
            
            const matchesStatus = statusFilter === 'All' 
                || (statusFilter === 'handed_over' && (record.status === 'handed_over' || isRecOverdue))
                || (statusFilter === 'overdue' && isRecOverdue)
                || record.status === statusFilter;

            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
            const timeA = parseDateRaw(a.borrow_date);
            const timeB = parseDateRaw(b.borrow_date);
            return sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
        });

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1A2B56] dark:border-blue-400"></div>
            </div>
        );
    }

    // Filter statuses for counts
    const now = new Date();
    const isOverdueGlobal = (r: typeof borrowRecords[0]) => 
        r.status === 'overdue' || (r.status === 'handed_over' && new Date(r.return_date) < now);

    const pendingCount = borrowRecords.filter(r => r.status === 'pending').length;
    const activeLoansCount = borrowRecords.filter(r => r.status === 'handed_over' || isOverdueGlobal(r)).length;
    const overdueCount = borrowRecords.filter(isOverdueGlobal).length;

    const isBlurred = isNewBorrowModalOpen || isDetailModalOpen;

    return (
        <div className="max-w-7xl mx-auto px-6 pt-6 sm:pt-8 pb-16 relative">
            {/* Background Blur for Modals */}
            <div className={`transition-all duration-300 ${isBlurred ? 'filter blur-sm opacity-50 pointer-events-none' : ''}`}>
                <div className="mb-8 px-2 flex flex-col md:flex-row md:items-center justify-between gap-6 mt-2">
                    <PageHeader
                        title="Borrowing & Circulation"
                        subtitle="Manage equipment loans, approvals, and upcoming returns."
                        className="items-start! text-left! mb-0!"
                    />
                    <button
                        onClick={() => setIsNewBorrowModalOpen(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-[#1A2B56] text-white rounded-2xl font-bold text-sm shadow-[0_10px_20px_rgba(26,43,86,0.3)] hover:opacity-90 transition-all border border-white/10 shrink-0"
                    >
                        <span className="material-symbols-outlined text-lg">add_circle</span>
                        Direct Allocation
                    </button>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Active Loans Card */}
                    <button
                        onClick={() => setStatusFilter(statusFilter === 'handed_over' ? 'All' : 'handed_over')}
                        className="group relative p-6 ambient-shadow flex items-center justify-between rounded-[24px] border transition-all duration-300 hover:scale-[1.02] active:scale-95 text-left w-full backdrop-blur-xl bg-white/60 dark:bg-slate-800/60 border-white/60 dark:border-white/10"
                    >
                        <div>
                            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500 mb-1">Active Loans</p>
                            <h3 className="text-3xl font-bold text-[#1A2B56] dark:text-white tracking-tight">{activeLoansCount}</h3>
                        </div>
                        <div className={`p-3 rounded-2xl transition-all duration-300 ${statusFilter === 'approved' ? 'text-blue-500 bg-blue-50 dark:bg-blue-900/40' : 'text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-700/30 group-hover:text-blue-500 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/40'}`}>
                            <span className="material-symbols-outlined text-3xl">swap_horiz</span>
                        </div>
                    </button>

                    {/* Pending Approvals Card */}
                    <button
                        onClick={() => setStatusFilter(statusFilter === 'pending' ? 'All' : 'pending')}
                        className="group relative p-6 ambient-shadow flex items-center justify-between rounded-[24px] border transition-all duration-300 hover:scale-[1.02] active:scale-95 text-left w-full backdrop-blur-xl bg-white/60 dark:bg-slate-800/60 border-white/60 dark:border-white/10"
                    >
                        <div>
                            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500 mb-1">Pending Approvals</p>
                            <h3 className="text-3xl font-bold text-[#1A2B56] dark:text-white tracking-tight">{pendingCount}</h3>
                        </div>
                        <div className={`p-3 rounded-2xl transition-all duration-300 ${statusFilter === 'pending' ? 'text-amber-500 bg-amber-50 dark:bg-amber-900/40' : 'text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-700/30 group-hover:text-amber-500 group-hover:bg-amber-50 dark:group-hover:bg-amber-900/40'}`}>
                            <span className="material-symbols-outlined text-3xl">pending_actions</span>
                        </div>
                    </button>

                    {/* Overdue Returns Card */}
                    <button
                        onClick={() => setStatusFilter(statusFilter === 'overdue' ? 'All' : 'overdue')}
                        className="group relative p-6 ambient-shadow flex items-center justify-between rounded-[24px] border transition-all duration-300 hover:scale-[1.02] active:scale-95 text-left w-full backdrop-blur-xl bg-white/60 dark:bg-slate-800/60 border-white/60 dark:border-white/10"
                    >
                        <div>
                            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500 mb-1">Overdue Returns</p>
                            <h3 className="text-3xl font-bold text-[#1A2B56] dark:text-white tracking-tight">{overdueCount}</h3>
                        </div>
                        <div className={`p-3 rounded-2xl transition-all duration-300 ${statusFilter === 'overdue' ? 'text-red-500 bg-red-50 dark:bg-red-900/40' : 'text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-700/30 group-hover:text-red-500 group-hover:bg-red-50 dark:group-hover:bg-red-900/40'}`}>
                            <span className="material-symbols-outlined text-3xl">warning</span>
                        </div>
                    </button>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
                    {/* Main Table Area */}
                    <div className="xl:col-span-2 space-y-8">
                        <div className="dashboard-card p-8 rounded-4xl transition-all duration-300">
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
                                    <div className="dashboard-card rounded-[1.25rem]! flex items-center">
                                        <button
                                            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-lg transition-colors flex items-center justify-center text-slate-500"
                                            title={sortOrder === 'asc' ? "Oldest First" : "Newest First"}
                                        >
                                            <span className="material-symbols-outlined text-[1.25rem]">
                                                {sortOrder === 'asc' ? 'south_east' : 'north_east'}
                                            </span>
                                        </button>
                                        <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1" />
                                        <CustomDropdown
                                            value={statusFilter as string}
                                            options={[
                                                { value: 'All', label: 'All Status' },
                                                { value: 'pending', label: 'Pending' },
                                                { value: 'approved', label: 'Approved' },
                                                { value: 'handed_over', label: 'Handed Over' },
                                                { value: 'overdue', label: 'Overdue' },
                                                { value: 'returned', label: 'Returned' },
                                                { value: 'rejected', label: 'Rejected' },
                                                { value: 'cancelled', label: 'Cancelled' },
                                            ]}
                                            onChange={v => setStatusFilter(v as any)}
                                            align="right"
                                        />
                                    </div>
                                </div>
                            </div>

                            <BorrowingTable
                                records={sortedRecords}
                                onApprove={(id) => handleUpdateStatus(id, 'approved')}
                                onHandover={(id) => handleUpdateStatus(id, 'handed_over')}
                                onReject={(id) => handleUpdateStatus(id, 'rejected')}
                                onReturn={(id) => handleUpdateStatus(id, 'returned')}
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
                onApprove={(id) => handleUpdateStatus(id, 'approved')}
                onHandover={(id) => handleUpdateStatus(id, 'handed_over')}
                onReject={(id) => handleUpdateStatus(id, 'rejected')}
                onReturn={(id) => handleUpdateStatus(id, 'returned')}
                onAlert={handleAlert}
            />
        </div>
    );
};

export default BorrowingManagement;
