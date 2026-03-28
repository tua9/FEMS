import React, { useState, useEffect, useRef } from 'react';
import {
  TABS,
  getTicketsByStatus,
  MOCK_TICKETS,
} from '@/mocks/technician/mockTickets';
import TicketTable from '@/features/technician/components/tickets/TicketTable';
import { PageHeader } from '@/features/shared/components/PageHeader';
import TicketViewModal from '@/features/technician/components/tickets/TicketViewModal';
import TicketApproveModal from '@/features/technician/components/tickets/TicketApproveModal';
import TicketRejectModal from '@/features/technician/components/tickets/TicketRejectModal';
import { StartRepairModal, MarkResolvedModal } from '@/features/technician/components/tickets/TicketActionModals';
import { getTodayLocal } from '@/utils/dateUtils';
import { technicianApi } from '@/services/technicianApi';
import { useLocation } from 'react-router-dom';

// ── Equipment types derived from mock data ────────────────────────────────────
const EQUIPMENT_TYPES = [
  'HVAC System', 'IT Hardware', 'AV Device', 'Plumbing',
  'Safety Equipment', 'Electrical', 'Furniture',
];

const PRIORITIES= ['Urgent', 'High', 'Medium', 'Low'];

const DATE_RANGES = [
  { label: 'Last 7 days', days: 7 },
  { label: 'Last 30 days', days: 30 },
  { label: 'Last 90 days', days: 90 },
  { label: 'All time', days: 0 },
];

const DEFAULT_FILTERS= { priorities: [], equipmentTypes: [], dateRangeDays: 0 };

function countActiveFilters(f) {
  return (f.priorities.length > 0 ? 1 : 0) +
    (f.equipmentTypes.length > 0 ? 1 : 0) +
    (f.dateRangeDays > 0 ? 1 : 0);
}

// ── Export Log helper ─────────────────────────────────────────────────────────
function exportTicketsToCSV(tickets, status) {
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
  const date = getTodayLocal();
  link.href = url;
  link.download = `tickets_${status.replace(' ', '_').toLowerCase()}_${date}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

const ITEMS_PER_PAGE = 4;

// search placeholder by tab
const SEARCH_PLACEHOLDER= {
  Pending: 'Search tickets...',
  Approved: 'Search approved tickets...',
  'In Progress': 'Search ongoing tasks...',
  Rejected: 'Search rejected tickets...',
  Completed: 'Search completed tickets...',
};

const TicketCenter = () => {
  const location = useLocation();

  const [tickets, setTickets] = useState([]);
  const ticketsRef = useRef([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [updating, setUpdating] = useState(false);

  const [activeStatus, setActiveStatus] = useState('Pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Modal state
  const [ticketModal, setTicketModal] = useState('none');
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Derive per-tab counts from live state
  const tabCounts = Object.fromEntries(
    TABS.map((t) => [t.status, getTicketsByStatus(t.status, tickets).length])
  );

  // Filter by search (no extra filters)
  const allForTab = getTicketsByStatus(activeStatus, tickets).filter((t) => {
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

    return true;
  });

  const totalPages = Math.max(1, Math.ceil(allForTab.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);

  const handleTabChange = (status) => {
    setActiveStatus(status);
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handleSearch = (v) => {
    setSearchQuery(v);
    setCurrentPage(1);
  };

  const showingCount = Math.min(
    ITEMS_PER_PAGE,
    allForTab.length - (safePage - 1) * ITEMS_PER_PAGE,
  );

  // ── Ticket modals ───────────────────────────────────────────────────────────
  const openModal = (modal, ticket) => {
    setSelectedTicket(ticket);
    setTicketModal(modal);
  };
  const closeModal = () => {
    setTicketModal('none');
    setSelectedTicket(null);
  };

  // Move a ticket to a new status in local state
  const changeStatus = (id, newStatus) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === id || t.code === id ? { ...t, status: newStatus } : t))
    );
  };

  // Lookup ticket by id from current live state
  const findTicket = (id) => tickets.find((t) => t.id === id);

  // Map backend Report.status -> UI TicketStatus
  const backendToUiStatus = (s) => {
    const v = String(s || '').toLowerCase();
    if (v === 'pending') return 'Pending';
    if (v === 'approved') return 'Approved';
    if (v === 'processing') return 'In Progress';
    if (v === 'fixed') return 'Completed';
    if (v === 'rejected') return 'Rejected';
    return 'Pending';
  };

  // Map UI TicketStatus -> backend status query
  const uiToBackendStatus = (s) => {
    if (s === 'Pending') return 'pending';
    if (s === 'Approved') return 'approved';
    if (s === 'In Progress') return 'processing';
    if (s === 'Completed') return 'fixed';
    if (s === 'Rejected') return 'rejected';
    return undefined;
  };

  // Convert backend report -> Ticket shape used by existing UI/modals/table
  const reportToTicket = (r) => {
    const avatar = undefined;
    const equipmentName = r.equipment_id?.name || r.room_id?.name || 'N/A';
    const equipmentType = r.equipment_id?.category || r.type || 'Other';
    const room = r.room_id?.name
      ? `${r.room_id?.name}`
      : 'N/A';

    const reporterName = r.user_id?.displayName || r.user_id?.username || 'Unknown';

    return {
      id: String(r._id),
      code: r.code || String(r._id).slice(-6).toUpperCase(),
      title: equipmentName,
      category: equipmentType,
      description: r.description || '',
      equipment: equipmentName,
      equipmentType,
      room,
      reporter: {
        name: reporterName,
        initials: reporterName
          .split(' ')
          .slice(0, 2)
          .map((w) => w[0])
          .join('')
          .toUpperCase(),
      },
      assignee: r.assigned_to
        ? {
          name: r.assigned_to?.displayName || r.assigned_to?.username || 'Technician',
          initials: (r.assigned_to?.displayName || r.assigned_to?.username || 'T')
            .split(' ')
            .slice(0, 2)
            .map((w) => w[0])
            .join('')
            .toUpperCase(),
          avatar,
        }
        : null,
      priority: (String(r.priority || 'medium').toLowerCase() === 'critical')
        ? 'Urgent'
        : (String(r.priority || 'medium').toLowerCase() === 'high')
          ? 'High'
          : (String(r.priority || 'medium').toLowerCase() === 'low')
            ? 'Low'
            : 'Medium',
      status: backendToUiStatus(r.status),
      createdAt: r.createdAt,
    };
  };

  // Keep a ref to the latest tickets to avoid stale closures in async handlers
  useEffect(() => {
    ticketsRef.current = tickets;
  }, [tickets]);

  // Persist status + optional outcome note to backend + optimistic UI update
  const updateStatus = async (id, newStatus, outcomeNote) => {
    const before = ticketsRef.current;
    setUpdating(true);

    // optimistic UI
    changeStatus(id, newStatus);
    if (activeStatus !== newStatus) {
      setTickets((prev) => prev.filter((t) => !(t.id === id || t.code === id)));
    }

    try {
      const backendStatus = uiToBackendStatus(newStatus);
      if (!backendStatus) return;

      const target = (before || []).find((t) => t.id === id || t.code === id);
      const reportId = target?.id;
      if (!reportId) throw new Error('Missing reportId');

      // technicianApi.updateTicket hits /api/technician/tickets/:id
      await technicianApi.updateTicket(reportId, {
        status: backendStatus,
        outcome: typeof outcomeNote === 'string' ? outcomeNote : undefined,
      });

      setRefreshKey((k) => k + 1);
    } catch (e) {
      setTickets(before);
      // eslint-disable-next-line no-console
      console.error('Failed to update ticket status', e);
    } finally {
      setUpdating(false);
    }
  };

  // Initial tab from query (?status=pending|approved|processing|fixed)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = (params.get('status') || '').toLowerCase();
    const map = {
      pending: 'Pending',
      approved: 'Approved',
      processing: 'In Progress',
      fixed: 'Completed',
      rejected: 'Rejected',
    };
    if (map[q]) {
      setActiveStatus(map[q]);
      setCurrentPage(1);
    }
  }, [location.search]);

  // Fetch tickets from backend when active tab changes / after updates
  useEffect(() => {
    let mounted = true;
    const status = uiToBackendStatus(activeStatus);

    if (updating) return;

    technicianApi
      .getTickets({ status })
      .then((data) => {
        if (!mounted) return;
        setTickets((data || []).map(reportToTicket));
      })
      .catch(() => {
        if (!mounted) return;
        setTickets([...MOCK_TICKETS]);
      });

    return () => { mounted = false; };
  }, [activeStatus, refreshKey, updating]);

  return (
    <div className="pt-6 sm:pt-8 pb-16 px-6 max-w-7xl mx-auto space-y-8">
      {/* ── Page header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <PageHeader
          title="Ticket Center"
          subtitle="Manage and process facility maintenance requests"
          className="items-start text-left mb-0!"
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
      <section className="dashboard-card rounded-3xl overflow-hidden flex flex-col min-h-150">
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
              </button>
            );
          })}
          <div className="grow" />
        </div>

        {/* Table */}
        <div className="overflow-x-auto grow">
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
          onConfirm={(id, note) => {
            // Pending -> Approved
            updateStatus(id, 'Approved', note);
            closeModal();
          }}
        />
      )}
      {selectedTicket && ticketModal === 'reject' && (
        <TicketRejectModal
          ticket={selectedTicket}
          onClose={closeModal}
          onConfirm={(id, note) => {
            // Pending -> Rejected (save note to outcome)
            updateStatus(id, 'Rejected', note);
            closeModal();
          }}
        />
      )}
      {selectedTicket && ticketModal === 'startRepair' && (
        <StartRepairModal
          ticket={selectedTicket}
          onClose={closeModal}
          onConfirm={(id) => {
            // Approved -> In Progress
            updateStatus(id, 'In Progress');
            closeModal();
          }}
        />
      )}
      {selectedTicket && ticketModal === 'markResolved' && (
        <MarkResolvedModal
          ticket={selectedTicket}
          onClose={closeModal}
          onConfirm={(id, note) => {
            // In Progress -> Completed (save note to outcome)
            updateStatus(id, 'Completed', note);
            closeModal();
          }}
        />
      )}
    </div>
  );
};

export default TicketCenter;
