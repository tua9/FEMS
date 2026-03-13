import React, { useState } from 'react';
import CustomDropdown from '../../shared/CustomDropdown';
import type { BorrowRequest } from '../../../types/borrowRequest';

interface ReturnCalendarProps {
    records?: BorrowRequest[];
    onViewDetails?: (recordId: string) => void;
}

const DAYS_SHORT = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const SYSTEM_TODAY = new Date();

const ReturnCalendar: React.FC<ReturnCalendarProps> = ({ records = [], onViewDetails }) => {
    const today = new Date();
    const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
    const [selectedDay, setSelectedDay] = useState<number | null>(today.getDate());

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const currentMonth = viewDate.getMonth(); // 0-11
    const currentYear = viewDate.getFullYear();

    // Derive returns from records that match the currently viewed month and year
    const derivedReturns = React.useMemo(() => {
        const map: Record<number, { id: string; name: string; borrower: string; time: string; avatar?: string; status: string }[]> = {};

        records.forEach(record => {
            if (record.status === 'returned' || record.status === 'rejected') return;

            const returnDate = new Date(record.return_date);
            if (returnDate.getMonth() === currentMonth && returnDate.getFullYear() === currentYear) {
                const day = returnDate.getDate();
                if (!map[day]) map[day] = [];
                
                const borrower = typeof record.user_id === 'object' ? record.user_id : null;
                const equipment = typeof record.equipment_id === 'object' ? record.equipment_id : null;
                const isOverdue = returnDate.getTime() < new Date().getTime();

                map[day].push({
                    id: record._id,
                    name: equipment?.name || 'Unknown Item',
                    borrower: borrower?.displayName || 'Unknown',
                    time: '04:00 PM', // Fallback time
                    status: isOverdue ? 'overdue' : record.status
                });
            }
        });
        return map;
    }, [records, currentMonth, currentYear]);

    const handleDayClick = (day: number) => {
        setSelectedDay(prev => prev === day ? null : day);
    };

    const handlePrevMonth = () => {
        setViewDate(new Date(currentYear, currentMonth - 1, 1));
        setSelectedDay(null);
    };

    const handleNextMonth = () => {
        setViewDate(new Date(currentYear, currentMonth + 1, 1));
        setSelectedDay(null);
    };

    const handleMonthChange = (v: string) => {
        setViewDate(new Date(currentYear, parseInt(v), 1));
        setSelectedDay(null);
    };

    const handleYearChange = (v: string) => {
        setViewDate(new Date(parseInt(v), currentMonth, 1));
        setSelectedDay(null);
    };

    // Calendar Grid Calculation
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); // 0 (Sun) to 6 (Sat)
    // Adjust to Monday start: Mo=0, Tu=1, ..., Su=6
    const startingOffset = (firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1);
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const selectedReturns = selectedDay ? derivedReturns[selectedDay] : null;

    return (
        <div className="bg-white/40 dark:bg-slate-800/60 p-8 ambient-shadow border border-white/40 dark:border-white/10 rounded-[32px] backdrop-blur-xl flex flex-col transition-all duration-300">
            {/* Header ... */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-extrabold text-[#1A2B56] dark:text-white tracking-tight flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#1A2B56] dark:text-blue-400">calendar_month</span>
                        Return Schedule
                    </h3>
                    <div className="glass-card !rounded-[1.25rem] flex items-center mt-1.5">
                        <CustomDropdown
                            value={String(currentMonth)}
                            options={monthNames.map((name, idx) => ({ value: String(idx), label: name }))}
                            onChange={handleMonthChange}
                            align="left"
                        />
                        <div className="h-4 w-px bg-[#1E2B58]/10 dark:bg-white/10" />
                        <CustomDropdown
                            value={String(currentYear)}
                            options={[2024, 2025, 2026, 2027].map(y => ({ value: String(y), label: String(y) }))}
                            onChange={handleYearChange}
                            align="left"
                        />
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handlePrevMonth}
                        className="w-8 h-8 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 shadow-sm border border-slate-100 dark:border-slate-600 transition-colors hover:scale-105 active:scale-95"
                    >
                        <span className="material-symbols-outlined text-sm">chevron_left</span>
                    </button>
                    <button
                        onClick={handleNextMonth}
                        className="w-8 h-8 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 shadow-sm border border-slate-100 dark:border-slate-600 transition-colors hover:scale-105 active:scale-95"
                    >
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
                {/* Empty slots for starting offset */}
                {Array.from({ length: startingOffset }).map((_, i) => (
                    <div key={`offset-${i}`} className="aspect-square rounded-lg opacity-5 bg-slate-200 dark:bg-slate-700" />
                ))}

                {/* Days of the month */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                    const dayNumber = i + 1;
                    const isToday =
                        currentYear === SYSTEM_TODAY.getFullYear() &&
                        currentMonth === SYSTEM_TODAY.getMonth() &&
                        dayNumber === SYSTEM_TODAY.getDate();

                    const dayReturns = derivedReturns[dayNumber];
                    const hasReturn = !!dayReturns;
                    const isOverdue = hasReturn && dayReturns.some(r => r.status === 'overdue');

                    const isSelected = selectedDay === dayNumber;

                    return (
                        <div
                            key={dayNumber}
                            onClick={() => handleDayClick(dayNumber)}
                            className={`
                                aspect-square rounded-lg flex flex-col items-center justify-center relative cursor-pointer font-bold text-sm transition-all duration-200
                                ${isSelected
                                    ? 'bg-[#1A2B56] text-white shadow-md scale-105'
                                    : isToday
                                        ? 'bg-[#1A2B56]/20 dark:bg-blue-800/30 text-[#1A2B56] dark:text-blue-300 border border-[#1A2B56]/30'
                                        : 'text-slate-600 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-slate-700/80'
                                }
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
                <div className="mt-5 pt-5 border-t border-slate-200/50 dark:border-slate-700/50 overflow-y-auto max-h-[120px] custom-scrollbar">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">
                        {selectedReturns.length} Return{selectedReturns.length > 1 ? 's' : ''} — {monthNames[currentMonth]} {selectedDay}
                    </p>
                    <div className="space-y-2">
                        {selectedReturns.map((item, i) => (
                            <div
                                key={i}
                                onClick={() => onViewDetails?.(item.id)}
                                className="flex items-center justify-between gap-3 bg-white/60 dark:bg-slate-700/50 rounded-lg px-3 py-2.5 hover:bg-white/90 dark:hover:bg-slate-700/90 transition-all cursor-pointer group hover:shadow-lg hover:-translate-y-0.5 shadow-sm border border-transparent hover:border-white/50 dark:hover:border-white/10"
                            >
                                <div className="min-w-0">
                                    <p className="text-xs font-bold text-[#1A2B56] dark:text-white truncate transition-colors">{item.name}</p>
                                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold truncate uppercase tracking-tighter">{item.borrower} · {item.time}</p>
                                </div>
                                <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 text-base flex-shrink-0 transition-transform group-hover:translate-x-0.5">chevron_right</span>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="mt-auto pt-4 border-t border-slate-200/50 dark:border-slate-700/50 flex gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#1A2B56] dark:bg-blue-400"></span> Returns Due</div>
                    <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500"></span> Overdue</div>
                </div>
            )}
        </div>
    );
};

export default ReturnCalendar;
