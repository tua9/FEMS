import React, { useState, useRef, useEffect } from 'react';
import {
  TABS,
  Ticket,
  TicketPriority,
  TicketStatus,
  getTicketsByStatus,
  MOCK_TICKETS,
} from '@/data/technician/mockTickets';
import TicketTable from '@/components/technician/tickets/TicketTable';
import { PageHeader } from '@/components/shared/PageHeader';
import TicketViewModal from '@/components/technician/tickets/TicketViewModal';
import TicketApproveModal from '@/components/technician/tickets/TicketApproveModal';
import TicketRejectModal from '@/components/technician/tickets/TicketRejectModal';
import { StartRepairModal, MarkResolvedModal } from '@/components/technician/tickets/TicketActionModals';

// ── Equipment types derived from mock data ────────────────────────────────────
const EQUIPMENT_TYPES = [
  'HVAC System', 'IT Hardware', 'AV Device', 'Plumbing',
  'Safety Equipment', 'Electrical', 'Furniture',
] as const;

const PRIORITIES: TicketPriority[] = ['Urgent', 'High', 'Medium', 'Low'];

const DATE_RANGES = [
  { label: 'Last 7 days', days: 7 },
  { label: 'Last 30 days', days: 30 },
  { label: 'Last 90 days', days: 90 },
  { label: 'All time', days: 0 },
] as const;

interface Filters {
  priorities: TicketPriority[];
  equipmentTypes: string[];
  dateRangeDays: number; // 0 = all time
}

const DEFAULT_FILTERS: Filters = { priorities: [], equipmentTypes: [], dateRangeDays: 0 };

function countActiveFilters(f: Filters) {
  return (f.priorities.length > 0 ? 1 : 0) +
    (f.equipmentTypes.length > 0 ? 1 : 0) +
    (f.dateRangeDays > 0 ? 1 : 0);
}

// ── Export Log helper ─────────────────────────────────────────────────────────
function exportTicketsToCSV(tickets: Ticket[], status: TicketStatus) {
  const headers = ['Ticket ID', 'Equipment', 'Type', 'Room', 'Reporter', 'Assignee', 'Priority', 'Status', 'Created At'];

  const rows = tickets.map((t) => [
    t.id,
    t.equipment,
    t.equipmentType,
    t.room,
    t.reporter.name,
    t.assignee?.name ?? '—',
    t.priority,
    t.status,
    t.createdAt,
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n');

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const date = new Date().toISOString().slice(0, 10);
  link.href = url;
  link.download = `tickets_${status.replace(' ', '_').toLowerCase()}_${date}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

const ITEMS_PER_PAGE = 4;

// search placeholder by tab
const SEARCH_PLACEHOLDER: Record<TicketStatus, string> = {
  Pending: 'Search tickets...',
  Approved: 'Search approved tickets...',
  'In Progress': 'Search ongoing tasks...',
  Rejected: 'Search rejected tickets...',
  Completed: 'Search completed tickets...',
};

const TicketCenter: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([...MOCK_TICKETS]);
  const [activeStatus, setActiveStatus] = useState<TicketStatus>('Pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  type TicketModal = 'none' | 'view' | 'approve' | 'reject' | 'startRepair' | 'markResolved';
  const [ticketModal, setTicketModal] = useState<TicketModal>('none');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const filterRef = useRef<HTMLDivElement>(null);

  // Close panel when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setShowFilterPanel(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const activeFilterCount = countActiveFilters(filters);

  // Derive per-tab counts from live state
  const tabCounts = Object.fromEntries(
    TABS.map((t) => [t.status, getTicketsByStatus(t.status, tickets).length])
  ) as Record<TicketStatus, number>;

  // Filter by search
  const allForTab = getTicketsByStatus(activeStatus, tickets).filter((t) => {
    // ── search query ──
    const q = searchQuery.toLowerCase().trim();
    if (q && !(
      t.id.toLowerCase().includes(q) ||
      t.equipment.toLowerCase().includes(q) ||
      t.equipmentType.toLowerCase().includes(q) ||
      t.room.toLowerCase().includes(q) ||
      t.reporter.name.toLowerCase().includes(q) ||
      (t.assignee?.name.toLowerCase().includes(q) ?? false) ||
      t.priority.toLowerCase().includes(q) ||
      t.status.toLowerCase().includes(q)
    )) return false;

    // ── priority filter ──
    if (filters.priorities.length > 0 && !filters.priorities.includes(t.priority)) return false;

    // ── equipment type filter ──
    if (filters.equipmentTypes.length > 0 && !filters.equipmentTypes.includes(t.equipmentType)) return false;

    // ── date range filter ──
    if (filters.dateRangeDays > 0) {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - filters.dateRangeDays);
      if (new Date(t.createdAt) < cutoff) return false;
    }

    return true;
  });

  const totalPages = Math.max(1, Math.ceil(allForTab.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);

  const handleTabChange = (status: TicketStatus) => {
    setActiveStatus(status);
    setSearchQuery('');
    setFilters(DEFAULT_FILTERS);
    setCurrentPage(1);
  };

  const handleSearch = (v: string) => {
    setSearchQuery(v);
    setCurrentPage(1);
  };

  const togglePriority = (p: TicketPriority) => {
    setFilters((f) => ({
      ...f,
      priorities: f.priorities.includes(p) ? f.priorities.filter((x) => x !== p) : [...f.priorities, p],
    }));
    setCurrentPage(1);
  };

  const toggleEquipmentType = (et: string) => {
    setFilters((f) => ({
      ...f,
      equipmentTypes: f.equipmentTypes.includes(et) ? f.equipmentTypes.filter((x) => x !== et) : [...f.equipmentTypes, et],
    }));
    setCurrentPage(1);
  };

  const setDateRange = (days: number) => {
    setFilters((f) => ({ ...f, dateRangeDays: f.dateRangeDays === days ? 0 : days }));
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setCurrentPage(1);
  };

  const showingCount = Math.min(
    ITEMS_PER_PAGE,
    allForTab.length - (safePage - 1) * ITEMS_PER_PAGE,
  );

  // ── Ticket modals ───────────────────────────────────────────────────────────
  const openModal = (modal: TicketModal, ticket: Ticket) => {
    setSelectedTicket(ticket);
    setTicketModal(modal);
  };
  const closeModal = () => {
    setTicketModal('none');
    setSelectedTicket(null);
  };

  // Move a ticket to a new status in local state
  const changeStatus = (id: string, newStatus: TicketStatus) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );
  };

  // Lookup ticket by id from current live state
  const findTicket = (id: string) => tickets.find((t) => t.id === id)!;

  return (
    <div className="pt-6 sm:pt-8 pb-16 px-6 max-w-7xl mx-auto space-y-8">
      {/* ── Page header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <PageHeader
          title="Ticket Center"
          subtitle="Manage and process facility maintenance requests"
          className="items-start! text-left! mb-0!"
        />
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
              className="w-full pl-12 pr-4 py-3 tech-pill dark:text-white border-none rounded-2xl text-sm focus:ring-2 focus:ring-[#232F58] shadow-sm placeholder-slate-400 dark:placeholder-slate-500 outline-none"
            />
          </div>
          {/* Export */}
          <button
            onClick={() => exportTicketsToCSV(allForTab, activeStatus)}
            className="bg-[#232F58] text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-lg hover:opacity-90 transition-all flex items-center gap-2 whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-lg">file_download</span>
            Export Log
          </button>
        </div>
      </div>

      {/* ── Main card ── */}
      <section className="tech-card rounded-3xl overflow-hidden flex flex-col border min-h-[600px]">
        {/* Tabs */}
        <div className="p-8 border-b border-white/30 dark:border-white/5 flex flex-wrap items-center gap-4">
          {TABS.map(({ label, status }) => {
            const isActive = activeStatus === status;
            return (
              <button
                key={status}
                onClick={() => handleTabChange(status)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${isActive
                    ? 'tech-pill bg-white dark:bg-[#1a3160] text-[#232F58] dark:text-white font-bold shadow-[0_4px_12px_rgba(35,47,88,0.1)]'
                    : 'tech-pill text-slate-600 dark:text-slate-300 hover:dark:bg-white/10'
                  }`}

              >
                {label}
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${isActive
                    ? 'bg-[#232F58]/10 dark:bg-white/10 text-[#232F58] dark:text-white'
                    : 'bg-slate-200/60 dark:bg-white/10 text-slate-500 dark:text-slate-400'
                  }`}>
                  {tabCounts[status]}
                </span>
              </button>
            );
          })}
          <div className="flex-grow" />

          {/* ── More Filters ── */}
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setShowFilterPanel((v) => !v)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${activeFilterCount > 0
                  ? 'bg-[#232F58] text-white shadow-md'
                  : 'tech-pill text-slate-600 dark:text-slate-300'
                }`}

            >
              <span className="material-symbols-outlined text-sm">filter_list</span>
              More Filters
              {activeFilterCount > 0 && (
                <span className="bg-white/20 px-1.5 py-0.5 rounded-md text-[10px] font-black">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Filter panel dropdown */}
            {showFilterPanel && (
              <div
                className="absolute right-0 top-full mt-2 w-72 tech-dropdown rounded-2xl shadow-2xl z-50 p-5 space-y-5"
              >
                {/* Header */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-extrabold text-[#232F58] dark:text-white">Filters</span>
                  {activeFilterCount > 0 && (
                    <button
                      onClick={resetFilters}
                      className="text-xs font-bold text-rose-500 hover:text-rose-600 flex items-center gap-1 transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">close</span>
                      Clear all
                    </button>
                  )}
                </div>

                {/* Priority */}
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Priority</p>
                  <div className="flex flex-wrap gap-2">
                    {PRIORITIES.map((p) => {
                      const active = filters.priorities.includes(p);
                      const colorMap: Record<TicketPriority, string> = {
                        Urgent: active ? 'bg-rose-600 text-white border-rose-600' : 'border-rose-200 text-rose-500 hover:bg-rose-50',
                        High: active ? 'bg-rose-500 text-white border-rose-500' : 'border-rose-200 text-rose-400 hover:bg-rose-50',
                        Medium: active ? 'bg-amber-500 text-white border-amber-500' : 'border-amber-200 text-amber-500 hover:bg-amber-50',
                        Low: active ? 'bg-emerald-500 text-white border-emerald-500' : 'border-emerald-200 text-emerald-500 hover:bg-emerald-50',
                      };
                      return (
                        <button
                          key={p}
                          onClick={() => togglePriority(p)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${colorMap[p]}`}
                        >
                          {p}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Equipment Type */}
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Equipment Type</p>
                  <div className="flex flex-col gap-1.5">
                    {EQUIPMENT_TYPES.map((et) => {
                      const active = filters.equipmentTypes.includes(et);
                      return (
                        <button
                          key={et}
                          onClick={() => toggleEquipmentType(et)}
                          className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-left transition-all ${active
                              ? 'bg-[#232F58] text-white'
                              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10'
                            }`}
                        >
                          <span className={`w-4 h-4 rounded flex items-center justify-center border flex-shrink-0 ${active ? 'bg-white/20 border-white/30' : 'border-slate-300'
                            }`}>
                            {active && <span className="material-symbols-outlined text-[12px]">check</span>}
                          </span>
                          {et}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Date Range */}
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Date Created</p>
                  <div className="flex flex-col gap-1.5">
                    {DATE_RANGES.filter((r) => r.days > 0).map((r) => {
                      const active = filters.dateRangeDays === r.days;
                      return (
                        <button
                          key={r.days}
                          onClick={() => setDateRange(r.days)}
                          className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-left transition-all ${active ? 'bg-[#232F58] text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10'
                            }`}
                        >
                          <span className={`w-4 h-4 rounded-full flex-shrink-0 border-2 ${active ? 'bg-white border-white/50' : 'border-slate-300'
                            }`} />
                          {r.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto flex-grow">
          <TicketTable
            tickets={allForTab}
            activeStatus={activeStatus}
            currentPage={safePage}
            itemsPerPage={ITEMS_PER_PAGE}
            onView={(id) => openModal('view', findTicket(id))}
            onApprove={(id) => openModal('approve', findTicket(id))}
            onReject={(id) => openModal('reject', findTicket(id))}
            onStartRepair={(id) => openModal('startRepair', findTicket(id))}
            onMarkResolved={(id) => openModal('markResolved', findTicket(id))}
          />
        </div>

        {/* Pagination */}
        <div className="p-8 border-t border-white/20 dark:border-white/5 flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
          <span>
            Showing {showingCount > 0 ? showingCount : 0} of {allForTab.length}{' '}
            {activeStatus.toLowerCase()} tickets
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="w-10 h-10 rounded-xl flex items-center justify-center tech-pill dark:text-white shadow-sm disabled:opacity-50 transition-all"
            >
              <span className="material-symbols-outlined text-lg">chevron_left</span>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .slice(0, 5)
              .map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all shadow-sm ${safePage === page
                      ? 'bg-[#232F58] text-white shadow-md'
                      : 'tech-pill text-slate-700 dark:text-slate-300'
                    }`}
                >
                  {page}
                </button>
              ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="w-10 h-10 rounded-xl flex items-center justify-center tech-pill dark:text-white shadow-sm disabled:opacity-50 transition-all"
            >
              <span className="material-symbols-outlined text-lg">chevron_right</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── Ticket Modals ── */}
      {selectedTicket && ticketModal === 'view' && (
        <TicketViewModal
          ticket={selectedTicket}
          onClose={closeModal}
          onApprove={(id) => { closeModal(); openModal('approve', findTicket(id)); }}
          onReject={(id) => { closeModal(); openModal('reject', findTicket(id)); }}
          onStartRepair={(id) => { closeModal(); openModal('startRepair', findTicket(id)); }}
          onMarkResolved={(id) => { closeModal(); openModal('markResolved', findTicket(id)); }}
        />
      )}
      {selectedTicket && ticketModal === 'approve' && (
        <TicketApproveModal
          ticket={selectedTicket}
          onClose={closeModal}
          onConfirm={(id) => { changeStatus(id, 'Approved'); closeModal(); }}
        />
      )}
      {selectedTicket && ticketModal === 'reject' && (
        <TicketRejectModal
          ticket={selectedTicket}
          onClose={closeModal}
          onConfirm={(id) => { changeStatus(id, 'Rejected'); closeModal(); }}
        />
      )}
      {selectedTicket && ticketModal === 'startRepair' && (
        <StartRepairModal
          ticket={selectedTicket}
          onClose={closeModal}
          onConfirm={(id) => { changeStatus(id, 'In Progress'); closeModal(); }}
        />
      )}
      {selectedTicket && ticketModal === 'markResolved' && (
        <MarkResolvedModal
          ticket={selectedTicket}
          onClose={closeModal}
          onConfirm={(id) => { changeStatus(id, 'Completed'); closeModal(); }}
        />
      )}
    </div>
  );
};

export default TicketCenter;
