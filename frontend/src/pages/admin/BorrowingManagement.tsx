import React, { useEffect, useState } from 'react';
import BorrowingTable from '../../components/admin/borrowing/BorrowingTable';
import UpcomingReturnCards from '../../components/admin/borrowing/UpcomingReturnCards';
import ReturnCalendar from '../../components/admin/borrowing/ReturnCalendar';
import NewBorrowModal from '../../components/admin/borrowing/NewBorrowModal';
import { adminApi } from '../../services/api/adminApi';
import { BorrowRecord } from '../../types/admin.types';

const BorrowingManagement: React.FC = () => {
    const [borrowRecords, setBorrowRecords] = useState<BorrowRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [isNewBorrowModalOpen, setIsNewBorrowModalOpen] = useState(false);

    useEffect(() => {
        const fetchBorrowingData = async () => {
            try {
                const records = await adminApi.getBorrowingList();
                setBorrowRecords(records);
            } catch (error) {
                console.error("Failed to fetch borrowing data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBorrowingData();
    }, []);

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

    return (
        <div className="max-w-7xl mx-auto px-6 pb-16 relative">
            {/* Background Blur for Modals */}
            <div className={`transition-all duration-300 ${isNewBorrowModalOpen ? 'filter blur-sm opacity-50 pointer-events-none' : ''}`}>
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
                    <div className="glass-card dark:!bg-slate-800/80 p-6 ambient-shadow flex items-center justify-between rounded-[24px] border border-white/40 dark:border-white/10">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">Active Loans</p>
                            <h3 className="text-3xl font-extrabold text-[#1A2B56] dark:text-white">{activeLoansCount}</h3>
                        </div>
                        <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-2xl text-blue-500">
                            <span className="material-symbols-outlined text-3xl">swap_horiz</span>
                        </div>
                    </div>
                    <div className="glass-card dark:!bg-slate-800/80 p-6 ambient-shadow flex items-center justify-between rounded-[24px] border border-white/40 dark:border-white/10">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">Pending Approvals</p>
                            <h3 className="text-3xl font-extrabold text-[#1A2B56] dark:text-white">{pendingCount}</h3>
                        </div>
                        <div className="bg-amber-50 dark:bg-amber-900/30 p-3 rounded-2xl text-amber-500">
                            <span className="material-symbols-outlined text-3xl">pending_actions</span>
                        </div>
                    </div>
                    <div className="glass-card dark:!bg-slate-800/80 p-6 ambient-shadow flex items-center justify-between rounded-[24px] border border-red-200 dark:border-red-900/40 bg-red-50/30">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500 mb-1">Overdue Returns</p>
                            <h3 className="text-3xl font-extrabold text-red-600 dark:text-red-400">{overdueCount}</h3>
                        </div>
                        <div className="bg-red-100 dark:bg-red-900/50 p-3 rounded-2xl text-red-600">
                            <span className="material-symbols-outlined text-3xl">warning</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Main Table Area */}
                    <div className="xl:col-span-2 space-y-8">
                        <div className="bg-white/40 dark:bg-slate-800/60 p-8 ambient-shadow rounded-[32px] border border-white/40 dark:border-white/10 backdrop-blur-xl transition-all duration-300">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                                <h4 className="font-extrabold text-[#1A2B56] dark:text-white text-lg">Loan Requests & Active Borrowings</h4>

                                <div className="flex items-center gap-3">
                                    <div className="relative w-full sm:w-64 bg-white/60 dark:bg-slate-700/50 rounded-xl border border-white/80 dark:border-slate-600 p-0.5">
                                        <div className="relative flex items-center">
                                            <span className="material-symbols-outlined absolute left-3 text-slate-400 text-sm">search</span>
                                            <input
                                                className="w-full pl-9 pr-3 py-2 bg-transparent border-none rounded-xl text-xs font-medium focus:ring-0 transition-all outline-none placeholder:text-slate-400 dark:text-white"
                                                placeholder="Search user or item..."
                                                type="text"
                                            />
                                        </div>
                                    </div>
                                    <button className="flex items-center justify-center p-2.5 bg-white/70 dark:bg-slate-700 hover:bg-white dark:hover:bg-slate-600 rounded-xl text-slate-700 dark:text-slate-200 border border-white/80 dark:border-slate-500 shadow-sm transition-all">
                                        <span className="material-symbols-outlined text-sm">filter_list</span>
                                    </button>
                                </div>
                            </div>

                            <BorrowingTable records={borrowRecords} />
                        </div>

                        <UpcomingReturnCards records={borrowRecords} />
                    </div>

                    {/* Sidebar Area */}
                    <div className="xl:col-span-1">
                        <ReturnCalendar />
                    </div>
                </div>
            </div>

            {/* Modals */}
            <NewBorrowModal
                isOpen={isNewBorrowModalOpen}
                onClose={() => setIsNewBorrowModalOpen(false)}
            />
        </div>
    );
};

export default BorrowingManagement;
