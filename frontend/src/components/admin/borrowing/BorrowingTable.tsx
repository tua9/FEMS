import React from 'react';
import { BorrowRecord } from '../../../types/admin.types';

interface BorrowingTableProps {
    records: BorrowRecord[];
    onApprove?: (recordId: string) => void;
    onReject?: (recordId: string) => void;
    onReturn?: (recordId: string) => void;
    onAlert?: (recordId: string) => void;
}

const BorrowingTable: React.FC<BorrowingTableProps> = ({ records, onApprove, onReject, onReturn, onAlert }) => {
    const [processingId, setProcessingId] = React.useState<string | null>(null);

    const handleAction = async (id: string, action: ((id: string) => void) | undefined) => {
        if (!action) return;
        setProcessingId(id);
        try {
            await action(id);
        } finally {
            setProcessingId(null);
        }
    };
    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Pending': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400';
            case 'Approved': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
            case 'Returned': return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400';
            case 'Overdue': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
            case 'Rejected': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400';
            default: return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300';
        }
    };

    const rowBg = "bg-white/70 group-hover:bg-white dark:bg-slate-800/60 dark:group-hover:bg-slate-700/80 backdrop-blur-sm transition-colors";

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
                        <th className="px-3 pb-2 text-[10px] font-extrabold uppercase tracking-[0.15em] opacity-80">Borrower</th>
                        <th className="px-3 pb-2 text-[10px] font-extrabold uppercase tracking-[0.15em] opacity-80">Equipment</th>
                        <th className="px-3 pb-2 text-[10px] font-extrabold uppercase tracking-[0.15em] opacity-80">Due Date</th>
                        <th className="px-3 pb-2 text-[10px] font-extrabold uppercase tracking-[0.15em] opacity-80">Status</th>
                        <th className="px-3 pb-2 text-[10px] font-extrabold uppercase tracking-[0.15em] opacity-80 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {records.map(record => (
                        <tr key={record.id} className="group cursor-pointer">
                            <td className={`p-3 rounded-l-xl ${rowBg}`}>
                                <div className="flex items-center gap-3">
                                    {record.borrowerAvatar ? (
                                        <img alt={record.borrowerName} className="w-8 h-8 rounded-full object-cover shadow-sm border border-white dark:border-slate-600 flex-shrink-0" src={record.borrowerAvatar} />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-[#1A2B56] text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                                            {record.borrowerName.charAt(0)}
                                        </div>
                                    )}
                                    <div className="min-w-0">
                                        <p className="text-xs font-bold text-slate-800 dark:text-white truncate">{record.borrowerName}</p>
                                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">ID: {record.borrowerId}</p>
                                    </div>
                                </div>
                            </td>
                            <td className={`p-3 ${rowBg}`}>
                                <p className="text-xs font-bold text-slate-800 dark:text-white truncate">{record.equipmentName}</p>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold mt-0.5">ID: {record.equipmentId}</p>
                            </td>
                            <td className={`p-3 text-xs font-semibold text-slate-600 dark:text-slate-300 ${rowBg}`}>
                                <div>{record.dueDate}</div>
                                {record.status === 'Overdue' && <span className="text-[10px] text-red-500 font-bold bg-red-50 px-1.5 py-0.5 rounded-md border border-red-100">Expired</span>}
                            </td>
                            <td className={`p-3 ${rowBg}`}>
                                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center justify-center whitespace-nowrap ${getStatusStyle(record.status)}`}>
                                    {record.status}
                                </span>
                            </td>
                            <td className={`p-3 rounded-r-xl text-right ${rowBg}`}>
                                <div className="flex items-center justify-end gap-1.5">
                                    {processingId === record.id ? (
                                        <div className="px-4 py-1 animate-pulse text-[10px] font-black uppercase tracking-widest text-[#1A2B56] dark:text-blue-400 bg-white/50 dark:bg-slate-700 rounded-lg">Processing...</div>
                                    ) : (
                                        <>
                                            {record.status === 'Pending' && (
                                                <>
                                                    <button
                                                        onClick={() => handleAction(record.id, onApprove)}
                                                        className="px-2.5 py-1 bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white rounded-lg text-xs font-bold transition-colors border border-emerald-100"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction(record.id, onReject)}
                                                        className="px-2.5 py-1 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white rounded-lg text-xs font-bold transition-colors border border-red-100"
                                                    >
                                                        Reject
                                                    </button>
                                                </>
                                            )}
                                            {record.status === 'Approved' && (
                                                <button
                                                    onClick={() => handleAction(record.id, onReturn)}
                                                    className="px-2.5 py-1 bg-[#1A2B56] text-white hover:bg-[#2A3B66] rounded-lg text-xs font-bold transition-colors shadow-sm whitespace-nowrap"
                                                >
                                                    Mark Returned
                                                </button>
                                            )}
                                            {record.status === 'Overdue' && (
                                                <button
                                                    onClick={() => handleAction(record.id, onAlert)}
                                                    className="px-2.5 py-1 bg-red-600 text-white hover:bg-red-700 rounded-lg text-xs font-bold transition-colors shadow-sm flex items-center gap-1 whitespace-nowrap"
                                                >
                                                    <span className="material-symbols-outlined text-[13px]">warning</span> Alert
                                                </button>
                                            )}
                                            {record.status === 'Returned' && (
                                                <div className="px-2.5 py-1 text-[10px] font-black uppercase text-slate-400 tracking-widest">Completed</div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BorrowingTable;
