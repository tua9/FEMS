import React, { useEffect, useMemo } from 'react';
import type { Performer, DateRangeDays } from '@/data/technician/mockReports';
import { useReports } from '@/hooks/technician/useReports';

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
          <div className={`relative shrink-0 ${medal ? medal.ring + ' rounded-full' : ''}`}>
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
  const { reports } = useReports();

  const performers = useMemo<Performer[]>(() => {
    const now = new Date();
    const from = dateRangeDays === 0
      ? null
      : new Date(now.getTime() - dateRangeDays * 24 * 60 * 60 * 1000);

    const inRange = (r: any) => {
      if (!from) return true;
      const created = new Date(r?.createdAt || r?.created_at || 0);
      return created >= from && created <= now;
    };

    const list = (reports || []).filter(inRange);

    // Group by assigned technician
    const map = new Map<string, { name: string; tickets: number; resolved: number }>();

    for (const r of list) {
      const assignee = r?.assigned_to;
      const name = assignee?.displayName || assignee?.username || 'Unassigned';
      const key = String(assignee?._id || 'unassigned');

      const entry = map.get(key) || { name, tickets: 0, resolved: 0 };
      entry.tickets += 1;
      if (String(r?.status).toLowerCase() === 'fixed') entry.resolved += 1;
      map.set(key, entry);
    }

    const all = Array.from(map.values())
      .map((v) => {
        const rate = v.tickets > 0 ? Math.round((v.resolved / v.tickets) * 100) : 0;
        const initials = v.name
          .split(' ')
          .slice(0, 2)
          .map((w) => w[0])
          .join('')
          .toUpperCase();

        return {
          rank: 0,
          rankBg: 'bg-slate-300',
          name: v.name,
          resolveRate: `${rate}% Resolve Rate`,
          tickets: v.tickets,
          initials,
        } as Performer;
      })
      .sort((a, b) => b.tickets - a.tickets);

    // If there are no rows (e.g., empty DB), keep the table non-empty for the existing UI.
    if (all.length === 0) {
      return Array.from({ length: 5 }).map((_, i) => ({
        rank: i + 1,
        rankBg: 'bg-slate-300',
        name: '—',
        resolveRate: '0% Resolve Rate',
        tickets: 0,
        initials: '—',
      })) as Performer[];
    }

    // Assign ranks and keep top N (UI scrolls, so allow more than 3)
    return all.map((p, i) => ({
      ...p,
      rank: i + 1,
      rankBg: i === 0 ? 'bg-emerald-500' : i === 1 ? 'bg-slate-400' : i === 2 ? 'bg-amber-600' : 'bg-slate-300',
    }));
  }, [reports, dateRangeDays]);

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
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 bg-black/0 backdrop-blur-0 hover:bg-black/30 hover:backdrop-blur-sm transition-all duration-300"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        animation: 'fadeIn 0.3s ease-out forwards',
      }}
    >
      {/* Panel */}
      <div 
        className="glass-card w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden"
        style={{
          animation: 'slideUp 0.3s ease-out forwards',
        }}
      >
        {/* Header */}
        <div className="px-8 py-6 border-b border-black/8 dark:border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>
                emoji_events
              </span>
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-[#1E2B58] dark:text-white">Full Leaderboard</h2>
              <p className="text-xs text-slate-400 font-medium">{rangeLabel} · {performers.length} technicians ranked</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#1E2B58]/50 hover:text-[#1E2B58] hover:bg-[#1E2B58]/10 dark:text-white/50 dark:hover:text-white dark:hover:bg-white/10 transition-all duration-200"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Legend row */}
        <div className="px-8 py-3 bg-black/3 dark:bg-white/3 border-b border-black/8 dark:border-white/10 shrink-0">
          <div className="flex items-center gap-6 text-[10px] font-extrabold uppercase tracking-widest text-[#1E2B58]/40 dark:text-white/40">
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
                <LeaderboardRow key={`${p.rank}-${p.name}`} performer={p} isLast={i === performers.length - 1} />
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-black/8 dark:border-white/10 flex items-center justify-between shrink-0 bg-black/3 dark:bg-white/3">
          <p className="text-xs text-slate-400 font-medium">
            Rankings based on tickets resolved · {rangeLabel}
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-[1.25rem] border border-[#1E2B58]/15 dark:border-white/15 text-[#1E2B58]/70 dark:text-white/70 text-xs font-bold hover:bg-[#1E2B58]/5 dark:hover:bg-white/5 transition-all duration-200"
          >
            Close
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            background-color: rgba(0, 0, 0, 0);
            backdrop-filter: blur(0px);
          }
          to {
            background-color: rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(4px);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default LeaderboardModal;


