import React, { useState } from 'react';
import {
  TABS,
  TicketStatus,
  getTicketsByStatus,
} from '@/data/technician/mockTickets';
import TicketTable from '@/components/technician/tickets/TicketTable';

const ITEMS_PER_PAGE = 4;

// search placeholder by tab
const SEARCH_PLACEHOLDER: Record<TicketStatus, string> = {
  Pending:      'Search tickets...',
  Approved:     'Search approved tickets...',
  'In Progress':'Search ongoing tasks...',
  Rejected:     'Search rejected tickets...',
  Completed:    'Search completed tickets...',
};

const TicketCenter: React.FC = () => {
  const [activeStatus, setActiveStatus] = useState<TicketStatus>('Pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Derive per-tab counts
  const tabCounts = Object.fromEntries(
    TABS.map((t) => [t.status, getTicketsByStatus(t.status).length])
  ) as Record<TicketStatus, number>;

  // Filter by search
  const allForTab = getTicketsByStatus(activeStatus).filter((t) => {
    const q = searchQuery.toLowerCase();
    return (
      t.id.toLowerCase().includes(q) ||
      t.equipment.toLowerCase().includes(q) ||
      t.room.toLowerCase().includes(q) ||
      t.reporter.name.toLowerCase().includes(q)
    );
  });

  const totalPages = Math.max(1, Math.ceil(allForTab.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);

  const handleTabChange = (status: TicketStatus) => {
    setActiveStatus(status);
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handleSearch = (v: string) => {
    setSearchQuery(v);
    setCurrentPage(1);
  };

  const showingCount = Math.min(
    ITEMS_PER_PAGE,
    allForTab.length - (safePage - 1) * ITEMS_PER_PAGE,
  );

  return (
    <div className="pt-32 pb-16 px-6 max-w-7xl mx-auto space-y-8">
      {/* ── Page header ── */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-extrabold text-[#232F58] tracking-tight">Ticket Center</h1>
          <p className="text-slate-600 font-medium">Manage and process facility maintenance requests</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative w-full md:w-80">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder={SEARCH_PLACEHOLDER[activeStatus]}
              className="w-full pl-12 pr-4 py-3 bg-white/80 border-none rounded-2xl text-sm focus:ring-2 focus:ring-[#232F58] shadow-sm placeholder-slate-400 outline-none"
            />
          </div>
          {/* Export */}
          <button className="bg-[#232F58] text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-lg hover:opacity-90 transition-all flex items-center gap-2 whitespace-nowrap">
            <span className="material-symbols-outlined text-lg">file_download</span>
            Export Log
          </button>
        </div>
      </section>

      {/* ── Main card ── */}
      <section
        className="rounded-3xl overflow-hidden flex flex-col border border-white/50 shadow-sm"
        style={{
          background: 'rgba(255,255,255,0.7)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          minHeight: 600,
        }}
      >
        {/* Tabs */}
        <div className="p-8 border-b border-white/30 flex flex-wrap items-center gap-4">
          {TABS.map(({ label, status }) => {
            const isActive = activeStatus === status;
            return (
              <button
                key={status}
                onClick={() => handleTabChange(status)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${
                  isActive
                    ? 'bg-white text-[#232F58] font-bold shadow-[0_4px_12px_rgba(35,47,88,0.1)]'
                    : 'text-slate-600 hover:bg-white/40'
                }`}
                style={
                  !isActive
                    ? { background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.3)' }
                    : undefined
                }
              >
                {label}
                {isActive && (
                  <span className="bg-[#232F58]/10 px-2 py-0.5 rounded-md text-[10px] font-bold">
                    {tabCounts[status]}
                  </span>
                )}
              </button>
            );
          })}
          <div className="flex-grow" />
          <button
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 flex items-center gap-2"
            style={{ background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.3)' }}
          >
            <span className="material-symbols-outlined text-sm">filter_list</span>
            More Filters
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto flex-grow">
          <TicketTable
            tickets={allForTab}
            activeStatus={activeStatus}
            currentPage={safePage}
            itemsPerPage={ITEMS_PER_PAGE}
          />
        </div>

        {/* Pagination */}
        <div className="p-8 border-t border-white/20 flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-widest">
          <span>
            Showing {showingCount > 0 ? showingCount : 0} of {allForTab.length}{' '}
            {activeStatus.toLowerCase()} tickets
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/50 shadow-sm disabled:opacity-50 hover:bg-white transition-all"
            >
              <span className="material-symbols-outlined text-lg">chevron_left</span>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .slice(0, 5) // show at most 5 page buttons
              .map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all shadow-sm ${
                    safePage === page
                      ? 'bg-[#232F58] text-white shadow-md'
                      : 'bg-white/50 text-slate-700 hover:bg-white'
                  }`}
                >
                  {page}
                </button>
              ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/50 shadow-sm disabled:opacity-50 hover:bg-white transition-all"
            >
              <span className="material-symbols-outlined text-lg">chevron_right</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TicketCenter;
