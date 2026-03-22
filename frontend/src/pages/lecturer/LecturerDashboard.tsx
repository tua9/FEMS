import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { PageShell, AnimatedList, AnimatedListItem, AnimatedSection } from "@/components/motion";
import { useDashboardStore } from "@/stores/useDashboardStore";
import { useScheduleStore } from "@/stores/useScheduleStore";
import { RecentActivityList } from "@/components/shared/dashboard/RecentActivityList";

// ─────────────────────────────────────────────────────────────────────────────

const LecturerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { stats, activities, fetchStats, fetchActivities } = useDashboardStore();
  const { schedules, fetchSchedules } = useScheduleStore();

  useEffect(() => {
    fetchStats();
    fetchActivities();
    fetchSchedules(); // Fetch all for now, or could pass today's date
  }, [fetchStats, fetchActivities, fetchSchedules]);

  // Map backend stats to the UI structure expected by STAT_CARDS
  const displayStats = useMemo(() => {
    if (!stats) return [];
    return [
      {
        label: 'Equipment Borrowed',
        value: String(stats.equipmentBorrowed),
        icon: 'laptop_mac',
        route: '/lecturer/equipment',
        hint: 'View Equipment',
        dot: 'bg-blue-400',
        glow: 'glow-blue',
      },
      {
        label: 'Pending Requests',
        value: String(stats.pendingRequests).padStart(2, '0'),
        icon: 'pending_actions',
        route: '/lecturer/approval',
        hint: 'Review Requests',
        dot: 'bg-amber-400',
        glow: 'glow-amber',
      },
      {
        label: 'Reports Sent',
        value: String(stats.reportsSent),
        icon: 'assignment_turned_in',
        route: '/lecturer/history',
        hint: 'View History',
        dot: 'bg-emerald-400',
        glow: 'glow-emerald',
      },
      {
        label: 'Assigned Rooms',
        value: String(stats.assignedRooms).padStart(2, '0'),
        icon: 'meeting_room',
        route: '/lecturer/room-status',
        hint: 'View Rooms',
        dot: 'bg-violet-400',
        glow: 'glow-violet',
      },
    ];
  }, [stats]);

  // Map backend classes to UI
  const upcomingClasses = useMemo(() => {
    return schedules.slice(0, 3).map(s => ({
      id: s._id,
      timeRange: `${s.startTime} - ${s.endTime}`,
      title: s.title,
      location: s.location,
      status: s.status
    }));
  }, [schedules]);

  const finalStats = displayStats.length > 0 ? displayStats : [];

  return (
    <PageShell
      title="Welcome, Dr. Alex Rivers"
      subtitle="Here's your academic facility overview for today."
      topPadding="pt-6"
      className="pb-20 px-6"
      contentClassName="max-w-350 mx-auto w-full"
    >
      {/* ── Stat Cards ── */}
      <AnimatedList className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {finalStats.map((stat) => (
          <AnimatedListItem key={stat.label}>
            <button
              onClick={() => navigate(stat.route)}
              className="dashboard-card group relative flex w-full cursor-pointer items-center gap-5 rounded-4xl p-6 text-left transition-all duration-200 hover:scale-[1.02] hover:shadow-xl"
              title={stat.hint}
            >
              <div className={`absolute top-5 right-5 h-2 w-2 rounded-full ${stat.dot} ${stat.glow}`} />
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#1E2B58]/8 text-[#1E2B58] transition-colors group-hover:bg-[#1E2B58]/14 dark:bg-[#4f75ff]/15 dark:text-[#4f75ff] dark:group-hover:bg-[#4f75ff]/25">
                <span className="material-symbols-rounded text-3xl">{stat.icon}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase dark:text-slate-500">{stat.label}</p>
                <p className="mt-1 text-3xl font-black text-[#1E2B58] dark:text-white">{stat.value}</p>
              </div>
              <span className="material-symbols-rounded text-base text-[#1E2B58]/30 opacity-0 transition-opacity group-hover:opacity-100 dark:text-white/20">arrow_forward</span>
            </button>
          </AnimatedListItem>
        ))}
      </AnimatedList>

      {/* ── Main grid ── */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* ── Recent Activities ── */}
        <RecentActivityList 
          activities={activities}
          viewAllRoute="/lecturer/history"
        />

        {/* ── Upcoming Classes ── */}
        <AnimatedSection variant="slide-up" delay={0.15}>
          <div className="dashboard-card flex h-full flex-col rounded-4xl p-8">
            <div className="mb-8 flex items-center justify-between">
              <h3 className="text-xl font-extrabold text-[#1E2B58] dark:text-white">Upcoming Classes</h3>
              <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
            </div>
            <div className="flex-1 space-y-3">
              {upcomingClasses.map((session, index) => (
                <button key={session.id} onClick={() => navigate("/lecturer/calendar")} className={`dashboard-card group w-full rounded-2xl p-4 text-left transition-all hover:shadow-md ${index === upcomingClasses.length - 1 && upcomingClasses.length > 2 ? "opacity-60" : ""}`}>
                  <p className="mb-1.5 text-[10px] font-black tracking-widest text-[#1E2B58]/40 uppercase dark:text-white/40">{session.timeRange}</p>
                  <h4 className="font-bold text-[#1E2B58] transition-colors group-hover:text-[#4f75ff] dark:text-white">{session.title}</h4>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-rounded text-sm opacity-60">location_on</span>
                      <span className="text-[11px] font-bold text-slate-500">{session.location}</span>
                    </div>
                    <span className="material-symbols-rounded text-sm text-[#1E2B58]/20 opacity-0 transition-all group-hover:text-[#4f75ff] group-hover:opacity-100 dark:text-white/20">chevron_right</span>
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button onClick={() => navigate("/lecturer/report-issue")} className="dashboard-card flex items-center justify-center gap-1.5 rounded-2xl py-3 text-[10px] font-black tracking-wider text-[#1E2B58] uppercase dark:text-white">
                <span className="material-symbols-rounded text-sm">report</span> Report Issue
              </button>
              <button onClick={() => navigate("/lecturer/equipment")} className="dashboard-card flex items-center justify-center gap-1.5 rounded-2xl py-3 text-[10px] font-black tracking-wider text-[#1E2B58] uppercase dark:text-white">
                <span className="material-symbols-rounded text-sm">laptop_mac</span> Equipment
              </button>
            </div>
            <button onClick={() => navigate("/lecturer/calendar")} className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#1E2B58] py-4 text-xs font-bold tracking-widest text-white uppercase shadow-lg shadow-[#1E2B58]/20 transition-all hover:bg-[#1E2B58]/90 active:scale-[0.98]">
              <span className="material-symbols-rounded text-base">calendar_month</span> Open Full Calendar
            </button>
          </div>
        </AnimatedSection>
      </div>
    </PageShell>
  );
};

export default LecturerDashboard;
