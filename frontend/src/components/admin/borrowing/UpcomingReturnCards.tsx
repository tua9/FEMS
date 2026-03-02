import React from 'react';
import { BorrowRecord } from '../../../types/admin.types';

interface UpcomingReturnCardsProps {
    records: BorrowRecord[];
}

const UpcomingReturnCards: React.FC<UpcomingReturnCardsProps> = ({ records }) => {
    // Show only records that are due soon or overdue
    const attentionRecords = records.filter(r => r.isDueTodayOrTomorrow || r.status === 'Overdue');

    if (attentionRecords.length === 0) return null;

    return (
        <div className="mt-12 bg-white/40 dark:bg-slate-800/60 p-8 ambient-shadow border-amber-200/50 dark:border-amber-900/30 rounded-[32px] border backdrop-blur-xl">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-extrabold text-[#1A2B56] dark:text-white tracking-tight flex items-center gap-2">
                        <span className="material-symbols-outlined text-amber-500">event_upcoming</span>
                        Upcoming Returns Attention
                    </h3>
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-1 uppercase tracking-wider">
                        Loans requiring follow-up due to approaching deadlines or overdues
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {attentionRecords.map(record => (
                    <div key={record.id} className="bg-white/80 dark:bg-slate-700/60 p-5 rounded-2xl border border-white dark:border-slate-600 flex flex-col gap-3 group hover:bg-white dark:hover:bg-slate-700 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 backdrop-blur-sm relative overflow-hidden">
                        {record.status === 'Overdue' && (
                            <div className="absolute top-2.5 right-2.5 text-[9px] font-bold uppercase tracking-wider text-red-500 bg-red-500/10 border border-red-300/40 px-2 py-0.5 rounded-full">
                                Overdue
                            </div>
                        )}

                        <div className="flex items-center gap-3">
                            {record.borrowerAvatar ? (
                                <img alt="Avatar" className="w-12 h-12 rounded-full object-cover shadow-sm border border-slate-200 dark:border-slate-600" src={record.borrowerAvatar} />
                            ) : (
                                <div className="w-12 h-12 rounded-full bg-[#1A2B56] text-white flex items-center justify-center font-bold text-lg">
                                    {record.borrowerName.charAt(0)}
                                </div>
                            )}
                            <div>
                                <p className="text-sm font-bold text-slate-800 dark:text-white">{record.borrowerName}</p>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">{record.borrowerId}</p>
                            </div>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700 flex justify-between items-center">
                            <div>
                                <p className="text-[10px] text-slate-500 font-bold uppercase">Item</p>
                                <p className="text-xs font-bold text-[#1A2B56] dark:text-blue-300">{record.equipmentName}</p>
                            </div>
                            <span className="material-symbols-outlined text-slate-300 dark:text-slate-600">devices</span>
                        </div>

                        <div className="flex justify-between items-end mt-2 gap-4 flex-wrap">
                            <div>
                                <p className="text-[10px] text-slate-500 font-bold uppercase">Due Date</p>
                                <p className={`text-sm font-bold ${record.status === 'Overdue' ? 'text-red-500' : 'text-slate-800 dark:text-white'}`}>
                                    {record.dueDate}
                                </p>
                            </div>
                            <button className="text-[10px] font-bold px-4 py-2 bg-slate-100 dark:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-500 transition-all flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px]">mail</span> Remind
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UpcomingReturnCards;
