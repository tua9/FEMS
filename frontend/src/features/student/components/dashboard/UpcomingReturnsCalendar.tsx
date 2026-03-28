import React, { useMemo, useState } from 'react';
import type { BorrowRequest } from '@/types/borrowRequest';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface UpcomingReturnsCalendarProps {
  borrowRequests: BorrowRequest[];
}

const UpcomingReturnsCalendar: React.FC<UpcomingReturnsCalendarProps> = ({ borrowRequests }) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Determine urgency status: < 2 days = urgent, overdue = negative days
  const getStatus = (returnDate: Date): 'overdue' | 'urgent' | 'coming' => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    returnDate = new Date(returnDate);
    returnDate.setHours(0, 0, 0, 0);

    const diffTime = returnDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'overdue';
    if (diffDays < 2) return 'urgent';
    return 'coming';
  };

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const days = [];
    const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Generate 42 days (6 weeks)
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);

      const items = borrowRequests.filter((req) => {
        if (req.status === 'returned' || req.status === 'rejected' || req.status === 'cancelled') {
          return false;
        }
        const reqReturnDate = new Date(req.return_date);
        reqReturnDate.setHours(0, 0, 0, 0);
        return reqReturnDate.getTime() === date.getTime();
      });

      const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
      const isToday = date.getTime() === today.getTime();

      let status: 'overdue' | 'urgent' | 'coming' | null = null;
      if (items.length > 0) {
        status = getStatus(date);
      }

      days.push({
        date: new Date(date),
        day: date.getDate(),
        isCurrentMonth,
        isToday,
        items,
        status,
        itemCount: items.length,
      });
    }

    return days;
  }, [currentMonth, borrowRequests]);

  const selectedDateItems = selectedDate
    ? calendarDays.find((d) => d.date.getTime() === selectedDate.getTime())?.items || []
    : [];

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    setSelectedDate(null);
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    setSelectedDate(null);
  };

  const monthYear = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Stats
  const overdueCount = borrowRequests.filter((req) => {
    if (req.status === 'returned' || req.status === 'rejected' || req.status === 'cancelled') return false;
    return getStatus(new Date(req.return_date)) === 'overdue';
  }).length;

  const urgentCount = borrowRequests.filter((req) => {
    if (req.status === 'returned' || req.status === 'rejected' || req.status === 'cancelled') return false;
    return getStatus(new Date(req.return_date)) === 'urgent';
  }).length;

  const getDateColor = (status: string | null, isToday: boolean) => {
    if (isToday) return 'bg-blue-50 dark:bg-blue-900/20';
    if (status === 'overdue') return 'bg-red-50 dark:bg-red-900/20';
    if (status === 'urgent') return 'bg-amber-50 dark:bg-amber-900/20';
    if (status === 'coming') return 'bg-green-50 dark:bg-green-900/20';
    return 'hover:bg-slate-50 dark:hover:bg-slate-700/30';
  };

  const getDayStatus = (status: string | null) => {
    if (status === 'overdue') return { label: 'Overdue', color: 'text-red-600 dark:text-red-400' };
    if (status === 'urgent') return { label: 'Due Soon', color: 'text-amber-600 dark:text-amber-400' };
    if (status === 'coming') return { label: '', color: 'text-green-600 dark:text-green-400' };
    return null;
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-md border border-slate-200 dark:border-slate-700 p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <span className="material-symbols-outlined text-2xl text-blue-600">calendar_month</span>
            Return Schedule
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Track your upcoming returns</p>
        </div>

        {/* Stats badges */}
        <div className="flex gap-3 flex-wrap">
          {overdueCount > 0 && (
            <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg px-3 py-2">
              <span className="text-red-600 dark:text-red-400 font-bold">{overdueCount}</span>
              <span className="text-xs font-semibold text-red-700 dark:text-red-300">Overdue</span>
            </div>
          )}
          {urgentCount > 0 && (
            <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg px-3 py-2">
              <span className="text-amber-600 dark:text-amber-400 font-bold">{urgentCount}</span>
              <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">Due Soon</span>
            </div>
          )}
        </div>
      </div>

      {/* Calendar */}
      <div className="space-y-6">
        {/* Month Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevMonth}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {monthYear}
          </h2>
          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
        </div>

        {/* Days of week */}
        <div className="grid grid-cols-7 gap-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center text-xs font-bold text-slate-600 dark:text-slate-400 py-3">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((dayObj, idx) => {
            const statusInfo = getDayStatus(dayObj.status);
            return (
              <button
                key={idx}
                onClick={() => dayObj.itemCount > 0 && setSelectedDate(dayObj.date)}
                className={`aspect-square p-2 rounded-lg border border-slate-200 dark:border-slate-700 transition-all text-center flex flex-col items-center justify-center gap-1 ${
                  getDateColor(dayObj.status, dayObj.isToday)
                } ${!dayObj.isCurrentMonth && 'opacity-30'} ${dayObj.itemCount > 0 ? 'cursor-pointer hover:shadow-md' : 'cursor-default'}`}
              >
                <span className={`text-sm font-bold ${!dayObj.isCurrentMonth ? 'text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                  {dayObj.day}
                </span>
                {dayObj.itemCount > 0 && (
                  <span className={`text-xs font-bold ${statusInfo?.color || 'text-slate-600'}`}>
                    {dayObj.itemCount === 1 ? '●' : `${dayObj.itemCount}✕`}
                  </span>
                )}
                {dayObj.isToday && <span className="w-1 h-1 bg-blue-600 rounded-full" />}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-700 flex flex-wrap gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Overdue</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">&lt; 2 Days</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">&gt;= 2 Days</span>
          </div>
        </div>
      </div>

      {/* Selected Date Details */}
      {selectedDate && selectedDateItems.length > 0 && (
        <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700">
          <h4 className="font-bold text-slate-900 dark:text-white mb-4 text-lg">
            {selectedDate.toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
            })}
          </h4>

          <div className="space-y-3">
            {selectedDateItems.map((item, idx) => {
              const status = getStatus(new Date(item.return_date));
              const equipment = typeof item.equipment_id === 'object' ? item.equipment_id : null;
              const room = typeof item.room_id === 'object' ? item.room_id : null;
              const itemName = equipment?.name || room?.name || 'Unknown Item';

              const returnDate = new Date(item.return_date);
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              returnDate.setHours(0, 0, 0, 0);
              const daysLeft = Math.ceil((returnDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

              return (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border ${
                    status === 'overdue'
                      ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700'
                      : status === 'urgent'
                        ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-700'
                        : 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="font-semibold text-slate-900 dark:text-white text-sm">
                      {itemName}
                    </p>
                    <span className={`text-xs font-bold px-2 py-1 rounded ${
                      status === 'overdue'
                        ? 'bg-red-500 text-white'
                        : status === 'urgent'
                          ? 'bg-amber-500 text-white'
                          : 'bg-green-500 text-white'
                    }`}>
                      {status === 'overdue' ? 'Overdue' : status === 'urgent' ? 'Due Soon' : 'Coming'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {daysLeft < 0
                      ? `${Math.abs(daysLeft)} days overdue`
                      : daysLeft === 0
                        ? '🔴 Due today'
                        : `${daysLeft} day${daysLeft > 1 ? 's' : ''} left`}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default UpcomingReturnsCalendar;
