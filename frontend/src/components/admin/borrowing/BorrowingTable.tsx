import React from 'react';
import type { BorrowRequest } from '../../../types/borrowRequest';
import Pagination from '../../shared/Pagination';
import { useBorrowRequestStore } from '../../../stores/useBorrowRequestStore';

interface BorrowingTableProps {
    records: BorrowRequest[];
    onApprove?: (recordId: string) => void;
    onHandover?: (recordId: string) => void;
    onReject?: (recordId: string) => void;
    onReturn?: (recordId: string) => void;
    onAlert?: (recordId: string) => void;
    onViewDetails?: (record: BorrowRequest) => void;
}

const BorrowingTable: React.FC<BorrowingTableProps> = ({ records, onApprove, onHandover, onReject, onReturn, onViewDetails }) => {
    const actionLoading = useBorrowRequestStore(state => state.actionLoading);
    const [currentPage, setCurrentPage] = React.useState(1);
    const itemsPerPage = 5;

    // Reset pagination when records prop changes (e.g., from parent filtering)
    React.useEffect(() => {
        setCurrentPage(1);
    }, [records]);

    const totalPages = Math.ceil(records.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentRecords = records.slice(startIndex, startIndex + itemsPerPage);

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-amber-100/50 dark:bg-amber-900/30 text-amber-500 dark:text-amber-400';
            case 'approved': return 'bg-blue-100/50 dark:bg-blue-900/30 text-blue-500 dark:text-blue-400';
            case 'handed_over': return 'bg-indigo-100/50 dark:bg-indigo-900/30 text-indigo-500 dark:text-indigo-400';
            case 'overdue': return 'bg-red-100/50 dark:bg-red-900/30 text-red-500 dark:text-red-400';
            case 'returned': return 'bg-emerald-100/50 dark:bg-emerald-900/30 text-emerald-500 dark:text-emerald-400';
            case 'rejected': return 'bg-orange-100/50 dark:bg-orange-900/30 text-orange-500 dark:text-orange-400';
            default: return 'bg-slate-100/50 dark:bg-slate-800/60 text-slate-400 dark:text-slate-500';
        }
    };

    const rowBg = "bg-white/50 group-hover:bg-white/80 dark:bg-slate-800/40 dark:group-hover:bg-slate-700/60 backdrop-blur-sm transition-colors";

    return (
        <div>
            <table className="w-full text-left border-separate border-spacing-y-3">
                <colgroup>
                    <col className="w-[22%]" />
                    <col className="w-[22%]" />
                    <col className="w-[16%]" />
                    <col className="w-[14%]" />
                    <col className="w-[26%]" />
                </colgroup>
                <thead>
                    <tr className="text-slate-800 dark:text-slate-300">
                        <th className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.15em] opacity-80">Borrower</th>
                        <th className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.15em] opacity-80">Equipment</th>
                        <th className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.15em] opacity-80">Due Date</th>
                        <th className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.15em] opacity-80">Status</th>
                        <th className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.15em] opacity-80 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentRecords.map(record => {
                        const borrower = typeof record.user_id === 'object' ? record.user_id : null;
                        const equipment = typeof record.equipment_id === 'object' ? record.equipment_id : null;
                        const borrowerName = borrower?.displayName || 'Unknown';
                        const equipmentName = equipment?.name || 'Unknown Item';
                        const isOverdue = record.status === 'overdue' || (record.status === 'handed_over' && new Date(record.return_date) < new Date());
                        const displayStatus = isOverdue ? 'overdue' : (record.status as string);

                        return (
                            <tr
                                key={record._id}
                                onClick={() => onViewDetails?.(record)}
                                className="group cursor-pointer transition-all hover:scale-[1.002] active:scale-[0.998]"
                            >
                                <td className={`p-3 rounded-l-lg ${rowBg}`}>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-[#1A2B56] text-white flex items-center justify-center font-semibold text-xs flex-shrink-0">
                                            {borrowerName.charAt(0)}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs font-semibold text-slate-800 dark:text-white truncate">{borrowerName}</p>
                                            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">ID: {borrower?._id || 'N/A'}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className={`p-3 ${rowBg}`}>
                                    <p className="text-xs font-semibold text-slate-800 dark:text-white truncate">{equipmentName}</p>
                                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">ID: {record._id.substring(0, 8)}...</p>
                                </td>
                                <td className={`p-3 text-xs font-medium ${isOverdue ? 'text-red-500 font-bold' : 'text-slate-400 dark:text-slate-500'} ${rowBg}`}>
                                    <div>{new Date(record.return_date).toLocaleDateString()}</div>
                                </td>
                            <td className={`p-3 ${rowBg}`}>
                                <span className={`px-2 py-1 rounded-full text-[10px] font-medium uppercase tracking-wider inline-flex items-center justify-center whitespace-nowrap ${getStatusStyle(displayStatus)}`}>
                                    {displayStatus}
                                </span>
                            </td>
                            <td className={`p-3 rounded-r-lg text-right ${rowBg}`}>
                                <div className="flex items-center justify-end gap-1.5">
                                    {actionLoading === record._id ? (
                                        <div className="px-4 py-1 animate-pulse text-[10px] font-semibold uppercase tracking-widest text-[#1A2B56] dark:text-blue-400 bg-white/50 dark:bg-slate-700 rounded-lg">Processing...</div>
                                    ) : (
                                        <>
                                            {record.status === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); onApprove?.(record._id); }}
                                                        className="px-2.5 py-1 bg-emerald-100/50 text-emerald-500 hover:bg-emerald-500 hover:text-white rounded-md text-xs font-semibold transition-colors border border-emerald-100"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); onReject?.(record._id); }}
                                                        className="px-2.5 py-1 bg-red-100/50 text-red-500 hover:bg-red-500 hover:text-white rounded-md text-xs font-semibold transition-colors border border-red-100"
                                                    >
                                                        Reject
                                                    </button>
                                                </>
                                            )}
                                            {record.status === 'approved' && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); onHandover?.(record._id); }}
                                                    className="px-2.5 py-1 bg-[#1A2B56] text-white hover:bg-[#2A3B66] rounded-md text-xs font-semibold transition-all shadow-[0_5px_15px_rgba(26,43,86,0.2)] hover:shadow-[0_8px_20px_rgba(26,43,86,0.3)] hover:-translate-y-0.5 whitespace-nowrap active:scale-95"
                                                >
                                                    Handover
                                                </button>
                                            )}
                                            {(record.status === 'handed_over' || record.status === 'overdue' || isOverdue) && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); onReturn?.(record._id); }}
                                                    className="px-2.5 py-1 bg-indigo-600 text-white hover:bg-indigo-700 rounded-md text-xs font-semibold transition-all shadow-[0_5px_15px_rgba(79,70,229,0.2)] hover:shadow-[0_8px_20px_rgba(79,70,229,0.3)] hover:-translate-y-0.5 whitespace-nowrap active:scale-95"
                                                >
                                                    Confirm Return
                                                </button>
                                            )}
                                            {record.status === 'returned' && (
                                                <div className="px-2.5 py-1 text-[10px] font-semibold uppercase text-slate-400 tracking-widest">Completed</div>
                                            )}
                                            {record.status === 'rejected' && (
                                                <div className="px-2.5 py-1 text-[10px] font-semibold uppercase text-red-400 tracking-widest">Rejected</div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>

            {/* Pagination UI */}
            {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-between px-2">
                    <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                        Showing <span className="text-[#1A2B56] dark:text-blue-400">{startIndex + 1}</span> to <span className="text-[#1A2B56] dark:text-blue-400">{Math.min(startIndex + itemsPerPage, records.length)}</span> of {records.length}
                    </p>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
            )}
        </div>
    );
};

export default BorrowingTable;
