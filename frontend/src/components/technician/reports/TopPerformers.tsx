import React, { useMemo, useState } from 'react';
import type { Performer, DateRangeDays } from '@/data/technician/mockReports';
import LeaderboardModal from './LeaderboardModal';
import { useReports } from '@/hooks/technician/useReports';

interface Props { dateRangeDays: DateRangeDays }

const PerformerRow: React.FC<{ performer: Performer }> = ({ performer: p }) => (
  <div className="flex items-center justify-between">
    {/* Left: avatar + name */}
    <div className="flex items-center gap-3">
      <div className="relative shrink-0">
        {p.avatar ? (
          <img
            src={p.avatar}
            alt={p.name}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-xs">
            {p.initials}
          </div>
        )}
        {/* Rank badge */}
        <div
          className={`absolute -bottom-1 -right-1 w-4 h-4 ${p.rankBg} border-2 border-white rounded-full flex items-center justify-center`}
        >
          <span className="text-[8px] text-white font-bold">{p.rank}</span>
        </div>
      </div>

      <div>
        <p className="text-sm font-bold text-slate-900 dark:text-white">{p.name}</p>
        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{p.resolveRate}</p>
      </div>
    </div>

    {/* Right: ticket count */}
    <div className="text-right">
      <p className="text-xs font-bold text-[#232F58]">{p.tickets}</p>
      <p className="text-[8px] text-slate-400 uppercase font-bold">Tickets</p>
    </div>
  </div>
);

const TopPerformers: React.FC<Props> = ({ dateRangeDays }) => {
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

    // Ensure at least 3 rows for UI
    while (all.length < 3) {
      all.push({
        rank: 0,
        rankBg: 'bg-slate-300',
        name: '—',
        resolveRate: '0% Resolve Rate',
        tickets: 0,
        initials: '—',
      });
    }

    // Assign ranks + medal-ish colors to top 3
    return all.slice(0, 3).map((p, i) => ({
      ...p,
      rank: i + 1,
      rankBg: i === 0 ? 'bg-emerald-500' : i === 1 ? 'bg-slate-400' : 'bg-amber-600',
    }));
  }, [reports, dateRangeDays]);

  const [showLeaderboard, setShowLeaderboard] = useState(false);

  return (
    <>
      <div className="dashboard-card p-8 rounded-3xl">
        <h3 className="text-lg font-bold text-[#232F58] dark:text-white mb-6">Top Performers</h3>

        <div className="space-y-6">
          {performers.map((p) => (
            <PerformerRow key={`${p.rank}-${p.name}`} performer={p} />
          ))}

          <button
            onClick={() => setShowLeaderboard(true)}
            className="w-full py-3 mt-4 rounded-2xl bg-slate-50 dark:bg-white/5 text-[10px] font-extrabold text-slate-500 dark:text-slate-300 uppercase tracking-widest hover:bg-slate-100 dark:hover:bg-white/10 hover:text-[#232F58] dark:hover:text-white transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
              emoji_events
            </span>
            View Full Leaderboard
          </button>
        </div>
      </div>

      {showLeaderboard && (
        <LeaderboardModal
          dateRangeDays={dateRangeDays}
          onClose={() => setShowLeaderboard(false)}
        />
      )}
    </>
  );
};

export default TopPerformers;


