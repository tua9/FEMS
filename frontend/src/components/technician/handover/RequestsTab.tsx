import React, { useState, useRef, useEffect, useMemo } from 'react';
import { MOCK_BORROW_REQUESTS, BorrowRequest } from '@/data/technician/mockHandover';
import HandoverPagination from './HandoverPagination';
import HandoverDetailModal, { HandoverDetailRecord } from './HandoverDetailModal';

const ITEMS_PER_PAGE = 4;

// ── Request status type ───────────────────────────────────────────────────────
type ReqStatus = 'Pending' | 'Approved' | 'Rejected';

interface RequestRecord extends BorrowRequest {
  status: ReqStatus;
}

const initials = (name: string) =>
  name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();

// ── Derive unique options from actual data ────────────────────────────────────
const ALL_DEPT_OPTIONS = Array.from(
  new Set(MOCK_BORROW_REQUESTS.map((r) => r.borrower.department ?? 'Unknown').filter(Boolean))
).sort();

const ALL_DURATION_OPTIONS = Array.from(
  new Set(MOCK_BORROW_REQUESTS.map((r) => r.duration))
);

// Sort durations: convert "N Days/Hours" to minutes for comparison
function durationToMinutes(d: string): number {
  const n = parseInt(d) || 0;
  if (d.toLowerCase().includes('hour')) return n * 60;
  return n * 24 * 60;
}
ALL_DURATION_OPTIONS.sort((a, b) => durationToMinutes(a) - durationToMinutes(b));

interface Filters {
  departments: string[];
  durations: string[];
  statuses: ReqStatus[];
}
const DEFAULT_FILTERS: Filters = { departments: [], durations: [], statuses: [] };

const STATUS_OPTIONS: ReqStatus[] = ['Pending', 'Approved', 'Rejected'];

// ── Convert BorrowRequest → HandoverDetailRecord ──────────────────────────────
function toDetailRecord(req: RequestRecord): HandoverDetailRecord {
  return {
    id: req.id,
    title: req.id,
    badge: {
      label: req.status,
      className:
        req.status === 'Approved' ? 'bg-emerald-100 text-emerald-700'
          : req.status === 'Rejected' ? 'bg-red-100 text-red-700'
            : 'bg-yellow-100 text-yellow-700',
    },
    person: {
      name: req.borrower.name,
      sub: `${req.borrower.department ?? 'Unknown Dept'} · ID: ${req.borrower.userId}`,
      initials: initials(req.borrower.name),
      avatarBg: 'bg-blue-100',
      avatarColor: 'text-blue-700',
      email: req.borrower.email,
    },
    meta: [
      { label: 'Equipment', value: req.equipment.name, icon: 'devices' },
      { label: 'Location', value: req.equipment.location, icon: 'location_on' },
      { label: 'Duration', value: req.duration, icon: 'calendar_today' },
      { label: 'Purpose', value: req.purpose, icon: 'info' },
    ],
    items: req.items,
    timeline: req.timeline,
  };
}

// ── Approve / Reject confirm modal ────────────────────────────────────────────
interface ActionModalProps {
  request: RequestRecord;
  action: 'Approve' | 'Reject';
  onConfirm: () => void;
  onClose: () => void;
}
const ActionModal: React.FC<ActionModalProps> = ({ request, action, onConfirm, onClose }) => {
  const isApprove = action === 'Approve';

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-md tech-dropdown rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Icon strip */}
        <div className={`h-2 w-full ${isApprove ? 'bg-emerald-500' : 'bg-red-500'}`} />

        <div className="p-8">
          {/* Icon + title */}
          <div className="flex items-center gap-4 mb-6">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${isApprove ? 'bg-emerald-50' : 'bg-red-50'}`}>
              <span className={`material-symbols-outlined text-2xl ${isApprove ? 'text-emerald-500' : 'text-red-500'}`}
                style={{ fontVariationSettings: "'FILL' 1" }}>
                {isApprove ? 'check_circle' : 'cancel'}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-[#1A2B56] dark:text-white">
                {isApprove ? 'Approve Request' : 'Reject Request'}
              </h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">{request.id}</p>
            </div>
          </div>

          {/* Info card */}
          <div className="bg-slate-50 dark:bg-white/5 rounded-2xl p-4 space-y-2 mb-6">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400 font-semibold">Borrower</span>
              <span className="font-bold text-slate-700">{request.borrower.name}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400 font-semibold">Equipment</span>
              <span className="font-bold text-slate-700">{request.equipment.name}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400 font-semibold">Duration</span>
              <span className="font-bold text-slate-700">{request.duration}</span>
            </div>
          </div>

          <p className="text-sm text-slate-600 mb-8">
            {isApprove
              ? 'This will approve the borrow request and notify the borrower. The equipment will be marked as reserved.'
              : 'This will reject the borrow request and notify the borrower. This action cannot be undone.'}
          </p>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-2xl border border-slate-200 dark:border-white/10 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 py-3 rounded-2xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95 flex items-center justify-center gap-2 ${isApprove ? 'bg-emerald-500' : 'bg-red-500'}`}
            >
              <span className="material-symbols-outlined text-base">{isApprove ? 'check' : 'close'}</span>
              {isApprove ? 'Confirm Approval' : 'Confirm Rejection'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Status pill ───────────────────────────────────────────────────────────────
const StatusPill: React.FC<{ status: ReqStatus }> = ({ status }) => {
  const map: Record<ReqStatus, string> = {
    Pending: 'bg-amber-50 text-amber-600 border border-amber-200',
    Approved: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
    Rejected: 'bg-red-50 text-red-500 border border-red-200',
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${map[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${status === 'Pending' ? 'bg-amber-500' : status === 'Approved' ? 'bg-emerald-500' : 'bg-red-500'}`} />
      {status}
    </span>
  );
};

// ── Single row ────────────────────────────────────────────────────────────────
interface RowProps {
  req: RequestRecord;
  onDetails: () => void;
  onApprove: () => void;
  onReject: () => void;
}
const RequestRow: React.FC<RowProps> = ({ req, onDetails, onApprove, onReject }) => (
  <tr className="hover:bg-blue-50/10 dark:hover:bg-white/5 transition-colors group border-b border-slate-100/80 dark:border-white/5 last:border-0">
    {/* Request ID */}
    <td className="px-5 py-5 w-36">
      <div className="space-y-1">
        <span className="text-sm font-extrabold text-[#1A2B56] block leading-tight">{req.id}</span>
        <StatusPill status={req.status} />
      </div>
    </td>

    {/* Borrower */}
    <td className="px-5 py-5 w-52">
      <div className="flex items-center gap-3">
        {req.borrower.avatar ? (
          <img src={req.borrower.avatar} alt={req.borrower.name} className="w-9 h-9 rounded-full border border-slate-200 object-cover flex-shrink-0" />
        ) : (
          <div className="w-9 h-9 rounded-full bg-blue-100 border-2 border-white shadow-sm flex items-center justify-center text-[10px] font-extrabold text-blue-700 flex-shrink-0">
            {initials(req.borrower.name)}
          </div>
        )}
        <div className="min-w-0">
          <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{req.borrower.name}</p>
          <p className="text-[10px] text-slate-400 font-semibold">ID: {req.borrower.userId}</p>
        </div>
      </div>
    </td>

    {/* Equipment */}
    <td className="px-5 py-5 w-48">
      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate max-w-[170px]">{req.equipment.name}</p>
      <p className="text-[10px] text-slate-400 mt-0.5 truncate max-w-[170px]">{req.equipment.location}</p>
    </td>

    {/* Duration — compact pill */}
    <td className="px-5 py-5 w-28">
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-100 text-blue-700 whitespace-nowrap">
        <span className="material-symbols-outlined text-[13px]">schedule</span>
        <span className="text-xs font-bold">{req.duration}</span>
      </div>
    </td>

    {/* Purpose */}
    <td className="px-5 py-5">
      <p className="text-xs text-slate-600 line-clamp-2 max-w-xs leading-relaxed">{req.purpose}</p>
    </td>

    {/* Actions */}
    <td className="px-5 py-5 w-52">
      <div className="flex items-center justify-end gap-2">
        <button
          onClick={onDetails}
          className="px-3.5 py-2 rounded-xl tech-pill dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-white/10 text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap"
        >
          <span className="material-symbols-outlined text-[13px]">visibility</span>
          Details
        </button>

        {req.status === 'Pending' && (
          <>
            <button
              onClick={onApprove}
              className="px-3.5 py-2 rounded-xl bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white text-xs font-bold transition-all whitespace-nowrap"
            >
              Approve
            </button>
            <button
              onClick={onReject}
              className="px-3.5 py-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white text-xs font-bold transition-all whitespace-nowrap"
            >
              Reject
            </button>
          </>
        )}

        {req.status === 'Approved' && (
          <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-600 text-[10px] font-extrabold uppercase tracking-wide border border-emerald-200 whitespace-nowrap">
            ✓ Approved
          </span>
        )}

        {req.status === 'Rejected' && (
          <span className="px-3 py-1.5 rounded-xl bg-red-50 text-red-500 text-[10px] font-extrabold uppercase tracking-wide border border-red-200 whitespace-nowrap">
            ✗ Rejected
          </span>
        )}
      </div>
    </td>
  </tr>
);

// ── Tab component ─────────────────────────────────────────────────────────────
const RequestsTab: React.FC = () => {
  const [requests, setRequests] = useState<RequestRecord[]>(
    MOCK_BORROW_REQUESTS.map((r) => ({ ...r, status: 'Pending' as ReqStatus }))
  );
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [detail, setDetail] = useState<HandoverDetailRecord | null>(null);

  // Filter state
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [showFilter, setShowFilter] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  // Action modal state
  type ActionState = { req: RequestRecord; action: 'Approve' | 'Reject' } | null;
  const [actionModal, setActionModal] = useState<ActionState>(null);

  // Close filter on outside click
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) setShowFilter(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const activeFilterCount =
    (filters.departments.length > 0 ? 1 : 0) +
    (filters.durations.length > 0 ? 1 : 0) +
    (filters.statuses.length > 0 ? 1 : 0);

  // Active chip list for display under search bar
  const activeChips = useMemo(() => {
    const chips: { label: string; onRemove: () => void }[] = [];
    filters.departments.forEach((d) =>
      chips.push({ label: d, onRemove: () => setFilters((f) => ({ ...f, departments: f.departments.filter((x) => x !== d) })) })
    );
    filters.durations.forEach((d) =>
      chips.push({ label: d, onRemove: () => setFilters((f) => ({ ...f, durations: f.durations.filter((x) => x !== d) })) })
    );
    filters.statuses.forEach((s) =>
      chips.push({ label: s, onRemove: () => setFilters((f) => ({ ...f, statuses: f.statuses.filter((x) => x !== s) })) })
    );
    return chips;
  }, [filters]);

  const filtered = requests.filter((r) => {
    const q = search.toLowerCase().trim();
    if (q && !(
      r.id.toLowerCase().includes(q) ||
      r.borrower.name.toLowerCase().includes(q) ||
      r.equipment.name.toLowerCase().includes(q) ||
      (r.borrower.department ?? '').toLowerCase().includes(q) ||
      r.purpose.toLowerCase().includes(q)
    )) return false;

    if (filters.departments.length > 0 && !filters.departments.includes(r.borrower.department ?? '')) return false;
    if (filters.durations.length > 0 && !filters.durations.includes(r.duration)) return false;
    if (filters.statuses.length > 0 && !filters.statuses.includes(r.status)) return false;

    return true;
  });

  const pendingCount = requests.filter((r) => r.status === 'Pending').length;
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paged = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

  const handleSearch = (v: string) => { setSearch(v); setCurrentPage(1); };

  const handleConfirmAction = () => {
    if (!actionModal) return;
    setRequests((prev) =>
      prev.map((r) => r.id === actionModal.req.id ? { ...r, status: actionModal.action === 'Approve' ? 'Approved' : 'Rejected' } : r)
    );
    setActionModal(null);
  };

  const toggle = <T extends string>(key: keyof Filters, val: T) =>
    setFilters((f) => {
      const arr = f[key] as T[];
      return { ...f, [key]: arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val] };
    });

  return (
    <>
      <div className="tech-card rounded-3xl border border-white/50 dark:border-white/10 shadow-2xl overflow-hidden">
        {/* ── Header ── */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-200/50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Title */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 flex-shrink-0">
                <span className="material-symbols-outlined">pending_actions</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#1A2B56] dark:text-white">Borrow Requests Queue</h2>
                <p className="text-xs text-slate-400 dark:text-slate-400 font-medium mt-0.5">
                  {filtered.length} request{filtered.length !== 1 ? 's' : ''} · {pendingCount} pending review
                </p>
              </div>
              {pendingCount > 0 && (
                <span className="bg-amber-500/10 text-amber-600 text-[10px] font-extrabold px-2.5 py-1 rounded-lg border border-amber-200 whitespace-nowrap">
                  {pendingCount} PENDING
                </span>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <div className="relative">
                <input
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search requests..."
                  className="pl-10 pr-4 py-2.5 tech-pill dark:text-white border border-slate-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1A2B56]/20 placeholder:text-slate-400 dark:placeholder:text-slate-500 w-56"
                />
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                {search && (
                  <button
                    onClick={() => handleSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <span className="material-symbols-outlined text-base">close</span>
                  </button>
                )}
              </div>

              {/* Filter button */}
              <div className="relative" ref={filterRef}>
                <button
                  onClick={() => setShowFilter((v) => !v)}
                  className={`h-10 px-3.5 rounded-xl border text-sm font-bold flex items-center gap-2 transition-all ${activeFilterCount > 0
                      ? 'bg-[#1A2B56] text-white border-[#1A2B56] shadow-md'
                      : 'border-slate-200 bg-white/80 text-slate-600 hover:bg-white hover:border-slate-300'
                    }`}
                >
                  <span className="material-symbols-outlined text-lg">tune</span>
                  <span className="text-xs font-bold">Filter</span>
                  {activeFilterCount > 0 && (
                    <span className="min-w-[18px] h-[18px] rounded-full bg-white/25 text-white text-[10px] font-extrabold flex items-center justify-center px-1">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                {/* ── Filter panel ── */}
                {showFilter && (
                  <div
                    className="absolute right-0 top-full mt-2 w-72 tech-dropdown rounded-2xl shadow-2xl z-50"
                  >
                    {/* Panel header */}
                    <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#1A2B56] text-lg">tune</span>
                        <span className="text-sm font-extrabold text-[#1A2B56] dark:text-white">Filters</span>
                        {activeFilterCount > 0 && (
                          <span className="bg-[#1A2B56] text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full">
                            {activeFilterCount}
                          </span>
                        )}
                      </div>
                      {activeFilterCount > 0 && (
                        <button
                          onClick={() => { setFilters(DEFAULT_FILTERS); setCurrentPage(1); }}
                          className="text-[11px] font-bold text-red-500 hover:text-red-600 flex items-center gap-1 transition-colors"
                        >
                          <span className="material-symbols-outlined text-sm">restart_alt</span>
                          Clear all
                        </button>
                      )}
                    </div>

                    {/* Scrollable body */}
                    <div className="overflow-y-auto" style={{ maxHeight: '420px' }}>
                      <div className="p-5 space-y-5">

                        {/* Status */}
                        <div className="space-y-2">
                          <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-slate-400">Status</p>
                          <div className="flex flex-wrap gap-2">
                            {STATUS_OPTIONS.map((s) => {
                              const on = filters.statuses.includes(s);
                              const colorMap: Record<ReqStatus, string> = {
                                Pending: on ? 'bg-amber-500 text-white border-amber-500' : 'border-amber-200 text-amber-600 hover:bg-amber-50',
                                Approved: on ? 'bg-emerald-500 text-white border-emerald-500' : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50',
                                Rejected: on ? 'bg-red-500 text-white border-red-500' : 'border-red-200 text-red-500 hover:bg-red-50',
                              };
                              return (
                                <button
                                  key={s}
                                  onClick={() => { toggle('statuses', s); setCurrentPage(1); }}
                                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${colorMap[s]}`}
                                >
                                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${s === 'Pending' ? 'bg-amber-400' : s === 'Approved' ? 'bg-emerald-400' : 'bg-red-400'
                                    } ${on ? 'opacity-0' : ''}`} />
                                  {s}
                                  {on && <span className="material-symbols-outlined text-[11px]">check</span>}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-slate-100" />

                        {/* Department */}
                        <div className="space-y-2">
                          <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-slate-400">Department</p>
                          <div className="flex flex-col gap-1">
                            {ALL_DEPT_OPTIONS.map((d) => {
                              const on = filters.departments.includes(d);
                              return (
                                <button
                                  key={d}
                                  onClick={() => { toggle('departments', d); setCurrentPage(1); }}
                                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition-all ${on ? 'bg-[#1A2B56] text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/10'
                                    }`}
                                >
                                  {/* Checkbox */}
                                  <span className={`w-4 h-4 rounded-md flex items-center justify-center flex-shrink-0 border-2 transition-all ${on ? 'bg-white/25 border-white/40' : 'border-slate-300 bg-white'
                                    }`}>
                                    {on && <span className="material-symbols-outlined text-[11px]">check</span>}
                                  </span>
                                  <span className="truncate">{d}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-slate-100" />

                        {/* Duration */}
                        <div className="space-y-2">
                          <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-slate-400">Duration</p>
                          <div className="flex flex-wrap gap-2">
                            {ALL_DURATION_OPTIONS.map((dur) => {
                              const on = filters.durations.includes(dur);
                              return (
                                <button
                                  key={dur}
                                  onClick={() => { toggle('durations', dur); setCurrentPage(1); }}
                                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${on
                                      ? 'bg-[#1A2B56] text-white border-[#1A2B56]'
                                      : 'border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                                    }`}
                                >
                                  <span className="material-symbols-outlined text-[12px]">schedule</span>
                                  {dur}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Panel footer */}
                    <div className="px-5 py-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between bg-slate-50/50 dark:bg-white/5 rounded-b-2xl">
                      <span className="text-[11px] text-slate-400 font-medium">
                        {filtered.length} result{filtered.length !== 1 ? 's' : ''} found
                      </span>
                      <button
                        onClick={() => setShowFilter(false)}
                        className="px-4 py-2 bg-[#1A2B56] text-white text-xs font-bold rounded-xl hover:opacity-90 transition-all"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Active filter chips ── */}
          {activeChips.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active:</span>
              {activeChips.map(({ label, onRemove }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#1A2B56]/8 text-[#1A2B56] text-[11px] font-bold rounded-full border border-[#1A2B56]/15"
                >
                  {label}
                  <button onClick={() => { onRemove(); setCurrentPage(1); }} className="hover:opacity-70 transition-opacity ml-0.5">
                    <span className="material-symbols-outlined text-[12px]">close</span>
                  </button>
                </span>
              ))}
              <button
                onClick={() => { setFilters(DEFAULT_FILTERS); setCurrentPage(1); }}
                className="text-[11px] font-bold text-red-500 hover:text-red-600 underline underline-offset-2 transition-colors"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* ── Table ── */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-white/5 border-b border-slate-200/60 dark:border-white/10">
                {[
                  { label: 'Request ID', cls: 'w-36' },
                  { label: 'Borrower', cls: 'w-52' },
                  { label: 'Equipment', cls: 'w-48' },
                  { label: 'Duration', cls: 'w-28' },
                  { label: 'Purpose', cls: '' },
                  { label: 'Actions', cls: 'w-52 text-right' },
                ].map(({ label, cls }) => (
                  <th
                    key={label}
                    className={`px-5 py-4 text-[11px] font-extrabold text-[#1A2B56] dark:text-slate-300 uppercase tracking-[0.12em] ${cls}`}
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.length > 0 ? (
                paged.map((req) => (
                  <RequestRow
                    key={req.id}
                    req={req}
                    onDetails={() => setDetail(toDetailRecord(req))}
                    onApprove={() => setActionModal({ req, action: 'Approve' })}
                    onReject={() => setActionModal({ req, action: 'Reject' })}
                  />
                ))
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

        {/* ── Pagination ── */}
        <HandoverPagination
          currentPage={safePage}
          totalPages={totalPages}
          label={`Showing ${filtered.length === 0 ? 0 : (safePage - 1) * ITEMS_PER_PAGE + 1}–${Math.min(safePage * ITEMS_PER_PAGE, filtered.length)} of ${filtered.length} requests`}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* ── Detail modal ── */}
      {detail && <HandoverDetailModal record={detail} onClose={() => setDetail(null)} />}

      {/* ── Approve / Reject confirm modal ── */}
      {actionModal && (
        <ActionModal
          request={actionModal.req}
          action={actionModal.action}
          onConfirm={handleConfirmAction}
          onClose={() => setActionModal(null)}
        />
      )}
    </>
  );
};

export default RequestsTab;


