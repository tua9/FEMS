import React, { useRef } from 'react';
import type { BorrowRequest } from '../../../types/borrowRequest';

interface UpcomingReturnCardsProps {
    records: BorrowRequest[];
    onViewDetails?: (record: BorrowRequest) => void;
}

const UpcomingReturnCards: React.FC<UpcomingReturnCardsProps> = ({ records, onViewDetails }) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Show only records that are due soon (within 7 days) or overdue, sorted by date
    const attentionRecords = records
        .filter(r => {
            if (r.status === 'returned' || r.status === 'rejected') return false;
            // Overdue is a derived state here, but for now we'll check return_date
            const returnDate = new Date(r.return_date).getTime();
            const today = new Date().getTime();
            const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;

            return (returnDate - today) <= sevenDaysInMs;
        })
        .sort((a, b) => new Date(a.return_date).getTime() - new Date(b.return_date).getTime());

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const { scrollLeft, clientWidth } = scrollContainerRef.current;
            const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
            scrollContainerRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    if (attentionRecords.length === 0) return null;

    return (
        <div className="mt-12 dashboard-card p-8 rounded-4xl">
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
                {attentionRecords.map(record => {
                    const borrower = typeof record.user_id === 'object' ? record.user_id : null;
                    const equipment = typeof record.equipment_id === 'object' ? record.equipment_id : null;
                    const borrowerName = borrower?.displayName || 'Unknown';
                    const equipmentName = equipment?.name || 'Unknown Item';
                    const isOverdue = new Date(record.return_date).getTime() < new Date().getTime();

                    return (
                        <div
                            key={record._id}
                            onClick={() => onViewDetails?.(record)}
                            className="min-w-[280px] md:min-w-[31%] lg:min-w-[31%] flex-shrink-0 snap-start bg-white/80 dark:bg-slate-700/60 p-6 rounded-[28px] border border-white dark:border-slate-600 flex flex-col gap-3 group hover:bg-white dark:hover:bg-slate-700 hover:-translate-y-2 shadow-sm hover:shadow-[0_30px_60px_-15px_rgba(26,43,86,0.3)] dark:hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] cursor-pointer transition-all duration-500 backdrop-blur-sm relative overflow-hidden"
                        >
                            {isOverdue && (
                                <div className="absolute top-2.5 right-2.5 text-[9px] font-bold uppercase tracking-wider text-red-500 bg-red-500/10 border border-red-300/40 px-2 py-0.5 rounded-full">
                                    Overdue
                                </div>
                            )}

                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-[#1A2B56] text-white flex items-center justify-center font-bold text-lg">
                                    {borrowerName.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-800 dark:text-white">{borrowerName}</p>
                                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">{borrower?._id || 'N/A'}</p>
                                </div>
                            </div>

                            <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700 flex justify-between items-center">
                                <div>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase">Item</p>
                                    <p className="text-xs font-bold text-[#1A2B56] dark:text-blue-300">{equipmentName}</p>
                                </div>
                                <span className="material-symbols-outlined text-slate-300 dark:text-slate-600">devices</span>
                            </div>

                            <div className="flex justify-between items-end mt-2 gap-4 flex-wrap">
                                <div>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase">Due Date</p>
                                    <p className={`text-sm font-bold ${isOverdue ? 'text-red-500' : 'text-slate-800 dark:text-white'}`}>
                                        {new Date(record.return_date).toLocaleDateString()}
                                    </p>
                                </div>
                                <button className="text-[10px] font-bold px-4 py-2 bg-slate-100 dark:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-500 transition-all flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[14px]">mail</span> Remind
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default UpcomingReturnCards;
