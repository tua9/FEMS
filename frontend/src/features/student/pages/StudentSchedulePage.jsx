import React, { useState, useMemo, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, MapPin, Clock, User, Laptop, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { scheduleService } from '@/services/scheduleService';
import { toVNDateStr } from '@/utils/dateUtils';
import { PageHeader } from '@/features/shared/components/PageHeader';

// ─── Constants ────────────────────────────────────────────────────────────────

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const FIXED_SLOTS = [
  { order: 1, label: 'Slot 1', startH: 7,  startM: 0,  endH: 9,  endM: 15 },
  { order: 2, label: 'Slot 2', startH: 9,  startM: 30, endH: 11, endM: 45 },
  { order: 3, label: 'Slot 3', startH: 12, startM: 30, endH: 14, endM: 45 },
  { order: 4, label: 'Slot 4', startH: 15, startM: 0,  endH: 17, endM: 15 },
];

const STATUS_CONFIG = {
  not_yet:   { label: 'Upcoming',  dot: 'bg-slate-400',   badge: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400' },
  ongoing:   { label: 'Ongoing',   dot: 'bg-emerald-500', badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
  completed: { label: 'Completed', dot: 'bg-blue-400',    badge: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
};

const TYPE_BG = {
  class: 'bg-[#1E2B58]',
  lab:   'bg-emerald-600',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function startOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - (day === 0 ? 6 : day - 1));
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate();
}

function pad2(n) { return String(n).padStart(2, '0'); }

function getVNMinutes() {
  const vnNow = new Date(Date.now() + 7 * 60 * 60 * 1000);
  return vnNow.getUTCHours() * 60 + vnNow.getUTCMinutes();
}

function getActiveSlotOrder() {
  const cur = getVNMinutes();
  const s = FIXED_SLOTS.find(sl =>
    cur >= sl.startH * 60 + sl.startM && cur <= sl.endH * 60 + sl.endM
  );
  return s ? s.order : null;
}

function mapSchedule(s) {
  const slot = s.slotId || {};
  const [sh = 7, sm = 0] = (slot.startTime || '07:00').split(':').map(Number);
  const [eh = 9, em = 15] = (slot.endTime   || '09:15').split(':').map(Number);
  const d = new Date(s.date || s.startAt);
  return {
    id: s._id,
    title: s.title || 'Unknown Course',
    location: s.roomId?.name || '—',
    roomId: s.roomId?._id || null,
    lecturer: s.lecturerId?.displayName || s.lecturerId?.username || '—',
    year: d.getFullYear(),
    month: d.getMonth(),
    day: d.getDate(),
    startH: sh,
    startM: sm,
    endH: eh,
    endM: em,
    slotOrder: slot.order || null,
    slotName: slot.name || '',
    // Keep backend status but also derive visual status from time
    backendStatus: s.status,
    type: s.roomId?.type === 'lab' ? 'lab' : 'class',
  };
}

function getEventsForDate(events, date) {
  return events.filter(e =>
    e.year === date.getFullYear()
    && e.month === date.getMonth()
    && e.day === date.getDate()
  );
}

function eventMatchesSlot(ev, slot) {
  const evStart = ev.startH * 60 + ev.startM;
  return evStart >= slot.startH * 60 + slot.startM && evStart < slot.endH * 60 + slot.endM;
}

/** Derive display status from time comparison (not from backend status alone) */
function deriveSlotStatus(ev, slot, isToday) {
  // Explicitly completed/cancelled by backend
  if (ev.backendStatus === 'cancelled') return 'not_yet'; // show as upcoming, handle separately if needed
  if (ev.backendStatus === 'completed') return 'completed';

  if (isToday) {
    const cur = getVNMinutes();
    const slotStart = slot.startH * 60 + slot.startM;
    const slotEnd   = slot.endH   * 60 + slot.endM;
    if (cur > slotEnd)   return 'completed';
    if (cur >= slotStart) return 'ongoing';
  }

  // Past date → always completed
  const evDate = new Date(ev.year, ev.month, ev.day);
  const todayMidnight = new Date();
  todayMidnight.setHours(0, 0, 0, 0);
  if (evDate < todayMidnight) return 'completed';

  return 'not_yet';
}

// ─── Slot Detail Modal ────────────────────────────────────────────────────────

const SlotModal = ({ event, slot, onClose, onBorrow }) => {
  const today = new Date();
  const evDate = new Date(event.year, event.month, event.day);
  const status = deriveSlotStatus(event, slot, isSameDay(evDate, today));
  const sc = STATUS_CONFIG[status] || STATUS_CONFIG.not_yet;
  const bg = TYPE_BG[event.type] || TYPE_BG.class;
  const duration = (event.endH * 60 + event.endM) - (event.startH * 60 + event.startM);

  const dateLabel = evDate.toLocaleDateString('en-GB', {
    weekday: 'long', day: '2-digit', month: 'short', year: 'numeric',
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 bg-black/30 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="dashboard-card rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* ── Coloured header ── */}
        <div className={`${bg} px-6 pt-6 pb-5 flex items-start justify-between`}>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${sc.badge}`}>
                {status === 'ongoing' && <span className={`w-1.5 h-1.5 rounded-full ${sc.dot} animate-pulse`} />}
                {sc.label}
              </span>
              <h3 className="text-white font-extrabold text-lg leading-tight mt-0.5 truncate">{event.title}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors shrink-0 ml-2"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* ── Details ── */}
        <div className="p-6 space-y-3">
          {/* Date */}
          <div className="flex items-center gap-3 p-3 bg-white/40 dark:bg-slate-800/40 rounded-xl">
            <span className="material-symbols-rounded text-base text-[#1E2B58]/50 dark:text-white/40 shrink-0">calendar_month</span>
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-[#1E2B58]/40 dark:text-white/40">Date</p>
              <p className="text-sm font-bold text-[#1E2B58] dark:text-white">{dateLabel}</p>
            </div>
          </div>

          {/* Time + Slot */}
          <div className="flex items-center gap-3 p-3 bg-white/40 dark:bg-slate-800/40 rounded-xl">
            <Clock className="w-4 h-4 text-[#1E2B58]/50 dark:text-white/40 shrink-0" />
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-[#1E2B58]/40 dark:text-white/40">
                {event.slotName || slot.label}
              </p>
              <p className="text-sm font-bold text-[#1E2B58] dark:text-white">
                {pad2(event.startH)}:{pad2(event.startM)} – {pad2(event.endH)}:{pad2(event.endM)}
                <span className="ml-2 text-[#1E2B58]/40 dark:text-white/30 font-semibold text-xs">
                  ({Math.floor(duration / 60)}h{duration % 60 ? ` ${duration % 60}m` : ''})
                </span>
              </p>
            </div>
          </div>

          {/* Room */}
          <div className="flex items-center gap-3 p-3 bg-white/40 dark:bg-slate-800/40 rounded-xl">
            <MapPin className="w-4 h-4 text-[#1E2B58]/50 dark:text-white/40 shrink-0" />
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-[#1E2B58]/40 dark:text-white/40">Room</p>
              <p className="text-sm font-bold text-[#1E2B58] dark:text-white">{event.location}</p>
            </div>
          </div>

          {/* Lecturer */}
          <div className="flex items-center gap-3 p-3 bg-white/40 dark:bg-slate-800/40 rounded-xl">
            <User className="w-4 h-4 text-[#1E2B58]/50 dark:text-white/40 shrink-0" />
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-[#1E2B58]/40 dark:text-white/40">Lecturer</p>
              <p className="text-sm font-bold text-[#1E2B58] dark:text-white">{event.lecturer}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              onClick={onBorrow}
              className="flex-1 py-3 rounded-2xl bg-[#1E2B58] text-white text-sm font-extrabold hover:bg-[#1E2B58]/90 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-[#1E2B58]/20 flex items-center justify-center gap-2"
            >
              <Laptop className="w-4 h-4" />
              Borrow Equipment
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-2xl bg-white/40 dark:bg-slate-800/40 text-sm font-bold text-[#1E2B58]/70 dark:text-white/70 hover:opacity-80 transition-opacity"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

const StudentSchedulePage = () => {
  const navigate = useNavigate();
  const today = useMemo(() => new Date(), []);

  const [viewDate,      setViewDate]      = useState(new Date());
  const [rawSchedules,  setRawSchedules]  = useState([]);
  const [loading,       setLoading]       = useState(false);
  const [selectedCell,  setSelectedCell]  = useState(null); // { event, slot }
  const [filterCourse,  setFilterCourse]  = useState('all');
  const [filterRoom,    setFilterRoom]    = useState('all');

  // ── Week ────────────────────────────────────────────────────────────────────
  const weekStart = useMemo(() => startOfWeek(viewDate), [
    viewDate.getFullYear(), viewDate.getMonth(), viewDate.getDate()
  ]);
  const days       = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart]);
  const isThisWeek = useMemo(() => days.some(d => isSameDay(d, today)), [days, today]);
  const activeSlotOrder = useMemo(() => isThisWeek ? getActiveSlotOrder() : null, [isThisWeek]);

  // ── Fetch — dùng weekStart.getTime() trực tiếp, tránh stale closure ─────────
  const weekStartMs = weekStart.getTime();

  useEffect(() => {
    const ws = new Date(weekStartMs);
    const params = {
      startDate: toVNDateStr(ws),
      endDate:   toVNDateStr(addDays(ws, 6)),
    };
    let cancelled = false;
    setLoading(true);
    setRawSchedules([]);
    scheduleService.getMySchedules(params)
      .then(data  => { if (!cancelled) setRawSchedules(Array.isArray(data) ? data : []); })
      .catch(()   => { if (!cancelled) setRawSchedules([]); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [weekStartMs]);

  const events = useMemo(() => rawSchedules.map(mapSchedule), [rawSchedules]);

  // ── Filters ─────────────────────────────────────────────────────────────────
  const courseOptions = useMemo(() => [...new Set(events.map(e => e.title))].sort(), [events]);
  const roomOptions   = useMemo(() => [...new Set(events.map(e => e.location).filter(r => r !== '—'))].sort(), [events]);

  const filteredEvents = useMemo(() => events.filter(e => {
    if (filterCourse !== 'all' && e.title !== filterCourse) return false;
    if (filterRoom   !== 'all' && e.location !== filterRoom) return false;
    return true;
  }), [events, filterCourse, filterRoom]);

  // ── Navigation ───────────────────────────────────────────────────────────────
  const goToPrev  = () => setViewDate(prev => { const d = new Date(prev); d.setDate(d.getDate() - 7); return d; });
  const goToNext  = () => setViewDate(prev => { const d = new Date(prev); d.setDate(d.getDate() + 7); return d; });
  const goToToday = () => setViewDate(new Date());

  // ── Header label ─────────────────────────────────────────────────────────────
  const weekLabel = useMemo(() => {
    const sun = addDays(weekStart, 6);
    return `${pad2(weekStart.getDate())}/${pad2(weekStart.getMonth() + 1)} – ${pad2(sun.getDate())}/${pad2(sun.getMonth() + 1)}`;
  }, [weekStart]);

  const weekYear = weekStart.getFullYear();

  // ── Stats for this week ───────────────────────────────────────────────────
  const weekStats = useMemo(() => {
    const total     = events.length;
    const completed = events.filter(e => {
      const evDate = new Date(e.year, e.month, e.day);
      const todayM  = new Date(); todayM.setHours(0,0,0,0);
      return e.backendStatus === 'completed' || evDate < todayM;
    }).length;
    const upcoming  = total - completed;
    return { total, completed, upcoming };
  }, [events]);

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="w-full">
      <main className="pt-6 sm:pt-8 pb-10 px-4 sm:px-6 w-full max-w-[90vw] xl:max-w-7xl mx-auto flex-1 flex flex-col">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <PageHeader
            title="Schedule"
            subtitle={`${weekYear} · Week ${weekLabel}`}
            className="items-start text-left mb-0"
          />

          <div className="flex items-center gap-2 flex-wrap shrink-0">
            {/* Course filter */}
            {courseOptions.length > 1 && (
              <select
                value={filterCourse}
                onChange={e => setFilterCourse(e.target.value)}
                className="h-8 px-3 rounded-full dashboard-card text-[10px] font-black uppercase tracking-widest text-[#1E2B58] dark:text-white bg-transparent outline-none cursor-pointer"
              >
                <option value="all">All Courses</option>
                {courseOptions.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            )}

            {/* Room filter */}
            {roomOptions.length > 1 && (
              <select
                value={filterRoom}
                onChange={e => setFilterRoom(e.target.value)}
                className="h-8 px-3 rounded-full dashboard-card text-[10px] font-black uppercase tracking-widest text-[#1E2B58] dark:text-white bg-transparent outline-none cursor-pointer"
              >
                <option value="all">All Rooms</option>
                {roomOptions.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            )}

            {/* Week navigation */}
            <div className="flex items-center gap-1 relative z-10">
              <button
                onClick={goToPrev}
                className="w-8 h-8 flex items-center justify-center rounded-full dashboard-card hover:bg-white/60 dark:hover:bg-white/10 transition-all text-[#1E2B58] dark:text-white"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={goToToday}
                className="px-4 h-8 rounded-full dashboard-card text-[10px] font-black uppercase tracking-widest text-[#1E2B58] dark:text-white hover:bg-white/60 dark:hover:bg-white/10 transition-all"
              >
                Today
              </button>
              <button
                onClick={goToNext}
                className="w-8 h-8 flex items-center justify-center rounded-full dashboard-card hover:bg-white/60 dark:hover:bg-white/10 transition-all text-[#1E2B58] dark:text-white"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ── Quick stats ──────────────────────────────────────────────────── */}
        <div className="flex gap-3 mb-6 flex-wrap">
          <div className="dashboard-card px-5 py-3 rounded-2xl flex items-center gap-3">
            <span className="text-2xl font-black text-[#1E2B58] dark:text-white leading-none">{weekStats.total}</span>
            <span className="text-[0.625rem] font-bold uppercase tracking-[0.15em] text-[#1E2B58]/50 dark:text-white/50">Classes<br/>this week</span>
          </div>
          <div className="dashboard-card px-5 py-3 rounded-2xl flex items-center gap-3">
            <span className="text-2xl font-black text-blue-500 leading-none">{weekStats.completed}</span>
            <span className="text-[0.625rem] font-bold uppercase tracking-[0.15em] text-[#1E2B58]/50 dark:text-white/50">Completed</span>
          </div>
          <div className="dashboard-card px-5 py-3 rounded-2xl flex items-center gap-3">
            <span className="text-2xl font-black text-amber-500 leading-none">{weekStats.upcoming}</span>
            <span className="text-[0.625rem] font-bold uppercase tracking-[0.15em] text-[#1E2B58]/50 dark:text-white/50">Upcoming</span>
          </div>
          {loading && (
            <div className="flex items-center gap-2 px-4 py-3 dashboard-card rounded-2xl text-xs text-slate-400">
              <span className="material-symbols-rounded animate-spin text-sm">refresh</span>
              Loading…
            </div>
          )}
        </div>

        {/* ── Schedule grid ────────────────────────────────────────────────── */}
        <div className="dashboard-card rounded-[2rem] overflow-x-auto hide-scrollbar">
          <div className="min-w-[640px] p-4 md:p-6">

            {/* Day column headers */}
            <div className="grid grid-cols-[repeat(8,1fr)] border-b border-[#1E2B58]/10 dark:border-white/10 pb-3 mb-1">
              <div className="text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-end pb-1">Slot</div>
              {days.map((date, i) => {
                const isToday   = isSameDay(date, today);
                const isWeekend = i >= 5;
                return (
                  <div key={i} className="text-center">
                    <div className={`text-[9px] font-black uppercase tracking-widest ${
                      isWeekend ? 'text-[#1E2B58]/30 dark:text-white/20' : 'text-slate-400'
                    }`}>
                      {DAY_LABELS[i]}
                    </div>
                    <div className={`text-sm md:text-base font-black mx-auto mt-0.5 w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded-full transition-all ${
                      isToday
                        ? 'bg-[#1E2B58] text-white'
                        : isWeekend
                          ? 'text-[#1E2B58]/35 dark:text-white/25'
                          : 'text-[#1E2B58] dark:text-white'
                    }`}>
                      {date.getDate()}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Slot rows */}
            {FIXED_SLOTS.map(slot => {
              const isActiveSlot = activeSlotOrder === slot.order;
              return (
                <div
                  key={slot.order}
                  className={`grid grid-cols-[repeat(8,1fr)] border-b border-[#1E2B58]/5 dark:border-white/5 last:border-b-0 min-h-[120px] ${
                    isActiveSlot ? 'bg-blue-50/60 dark:bg-blue-900/10 rounded-2xl' : ''
                  }`}
                >
                  {/* Slot label */}
                  <div className="aspect-square p-2 md:p-3 flex flex-col justify-center items-center text-center gap-0.5 shrink-0 border-r border-[#1E2B58]/5 dark:border-white/5">
                    <div className="flex items-center gap-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#1E2B58] dark:text-white">
                        {slot.label}
                      </p>
                      {isActiveSlot && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                      )}
                    </div>
                    <p className="text-[9px] text-slate-400 dark:text-slate-500 font-semibold leading-snug">
                      {pad2(slot.startH)}:{pad2(slot.startM)}
                      <span className="mx-0.5">–</span>
                      {pad2(slot.endH)}:{pad2(slot.endM)}
                    </p>
                  </div>

                  {/* Day cells */}
                  {days.map((date, dayIdx) => {
                    const isToday    = isSameDay(date, today);
                    const isWeekend  = dayIdx >= 5;
                    const cellEvents = getEventsForDate(filteredEvents, date).filter(ev => eventMatchesSlot(ev, slot));

                    return (
                      <div
                        key={dayIdx}
                        className={`border-l border-[#1E2B58]/5 dark:border-white/5 p-1 flex flex-col justify-center ${
                          isToday && isActiveSlot ? 'bg-emerald-50/40 dark:bg-emerald-900/10' : ''
                        } ${isWeekend ? 'bg-[#1E2B58]/[0.02] dark:bg-white/[0.015]' : ''}`}
                      >
                        {cellEvents.map((ev, eIdx) => {
                          const evDate     = new Date(ev.year, ev.month, ev.day);
                          const evIsToday  = isSameDay(evDate, today);
                          const slotStatus = deriveSlotStatus(ev, slot, evIsToday);
                          const sc         = STATUS_CONFIG[slotStatus] || STATUS_CONFIG.not_yet;
                          const cardBg     = TYPE_BG[ev.type] || TYPE_BG.class;
                          const isOngoing  = slotStatus === 'ongoing';
                          const isDone     = slotStatus === 'completed';

                          return (
                            <button
                              key={eIdx}
                              onClick={() => setSelectedCell({ event: ev, slot })}
                              className={`w-full aspect-square text-left p-3 rounded-xl text-white transition-all hover:opacity-90 hover:scale-[1.02] active:scale-95 overflow-hidden flex flex-col justify-between ${cardBg} ${
                                isOngoing ? 'ring-2 ring-emerald-400 ring-offset-1 ring-offset-transparent' : ''
                              } ${isDone ? 'opacity-55' : ''}`}
                            >
                              <div className="min-w-0">
                                {/* Course title */}
                                <div className="text-[9px] md:text-[10px] font-extrabold truncate leading-tight">
                                  {ev.title}
                                </div>
                                {/* Room */}
                                <div className="text-[8px] md:text-[9px] opacity-80 truncate mt-0.5 flex items-center gap-0.5">
                                  <MapPin className="w-2.5 h-2.5 shrink-0" />
                                  <span className="truncate">{ev.location}</span>
                                </div>
                                {/* Lecturer */}
                                <div className="text-[8px] md:text-[9px] opacity-70 truncate flex items-center gap-0.5">
                                  <User className="w-2.5 h-2.5 shrink-0" />
                                  <span className="truncate">{ev.lecturer}</span>
                                </div>
                              </div>
                              {/* Status badge */}
                              <div className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[7px] md:text-[8px] font-black uppercase tracking-wider w-fit ${sc.badge}`}>
                                {isOngoing && <span className={`w-1 h-1 rounded-full ${sc.dot} animate-pulse`} />}
                                {sc.label}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Legend ───────────────────────────────────────────────────────── */}
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 px-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1E2B58]" />
            <span className="text-[10px] font-bold text-[#1E2B58]/60 dark:text-white/50">Class</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
            <span className="text-[10px] font-bold text-[#1E2B58]/60 dark:text-white/50">Lab</span>
          </div>
          <span className="text-[#1E2B58]/20 dark:text-white/20 text-xs">|</span>
          {Object.entries(STATUS_CONFIG).map(([key, s]) => (
            <div key={key} className="flex items-center gap-1">
              <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${s.badge}`}>
                {s.label}
              </span>
            </div>
          ))}
          <div className="flex items-center gap-1.5 ml-1">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-600 opacity-60" />
            <span className="text-[10px] font-bold text-[#1E2B58]/60 dark:text-white/50">Completed cells are dimmed</span>
          </div>
        </div>

      </main>

      {/* ── Slot detail modal ──────────────────────────────────────────────── */}
      {selectedCell && (
        <SlotModal
          event={selectedCell.event}
          slot={selectedCell.slot}
          onClose={() => setSelectedCell(null)}
          onBorrow={() => {
            setSelectedCell(null);
            navigate('/student/equipment');
          }}
        />
      )}
    </div>
  );
};

export default StudentSchedulePage;
