import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { PageShell, AnimatedList, AnimatedListItem, AnimatedSection } from "@/components/motion";
import { useDashboardStore } from "@/stores/useDashboardStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { RecentActivityList } from "@/features/shared/components/dashboard/RecentActivityList";
import { scheduleService } from "@/services/scheduleService";
import { attendanceService } from "@/services/attendanceService";
import { getTodayVN, getSlotTimeStatus } from "@/utils/dateUtils";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const fmtTime = (d) =>
  d ? new Date(d).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) : "—";

// ─────────────────────────────────────────────────────────────────────────────
// A. Current Teaching Session Card
// ─────────────────────────────────────────────────────────────────────────────

const SessionCard = ({ schedule, isCheckedIn, isSessionOngoing, isActionLoading, onCheckIn }) => {
  const slotLabel =
    schedule.slotId?.name || schedule.slotId?.code || "Slot";
  const timeRange = `${schedule.slotId?.startTime || fmtTime(schedule.startAt)} – ${schedule.slotId?.endTime || fmtTime(schedule.endAt)}`;
  const roomName =
    schedule.roomId?.name || schedule.roomId?.code || "—";
  const courseName = schedule.title || "—";
  const studentCount = schedule.studentIds?.length ?? 0;

  return (
    <div className="dashboard-card rounded-4xl p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        {/* ── Session Info ── */}
        <div className="flex flex-1 flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#1E2B58]/8 text-[#1E2B58] dark:bg-[#4f75ff]/15 dark:text-[#4f75ff]">
              <span className="material-symbols-rounded text-2xl">school</span>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Current Teaching Session
              </p>
              <h2 className="text-xl font-extrabold text-[#1E2B58] dark:text-white">
                {courseName}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="flex items-center gap-2 rounded-2xl bg-[#1E2B58]/4 px-4 py-3 dark:bg-white/5">
              <span className="material-symbols-rounded shrink-0 text-base text-[#1E2B58]/50 dark:text-white/40">
                schedule
              </span>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                  Slot
                </p>
                <p className="text-sm font-bold text-[#1E2B58] dark:text-white">
                  {slotLabel} · {timeRange}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-2xl bg-[#1E2B58]/4 px-4 py-3 dark:bg-white/5">
              <span className="material-symbols-rounded shrink-0 text-base text-[#1E2B58]/50 dark:text-white/40">
                meeting_room
              </span>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                  Room
                </p>
                <p className="text-sm font-bold text-[#1E2B58] dark:text-white">
                  {roomName}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-2xl bg-[#1E2B58]/4 px-4 py-3 dark:bg-white/5">
              <span className="material-symbols-rounded shrink-0 text-base text-[#1E2B58]/50 dark:text-white/40">
                groups
              </span>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                  Students
                </p>
                <p className="text-sm font-bold text-[#1E2B58] dark:text-white">
                  {studentCount} enrolled
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Check-in Action ── */}
        <div className="flex shrink-0 flex-col items-start gap-2 lg:items-end">
          {isCheckedIn ? (
            <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 px-5 py-3 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/30">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              <span className="text-sm font-black text-emerald-700 dark:text-emerald-400">
                Session Active
              </span>
            </div>
          ) : (
            <div className={`flex items-center gap-2 rounded-2xl px-5 py-3 border ${
              isSessionOngoing 
                ? 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-900/30'
                : 'bg-slate-50 text-slate-500 border-slate-200 dark:bg-slate-800/50 dark:text-slate-400 dark:border-slate-700'
            }`}>
              <span className={`h-2 w-2 rounded-full ${isSessionOngoing ? 'bg-amber-500 animate-pulse' : 'bg-slate-400'}`} />
              <span className="text-sm font-black uppercase tracking-wider">
                {isSessionOngoing ? 'Ready to Start' : 'Upcoming'}
              </span>
            </div>
          )}
        </div>

        {/* ── Check-in Action ── */}
        <div className="flex shrink-0 flex-col items-start gap-2 lg:items-end mt-4 lg:mt-0">
          {!isCheckedIn && (
            <button
              onClick={onCheckIn}
              disabled={isActionLoading || !isSessionOngoing}
              className={`flex items-center gap-2 rounded-2xl px-6 py-3 text-xs font-black uppercase tracking-widest transition-all active:scale-[0.98] disabled:opacity-60 ${
                isSessionOngoing 
                  ? "bg-[#1E2B58] text-white shadow-lg shadow-[#1E2B58]/20 hover:bg-[#1E2B58]/90" 
                  : "bg-slate-100 text-slate-400 dark:bg-slate-800 cursor-not-allowed"
              }`}
            >
              {isActionLoading ? (
                <span className="material-symbols-rounded animate-spin text-base">
                  refresh
                </span>
              ) : (
                <span className="material-symbols-rounded text-base">
                  {isSessionOngoing ? "login" : "timer"}
                </span>
              )}
              {isSessionOngoing ? "Start Session" : "Too Early"}
            </button>
          )}
          <p className="text-[10px] text-slate-400 dark:text-slate-500">
            {isCheckedIn
              ? "Equipment borrowing is unlocked for students."
              : isSessionOngoing 
                ? "Check in to unlock equipment borrowing."
                : "Session time hasn't arrived yet."}
          </p>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Main Dashboard Page
// ─────────────────────────────────────────────────────────────────────────────

const STAT_CARDS = (stats) => [
  {
    label: "Pending Requests",
    value: String(stats?.pendingRequests ?? 0).padStart(2, "0"),
    icon: "pending_actions",
    route: "/lecturer/approval",
    hint: "Review Requests",
    dot: "bg-amber-400",
    glow: "glow-amber",
  },
  {
    label: "Active Borrowings",
    value: String(stats?.equipmentBorrowed ?? 0),
    icon: "laptop_mac",
    route: "/lecturer/equipment",
    hint: "Manage Borrowings",
    dot: "bg-blue-400",
    glow: "glow-blue",
  },
  {
    label: "Reports Submitted",
    value: String(stats?.reportsSent ?? 0),
    icon: "assignment_turned_in",
    route: "/lecturer/history",
    hint: "View History",
    dot: "bg-emerald-400",
    glow: "glow-emerald",
  },
  {
    label: "Assigned Rooms",
    value: String(stats?.assignedRooms ?? 0).padStart(2, "0"),
    icon: "meeting_room",
    route: "/lecturer/calendar",
    hint: "View Calendar",
    dot: "bg-violet-400",
    glow: "glow-violet",
  },
];

const LecturerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { stats, activities, fetchStats, fetchActivities } = useDashboardStore();

  // ── Today's schedule ───────────────────────────────────────────────────────
  const [schedules, setSchedules] = useState([]);
  const [scheduleLoading, setScheduleLoading] = useState(true);

  // ── Check-in state ─────────────────────────────────────────────────────────
  const [checkInStatus, setCheckInStatus] = useState(null);
  const [checkInLoading, setCheckInLoading] = useState(false);
  const [checkingIn, setCheckingIn] = useState(false);
  const [nowTick, setNowTick] = useState(Date.now());

  // ── Load stats and activities ──────────────────────────────────────────────
  useEffect(() => {
    fetchStats();
    fetchActivities();
  }, [fetchStats, fetchActivities]);

  // ── Load today's schedule ──────────────────────────────────────────────────
  const loadSchedules = useCallback(async () => {
    setScheduleLoading(true);
    try {
      const res = await scheduleService.getMySchedules(getTodayVN());
      setSchedules(Array.isArray(res) ? res : []);
    } catch {
      setSchedules([]);
    } finally {
      setScheduleLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSchedules();
  }, [loadSchedules]);

  // ── Derive current/active session (ongoing first, then next upcoming) ──────
  const activeSchedule = useMemo(() => {
    if (!schedules.length) return null;
    
    // 1. Ongoing: current time is within [startAt, endAt] AND not completed
    const ongoing = schedules.find(s => 
      s.status !== 'completed' && 
      getSlotTimeStatus(s.startAt, s.endAt) === 'ongoing'
    );
    if (ongoing) return ongoing;
    
    // 2. Upcoming: starts in the future AND not completed
    const upcoming = schedules.find(s => 
      s.status !== 'completed' && 
      getSlotTimeStatus(s.startAt, s.endAt) === 'upcoming'
    );
    if (upcoming) return upcoming;

    // 3. Fallback: Recently ended session of today (so lecturer can still checkout)
    const recentlyEnded = [...schedules]
      .filter(s => getSlotTimeStatus(s.startAt, s.endAt) === 'ended')
      .sort((a,b) => new Date(b.endAt) - new Date(a.endAt))[0];

    return recentlyEnded || null;
  }, [schedules, nowTick]);

  const isSessionOngoing = useMemo(() => {
    if (!activeSchedule) return false;
    if (activeSchedule.status === 'completed') return false;
    return getSlotTimeStatus(activeSchedule.startAt, activeSchedule.endAt) === 'ongoing';
  }, [activeSchedule, nowTick]);

  // ── Tick & Auto-Refresh ────────────────────────────────────────────────────
  useEffect(() => {
    const id = setInterval(() => setNowTick(Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);

  // ── Load check-in status once session is known ─────────────────────────────
  useEffect(() => {
    if (!activeSchedule?._id) {
      setCheckInStatus(null);
      return;
    }
    let cancelled = false;
    const load = async () => {
      setCheckInLoading(true);
      try {
        const res = await attendanceService.getMyCheckInStatus(activeSchedule._id);
        if (!cancelled) setCheckInStatus(res);
      } catch {
        if (!cancelled) setCheckInStatus({ checkedIn: false });
      } finally {
        if (!cancelled) setCheckInLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [activeSchedule]);

  const isCheckedIn = checkInStatus?.checkedIn === true;

  // ── Checkout Reminder ──────────────────────────────────────────────────────
  useEffect(() => {
    if (activeSchedule && isCheckedIn && getSlotTimeStatus(activeSchedule.startAt, activeSchedule.endAt) === 'ended' && activeSchedule.status !== 'completed') {
      const timer = setTimeout(() => {
        toast.warning(
          `Your session "${activeSchedule.title}" has ended. Please remember to end the session.`,
          { id: 'checkout-reminder', duration: 10000 }
        );
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [activeSchedule, isCheckedIn, nowTick]);

  const isCheckedInUI = useMemo(() => {
    if (!activeSchedule) return false;
    return isCheckedIn;
  }, [activeSchedule, isCheckedIn]);

  // ── Check-in handler ───────────────────────────────────────────────────────
  const handleCheckIn = async () => {
    if (!activeSchedule?._id) return;
    setCheckingIn(true);
    try {
      await attendanceService.checkIn(activeSchedule._id);
      toast.success("Session started! Equipment borrowing is now unlocked.");
      const res = await attendanceService.getMyCheckInStatus(activeSchedule._id);
      setCheckInStatus(res);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Unable to start session.");
    } finally {
      setCheckingIn(false);
    }
  };

  // ── Derived values ─────────────────────────────────────────────────────────
  const statCards = STAT_CARDS(stats);
  const welcomeName = user?.displayName || user?.username || "Lecturer";

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <PageShell
      title={`Welcome, ${welcomeName}`}
      subtitle="Here's your teaching session overview for today."
      topPadding="pt-6"
      className="pb-20 px-6"
      contentClassName="max-w-350 mx-auto w-full"
    >
      {/* ── A. Current Teaching Session ── */}
      <AnimatedSection variant="slide-up" delay={0} className="mb-8">
        {scheduleLoading ? (
          <div className="dashboard-card flex items-center justify-center gap-3 rounded-4xl p-10">
            <span className="material-symbols-rounded animate-spin text-xl text-slate-400">
              refresh
            </span>
            <p className="text-sm text-slate-400">Loading session…</p>
          </div>
        ) : activeSchedule ? (
          <SessionCard
            schedule={activeSchedule}
            isCheckedIn={isCheckedInUI}
            isSessionOngoing={isSessionOngoing}
            isActionLoading={checkInLoading || checkingIn}
            onCheckIn={handleCheckIn}
          />
        ) : (
          <div className="dashboard-card flex flex-col items-center justify-center gap-3 rounded-4xl p-10 text-center">
            <span className="material-symbols-rounded text-4xl text-slate-300">
              event_busy
            </span>
            <p className="font-bold text-[#1E2B58] dark:text-white">
              No teaching session is currently active
            </p>
            <p className="text-sm text-slate-400">
              You have no scheduled classes at this time today.
            </p>
            <button
              onClick={() => navigate("/lecturer/calendar")}
              className="mt-2 flex items-center gap-2 rounded-2xl bg-[#1E2B58]/8 px-5 py-2.5 text-xs font-bold text-[#1E2B58] transition-colors hover:bg-[#1E2B58]/14 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
            >
              <span className="material-symbols-rounded text-sm">calendar_month</span>
              View Full Calendar
            </button>
          </div>
        )}
      </AnimatedSection>

      {/* ── B. Quick Statistics ── */}
      <AnimatedList className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <AnimatedListItem key={stat.label}>
            <button
              onClick={() => navigate(stat.route)}
              className="dashboard-card group relative flex w-full cursor-pointer items-center gap-5 rounded-4xl p-6 text-left transition-all duration-200 hover:scale-[1.02] hover:shadow-xl"
              title={stat.hint}
            >
              <div
                className={`absolute top-5 right-5 h-2 w-2 rounded-full ${stat.dot} ${stat.glow}`}
              />
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#1E2B58]/8 text-[#1E2B58] transition-colors group-hover:bg-[#1E2B58]/14 dark:bg-[#4f75ff]/15 dark:text-[#4f75ff] dark:group-hover:bg-[#4f75ff]/25">
                <span className="material-symbols-rounded text-3xl">{stat.icon}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                  {stat.label}
                </p>
                <p className="mt-1 text-3xl font-black text-[#1E2B58] dark:text-white">
                  {stat.value}
                </p>
              </div>
              <span className="material-symbols-rounded text-base text-[#1E2B58]/30 opacity-0 transition-opacity group-hover:opacity-100 dark:text-white/20">
                arrow_forward
              </span>
            </button>
          </AnimatedListItem>
        ))}
      </AnimatedList>

      {/* ── Recent Activities — "View All" goes to Notifications ── */}
      <RecentActivityList
        activities={activities}
        viewAllRoute="/lecturer/notifications"
      />
    </PageShell>
  );
};

export default LecturerDashboard;
