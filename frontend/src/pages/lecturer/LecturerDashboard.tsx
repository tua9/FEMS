import React from "react";
import { useNavigate } from "react-router-dom";
import { ACTIVITIES, UPCOMING_CLASSES } from "./constants";

// ── Stat card config – each card routes to the most relevant page ──────────
const STAT_CARDS = [
  {
    label: "Equipment Borrowed",
    value: "24",
    icon: "laptop_mac",
    route: "/lecturer/equipment",
    hint: "View Equipment",
    dot: "bg-blue-400",
    glow: "glow-blue",
  },
  {
    label: "Pending Requests",
    value: "08",
    icon: "pending_actions",
    route: "/lecturer/approval",
    hint: "Review Requests",
    dot: "bg-amber-400",
    glow: "glow-amber",
  },
  {
    label: "Reports Sent",
    value: "15",
    icon: "assignment_turned_in",
    route: "/lecturer/history",
    hint: "View History",
    dot: "bg-emerald-400",
    glow: "glow-emerald",
  },
  {
    label: "Assigned Rooms",
    value: "04",
    icon: "meeting_room",
    route: "/lecturer/room-status",
    hint: "View Rooms",
    dot: "bg-violet-400",
    glow: "glow-violet",
  },
];

// ── Map activity type to destination route ─────────────────────────────────
const ACTIVITY_ROUTE: Record<string, string> = {
  access: "/lecturer/approval",
  return: "/lecturer/history",
  report: "/lecturer/history",
};

// ── Map activity type to badge label ──────────────────────────────────────
const ACTIVITY_BADGE: Record<string, { label: string; color: string }> = {
  access: {
    label: "Approval",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  },
  return: {
    label: "Equipment",
    color:
      "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  },
  report: {
    label: "Report",
    color:
      "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  },
};

// ─────────────────────────────────────────────────────────────────────────────

const LecturerDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full">
      <main className="mx-auto w-full max-w-[1400px] px-6 pt-36 pb-20">
        {/* ── Header ── */}
        <header className="mb-12">
          <div className="flex flex-col gap-2">
            <h2 className="text-5xl font-extrabold tracking-tight text-[#1E2B58] md:text-6xl dark:text-white">
              Welcome, Dr. Alex Rivers
            </h2>
            <p className="text-lg font-medium text-slate-500 dark:text-slate-400">
              Here's your academic facility overview for today.
            </p>
          </div>
        </header>

        {/* ── Stat Cards ── */}
        <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {STAT_CARDS.map((stat) => (
            <button
              key={stat.label}
              onClick={() => navigate(stat.route)}
              className="glass-card group relative flex w-full cursor-pointer items-center gap-5 rounded-[32px] p-6 text-left transition-all duration-200 hover:scale-[1.02] hover:shadow-xl"
              title={stat.hint}
            >
              {/* Glow status dot */}
              <div className={`absolute top-5 right-5 h-2 w-2 rounded-full ${stat.dot} ${stat.glow}`} />

              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-[#1E2B58]/[0.08] text-[#1E2B58] transition-colors group-hover:bg-[#1E2B58]/[0.14] dark:bg-[#4f75ff]/[0.15] dark:text-[#4f75ff] dark:group-hover:bg-[#4f75ff]/[0.25]">
                <span className="material-symbols-rounded text-3xl">
                  {stat.icon}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase dark:text-slate-500">
                  {stat.label}
                </p>
                <p className="mt-1 text-3xl font-black text-[#1E2B58] dark:text-white">
                  {stat.value}
                </p>
              </div>
              {/* Arrow hint on hover */}
              <span className="material-symbols-rounded text-base text-[#1E2B58]/30 opacity-0 transition-opacity group-hover:opacity-100 dark:text-white/20">
                arrow_forward
              </span>
            </button>
          ))}
        </div>

        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* ── Recent Activities ── */}
          <div className="lg:col-span-2">
            <div className="glass-card h-full rounded-[32px] p-8">
              <div className="mb-8 flex items-center justify-between">
                <h3 className="text-xl font-extrabold text-[#1E2B58] dark:text-white">
                  Recent Activities
                </h3>
                {/* View All → My History */}
                <button
                  onClick={() => navigate("/lecturer/history")}
                  className="flex items-center gap-1 text-xs font-bold tracking-widest text-[#4f75ff] uppercase hover:underline"
                >
                  View All
                  <span className="material-symbols-rounded text-sm">
                    arrow_forward
                  </span>
                </button>
              </div>

              <div className="relative space-y-6 before:absolute before:top-2 before:bottom-2 before:left-[11px] before:w-[2px] before:bg-[#1E2B58]/5 dark:before:bg-white/5">
                {ACTIVITIES.map((activity) => {
                  const badge = ACTIVITY_BADGE[activity.type];
                  const dest =
                    ACTIVITY_ROUTE[activity.type] ?? "/lecturer/history";

                  return (
                    <div
                      key={activity.id}
                      onClick={() => navigate(dest)}
                      className="group relative cursor-pointer pl-10"
                    >
                      {/* Timeline dot */}
                      <div
                        className={`absolute top-1.5 left-0 z-10 h-[22px] w-[22px] rounded-full border-4 bg-white shadow-sm transition-colors dark:bg-slate-800 ${
                          activity.type === "access"
                            ? "border-[#1E2B58] dark:border-white"
                            : "border-slate-300 dark:border-slate-600"
                        }`}
                      />

                      {/* Content */}
                      <div className="-m-3 flex flex-col gap-1 rounded-2xl p-3 transition-colors group-hover:bg-[#1E2B58]/[0.04] dark:group-hover:bg-white/[0.04]">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-bold text-[#1E2B58] transition-colors group-hover:text-[#4f75ff] dark:text-white dark:group-hover:text-[#4f75ff]">
                            {activity.title}
                          </p>
                          {badge && (
                            <span
                              className={`rounded-full px-2 py-0.5 text-[9px] font-black tracking-wider uppercase ${badge.color}`}
                            >
                              {badge.label}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500">
                          {activity.subject} • {activity.time}
                        </p>

                        {/* access → boxed description */}
                        {activity.type === "access" && activity.description && (
                          <div className="mt-2 rounded-xl border border-[#1E2B58]/10 bg-[#1E2B58]/5 p-3 text-xs dark:border-white/10 dark:bg-white/5">
                            {activity.description}
                          </div>
                        )}
                        {/* return → italic */}
                        {activity.type === "return" && activity.description && (
                          <p className="mt-1 text-xs text-slate-400 italic">
                            {activity.description}
                          </p>
                        )}
                        {/* report → plain */}
                        {activity.type === "report" && activity.description && (
                          <p className="mt-1 text-xs text-slate-500">
                            {activity.description}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer link */}
              <div className="mt-8 flex items-center justify-center border-t border-[#1E2B58]/5 pt-6 dark:border-white/5">
                <button
                  onClick={() => navigate("/lecturer/history")}
                  className="flex items-center gap-1.5 text-xs font-bold tracking-widest text-slate-400 uppercase transition-colors hover:text-[#4f75ff] dark:text-slate-500 dark:hover:text-[#4f75ff]"
                >
                  <span className="material-symbols-rounded text-sm">
                    history
                  </span>
                  See full activity log
                </button>
              </div>
            </div>
          </div>

          {/* ── Upcoming Classes ── */}
          <div>
            <div className="glass-card flex h-full flex-col rounded-[32px] p-8">
              <div className="mb-8 flex items-center justify-between">
                <h3 className="text-xl font-extrabold text-[#1E2B58] dark:text-white">
                  Upcoming Classes
                </h3>
                <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
              </div>

              <div className="flex-1 space-y-3">
                {UPCOMING_CLASSES.map((session, index) => {
                  const isLast = index === UPCOMING_CLASSES.length - 1;
                  return (
                    <button
                      key={session.id}
                      onClick={() => navigate("/lecturer/calendar")}
                      className={`glass-btn group w-full rounded-2xl p-4 text-left transition-all hover:shadow-md ${
                        isLast ? "opacity-60" : ""
                      }`}
                    >
                      <p className="mb-1.5 text-[10px] font-black tracking-widest text-[#1E2B58]/40 uppercase dark:text-white/40">
                        {session.timeRange}
                      </p>
                      <h4 className="font-bold text-[#1E2B58] transition-colors group-hover:text-[#4f75ff] dark:text-white">
                        {session.title}
                      </h4>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-rounded text-sm opacity-60">
                            location_on
                          </span>
                          <span className="text-[11px] font-bold text-slate-500">
                            {session.location}
                          </span>
                        </div>
                        <span className="material-symbols-rounded text-sm text-[#1E2B58]/20 opacity-0 transition-all group-hover:text-[#4f75ff] group-hover:opacity-100 dark:text-white/20">
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
                  onClick={() => navigate("/lecturer/report-issue")}
                  className="glass-btn flex items-center justify-center gap-1.5 rounded-2xl py-3 text-[10px] font-black tracking-wider text-[#1E2B58] uppercase dark:text-white"
                >
                  <span className="material-symbols-rounded text-sm">
                    report
                  </span>
                  Report Issue
                </button>
                <button
                  onClick={() => navigate("/lecturer/equipment")}
                  className="glass-btn flex items-center justify-center gap-1.5 rounded-2xl py-3 text-[10px] font-black tracking-wider text-[#1E2B58] uppercase dark:text-white"
                >
                  <span className="material-symbols-rounded text-sm">
                    laptop_mac
                  </span>
                  Equipment
                </button>
              </div>

              <button
                onClick={() => navigate("/lecturer/calendar")}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#1E2B58] py-4 text-xs font-bold tracking-widest text-white uppercase shadow-lg shadow-[#1E2B58]/20 transition-all hover:bg-[#1E2B58]/90 active:scale-[0.98]"
              >
                <span className="material-symbols-rounded text-base">
                  calendar_month
                </span>
                Open Full Calendar
              </button>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
};

export default LecturerDashboard;
