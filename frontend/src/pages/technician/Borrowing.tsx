import React, { useEffect, useState } from 'react';
import CustomDropdown from '@/components/shared/CustomDropdown';
import BorrowingTable from '@/components/admin/borrowing/BorrowingTable';
import UpcomingReturnCards from '@/components/admin/borrowing/UpcomingReturnCards';
import ReturnCalendar from '@/components/admin/borrowing/ReturnCalendar';
import NewBorrowModal from '@/components/admin/borrowing/NewBorrowModal';
import BorrowingDetailModal from '@/components/admin/borrowing/BorrowingDetailModal';
import { useBorrowRequestStore } from '@/stores/useBorrowRequestStore';
import type { BorrowRequest } from '@/types/borrowRequest';
import { PageHeader } from '@/components/shared/PageHeader';

const TechnicianBorrowing: React.FC = () => {
    const borrowRecords = useBorrowRequestStore(state => state.borrowRequests);
    const loading = useBorrowRequestStore(state => state.loading);
    const fetchAll = useBorrowRequestStore(state => state.fetchAllBorrowRequests);

    const [isNewBorrowModalOpen, setIsNewBorrowModalOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<BorrowRequest | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('All');

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    const handleViewDetails = (record: BorrowRequest) => {
        setSelectedRecord(record);
        setIsDetailModalOpen(true);
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
        .sort((a, b) => parseDateRaw(a.return_date) - parseDateRaw(b.return_date));

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1A2B56] dark:border-blue-400"></div>
            </div>
        );
    }

    const upcomingReturns = sortedRecords.filter(r => r.status === 'handed_over' || r.status === 'overdue');

    return (
        <div className="min-h-screen bg-linear-to-b from-[#e0eafc] to-white dark:from-[#0f172a] dark:to-[#1a2332] pt-6 sm:pt-10 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <PageHeader
                    title="Borrowing Management"
                    subtitle="Manage equipment borrowing requests, handovers, and returns."
                />

                {upcomingReturns.length > 0 && (
                    <div className="mb-8">
                        <UpcomingReturnCards
                            records={upcomingReturns.slice(0, 3)}
                        />
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-[#1a2b56]/40 rounded-3xl shadow-xl overflow-hidden border border-slate-200/50 dark:border-slate-700/50">
                            <div className="px-6 sm:px-8 py-6 border-b border-slate-200 dark:border-slate-700/50 flex justify-between items-center flex-wrap gap-4">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-slate-600 dark:text-slate-300">tune</span>
                                    <h2 className="text-lg font-bold text-slate-800 dark:text-white">Borrowing Records</h2>
                                </div>
                                <button
                                    onClick={() => setIsNewBorrowModalOpen(true)}
                                    className="bg-[#1A2B56] dark:bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-[#1A2B56]/90 dark:hover:bg-blue-700 transition-colors flex items-center gap-2"
                                >
                                    <span className="material-symbols-outlined">add</span>
                                    New Request
                                </button>
                            </div>

                            <div className="px-6 sm:px-8 py-6 space-y-4 sm:space-y-0 sm:flex sm:gap-4 flex-wrap border-b border-slate-200 dark:border-slate-700/50">
                                <input
                                    type="text"
                                    placeholder="Search by borrower or equipment..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="flex-1 min-w-0 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#1A2B56] dark:focus:ring-blue-500"
                                />
                                <CustomDropdown
                                    value={statusFilter}
                                    options={[
                                        { label: 'All', value: 'All' },
                                        { label: 'pending', value: 'pending' },
                                        { label: 'approved', value: 'approved' },
                                        { label: 'handed_over', value: 'handed_over' },
                                        { label: 'returned', value: 'returned' },
                                        { label: 'rejected', value: 'rejected' },
                                        { label: 'overdue', value: 'overdue' },
                                    ]}
                                    onChange={setStatusFilter}
                                />
                            </div>

                            <BorrowingTable
                                records={sortedRecords}
                                onViewDetails={handleViewDetails}
                            />
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <ReturnCalendar records={borrowRecords} />
                    </div>
                </div>
            </div>

            {isNewBorrowModalOpen && (
                <NewBorrowModal
                    isOpen={isNewBorrowModalOpen}
                    onClose={() => {
                        setIsNewBorrowModalOpen(false);
                        fetchAll();
                    }}
                />
            )}

            {selectedRecord && isDetailModalOpen && (
                <BorrowingDetailModal
                    isOpen={isDetailModalOpen}
                    record={selectedRecord}
                    onClose={() => setIsDetailModalOpen(false)}
                />
            )}
        </div>
    );
};

export default TechnicianBorrowing;
