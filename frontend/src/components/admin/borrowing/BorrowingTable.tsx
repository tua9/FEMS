import React from 'react';
import { BorrowRecord } from '../../../types/admin.types';

interface BorrowingTableProps {
    records: BorrowRecord[];
    onApprove?: (recordId: string) => void;
    onReject?: (recordId: string) => void;
    onReturn?: (recordId: string) => void;
    onAlert?: (recordId: string) => void;
    onViewDetails?: (record: BorrowRecord) => void;
}

const BorrowingTable: React.FC<BorrowingTableProps> = ({ records, onApprove, onReject, onReturn, onAlert, onViewDetails }) => {
    const [processingId, setProcessingId] = React.useState<string | null>(null);
    const [currentPage, setCurrentPage] = React.useState(1);
    const itemsPerPage = 5;

    // Reset pagination when records prop changes (e.g., from parent filtering)
    React.useEffect(() => {
        setCurrentPage(1);
    }, [records]);

    const handleAction = async (id: string, action: ((id: string) => void) | undefined) => {
        if (!action) return;
        setProcessingId(id);
        try {
            await action(id);
        } finally {
            setProcessingId(null);
        }
    };

    const totalPages = Math.ceil(records.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentRecords = records.slice(startIndex, startIndex + itemsPerPage);

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Pending': return 'bg-amber-100/50 dark:bg-amber-900/30 text-amber-500 dark:text-amber-400';
            case 'Approved': return 'bg-blue-100/50 dark:bg-blue-900/30 text-blue-500 dark:text-blue-400';
            case 'Returned': return 'bg-emerald-100/50 dark:bg-emerald-900/30 text-emerald-500 dark:text-emerald-400';
            case 'Overdue': return 'bg-red-100/50 dark:bg-red-900/30 text-red-500 dark:text-red-400';
            case 'Rejected': return 'bg-orange-100/50 dark:bg-orange-900/30 text-orange-500 dark:text-orange-400';
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
                    {currentRecords.map(record => (
                        <tr
                            key={record.id}
                            onClick={() => onViewDetails?.(record)}
                            className="group cursor-pointer transition-all hover:scale-[1.002] active:scale-[0.998]"
                        >
                            <td className={`p-3 rounded-l-lg ${rowBg}`}>
                                <div className="flex items-center gap-3">
                                    {record.borrowerAvatar ? (
                                        <img alt={record.borrowerName} className="w-8 h-8 rounded-full object-cover shadow-sm border border-white dark:border-slate-600 flex-shrink-0" src={record.borrowerAvatar} />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-[#1A2B56] text-white flex items-center justify-center font-semibold text-xs flex-shrink-0">
                                            {record.borrowerName.charAt(0)}
                                        </div>
                                    )}
                                    <div className="min-w-0">
                                        <p className="text-xs font-semibold text-slate-800 dark:text-white truncate">{record.borrowerName}</p>
                                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">ID: {record.borrowerId}</p>
                                    </div>
                                </div>
                            </td>
                            <td className={`p-3 ${rowBg}`}>
                                <p className="text-xs font-semibold text-slate-800 dark:text-white truncate">{record.equipmentName}</p>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">ID: {record.equipmentId}</p>
                            </td>
                            <td className={`p-3 text-xs font-medium text-slate-400 dark:text-slate-500 ${rowBg}`}>
                                <div>{record.dueDate}</div>
                            </td>
                            <td className={`p-3 ${rowBg}`}>
                                <span className={`px-2 py-1 rounded-full text-[10px] font-medium uppercase tracking-wider inline-flex items-center justify-center whitespace-nowrap ${getStatusStyle(record.status)}`}>
                                    {record.status}
                                </span>
                            </td>
                            <td className={`p-3 rounded-r-lg text-right ${rowBg}`}>
                                <div className="flex items-center justify-end gap-1.5">
                                    {processingId === record.id ? (
                                        <div className="px-4 py-1 animate-pulse text-[10px] font-semibold uppercase tracking-widest text-[#1A2B56] dark:text-blue-400 bg-white/50 dark:bg-slate-700 rounded-lg">Processing...</div>
                                    ) : (
                                        <>
                                            {record.status === 'Pending' && (
                                                <>
                                                    <button
                                                        onClick={() => handleAction(record.id, onApprove)}
                                                        className="px-2.5 py-1 bg-emerald-100/50 text-emerald-500 hover:bg-emerald-500 hover:text-white rounded-md text-xs font-semibold transition-colors border border-emerald-100"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction(record.id, onReject)}
                                                        className="px-2.5 py-1 bg-red-100/50 text-red-500 hover:bg-red-500 hover:text-white rounded-md text-xs font-semibold transition-colors border border-red-100"
                                                    >
                                                        Reject
                                                    </button>
                                                </>
                                            )}
                                            {record.status === 'Approved' && (
                                                <button
                                                    onClick={() => handleAction(record.id, onReturn)}
                                                    className="px-2.5 py-1 bg-[#1A2B56] text-white hover:bg-[#2A3B66] rounded-md text-xs font-semibold transition-colors shadow-sm whitespace-nowrap"
                                                >
                                                    Mark Returned
                                                </button>
                                            )}
                                            {record.status === 'Overdue' && (
                                                <div className="flex gap-1.5">
                                                    <button
                                                        onClick={() => handleAction(record.id, onAlert)}
                                                        className="px-2.5 py-1 bg-red-100/50 text-red-500 hover:bg-red-600 hover:text-white rounded-md text-xs font-semibold transition-colors border border-red-100 flex items-center gap-1 whitespace-nowrap"
                                                    >
                                                        <span className="material-symbols-outlined text-[13px]">warning</span> Alert
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction(record.id, onReturn)}
                                                        className="px-2.5 py-1 bg-[#1A2B56] text-white hover:bg-[#2A3B66] rounded-md text-xs font-semibold transition-colors shadow-sm whitespace-nowrap"
                                                    >
                                                        Mark Returned
                                                    </button>
                                                </div>
                                            )}
                                            {record.status === 'Returned' && (
                                                <div className="px-2.5 py-1 text-[10px] font-semibold uppercase text-slate-400 tracking-widest">Completed</div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination UI */}
            {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-between px-2">
                    <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                        Showing <span className="text-[#1A2B56] dark:text-blue-400">{startIndex + 1}</span> to <span className="text-[#1A2B56] dark:text-blue-400">{Math.min(startIndex + itemsPerPage, records.length)}</span> of {records.length}
                    </p>
                    <div className="flex items-center gap-1.5">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all border ${currentPage === 1 ? 'opacity-30 cursor-not-allowed border-slate-200 dark:border-slate-700' : 'hover:bg-white dark:hover:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 shadow-sm'}`}
                        >
                            <span className="material-symbols-outlined text-sm">chevron_left</span>
                        </button>

                        {Array.from({ length: totalPages }).map((_, i) => (
                            <button
                                key={i + 1}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`w-8 h-8 rounded-lg text-[10px] font-semibold transition-all ${currentPage === i + 1
                                    ? 'bg-[#1A2B56] text-white shadow-md border-[#1A2B56]'
                                    : 'hover:bg-white dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 border border-transparent hover:border-slate-200 dark:hover:border-slate-600'
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}

                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all border ${currentPage === totalPages ? 'opacity-30 cursor-not-allowed border-slate-200 dark:border-slate-700' : 'hover:bg-white dark:hover:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 shadow-sm'}`}
                        >
                            <span className="material-symbols-outlined text-sm">chevron_right</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BorrowingTable;
