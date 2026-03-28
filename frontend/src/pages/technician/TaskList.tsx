import React, { useState, useRef, useEffect } from 'react';
import {
  TABS,
  getTicketsByStatus,
  MOCK_TICKETS,
} from '@/data/technician/mockTickets';
import type { Ticket, TicketPriority, TicketStatus } from '@/data/technician/mockTickets';
import TicketTable from '@/components/technician/tickets/TicketTable';
import { PageHeader } from '@/components/shared/PageHeader';
import TicketViewModal from '@/components/technician/tickets/TicketViewModal';
import TicketApproveModal from '@/components/technician/tickets/TicketApproveModal';
import TicketRejectModal from '@/components/technician/tickets/TicketRejectModal';
import { StartRepairModal, MarkResolvedModal } from '@/components/technician/tickets/TicketActionModals';
import { getTodayLocal } from '@/utils/dateUtils';
import { technicianApi } from '@/services/api/technicianApi';
import { useLocation } from 'react-router-dom';

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
  const date = getTodayLocal();
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
  const location = useLocation();

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const ticketsRef = useRef<Ticket[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [updating, setUpdating] = useState(false);

  const [activeStatus, setActiveStatus] = useState<TicketStatus>('Pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  type TicketModal = 'none' | 'view' | 'approve' | 'reject' | 'startRepair' | 'markResolved';
  const [ticketModal, setTicketModal] = useState<TicketModal>('none');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  // Derive per-tab counts from live state
  const tabCounts = Object.fromEntries(
    TABS.map((t) => [t.status, getTicketsByStatus(t.status, tickets).length])
  ) as Record<TicketStatus, number>;

  // Filter by search
  const allForTab = getTicketsByStatus(activeStatus, tickets).filter((t: Ticket) => {
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

    return true;
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

  // ── Ticket modals ───────────────────────────────────────────────────────────
  const openModal = (modal: TicketModal, ticket: Ticket) => {
    setSelectedTicket(ticket);
    setTicketModal(modal);
  };
  const closeModal = () => {
    setTicketModal('none');
    setSelectedTicket(null);
  };

  // Keep a ref to the latest tickets to avoid stale closures in async handlers
  useEffect(() => {
    ticketsRef.current = tickets;
  }, [tickets]);

  // Move a ticket to a new status in local state
  const changeStatus = (id: string, newStatus: TicketStatus) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === id || t.code === id ? { ...t, status: newStatus } : t))
    );
  };

  // Persist status + optional outcome note to backend + optimistic UI update
  const updateStatus = async (id: string, newStatus: TicketStatus, outcomeNote?: string) => {
    const before = ticketsRef.current;
    setUpdating(true);

    // optimistic update
    changeStatus(id, newStatus);

    // If the ticket no longer belongs to current tab, move it out immediately
    if (activeStatus !== newStatus) {
      setTickets((prev) => prev.filter((t) => !(t.id === id || t.code === id)));
    }

    try {
      const backendStatus = uiToBackendStatus(newStatus);
      if (!backendStatus) return;

      const target = (before || []).find((t) => t.id === id || t.code === id);
      const reportId = target?.id;
      if (!reportId) throw new Error('Missing reportId');

      await technicianApi.updateTicketStatus(reportId, backendStatus as any, outcomeNote);

      setRefreshKey((k) => k + 1);
    } catch (e) {
      setTickets(before);
      // eslint-disable-next-line no-console
      console.error('Failed to update ticket status', e);
    } finally {
      setUpdating(false);
    }
  };

  // Lookup ticket by id from current live state
  const findTicket = (id: string) => (ticketsRef.current.find((t) => t.id === id) ?? tickets.find((t) => t.id === id))!;

  // Map backend Report.status -> UI TicketStatus
  const backendToUiStatus = (s?: string): TicketStatus => {
    const v = String(s || '').toLowerCase();
    if (v === 'pending') return 'Pending';
    if (v === 'approved') return 'Approved';
    if (v === 'processing') return 'In Progress';
    if (v === 'fixed') return 'Completed';
    if (v === 'rejected') return 'Rejected';
    return 'Pending';
  };

  // Map UI TicketStatus -> backend status query
  const uiToBackendStatus = (s: TicketStatus): string | undefined => {
    if (s === 'Pending') return 'pending';
    if (s === 'Approved') return 'approved';
    if (s === 'In Progress') return 'processing';
    if (s === 'Completed') return 'fixed';
    if (s === 'Rejected') return 'rejected';
    return undefined;
  };

  return (
    <>
      <PageHeader
        title="Ticket Center"
        description="Manage and oversee all tickets and tasks."
        className="mb-4"
      />

      {/* ── Status tabs ────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2 mb-4">
        {TABS.map((tab) => {
          const count = tabCounts[tab.status] ?? 0;
          const isActive = tab.status === activeStatus;

          return (
            <button
              key={tab.status}
              onClick={() => handleTabChange(tab.status)}
              className={`flex-1 px-4 py-2 text-sm font-semibold rounded-lg transition-all flex gap-2 items-center justify-center
              ${isActive ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
              `}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
              {count > 0 && (
                <span className="inline-flex items-center justify-center w-5 h-5 p-1 text-xs font-medium rounded-full bg-blue-100 text-blue-600">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Search + filters ────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 mb-4 md:flex-row">
        <div className="flex-1">
          <label htmlFor="search" className="sr-only">Search</label>
          <input
            id="search"
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder={SEARCH_PLACEHOLDER[activeStatus]}
            className="block w-full px-4 py-2 text-sm border rounded-lg focus:ring-1 focus:ring-blue-600 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => exportTicketsToCSV(allForTab, activeStatus)}
            className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v8m4-4H8" />
            </svg>
            New Ticket
          </button>

          {/* ── Date range & status filters (mobile) ────────────────────────────── */}
          <div className="flex flex-col gap-2 md:hidden">
            <div className="flex gap-2">
              <select
                value={filters.dateRangeDays}
                onChange={(e) => setFilters({ ...filters, dateRangeDays: Number(e.target.value) })}
                className="block w-full px-4 py-2 text-sm border rounded-lg focus:ring-1 focus:ring-blue-600 focus:outline-none"
              >
                {DATE_RANGES.map((range) => (
                  <option key={range.label} value={range.days}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-wrap gap-2">
              {PRIORITIES.map((priority) => (
                <button
                  key={priority}
                  onClick={() => togglePriority(priority)}
                  className={`flex-1 px-4 py-2 text-sm font-semibold rounded-lg transition-all flex gap-2 items-center justify-center
                  ${filters.priorities.includes(priority) ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                  `}
                >
                  {priority}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {EQUIPMENT_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => toggleEquipmentType(type)}
                  className={`flex-1 px-4 py-2 text-sm font-semibold rounded-lg transition-all flex gap-2 items-center justify-center
                  ${filters.equipmentTypes.includes(type) ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                  `}
                >
                  {type}
                </button>
              ))}
            </div
