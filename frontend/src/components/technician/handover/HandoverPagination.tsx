import React from 'react';

interface Props {
  currentPage: number;
  totalPages: number;
  label: string;           // e.g. "Showing 1-4 of 8 requests"
  onPageChange: (page: number) => void;
}

const HandoverPagination: React.FC<Props> = ({ currentPage, totalPages, label, onPageChange }) => (
  <div className="px-6 py-5 bg-slate-50/30 border-t border-slate-200/50 flex items-center justify-between">
    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{label}</p>
    <div className="flex items-center gap-2">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 disabled:opacity-40 hover:bg-slate-50 transition-colors"
      >
        <span className="material-symbols-outlined text-sm">chevron_left</span>
      </button>

      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-colors ${
            currentPage === p
              ? 'bg-[#1A2B56] text-white shadow-sm'
              : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
          }`}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 disabled:opacity-40 hover:bg-slate-50 transition-colors"
      >
        <span className="material-symbols-outlined text-sm">chevron_right</span>
      </button>
    </div>
  </div>
);

export default HandoverPagination;


