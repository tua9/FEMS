import React, { useRef } from 'react';
import { BorrowRecord } from '../../../types/admin.types';

interface UpcomingReturnCardsProps {
    records: BorrowRecord[];
    onViewDetails?: (record: BorrowRecord) => void;
}

const UpcomingReturnCards: React.FC<UpcomingReturnCardsProps> = ({ records, onViewDetails }) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Helper to parse "Mar DD, 2026" or "Feb DD, 2026" etc.
    const parseDate = (dateStr: string) => {
        const months: Record<string, number> = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
        const parts = dateStr.replace(',', '').split(' ');
        if (parts.length === 3) {
            return new Date(parseInt(parts[2]), months[parts[0]], parseInt(parts[1])).getTime();
        }
        return 0;
    };

    // Show only records that are due soon (within 7 days) or overdue, sorted by date
    const attentionRecords = records
        .filter(r => {
            if (r.status === 'Returned' || r.status === 'Rejected') return false;
            if (r.status === 'Overdue') return true;

            const dueDateTimestamp = parseDate(r.dueDate);
            const currentTimestamp = new Date(2026, 2, 3).getTime(); // March 3, 2026
            const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;

            return dueDateTimestamp >= currentTimestamp && (dueDateTimestamp - currentTimestamp) <= sevenDaysInMs;
        })
        .sort((a, b) => parseDate(a.dueDate) - parseDate(b.dueDate));

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const { scrollLeft, clientWidth } = scrollContainerRef.current;
            const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
            scrollContainerRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

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

                {/* Navigation Arrows */}
                <div className="flex gap-2">
                    <button
                        onClick={() => scroll('left')}
                        className="w-10 h-10 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-[#1A2B56] dark:hover:text-blue-400 shadow-sm border border-slate-100 dark:border-slate-600 transition-all hover:scale-110 active:scale-95"
                    >
                        <span className="material-symbols-outlined">chevron_left</span>
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="w-10 h-10 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-[#1A2B56] dark:hover:text-blue-400 shadow-sm border border-slate-100 dark:border-slate-600 transition-all hover:scale-110 active:scale-95"
                    >
                        <span className="material-symbols-outlined">chevron_right</span>
                    </button>
                </div>
            </div>

            <div
                ref={scrollContainerRef}
                className="flex gap-6 overflow-x-auto custom-scrollbar snap-x snap-mandatory scroll-smooth py-10 -my-10 px-4 -mx-4"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                <style dangerouslySetInnerHTML={{ __html: `.custom-scrollbar::-webkit-scrollbar { display: none; }` }} />
                {attentionRecords.map(record => (
                    <div
                        key={record.id}
                        onClick={() => onViewDetails?.(record)}
                        className="min-w-[280px] md:min-w-[31%] lg:min-w-[31%] flex-shrink-0 snap-start bg-white/80 dark:bg-slate-700/60 p-6 rounded-[28px] border border-white dark:border-slate-600 flex flex-col gap-3 group hover:bg-white dark:hover:bg-slate-700 hover:-translate-y-2 shadow-sm hover:shadow-[0_30px_60px_-15px_rgba(26,43,86,0.3)] dark:hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] cursor-pointer transition-all duration-500 backdrop-blur-sm relative overflow-hidden"
                    >
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
