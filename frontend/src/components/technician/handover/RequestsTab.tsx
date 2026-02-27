import React, { useState } from 'react';
import { MOCK_BORROW_REQUESTS, BorrowRequest } from '@/data/technician/mockHandover';
import HandoverPagination from './HandoverPagination';

const ITEMS_PER_PAGE = 4;

// ── Avatar initials fallback ──────────────────────────────────────────────────
const initials = (name: string) =>
  name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

// ── Single row ────────────────────────────────────────────────────────────────
const RequestRow: React.FC<{ req: BorrowRequest }> = ({ req }) => (
  <tr className="hover:bg-slate-50/40 transition-colors group">
    <td className="px-8 py-6">
      <span className="text-sm font-bold text-[#1A2B56]">{req.id}</span>
    </td>
    <td className="px-8 py-6">
      <div className="flex items-center gap-3">
        {req.borrower.avatar ? (
          <img
            src={req.borrower.avatar}
            alt={req.borrower.name}
            className="w-8 h-8 rounded-full border border-slate-200 object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-slate-200 border border-white flex items-center justify-center text-[10px] font-bold text-slate-700 flex-shrink-0">
            {initials(req.borrower.name)}
          </div>
        )}
        <div>
          <p className="text-sm font-bold text-slate-900">{req.borrower.name}</p>
          <p className="text-[10px] text-slate-500 font-semibold uppercase">ID: {req.borrower.userId}</p>
        </div>
      </div>
    </td>
    <td className="px-8 py-6">
      <p className="text-sm font-semibold text-slate-700">{req.equipment.name}</p>
      <p className="text-[10px] text-slate-400">{req.equipment.location}</p>
    </td>
    <td className="px-8 py-6">
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[11px] font-bold">
        <span className="material-symbols-outlined text-[14px]">calendar_today</span>
        {req.duration}
      </div>
    </td>
    <td className="px-8 py-6 max-w-xs">
      <p className="text-xs text-slate-600 truncate">{req.purpose}</p>
    </td>
    <td className="px-8 py-6 text-right">
      <div className="flex items-center justify-end gap-2">
        <button className="px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white text-xs font-bold transition-all">
          Approve
        </button>
        <button className="px-4 py-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white text-xs font-bold transition-all">
          Reject
        </button>
      </div>
    </td>
  </tr>
);

// ── Tab component ─────────────────────────────────────────────────────────────
const RequestsTab: React.FC = () => {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = MOCK_BORROW_REQUESTS.filter(
    (r) =>
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.borrower.name.toLowerCase().includes(search.toLowerCase()) ||
      r.equipment.name.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paged = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

  const handleSearch = (v: string) => {
    setSearch(v);
    setCurrentPage(1);
  };

  return (
    <div
      className="rounded-3xl border border-white/50 shadow-2xl overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(24px)' }}
    >
      {/* Header */}
      <div className="p-8 border-b border-slate-200/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600">
            <span className="material-symbols-outlined">pending_actions</span>
          </div>
          <h2 className="text-xl font-bold text-[#1A2B56]">Borrow Requests Queue</h2>
          <span className="bg-[#1A2B56]/10 text-[#1A2B56] text-[10px] font-bold px-2 py-1 rounded-md">
            {filtered.length} PENDING
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search requests..."
              className="pl-10 pr-4 py-2 bg-white/50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1A2B56]/30 placeholder:text-slate-400"
            />
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
              search
            </span>
          </div>
          <button className="p-2 rounded-xl border border-slate-200 bg-white/50 text-slate-600">
            <span className="material-symbols-outlined">filter_list</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              {['Request ID', 'Borrower', 'Equipment', 'Duration', 'Purpose', 'Actions'].map((h) => (
                <th
                  key={h}
                  className={`px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200/50 ${
                    h === 'Actions' ? 'text-right' : ''
                  }`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/50">
            {paged.length > 0 ? (
              paged.map((req) => <RequestRow key={req.id} req={req} />)
            ) : (
              <tr>
                <td colSpan={6} className="py-16 text-center text-slate-400 text-sm font-semibold">
                  No requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <HandoverPagination
        currentPage={safePage}
        totalPages={totalPages}
        label={`Showing ${(safePage - 1) * ITEMS_PER_PAGE + 1}–${Math.min(safePage * ITEMS_PER_PAGE, filtered.length)} of ${filtered.length} requests`}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default RequestsTab;
