import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import TicketTable from '@/features/technician/components/tickets/TicketTable';
import Pagination from '@/features/shared/components/Pagination';

const STATUS_CONFIG = {
  pending:    { label: 'Pending',     color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  approved:   { label: 'Approved',    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  processing: { label: 'In Progress', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
  fixed:      { label: 'Completed',   color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  rejected:   { label: 'Rejected',    color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
  cancelled:  { label: 'Cancelled',   color: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400' },
};

const PRIORITY_COLOR = {
  critical: 'text-red-600 dark:text-red-400',
  high:     'text-orange-600 dark:text-orange-400',
  medium:   'text-amber-600 dark:text-amber-400',
  low:      'text-slate-500 dark:text-slate-400',
};

const STATUS_FILTERS = [
  { key: 'all',        label: 'All' },
  { key: 'pending',    label: 'Pending' },
  { key: 'approved',   label: 'Approved' },
  { key: 'processing', label: 'In Progress' },
  { key: 'fixed',      label: 'Completed' },
  { key: 'rejected',   label: 'Rejected' },
];

const TRANSITIONS = {
  pending:    ['approved', 'rejected'],
  approved:   ['processing', 'rejected'],
  processing: ['fixed'],
};

const ACTION_LABELS = {
  approved:   { label: 'Approve',       icon: 'check_circle', cls: 'bg-blue-600 text-white hover:bg-blue-700' },
  rejected:   { label: 'Reject',        icon: 'cancel',       cls: 'bg-red-500 text-white hover:bg-red-600' },
  processing: { label: 'Start Repair',  icon: 'build',        cls: 'bg-purple-600 text-white hover:bg-purple-700' },
  fixed:      { label: 'Mark Complete', icon: 'task_alt',     cls: 'bg-green-600 text-white hover:bg-green-700' },
};

const CAUSE_OPTIONS = [
  { value: 'user_error',   label: 'User error' },
  { value: 'hardware',     label: 'Hardware failure' },
  { value: 'software',     label: 'Software issue' },
  { value: 'environment',  label: 'Environmental factor' },
  { value: 'unknown',      label: 'Unknown' },
];

const OUTCOME_OPTIONS = [
  { value: 'fixed_internally',  label: 'Fixed internally' },
  { value: 'external_warranty', label: 'External warranty' },
  { value: 'beyond_repair',     label: 'Beyond repair' },
];

// ── Detail Modal ──────────────────────────────────────────────────────────────
const RepairDetailModal = ({ report, onClose, onUpdateStatus }) => {
  const [loading, setLoading] = useState(false);
  const [cause, setCause]     = useState(report.cause ?? '');
  const [outcome, setOutcome] = useState(report.outcome ?? '');
  const [note, setNote]       = useState('');

  const cfg     = STATUS_CONFIG[report.status] ?? STATUS_CONFIG.pending;
  const allowed = TRANSITIONS[report.status] ?? [];

  const handleAction = async (newStatus) => {
    setLoading(true);
    await onUpdateStatus(report._id, {
      status:        newStatus,
      cause:         cause || undefined,
      outcome:       outcome || undefined,
      decision_note: note || undefined,
    });
    setLoading(false);
    onClose();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="dashboard-card rounded-4xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4 flex items-start justify-between">
          <div className="space-y-1">
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${cfg.color}`}>
              {cfg.label}
            </span>
            <h2 className="text-base font-extrabold text-[#1A2B56] dark:text-white mt-2">
              {report.equipment_id?.name ?? 'Equipment'}
            </h2>
            <p className="text-xs text-slate-400">
              {report.code ?? report._id?.slice(-8).toUpperCase()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <div className="mx-6 border-t border-slate-100 dark:border-slate-700" />

        <div className="px-6 py-4 space-y-3">
          {report.description && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Description</p>
              <p className="text-sm text-slate-700 dark:text-slate-300">{report.description}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Reported by</p>
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {report.user_id?.displayName ?? '—'}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Priority</p>
              <p className={`text-xs font-bold uppercase ${PRIORITY_COLOR[report.priority] ?? ''}`}>
                {report.priority ?? '—'}
              </p>
            </div>
            {report.assigned_to && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Assigned to</p>
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {report.assigned_to?.displayName ?? '—'}
                </p>
              </div>
            )}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Reported at</p>
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {report.createdAt ? new Date(report.createdAt).toLocaleDateString('en-GB') : '—'}
              </p>
            </div>
          </div>

          {/* Cause / Outcome fields when in progress */}
          {(report.status === 'approved' || report.status === 'processing') && (
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-700">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Cause</label>
                <select
                  value={cause}
                  onChange={(e) => setCause(e.target.value)}
                  className="mt-1 w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none"
                >
                  <option value="">— Not determined —</option>
                  {CAUSE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              {report.status === 'processing' && (
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Repair outcome</label>
                  <select
                    value={outcome}
                    onChange={(e) => setOutcome(e.target.value)}
                    className="mt-1 w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none"
                  >
                    <option value="">— Select outcome —</option>
                    {OUTCOME_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
              )}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Notes</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={2}
                  className="mt-1 w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none resize-none"
                  placeholder="Additional notes..."
                />
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        {allowed.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-700 flex gap-2 flex-wrap">
            {allowed.map((s) => {
              const ac = ACTION_LABELS[s];
              if (!ac) return null;
              return (
                <button
                  key={s}
                  disabled={loading}
                  onClick={() => handleAction(s)}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${ac.cls} disabled:opacity-60`}
                >
                  {loading
                    ? <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    : <span className="material-symbols-outlined text-base">{ac.icon}</span>
                  }
                  {ac.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

// ── Repair Table ──────────────────────────────────────────────────────────────
const ITEMS_PER_PAGE = 4;

const RepairTable = ({
  reports,
  onUpdateStatus,
  loading,
  statusFilter,
  onStatusFilterChange,
  highlightedId,
}) => {
  const [selected, setSelected] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const highlightRowRef = useRef(null);

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

  // Map UI TicketStatus -> backend status
  const uiToBackendStatus = (s) => {
    if (s === 'Pending') return 'pending';
    if (s === 'Approved') return 'approved';
    if (s === 'In Progress') return 'processing';
    if (s === 'Completed') return 'fixed';
    if (s === 'Rejected') return 'rejected';
    return undefined;
  };

  // Convert a repair report -> TicketTable row shape
  const reportToTicket = (r) => {
    const equipment = r.equipment_id?.name || 'N/A';
    const equipmentType = r.equipment_id?.category || 'Equipment';
    const room = r.room_id?.name || r.equipment_id?.roomId?.name || 'N/A';
    const reporterName = r.user_id?.displayName || r.user_id?.username || 'Unknown';

    // Replace Ticket ID column with Equipment ID (per requirement)
    const equipmentId = r.equipment_id?._id || r.equipment_id || '';

    return {
      id: String(r._id),
      // TicketTable shows "#" + code, so we put EquipmentId suffix here
      code: equipmentId ? String(equipmentId).slice(-6).toUpperCase() : String(r._id).slice(-6).toUpperCase(),
      equipment,
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
      priority: 'Medium',
      status: backendToUiStatus(r.status),
      createdAt: r.createdAt,
      _raw: r,
    };
  };

  const allTickets = useMemo(() => (reports ?? []).map(reportToTicket), [reports]);

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, reports]);

  const filteredTickets = useMemo(() => {
    if (statusFilter === 'all') return allTickets;
    const ui = backendToUiStatus(statusFilter);
    // statusFilter in this component is backend key; map to UI label
    return allTickets.filter((t) => t.status === ui);
  }, [allTickets, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredTickets.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);

  const pagedTickets = filteredTickets.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE,
  );

  // Scroll the highlighted row into view when it appears
  useEffect(() => {
    if (highlightedId && highlightRowRef.current) {
      highlightRowRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [highlightedId]);

  // Action handlers (same as ticket center)
  const findReportByTicketId = (ticketId) => {
    const t = allTickets.find((x) => x.id === ticketId);
    return t?._raw;
  };

  const updateStatus = async (ticketId, uiStatus, extra) => {
    const r = findReportByTicketId(ticketId);
    if (!r) return;
    const backendStatus = uiToBackendStatus(uiStatus);
    if (!backendStatus) return;

    await onUpdateStatus(r._id, {
      status: backendStatus,
      // For parity with ticket center: reject/resolve notes go to outcome
      outcome: typeof extra === 'string' ? extra : undefined,
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-extrabold text-[#1A2B56] dark:text-white">Repair Requests</h3>
          <p className="text-xs text-slate-400 mt-0.5">Equipment damage reports and repair workflow</p>
        </div>
        <span className="text-xs text-slate-400 font-semibold">{(reports ?? []).length} total</span>
      </div>

      {/* Status tabs (same labels as ticket center) */}
      <div className="flex gap-3 flex-wrap mb-6">
        {[
          { key: 'pending', label: 'Pending' },
          { key: 'approved', label: 'Approved' },
          { key: 'processing', label: 'In Progress' },
          { key: 'rejected', label: 'Rejected' },
          { key: 'fixed', label: 'Completed' },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => onStatusFilterChange(t.key)}
            className={`px-6 py-3 rounded-full text-sm font-semibold transition-all ${
              statusFilter === t.key
                ? 'bg-white text-[#1A2B56] shadow-sm'
                : 'bg-white/30 text-slate-600 hover:bg-white/50'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-4xl">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1A2B56]" />
          </div>
        ) : (
          <>
            <TicketTable
              tickets={pagedTickets}
              activeStatus={backendToUiStatus(statusFilter)}
              currentPage={1}
              itemsPerPage={ITEMS_PER_PAGE}
              onView={(id) => {
                const r = findReportByTicketId(id);
                if (r) setSelected(r);
              }}
              onApprove={(id) => updateStatus(id, 'Approved')}
              onReject={(id) => {
                const r = findReportByTicketId(id);
                if (r) setSelected(r); // reuse detail modal to collect note
              }}
              onStartRepair={(id) => updateStatus(id, 'In Progress')}
              onMarkResolved={(id) => {
                const r = findReportByTicketId(id);
                if (r) setSelected(r); // reuse detail modal to collect note
              }}
            />

            <div className="mt-8 flex items-center justify-between px-2">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Showing {filteredTickets.length === 0 ? 0 : (safePage - 1) * ITEMS_PER_PAGE + 1} - {Math.min(filteredTickets.length, safePage * ITEMS_PER_PAGE)} of {filteredTickets.length} tickets
              </p>
              <Pagination currentPage={safePage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>
          </>
        )}
      </div>

      {/* Keep existing detail modal for now to show full report info + capture notes */}
      {selected && (
        <RepairDetailModal
          report={selected}
          onClose={() => setSelected(null)}
          onUpdateStatus={async (id, payload) => {
            // Map detail modal payload to ticket-center style: note -> outcome
            const next = payload?.status;
            await onUpdateStatus(id, {
              ...payload,
              outcome: payload?.decision_note || payload?.outcome,
            });
            setSelected(null);
          }}
        />
      )}
    </div>
  );
};

export default RepairTable;
