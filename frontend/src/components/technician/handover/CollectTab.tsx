import React, { useState } from 'react';
import {
  MOCK_ACTIVE_LOANS,
  ActiveLoan,
  getLoanStatusStyle,
} from '@/data/technician/mockHandover';

// ── Loan card ─────────────────────────────────────────────────────────────────
const LoanCard: React.FC<{ loan: ActiveLoan }> = ({ loan }) => {
  const st = getLoanStatusStyle(loan.status);

  const dueTextColor =
    loan.dueColor === 'red'
      ? 'text-red-500'
      : loan.dueColor === 'yellow'
      ? 'text-yellow-600'
      : 'text-slate-700';

  const initials = loan.borrower.name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  return (
    <div
      className={`rounded-3xl border-2 shadow-xl overflow-hidden flex flex-col ${st.border}`}
      style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(24px)' }}
    >
      <div className="p-6 flex-1">
        {/* Header row */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            {loan.borrower.avatar ? (
              <img
                src={loan.borrower.avatar}
                alt={loan.borrower.name}
                className="w-10 h-10 rounded-full border border-slate-200 object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-[#1A2B56]/10 flex items-center justify-center font-bold text-[#1A2B56] text-xs border border-slate-200">
                {initials}
              </div>
            )}
            <div>
              <h3 className="text-sm font-bold text-slate-900">{loan.borrower.name}</h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                {loan.borrower.idLabel}
              </p>
            </div>
          </div>
          <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-tight ${st.badge}`}>
            {loan.status}
          </span>
        </div>

        {/* Items held */}
        <div className="space-y-3 mb-6">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-slate-400 text-lg">inventory_2</span>
            <div>
              <p className="text-xs font-bold text-slate-900">{loan.itemCount} Items Held</p>
              <p className="text-[10px] text-slate-500">{loan.itemNames}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className={`material-symbols-outlined text-lg ${dueTextColor}`}>{loan.dueIcon}</span>
            <div>
              <p className={`text-xs font-bold ${dueTextColor}`}>{loan.dueLabel}</p>
              <p className="text-[10px] text-slate-400">Borrowed: {loan.borrowedDate}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer button */}
      <div className="p-4 bg-slate-50/50 border-t border-slate-200">
        <button className="w-full bg-white hover:bg-[#1A2B56] hover:text-white text-[#1A2B56] py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border border-[#1A2B56]/20">
          <span className="material-symbols-outlined text-base">assignment_turned_in</span>
          Mark Returned
        </button>
      </div>
    </div>
  );
};

// ── Tab component ─────────────────────────────────────────────────────────────
const CollectTab: React.FC = () => {
  const [search, setSearch] = useState('');

  const filtered = MOCK_ACTIVE_LOANS.filter(
    (l) =>
      l.borrower.name.toLowerCase().includes(search.toLowerCase()) ||
      l.borrower.idLabel.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      {/* Search + count bar */}
      <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by Borrower or ID"
            className="w-full pl-12 pr-4 py-3 rounded-2xl text-sm border border-white/50 focus:outline-none focus:ring-2 focus:ring-[#1A2B56]/30 placeholder-slate-400"
            style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(24px)' }}
          />
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            search
          </span>
        </div>
        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
          Active Loans: {MOCK_ACTIVE_LOANS.length}
        </span>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {filtered.map((loan) => (
          <LoanCard key={loan.id} loan={loan} />
        ))}
        {filtered.length === 0 && (
          <p className="col-span-3 text-center py-16 text-slate-400 font-semibold">
            No active loans found.
          </p>
        )}
      </div>

      {/* Scan QR banner */}
      <button className="w-full bg-[#1A2B56] hover:bg-slate-800 text-white py-5 rounded-3xl shadow-2xl flex items-center justify-center gap-4 group transition-all active:scale-[0.98]">
        <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
          <span className="material-symbols-outlined text-3xl">qr_code_scanner</span>
        </div>
        <div className="text-left">
          <p className="text-sm font-extrabold uppercase tracking-widest leading-none mb-1">
            Scan QR to Return
          </p>
          <p className="text-[10px] text-white/60 font-medium">
            Instantly identify borrower and equipment items
          </p>
        </div>
        <span className="material-symbols-outlined ml-4 group-hover:translate-x-1 transition-transform">
          arrow_forward
        </span>
      </button>
    </div>
  );
};

export default CollectTab;
