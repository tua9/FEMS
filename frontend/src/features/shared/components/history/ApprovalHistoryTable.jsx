import { CheckCircle2, ChevronLeft, ChevronRight, Eye, XCircle } from 'lucide-react';
import React from 'react';

export const ALL_APPROVAL_HISTORY = [];

function pageRange(current, total) {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 3) return [1, 2, 3, '...', total];
  if (current >= total - 2) return [1, '...', total - 2, total - 1, total];
  return [1, '...', current - 1, current, current + 1, '...', total];
}

function initials(name) {
  return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
}

const DecisionBadge = ({ decision }) =>
  decision === 'APPROVED' ? (
    <span className="inline-flex items-center gap-1 text-[0.625rem] font-bold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 uppercase tracking-wider">
      <CheckCircle2 className="w-3 h-3" />
      Approved
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-[0.625rem] font-bold px-2.5 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/50 uppercase tracking-wider">
      <XCircle className="w-3 h-3" />
      Rejected
    </span>
  );

const Pagination = ({ currentPage, totalPages, onPageChange }) => (
  <div className="flex gap-[0.5rem] items-center">
    <button
      onClick={() => onPageChange(currentPage - 1)}
      disabled={currentPage === 1}
      className="w-8 h-8 rounded-full border border-[#1E2B58]/10 dark:border-white/10 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
    >
      <ChevronLeft className="w-4 h-4 text-[#1E2B58] dark:text-slate-400" />
    </button>
    {pageRange(currentPage, totalPages).map((p, i) =>
      p === '...' ? (
        <span key={`d-${i}`} className="text-sm text-slate-400 mx-1">…</span>
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

export const ApprovalHistoryTable = ({
  items, currentPage, totalPages, totalItems, onPageChange, onViewDetail,
}) => {
  const emptyState = (
    <p className="py-16 text-center text-slate-400 dark:text-slate-500 font-bold text-sm">
      No records found for the selected filters.
    </p>
  );

  return (
    <div className="dashboard-card rounded-3xl sm:rounded-4xl overflow-hidden mb-16">

      {/* ── Mobile cards (hidden on sm+) ── */}
      <div className="sm:hidden divide-y divide-black/5 dark:divide-white/5">
        {items.length === 0 ? emptyState : items.map(item => (
          <button
            key={item.id}
            onClick={() => onViewDetail(item)}
            className="w-full text-left px-4 py-4 hover:bg-white/60 dark:hover:bg-white/5 transition-colors active:scale-[0.99]"
          >
            <div className="flex items-start justify-between gap-3">
              {/* Left: avatar + student info */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-full bg-[#1E2B58]/10 dark:bg-white/10 flex items-center justify-center text-[0.625rem] font-black text-[#1E2B58] dark:text-white shrink-0">
                  {initials(item.studentName)}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-[#1E2B58] dark:text-white text-sm truncate">{item.studentName}</p>
                  <p className="text-[0.625rem] text-slate-400 font-medium">{item.studentId}</p>
                </div>
              </div>
              {/* Right: decision badge */}
              <div className="shrink-0 pt-0.5">
                <DecisionBadge decision={item.decision} />
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between gap-2">
              {/* Equipment */}
              <div className="min-w-0">
                <p className="text-[0.625rem] font-black uppercase tracking-widest text-slate-400 mb-0.5">Equipment</p>
                <p className="text-sm font-bold text-[#1E2B58] dark:text-white truncate">{item.equipment}</p>
              </div>
              {/* Dates + ID */}
              <div className="text-right shrink-0">
                <p className="text-[0.625rem] font-bold text-slate-400">{item.id}</p>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">{item.decidedDate}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* ── Desktop table (hidden on mobile) ── */}
      <div className="hidden sm:block overflow-x-auto hide-scrollbar">
        <table className="w-full border-collapse min-w-[900px]">
          <thead>
            <tr className="thead-tint">
              {['Request ID', 'Student', 'Equipment', 'Requested', 'Decided', 'Decision', 'Actions'].map((h, i) => (
                <th key={h} className={`px-[2rem] py-[1.5rem] text-[0.625rem] font-black uppercase tracking-[0.2em] text-[#1E2B58]/50 dark:text-slate-400 ${i === 5 ? 'text-center' : i === 6 ? 'text-right' : 'text-left'}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5 dark:divide-white/5">
            {items.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-[2rem] py-[4rem] text-center text-slate-400 dark:text-slate-500 font-bold text-sm">
                  No records found for the selected filters.
                </td>
              </tr>
            ) : items.map((item) => (
              <tr
                key={item.id}
                className="transition-all duration-200 hover:bg-white/70 dark:hover:bg-white/5 group cursor-pointer"
                onClick={() => onViewDetail(item)}
              >
                <td className="px-[2rem] py-[1.5rem]">
                  <span className="text-[0.625rem] font-bold text-[#1E2B58] dark:text-slate-300">{item.id}</span>
                </td>
                <td className="px-[2rem] py-[1.5rem]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#1E2B58]/10 dark:bg-white/10 flex items-center justify-center text-[0.625rem] font-black text-[#1E2B58] dark:text-white shrink-0">
                      {initials(item.studentName)}
                    </div>
                    <div>
                      <p className="font-bold text-[#1E2B58] dark:text-white text-[0.875rem] leading-none mb-[0.2rem]">{item.studentName}</p>
                      <p className="text-[0.625rem] text-slate-500 font-medium">{item.studentId}</p>
                    </div>
                  </div>
                </td>
                <td className="px-[2rem] py-[1.5rem]">
                  <span className="font-bold text-[#1E2B58] dark:text-white text-[0.875rem]">{item.equipment}</span>
                </td>
                <td className="px-[2rem] py-[1.5rem]">
                  <span className="text-[0.75rem] font-medium text-slate-600 dark:text-slate-400">{item.requestDate}</span>
                </td>
                <td className="px-[2rem] py-[1.5rem]">
                  <span className="text-[0.75rem] font-bold text-[#1E2B58] dark:text-white">{item.decidedDate}</span>
                </td>
                <td className="px-[2rem] py-[1.5rem] text-center">
                  <DecisionBadge decision={item.decision} />
                </td>
                <td className="px-[2rem] py-[1.5rem] text-right">
                  <button
                    onClick={e => { e.stopPropagation(); onViewDetail(item); }}
                    className="p-[0.5rem] rounded-full hover:bg-[#1E2B58]/10 dark:hover:bg-white/10 transition-all hover:scale-110 active:scale-90"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4 text-[#1E2B58] dark:text-slate-300" strokeWidth={2.5} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-5 sm:px-[2rem] py-4 sm:py-[1.5rem] flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-black/5 dark:border-white/5 bg-white/20 dark:bg-transparent">
        <p className="text-[0.6875rem] font-bold text-[#1E2B58]/60 dark:text-slate-400 uppercase tracking-wider">
          Showing {items.length} of {totalItems} record{totalItems !== 1 ? 's' : ''}
        </p>
        {totalPages > 1 && (
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
        )}
      </div>
    </div>
  );
};
