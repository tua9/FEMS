import React, { useState } from 'react';
import { BorrowRecord } from '../../../types/admin.types';

interface ReturnCalendarProps {
    records?: BorrowRecord[];
}

// Mock return data keyed by day number
const MOCK_RETURNS: Record<number, { name: string; borrower: string; time: string; avatar?: string }[]> = {
    15: [
        { name: 'MacBook Pro M3', borrower: 'Sarah Jenkins', time: '10:00 AM' },
        { name: 'Canon EOS R6', borrower: 'Michael Chen', time: '2:30 PM' },
        { name: 'iPad Pro 12.9"', borrower: 'Emma Watson', time: '4:00 PM' },
    ],
    20: [
        { name: 'Dell Workstation #42', borrower: 'Marcus Lee', time: '9:00 AM' },
    ],
    24: [
        { name: 'Projector Pro-X1', borrower: 'Dr. Sarah J.', time: '11:00 AM' },
        { name: 'Wireless Mic Set', borrower: 'Tom Baker', time: '3:00 PM' },
    ],
    28: [
        { name: 'Laboratory Oven 300C', borrower: 'Elena Vance', time: '1:00 PM' },
    ],
};

const DAYS_SHORT = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const CURRENT_DAY = 24;

const ReturnCalendar: React.FC<ReturnCalendarProps> = () => {
    const [selectedDay, setSelectedDay] = useState<number | null>(15);

    const handleDayClick = (day: number) => {
        setSelectedDay(prev => prev === day ? null : day);
    };

    const selectedReturns = selectedDay ? MOCK_RETURNS[selectedDay] : null;

    return (
        <div className="bg-white/40 dark:bg-slate-800/60 p-8 ambient-shadow border border-white/40 dark:border-white/10 rounded-[32px] backdrop-blur-xl h-full flex flex-col transition-all duration-300">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-extrabold text-[#1A2B56] dark:text-white tracking-tight flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#1A2B56] dark:text-blue-400">calendar_month</span>
                        Return Schedule
                    </h3>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5 uppercase tracking-wider">
                        October 2024
                    </p>
                </div>
                <div className="flex gap-2">
                    <button className="w-8 h-8 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 shadow-sm border border-slate-100 dark:border-slate-600 transition-colors">
                        <span className="material-symbols-outlined text-sm">chevron_left</span>
                    </button>
                    <button className="w-8 h-8 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 shadow-sm border border-slate-100 dark:border-slate-600 transition-colors">
                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                    </button>
                </div>
            </div>

            {/* Day labels */}
            <div className="grid grid-cols-7 gap-1.5 mb-1.5">
                {DAYS_SHORT.map(day => (
                    <div key={day} className="text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1.5">
                {Array.from({ length: 35 }).map((_, index) => {
                    const dayNumber = index - 1;
                    const isValidDay = dayNumber > 0 && dayNumber <= 31;
                    const isToday = isValidDay && dayNumber === CURRENT_DAY;
                    const hasReturn = isValidDay && Object.keys(MOCK_RETURNS).map(Number).includes(dayNumber);
                    const isOverdue = isValidDay && dayNumber < CURRENT_DAY && hasReturn;
                    const isSelected = isValidDay && selectedDay === dayNumber;

                    if (!isValidDay) {
                        return <div key={index} className="aspect-square rounded-lg opacity-10 bg-slate-200 dark:bg-slate-700" />;
                    }

                    return (
                        <div
                            key={index}
                            onClick={() => isValidDay && handleDayClick(dayNumber)}
                            className={`
                                aspect-square rounded-lg flex flex-col items-center justify-center relative cursor-pointer font-bold text-sm transition-all duration-200
                                ${isSelected
                                    ? 'bg-[#1A2B56] text-white shadow-md scale-105'
                                    : isToday
                                        ? 'bg-[#1A2B56]/20 dark:bg-blue-800/30 text-[#1A2B56] dark:text-blue-300 border border-[#1A2B56]/30'
                                        : 'text-slate-600 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-slate-700/80'
                                }
                                ${isOverdue && !isSelected ? '!border !border-red-300/60 dark:!border-red-800/60' : ''}
                            `}
                        >
                            <span className="text-xs">{dayNumber}</span>
                            {hasReturn && (
                                <span
                                    className={`absolute bottom-1 w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white/70'
                                            : isOverdue ? 'bg-red-500'
                                                : 'bg-[#1A2B56] dark:bg-blue-400'
                                        }`}
                                />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Selected Day Panel */}
            {selectedDay && selectedReturns ? (
                <div className="mt-5 pt-5 border-t border-slate-200/50 dark:border-slate-700/50">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">
                        {selectedReturns.length} Return{selectedReturns.length > 1 ? 's' : ''} — Day {selectedDay}
                    </p>
                    <div className="space-y-2">
                        {selectedReturns.map((item, i) => (
                            <div key={i} className="flex items-center justify-between gap-3 bg-white/60 dark:bg-slate-700/50 rounded-xl px-3 py-2.5 hover:bg-white dark:hover:bg-slate-700 transition-colors">
                                <div className="min-w-0">
                                    <p className="text-xs font-bold text-[#1A2B56] dark:text-white truncate">{item.name}</p>
                                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold truncate">{item.borrower} · {item.time}</p>
                                </div>
                                <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 text-base flex-shrink-0">chevron_right</span>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="mt-5 pt-4 border-t border-slate-200/50 dark:border-slate-700/50 flex gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#1A2B56]"></span> Returns Due</div>
                    <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500"></span> Overdue</div>
                </div>
            )}
        </div>
    );
};

export default ReturnCalendar;
