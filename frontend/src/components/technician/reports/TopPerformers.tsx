import React, { useState } from 'react';
import { getTopPerformers, type Performer, type DateRangeDays } from '@/data/technician/mockReports';
import LeaderboardModal from './LeaderboardModal';

interface Props { dateRangeDays: DateRangeDays }

const PerformerRow: React.FC<{ performer: Performer }> = ({ performer: p }) => (
  <div className="flex items-center justify-between">
    {/* Left: avatar + name */}
    <div className="flex items-center gap-3">
      <div className="relative flex-shrink-0">
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
  const performers = getTopPerformers(dateRangeDays);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  return (
    <>
      <div className="tech-card p-8 rounded-3xl border border-white/20 dark:border-white/6 shadow-sm">
        <h3 className="text-lg font-bold text-[#232F58] dark:text-white mb-6">Top Performers</h3>

        <div className="space-y-6">
          {performers.map((p) => (
            <PerformerRow key={p.rank} performer={p} />
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


