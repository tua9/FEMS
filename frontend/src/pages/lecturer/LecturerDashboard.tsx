import React from 'react';
import { useNavigate } from 'react-router-dom';
import LecturerNavbar from '../../components/lecturer/navbar/LecturerNavbar';
import { ACTIVITIES, UPCOMING_CLASSES } from './constants';

// ── Stat card config – each card routes to the most relevant page ──────────
const STAT_CARDS = [
  {
    label: 'Equipment Borrowed',
    value: '24',
    icon: 'laptop_mac',
    route: '/lecturer/equipment',
    hint: 'View Equipment',
  },
  {
    label: 'Pending Requests',
    value: '08',
    icon: 'pending_actions',
    route: '/lecturer/approval',
    hint: 'Review Requests',
  },
  {
    label: 'Reports Sent',
    value: '15',
    icon: 'assignment_turned_in',
    route: '/lecturer/history',
    hint: 'View History',
  },
  {
    label: 'Assigned Rooms',
    value: '04',
    icon: 'meeting_room',
    route: '/lecturer/room-status',
    hint: 'View Rooms',
  },
];

// ── Map activity type to destination route ─────────────────────────────────
const ACTIVITY_ROUTE: Record<string, string> = {
  access: '/lecturer/approval',
  return: '/lecturer/history',
  report: '/lecturer/history',
};

// ── Map activity type to badge label ──────────────────────────────────────
const ACTIVITY_BADGE: Record<string, { label: string; color: string }> = {
  access: { label: 'Approval',  color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' },
  return: { label: 'Equipment', color: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' },
  report: { label: 'Report',    color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300' },
};

// ─────────────────────────────────────────────────────────────────────────────

const LecturerDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#e0eafc] dark:bg-[#0f172a] text-slate-800 dark:text-slate-200 transition-colors duration-300">
      <LecturerNavbar />

      <main className="pt-36 pb-20 px-6 w-full max-w-[1400px] mx-auto">

        {/* ── Header ── */}
        <header className="mb-12">
          <div className="flex flex-col gap-2">
            <h2 className="text-5xl md:text-6xl font-extrabold text-[#1E2B58] dark:text-white tracking-tight">
              Welcome, Dr. Alex Rivers
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">
              Here's your academic facility overview for today.
            </p>
          </div>
        </header>

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {STAT_CARDS.map((stat) => (
            <button
              key={stat.label}
              onClick={() => navigate(stat.route)}
              className="glass-card p-6 rounded-[32px] flex items-center gap-5 text-left group hover:scale-[1.02] hover:shadow-xl transition-all duration-200 cursor-pointer w-full"
              title={stat.hint}
            >
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-[#1E2B58]/[0.08] dark:bg-[#4f75ff]/[0.15] text-[#1E2B58] dark:text-[#4f75ff] flex-shrink-0 group-hover:bg-[#1E2B58]/[0.14] dark:group-hover:bg-[#4f75ff]/[0.25] transition-colors">
                <span className="material-symbols-rounded text-3xl">{stat.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                  {stat.label}
                </p>
                <p className="text-3xl font-black text-[#1E2B58] dark:text-white mt-1">
                  {stat.value}
                </p>
              </div>
              {/* Arrow hint on hover */}
              <span className="material-symbols-rounded text-base text-[#1E2B58]/30 dark:text-white/20 opacity-0 group-hover:opacity-100 transition-opacity">
                arrow_forward
              </span>
            </button>
          ))}
        </div>

        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Recent Activities ── */}
          <div className="lg:col-span-2">
            <div className="glass-card rounded-[32px] p-8 h-full">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-extrabold text-[#1E2B58] dark:text-white">
                  Recent Activities
                </h3>
                {/* View All → My History */}
                <button
                  onClick={() => navigate('/lecturer/history')}
                  className="text-xs font-bold text-[#4f75ff] uppercase tracking-widest hover:underline flex items-center gap-1"
                >
                  View All
                  <span className="material-symbols-rounded text-sm">arrow_forward</span>
                </button>
              </div>

              <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-[#1E2B58]/5 dark:before:bg-white/5">
                {ACTIVITIES.map((activity) => {
                  const badge = ACTIVITY_BADGE[activity.type];
                  const dest  = ACTIVITY_ROUTE[activity.type] ?? '/lecturer/history';

                  return (
                    <div
                      key={activity.id}
                      onClick={() => navigate(dest)}
                      className="relative pl-10 group cursor-pointer"
                    >
                      {/* Timeline dot */}
                      <div
                        className={`absolute left-0 top-1.5 w-[22px] h-[22px] bg-white dark:bg-slate-800 rounded-full border-4 shadow-sm z-10 transition-colors ${
                          activity.type === 'access'
                            ? 'border-[#1E2B58] dark:border-white'
                            : 'border-slate-300 dark:border-slate-600'
                        }`}
                      />

                      {/* Content */}
                      <div className="flex flex-col gap-1 p-3 -m-3 rounded-2xl group-hover:bg-[#1E2B58]/[0.04] dark:group-hover:bg-white/[0.04] transition-colors">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-bold text-[#1E2B58] dark:text-white group-hover:text-[#4f75ff] dark:group-hover:text-[#4f75ff] transition-colors">
                            {activity.title}
                          </p>
                          {badge && (
                            <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${badge.color}`}>
                              {badge.label}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500">
                          {activity.subject} • {activity.time}
                        </p>

                        {/* access → boxed description */}
                        {activity.type === 'access' && activity.description && (
                          <div className="mt-2 text-xs bg-[#1E2B58]/5 dark:bg-white/5 p-3 rounded-xl border border-[#1E2B58]/10 dark:border-white/10">
                            {activity.description}
                          </div>
                        )}
                        {/* return → italic */}
                        {activity.type === 'return' && activity.description && (
                          <p className="text-xs italic text-slate-400 mt-1">{activity.description}</p>
                        )}
                        {/* report → plain */}
                        {activity.type === 'report' && activity.description && (
                          <p className="text-xs text-slate-500 mt-1">{activity.description}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer link */}
              <div className="mt-8 pt-6 border-t border-[#1E2B58]/5 dark:border-white/5 flex items-center justify-center">
                <button
                  onClick={() => navigate('/lecturer/history')}
                  className="text-xs font-bold text-slate-400 dark:text-slate-500 hover:text-[#4f75ff] dark:hover:text-[#4f75ff] uppercase tracking-widest transition-colors flex items-center gap-1.5"
                >
                  <span className="material-symbols-rounded text-sm">history</span>
                  See full activity log
                </button>
              </div>
            </div>
          </div>

          {/* ── Upcoming Classes ── */}
          <div>
            <div className="glass-card rounded-[32px] p-8 h-full flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-extrabold text-[#1E2B58] dark:text-white">
                  Upcoming Classes
                </h3>
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              </div>

              <div className="space-y-3 flex-1">
                {UPCOMING_CLASSES.map((session, index) => {
                  const isLast = index === UPCOMING_CLASSES.length - 1;
                  return (
                    <button
                      key={session.id}
                      onClick={() => navigate('/lecturer/calendar')}
                      className={`w-full text-left p-4 rounded-2xl bg-white/40 dark:bg-white/5 border border-white/60 dark:border-white/10 hover:border-[#1E2B58]/30 hover:bg-white/60 dark:hover:bg-white/10 hover:shadow-md transition-all group ${
                        isLast ? 'opacity-60' : ''
                      }`}
                    >
                      <p className="text-[10px] font-black text-[#1E2B58]/40 dark:text-white/40 uppercase tracking-widest mb-1.5">
                        {session.timeRange}
                      </p>
                      <h4 className="font-bold text-[#1E2B58] dark:text-white group-hover:text-[#4f75ff] transition-colors">
                        {session.title}
                      </h4>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-rounded text-sm opacity-60">location_on</span>
                          <span className="text-[11px] font-bold text-slate-500">{session.location}</span>
                        </div>
                        <span className="material-symbols-rounded text-sm text-[#1E2B58]/20 dark:text-white/20 group-hover:text-[#4f75ff] group-hover:opacity-100 opacity-0 transition-all">
                          chevron_right
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Quick-action row */}
              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  onClick={() => navigate('/lecturer/report-issue')}
                  className="py-3 rounded-2xl border border-[#1E2B58]/15 dark:border-white/10 text-[10px] font-black uppercase tracking-wider text-[#1E2B58] dark:text-white hover:bg-[#1E2B58]/5 dark:hover:bg-white/5 transition-all flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-rounded text-sm">report</span>
                  Report Issue
                </button>
                <button
                  onClick={() => navigate('/lecturer/equipment')}
                  className="py-3 rounded-2xl border border-[#1E2B58]/15 dark:border-white/10 text-[10px] font-black uppercase tracking-wider text-[#1E2B58] dark:text-white hover:bg-[#1E2B58]/5 dark:hover:bg-white/5 transition-all flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-rounded text-sm">laptop_mac</span>
                  Equipment
                </button>
              </div>

              <button
                onClick={() => navigate('/lecturer/calendar')}
                className="w-full mt-3 py-4 rounded-2xl bg-[#1E2B58] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#1E2B58]/90 active:scale-[0.98] transition-all shadow-lg shadow-[#1E2B58]/20 flex items-center justify-center gap-2"
              >
                <span className="material-symbols-rounded text-base">calendar_month</span>
                Open Full Calendar
              </button>
            </div>
          </div>

        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="mt-auto py-16 flex flex-col items-center justify-center gap-6 opacity-40">
        <div className="flex items-center gap-10">
          <span className="material-symbols-rounded text-2xl">school</span>
          <span className="material-symbols-rounded text-2xl">security</span>
          <span className="material-symbols-rounded text-2xl">construction</span>
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#1E2B58] dark:text-white text-center">
          Facility &amp; Equipment Management System — F-EMS 2024
        </p>
      </footer>
    </div>
  );
};

export default LecturerDashboard;
