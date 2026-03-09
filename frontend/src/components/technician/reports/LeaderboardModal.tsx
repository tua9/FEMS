import React, { useEffect } from 'react';
import { getAllPerformers, type Performer, type DateRangeDays } from '@/data/technician/mockReports';

interface Props {
  dateRangeDays: DateRangeDays;
  onClose: () => void;
}

// Medal colours for top 3
const MEDAL: Record<number, { ring: string; badge: string; icon: string }> = {
  1: { ring: 'ring-2 ring-amber-400',   badge: 'bg-amber-400',   icon: '🥇' },
  2: { ring: 'ring-2 ring-slate-400',   badge: 'bg-slate-400',   icon: '🥈' },
  3: { ring: 'ring-2 ring-amber-600',   badge: 'bg-amber-600',   icon: '🥉' },
};

const rankBg = (rank: number) =>
  rank === 1 ? 'bg-amber-50'
  : rank === 2 ? 'bg-slate-50'
  : rank === 3 ? 'bg-orange-50'
  : 'bg-white';

const LeaderboardRow: React.FC<{ performer: Performer; isLast: boolean }> = ({ performer: p, isLast }) => {
  const medal = MEDAL[p.rank];

  return (
    <tr
      className={`transition-colors hover:bg-blue-50/40 ${!isLast ? 'border-b border-slate-100' : ''} ${rankBg(p.rank)}`}
    >
      {/* Rank */}
      <td className="px-6 py-4 w-12 text-center">
        {medal ? (
          <span className="text-xl leading-none">{medal.icon}</span>
        ) : (
          <span className="text-sm font-extrabold text-slate-400">{p.rank}</span>
        )}
      </td>

      {/* Avatar + Name */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div className={`relative flex-shrink-0 ${medal ? medal.ring + ' rounded-full' : ''}`}>
            {p.avatar ? (
              <img src={p.avatar} alt={p.name} className="w-9 h-9 rounded-full object-cover" />
            ) : (
              <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-xs">
                {p.initials}
              </div>
            )}
            {medal && (
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${medal.badge} border-2 border-white rounded-full flex items-center justify-center`}>
                <span className="text-[8px] text-white font-bold">{p.rank}</span>
              </div>
            )}
          </div>
          <div>
            <p className={`text-sm font-bold ${p.rank <= 3 ? 'text-[#232F58]' : 'text-slate-700'}`}>{p.name}</p>
            <p className="text-[10px] text-slate-400 font-medium">{p.initials}</p>
          </div>
        </div>
      </td>

      {/* Resolve rate */}
      <td className="px-4 py-4">
        <span className="text-xs font-semibold text-slate-600">{p.resolveRate}</span>
      </td>

      {/* Tickets */}
      <td className="px-6 py-4 text-right">
        <span className={`text-sm font-extrabold ${p.rank === 1 ? 'text-amber-500' : p.rank === 2 ? 'text-slate-500' : p.rank === 3 ? 'text-amber-700' : 'text-[#232F58]'}`}>
          {p.tickets}
        </span>
        <p className="text-[9px] text-slate-400 uppercase font-bold">Tickets</p>
      </td>

      {/* Progress bar */}
      <td className="px-6 py-4 w-40 hidden sm:table-cell">
        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              p.rank === 1 ? 'bg-amber-400'
              : p.rank === 2 ? 'bg-slate-400'
              : p.rank === 3 ? 'bg-amber-600'
              : 'bg-blue-400'
            }`}
            style={{ width: `${parseInt(p.resolveRate)}%` }}
          />
        </div>
        <p className="text-[9px] text-slate-400 mt-1 font-medium">{p.resolveRate.split('%')[0]}%</p>
      </td>
    </tr>
  );
};

const LeaderboardModal: React.FC<Props> = ({ dateRangeDays, onClose }) => {
  const performers = getAllPerformers(dateRangeDays);

  const rangeLabel =
    dateRangeDays === 7  ? 'Last 7 Days'
    : dateRangeDays === 30 ? 'Last 30 Days'
    : dateRangeDays === 90 ? 'Last 90 Days'
    : 'All Time';

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Panel */}
      <div
        className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl shadow-2xl overflow-hidden"
        style={{
          background: 'rgba(255,255,255,0.97)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.5)',
        }}
      >
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center">
              <span className="material-symbols-outlined text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>
                emoji_events
              </span>
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-[#232F58]">Full Leaderboard</h2>
              <p className="text-xs text-slate-400 font-medium">{rangeLabel} · {performers.length} technicians ranked</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Legend row */}
        <div className="px-8 py-3 bg-slate-50 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-6 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
            <span className="w-12 text-center">#</span>
            <span className="flex-1">Technician</span>
            <span className="w-32">Resolve Rate</span>
            <span className="w-20 text-right">Tickets</span>
            <span className="w-40 hidden sm:block">Progress</span>
          </div>
        </div>

        {/* Table — scrollable */}
        <div className="overflow-y-auto flex-1">
          <table className="w-full">
            <tbody>
              {performers.map((p, i) => (
                <LeaderboardRow key={p.rank} performer={p} isLast={i === performers.length - 1} />
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-slate-100 flex items-center justify-between flex-shrink-0 bg-slate-50/80">
          <p className="text-xs text-slate-400 font-medium">
            Rankings based on tickets resolved · {rangeLabel}
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#232F58] text-white text-xs font-bold rounded-xl hover:opacity-90 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardModal;


