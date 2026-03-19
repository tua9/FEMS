import React from 'react';

interface Props {
  currentPage: number;
  totalPages: number;
  visibleCount: number;
  totalCount: number;
  onPageChange: (page: number) => void;
}

const AssetPagination: React.FC<Props> = ({
  currentPage,
  totalPages,
  visibleCount,
  totalCount,
  onPageChange,
}) => (
  <div className="flex items-center justify-between pt-6 border-t border-slate-300 dark:border-slate-600">
    <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
      Showing {visibleCount} of {totalCount} assets
    </span>

    <div className="flex items-center gap-2">
      {/* Prev */}
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/60 dark:bg-white/10 text-slate-400 disabled:opacity-30 hover:bg-white dark:hover:bg-white/20 transition-all"
      >
        <span className="material-symbols-outlined text-lg">chevron_left</span>
      </button>

      {/* Page numbers */}
      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
            currentPage === page
              ? 'bg-[#232F58] text-white shadow-sm'
              : 'bg-white/60 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-white/20'
          }`}
        >
          {page}
        </button>
      ))}

      {/* Next */}
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/60 dark:bg-white/10 text-slate-400 disabled:opacity-30 hover:bg-white dark:hover:bg-white/20 transition-all"
      >
        <span className="material-symbols-outlined text-lg">chevron_right</span>
      </button>
    </div>
  </div>
);

export default AssetPagination;

