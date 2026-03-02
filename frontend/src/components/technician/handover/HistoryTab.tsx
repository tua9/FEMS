import React, { useState } from 'react';
import {
  MOCK_HISTORY,
  HistoryRecord,
  getEventStyle,
} from '@/data/technician/mockHandover';
import HandoverPagination from './HandoverPagination';
import HandoverDetailModal, { HandoverDetailRecord } from './HandoverDetailModal';

// ── Convert HistoryRecord → HandoverDetailRecord ──────────────────────────────
function toDetailRecord(rec: HistoryRecord): HandoverDetailRecord {
  const ev = getEventStyle(rec.eventType);
  return {
    id: rec.logId,
    title: rec.logId,
    badge: { label: rec.eventType, className: ev.pill },
    person: {
      name:        rec.recipient.name,
      sub:         rec.recipient.role,
      initials:    rec.recipient.initials,
      avatarBg:    rec.recipient.avatarBg,
      avatarColor: rec.recipient.avatarColor,
      email:       rec.recipient.email,
    },
    meta: [
      { label: 'Equipment',  value: rec.equipment.name,   icon: rec.equipment.icon },
      { label: 'Date',       value: rec.date,             icon: 'calendar_today'   },
      { label: 'Time',       value: rec.time,             icon: 'schedule'         },
      { label: 'Condition',  value: rec.condition,        icon: 'health_and_safety' },
    ],
    items:    rec.items,
    timeline: rec.timeline,
    notes:    rec.notes,
  };
}

const ITEMS_PER_PAGE = 4;

// ── Single row ────────────────────────────────────────────────────────────────
const HistoryRow: React.FC<{ record: HistoryRecord; onDetails: () => void }> = ({ record, onDetails }) => {
  const ev = getEventStyle(record.eventType);

  return (
    <tr className="hover:bg-slate-50/30 transition-colors">
      {/* Event type */}
      <td className="px-6 py-5">
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${ev.pill}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${ev.dot}`} />
          {ev.text}
        </span>
      </td>
      {/* Log ID */}
      <td className="px-6 py-5 font-mono text-xs font-bold text-slate-500">{record.logId}</td>
      {/* Recipient */}
      <td className="px-6 py-5">
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-full ${record.recipient.avatarBg} flex items-center justify-center ${record.recipient.avatarColor} font-bold text-[10px]`}
          >
            {record.recipient.initials}
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900">{record.recipient.name}</p>
            <p className="text-[9px] text-slate-500 uppercase">{record.recipient.role}</p>
          </div>
        </div>
      </td>
      {/* Equipment */}
      <td className="px-6 py-5">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-slate-400 text-lg">{record.equipment.icon}</span>
          <span className="text-xs font-semibold text-slate-700">{record.equipment.name}</span>
        </div>
      </td>
      {/* Date & Time */}
      <td className="px-6 py-5">
        <p className="text-xs font-semibold text-slate-900">{record.date}</p>
        <p className="text-[9px] text-slate-500 uppercase">{record.time}</p>
      </td>
      {/* Condition */}
      <td className="px-6 py-5">
        <span className={`text-xs font-bold uppercase ${record.conditionColor}`}>
          {record.condition}
        </span>
      </td>
      {/* Action */}
      <td className="px-6 py-5">
        <button
          onClick={onDetails}
          className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
          title="View Details"
        >
          <span className="material-symbols-outlined text-slate-400">visibility</span>
        </button>
      </td>
    </tr>
  );
};

// ── Tab component ─────────────────────────────────────────────────────────────
const HistoryTab: React.FC = () => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [currentPage, setCurrentPage] = useState(1);
  const [modalRecord, setModalRecord] = useState<HandoverDetailRecord | null>(null);

  const filtered = MOCK_HISTORY.filter((r) => {
    const matchSearch =
      r.logId.toLowerCase().includes(search.toLowerCase()) ||
      r.recipient.name.toLowerCase().includes(search.toLowerCase()) ||
      r.equipment.name.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'All Types' || r.eventType === typeFilter;
    return matchSearch && matchType;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paged = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

  const handleSearch = (v: string) => { setSearch(v); setCurrentPage(1); };
  const handleType = (v: string) => { setTypeFilter(v); setCurrentPage(1); };

  return (
    <div>
      {/* Filter bar */}
      <div
        className="mb-6 border border-white/50 rounded-3xl p-6 shadow-xl"
        style={{ background: 'rgba(255,255,255,0.4)', backdropFilter: 'blur(24px)' }}
      >
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="flex-1 min-w-[240px] relative">
            <input
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search by ID, Recipient or Item..."
              className="w-full pl-12 pr-4 py-3 bg-white/60 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1A2B56]/30 placeholder-slate-400"
            />
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              search
            </span>
          </div>

          {/* Type select */}
          <div className="relative min-w-[140px]">
            <select
              value={typeFilter}
              onChange={(e) => handleType(e.target.value)}
              className="w-full appearance-none pl-4 pr-10 py-3 bg-white/60 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-600 focus:ring-2 focus:ring-[#1A2B56]/30 outline-none"
            >
              <option>All Types</option>
              <option>Handover</option>
              <option>Return</option>
              <option>Reject</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              expand_more
            </span>
          </div>

          {/* Date range */}
          <div className="flex items-center bg-white/60 border border-slate-200 rounded-2xl overflow-hidden">
            <input type="date" className="bg-transparent border-none text-xs font-semibold px-4 py-3 focus:ring-0 focus:outline-none" />
            <span className="text-slate-400 font-bold px-1">to</span>
            <input type="date" className="bg-transparent border-none text-xs font-semibold px-4 py-3 focus:ring-0 focus:outline-none" />
          </div>

          {/* Filter button */}
          <button className="bg-[#1A2B56] text-white p-3 rounded-2xl shadow-lg hover:bg-slate-900 transition-all active:scale-95">
            <span className="material-symbols-outlined">filter_list</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div
        className="rounded-3xl border border-white/50 shadow-2xl overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(24px)' }}
      >
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                {['Event Type', 'Log ID', 'Recipient', 'Equipment', 'Date & Time', 'Final Condition', 'Action'].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paged.length > 0 ? (
                paged.map((r) => (
                  <HistoryRow
                    key={r.id}
                    record={r}
                    onDetails={() => setModalRecord(toDetailRecord(r))}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-slate-400 text-sm font-semibold">
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <HandoverPagination
          currentPage={safePage}
          totalPages={totalPages}
          label={`Showing ${paged.length} of ${filtered.length} records`}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Detail modal */}
      {modalRecord && (
        <HandoverDetailModal
          record={modalRecord}
          onClose={() => setModalRecord(null)}
        />
      )}
    </div>
  );
};

export default HistoryTab;
