import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import React from 'react';
import { StatusBadge } from '@/features/shared/components/ui/StatusBadge';

export const ALL_REPORT_HISTORY = [];

const SEVERITY_CLASSES = {
  CRITICAL: 'text-red-600 bg-red-100 border-red-200 dark:bg-red-900/30 dark:border-red-800/50 dark:text-red-400',
  HIGH: 'text-orange-600 bg-orange-100 border-orange-200 dark:bg-orange-900/30 dark:border-orange-800/50 dark:text-orange-400',
  MEDIUM: 'text-yellow-600 bg-yellow-100 border-yellow-200 dark:bg-yellow-900/30 dark:border-yellow-800/50 dark:text-yellow-400',
  LOW: 'text-blue-600 bg-blue-100 border-blue-200 dark:bg-blue-900/30 dark:border-blue-800/50 dark:text-blue-400',
};

function pageRange(current, total) {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 3) return [1, 2, 3, '...', total];
  if (current >= total - 2) return [1, '...', total - 2, total - 1, total];
  return [1, '...', current - 1, current, current + 1, '...', total];
}

const Pagination = ({ currentPage, totalPages, onPageChange }) => (
  <div className="flex gap-2 items-center">
    <button
      onClick={() => onPageChange(currentPage - 1)}
      disabled={currentPage === 1}
      className="w-8 h-8 rounded-full border border-[#1E2B58]/10 dark:border-white/10 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
    >
      <ChevronLeft className="w-4 h-4 text-[#1E2B58] dark:text-slate-400" />
    </button>
    {pageRange(currentPage, totalPages).map((p, i) =>
      p === '...' ? (
        <span key={`dots-${i}`} className="text-sm text-slate-400 mx-1">…</span>
      ) : (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
            currentPage === p
              ? 'bg-[#1E2B58] text-white shadow-sm shadow-[#1E2B58]/20'
              : 'border border-[#1E2B58]/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10 text-[#1E2B58] dark:text-slate-300'
          }`}
        >
          {p}
        </button>
      )
    )}
    <button
      onClick={() => onPageChange(currentPage + 1)}
      disabled={currentPage === totalPages}
      className="w-8 h-8 rounded-full border border-[#1E2B58]/10 dark:border-white/10 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
    >
      <ChevronRight className="w-4 h-4 text-[#1E2B58] dark:text-slate-400" />
    </button>
  </div>
);

export const ReportHistoryTable = ({
  items, currentPage, totalPages, totalItems, onPageChange, onViewDetail, onEdit, onCancel,
}) => {
  const showing = items.length;

  const emptyState = (
    <p className="py-16 text-center text-slate-400 dark:text-slate-500 font-bold text-sm">
      No records found for the selected filters.
    </p>
  );

  return (
    <div className="dashboard-card rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden mb-[4rem]">

      {/* ── Mobile cards (hidden on sm+) ── */}
      <div className="sm:hidden divide-y divide-black/5 dark:divide-white/5">
        {items.length === 0 ? emptyState : items.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.original._id}
              onClick={() => onViewDetail(item)}
              className="w-full text-left px-4 py-4 hover:bg-white/60 dark:hover:bg-white/5 transition-colors active:scale-[0.99]"
            >
              {/* Row 1: ID + date + actions */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[0.625rem] font-bold text-[#1E2B58]/60 dark:text-slate-400">{item.id}</span>
                <div className="flex items-center gap-1.5">
                  {item.original.status === 'pending' && (
                    <button
                      onClick={e => { e.stopPropagation(); onCancel && onCancel(item); }}
                      className="p-1.5 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30 transition-all"
                      title="Cancel Report"
                    >
                      <span className="material-symbols-outlined text-[1rem] text-red-500">delete_forever</span>
                    </button>
                  )}
                  <button
                    onClick={e => { e.stopPropagation(); onViewDetail(item); }}
                    className="p-1.5 rounded-full hover:bg-[#1E2B58]/10 dark:hover:bg-white/10 transition-all"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4 text-[#1E2B58] dark:text-slate-300" strokeWidth={2.5} />
                  </button>
                </div>
              </div>

              {/* Row 2: category + location */}
              <div className="flex items-center gap-2 mb-2.5">
                <Icon className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" strokeWidth={2} />
                <span className="font-bold text-[#1E2B58] dark:text-white text-sm capitalize">{item.category}</span>
                <span className="text-slate-300 dark:text-slate-600">·</span>
                <span className="font-medium text-slate-500 dark:text-slate-400 text-sm truncate">{item.location}</span>
              </div>

              {/* Row 3: severity + status + date */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={`text-[0.625rem] font-bold px-2.5 py-0.5 rounded-lg border uppercase tracking-wider ${SEVERITY_CLASSES[item.severity]}`}>
                    {item.severity}
                  </span>
                  <StatusBadge status={item.status.toLowerCase()} />
                </div>
                <span className="text-xs font-medium text-slate-400 shrink-0">{item.date}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Desktop table (hidden on mobile) ── */}
      <div className="hidden sm:block overflow-x-auto hide-scrollbar">
        <table className="w-full border-collapse min-w-[1000px]">
          <thead>
            <tr className="thead-tint">
              {['Report ID', 'Date Reported', 'Category', 'Location', 'Severity', 'Status', 'Actions'].map((h, i) => (
                <th key={h} className={`px-[2rem] py-[1.5rem] text-[0.625rem] font-black uppercase tracking-[0.2em] text-[#1E2B58]/50 dark:text-slate-400 ${i === 4 || i === 5 ? 'text-center' : i === 6 ? 'text-right' : 'text-left'}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5 dark:divide-white/5 bg-white/40 dark:bg-black/10">
            {items.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-[2rem] py-[4rem] text-center text-slate-400 dark:text-slate-500 font-bold text-sm">
                  No records found for the selected filters.
                </td>
              </tr>
            ) : items.map((item) => {
              const Icon = item.icon;
              return (
                <tr
                  key={item.original._id}
                  className="transition-all duration-200 hover:bg-white/70 dark:hover:bg-white/5 group cursor-pointer"
                  onClick={() => onViewDetail(item)}
                >
                  <td className="px-[2rem] py-[1.5rem]">
                    <span className="text-[0.625rem] font-bold text-[#1E2B58] dark:text-slate-300">{item.id}</span>
                  </td>
                  <td className="px-[2rem] py-[1.5rem]">
                    <span className="text-[0.875rem] font-bold text-[#1E2B58] dark:text-white">{item.date}</span>
                  </td>
                  <td className="px-[2rem] py-[1.5rem]">
                    <div className="flex items-center gap-[0.75rem]">
                      <Icon className="w-[1.25rem] h-[1.25rem] text-slate-400 dark:text-slate-500" strokeWidth={2} />
                      <span className="font-bold text-[#1E2B58] dark:text-white text-[0.875rem] capitalize">{item.category}</span>
                    </div>
                  </td>
                  <td className="px-[2rem] py-[1.5rem]">
                    <p className="font-bold text-[#1E2B58] dark:text-white text-[0.875rem] leading-none mb-[0.25rem]">{item.location}</p>
                  </td>
                  <td className="px-[2rem] py-[1.5rem] text-center">
                    <span className={`inline-block min-w-[5.5rem] text-center text-[0.625rem] font-bold px-[0.75rem] py-[0.25rem] rounded-[0.5rem] border uppercase tracking-wider leading-none ${SEVERITY_CLASSES[item.severity]}`}>
                      {item.severity}
                    </span>
                  </td>
                  <td className="px-[2rem] py-[1.5rem] text-center">
                    <span className="inline-block">
                      <StatusBadge status={item.status.toLowerCase()} />
                    </span>
                  </td>
                  <td className="px-[2rem] py-[1.5rem] text-right">
                    <div className="flex items-center justify-end gap-[0.25rem]">
                      {item.original.status === 'pending' && (
                        <button
                          onClick={e => { e.stopPropagation(); onCancel && onCancel(item); }}
                          className="p-[0.5rem] rounded-full hover:bg-red-50 dark:hover:bg-red-900/30 transition-all hover:scale-110 active:scale-90"
                          title="Cancel Report"
                        >
                          <span className="material-symbols-outlined text-[1.1rem] text-red-500">delete_forever</span>
                        </button>
                      )}
                      <button
                        onClick={e => { e.stopPropagation(); onViewDetail(item); }}
                        className="p-[0.5rem] rounded-full hover:bg-[#1E2B58]/10 dark:hover:bg-white/10 transition-all hover:scale-110 active:scale-90"
                        title="View Details"
                      >
                        <Eye className="w-[1rem] h-[1rem] text-[#1E2B58] dark:text-slate-300" strokeWidth={2.5} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-5 sm:px-[2rem] py-4 sm:py-[1.5rem] flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-black/5 dark:border-white/5 bg-white/20 dark:bg-transparent">
        <p className="text-[0.6875rem] font-bold text-[#1E2B58]/60 dark:text-slate-400 uppercase tracking-wider">
          Showing {showing} of {totalItems} record{totalItems !== 1 ? 's' : ''}
        </p>
        {totalPages > 1 && (
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
        )}
      </div>
    </div>
  );
};
