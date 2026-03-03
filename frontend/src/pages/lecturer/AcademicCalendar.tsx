import {
    ArrowLeft, ChevronLeft, ChevronRight,
    Clock,
    Download,
    MapPin,
    Users,
    X,
} from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LecturerNavbar from '../../components/lecturer/navbar/LecturerNavbar';

// ─── Types ────────────────────────────────────────────────────────────────────
type ViewMode = 'day' | 'week' | 'month';
type EventType = 'class' | 'meeting' | 'lab';

interface ScheduleEvent {
    id: string;
    title: string;
    location: string;
    type: EventType;
    year: number;
    month: number;   // 0-indexed
    day: number;
    startHour: number;
    startMin: number;
    endHour: number;
    endMin: number;
    description: string;
    students?: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const TODAY = new Date();   // actual today

const MONTH_NAMES = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December',
];
const DAY_SHORT   = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const DAY_MINI    = ['S','M','T','W','T','F','S'];
const HOURS       = Array.from({ length: 14 }, (_, i) => i + 7); // 07 – 20

// ─── Mock Events (seeded around today) ───────────────────────────────────────
function seedEvents(): ScheduleEvent[] {
    const y = TODAY.getFullYear();
    const m = TODAY.getMonth();

    // Find all Thursdays this month
    const thursdays: number[] = [];
    for (let d = 1; d <= new Date(y, m + 1, 0).getDate(); d++) {
        if (new Date(y, m, d).getDay() === 4) thursdays.push(d);
    }
    // Find all Tuesdays this month
    const tuesdays: number[] = [];
    for (let d = 1; d <= new Date(y, m + 1, 0).getDate(); d++) {
        if (new Date(y, m, d).getDay() === 2) tuesdays.push(d);
    }

    const events: ScheduleEvent[] = [];

    thursdays.forEach((d, i) => {
        events.push({
            id: `awd-${i}`,
            title: 'Advanced Web Design',
            location: 'Room AL-201',
            type: 'class',
            year: y, month: m, day: d,
            startHour: 8, startMin: 0, endHour: 10, endMin: 0,
            description: [
                'Introduction to modern web frameworks and responsive design principles.',
                'CSS Grid & Flexbox advanced layouts.',
                'JavaScript async patterns and performance optimization.',
                'Final project presentations and code reviews.',
            ][i % 4],
            students: 35,
        });
        if (i % 2 === 0) {
            events.push({
                id: `lab-${i}`,
                title: 'UI/UX Fundamentals',
                location: 'Lab 105',
                type: 'lab',
                year: y, month: m, day: d,
                startHour: 10, startMin: 0, endHour: 12, endMin: 0,
                description: 'Hands-on prototyping with Figma and usability testing methods.',
                students: 28,
            });
        }
    });

    tuesdays.forEach((d, i) => {
        if (i % 2 === 0) {
            events.push({
                id: `dm-${i}`,
                title: 'Dept. Meeting',
                location: 'Hall A',
                type: 'meeting',
                year: y, month: m, day: d,
                startHour: 13, startMin: 0, endHour: 15, endMin: 0,
                description: 'Monthly faculty meeting covering curriculum updates and student performance.',
                students: 12,
            });
        }
    });

    return events;
}

const ALL_EVENTS = seedEvents();

// ─── Helpers ──────────────────────────────────────────────────────────────────
function isSameDay(a: Date, b: Date) {
    return a.getFullYear() === b.getFullYear()
        && a.getMonth() === b.getMonth()
        && a.getDate() === b.getDate();
}

function addDays(date: Date, n: number) {
    const d = new Date(date);
    d.setDate(d.getDate() + n);
    return d;
}

function startOfWeek(date: Date) {
    const d = new Date(date);
    const day = d.getDay();
    d.setDate(d.getDate() - (day === 0 ? 6 : day - 1));
    return d;
}

function fmt(h: number, m: number) {
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function getEventsForDate(date: Date, filters: Filters): ScheduleEvent[] {
    return ALL_EVENTS.filter(e => {
        if (e.year !== date.getFullYear() || e.month !== date.getMonth() || e.day !== date.getDate()) return false;
        if (e.type === 'class'   && !filters.myClasses)    return false;
        if (e.type === 'meeting' && !filters.deptMeetings) return false;
        if (e.type === 'lab'     && !filters.labSessions)  return false;
        return true;
    });
}

// ─── Event type styles ────────────────────────────────────────────────────────
const TYPE_STYLE: Record<EventType, { bg: string; badge: string; badgeBg: string; icon: string }> = {
    class:   { bg: 'bg-[#1E2B58]',    badge: 'CLASS',   badgeBg: 'bg-blue-100 text-blue-700',     icon: 'school'   },
    meeting: { bg: 'bg-slate-500',    badge: 'MEETING', badgeBg: 'bg-slate-100 text-slate-700',   icon: 'groups'   },
    lab:     { bg: 'bg-emerald-600',  badge: 'LAB',     badgeBg: 'bg-emerald-100 text-emerald-700', icon: 'science' },
};

// ─── Types for props ──────────────────────────────────────────────────────────
interface Filters { myClasses: boolean; deptMeetings: boolean; labSessions: boolean; }

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

// ── Month View ────────────────────────────────────────────────────────────────
const MonthView: React.FC<{
    viewDate: Date;
    filters: Filters;
    onDayClick: (d: Date) => void;
    onEventClick: (e: ScheduleEvent) => void;
}> = ({ viewDate, filters, onDayClick, onEventClick }) => {
    const y = viewDate.getFullYear(), m = viewDate.getMonth();
    const firstDay   = new Date(y, m, 1).getDay();
    const daysInMonth= new Date(y, m + 1, 0).getDate();
    const startOffset= firstDay === 0 ? 6 : firstDay - 1;

    const cells: Date[] = [];
    for (let i = startOffset - 1; i >= 0; i--) cells.push(new Date(y, m, -i));
    for (let d = 1; d <= daysInMonth; d++)       cells.push(new Date(y, m, d));
    while (cells.length % 7 !== 0)               cells.push(new Date(y, m + 1, cells.length - daysInMonth - startOffset + 1));

    const numRows = cells.length / 7;

    return (
        <div className="glass-card rounded-[2rem] overflow-hidden p-4 md:p-6">
            {/* Day-of-week headers */}
            <div className="grid grid-cols-7 pb-3 mb-2 border-b border-[#1E2B58]/10 dark:border-white/10">
                {DAY_SHORT.map(d => (
                    <div key={d} className={`text-center text-[9px] md:text-[10px] font-black uppercase tracking-widest ${
                        d === 'Sat' || d === 'Sun' ? 'text-[#1E2B58]/30 dark:text-white/20' : 'text-slate-400'
                    }`}>{d}</div>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-7" style={{ gridTemplateRows: `repeat(${numRows}, minmax(80px, 1fr))` }}>
                {cells.map((date, idx) => {
                    const isCurMonth = date.getMonth() === m;
                    const isToday    = isSameDay(date, TODAY);
                    const isWeekend  = date.getDay() === 0 || date.getDay() === 6;
                    const events     = getEventsForDate(date, filters);

                    return (
                        <div
                            key={idx}
                            onClick={() => onDayClick(date)}
                            className={`p-1.5 border border-[#1E2B58]/5 dark:border-white/5 flex flex-col gap-1 cursor-pointer transition-all hover:bg-white/40 dark:hover:bg-white/5 group ${
                                isWeekend ? 'bg-white/10 dark:bg-white/[0.02]' : ''
                            } ${isToday ? 'ring-2 ring-inset ring-[#1E2B58]/25 bg-white/50 dark:bg-white/10' : ''}`}
                        >
                            <span className={`text-[10px] md:text-xs font-black w-6 h-6 flex items-center justify-center rounded-full transition-all group-hover:scale-110 ${
                                isToday     ? 'bg-[#1E2B58] text-white' :
                                isCurMonth  ? 'text-[#1E2B58] dark:text-white' :
                                              'text-slate-300 dark:text-slate-700'
                            }`}>
                                {date.getDate()}
                            </span>

                            {events.slice(0, 2).map((ev, i) => (
                                <button
                                    key={i}
                                    onClick={e => { e.stopPropagation(); onEventClick(ev); }}
                                    className={`w-full text-left px-1.5 py-1 rounded-lg text-[8px] md:text-[9px] font-bold leading-tight text-white hover:opacity-90 transition-opacity truncate ${TYPE_STYLE[ev.type].bg}`}
                                >
                                    {ev.title}
                                </button>
                            ))}
                            {events.length > 2 && (
                                <span className="text-[8px] font-bold text-[#1E2B58]/40 dark:text-white/30 pl-1">
                                    +{events.length - 2} more
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// ── Week View ─────────────────────────────────────────────────────────────────
const WeekView: React.FC<{
    viewDate: Date;
    filters: Filters;
    onDayClick: (d: Date) => void;
    onEventClick: (e: ScheduleEvent) => void;
}> = ({ viewDate, filters, onDayClick, onEventClick }) => {
    const mon  = startOfWeek(viewDate);
    const days = Array.from({ length: 7 }, (_, i) => addDays(mon, i));

    return (
        <div className="glass-card rounded-[2rem] overflow-hidden p-4 md:p-6">
            {/* Day headers */}
            <div className="grid grid-cols-[56px_repeat(7,1fr)] border-b border-[#1E2B58]/10 dark:border-white/10 pb-3 mb-2">
                <div />
                {days.map((date, i) => {
                    const isToday = isSameDay(date, TODAY);
                    return (
                        <button
                            key={i}
                            onClick={() => onDayClick(date)}
                            className="text-center transition-all hover:opacity-70 group"
                        >
                            <div className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                                {DAY_SHORT[i]}
                            </div>
                            <div className={`text-base md:text-xl font-black mx-auto mt-1 w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-full transition-all group-hover:scale-110 ${
                                isToday ? 'bg-[#1E2B58] text-white' : 'text-[#1E2B58] dark:text-white'
                            }`}>
                                {date.getDate()}
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Time grid */}
            <div className="overflow-y-auto max-h-[520px] md:max-h-[580px]">
                {HOURS.map(hour => {
                    const rowEvents = days.map(date =>
                        getEventsForDate(date, filters).filter(e => e.startHour === hour)
                    );
                    const hasAny = rowEvents.some(e => e.length > 0);

                    return (
                        <div
                            key={hour}
                            className={`grid grid-cols-[56px_repeat(7,1fr)] border-b border-[#1E2B58]/5 dark:border-white/5 ${hasAny ? 'min-h-[64px]' : 'min-h-[40px]'}`}
                        >
                            <div className="text-[9px] font-bold text-slate-400 dark:text-slate-600 pt-1.5 text-right pr-2 shrink-0">
                                {String(hour).padStart(2, '0')}:00
                            </div>
                            {rowEvents.map((evs, dayIdx) => (
                                <div
                                    key={dayIdx}
                                    className="border-l border-[#1E2B58]/5 dark:border-white/5 p-1 flex flex-col gap-1"
                                >
                                    {evs.map((ev, eIdx) => (
                                        <button
                                            key={eIdx}
                                            onClick={() => onEventClick(ev)}
                                            className={`w-full text-left p-1 rounded-lg text-[8px] font-bold leading-tight text-white hover:opacity-90 transition-opacity ${TYPE_STYLE[ev.type].bg}`}
                                        >
                                            {ev.title}
                                            <br />
                                            <span className="opacity-70">{fmt(ev.startHour, ev.startMin)}–{fmt(ev.endHour, ev.endMin)}</span>
                                        </button>
                                    ))}
                                </div>
                            ))}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// ── Day View ──────────────────────────────────────────────────────────────────
const DayView: React.FC<{
    date: Date;
    filters: Filters;
    onEventClick: (e: ScheduleEvent) => void;
}> = ({ date, filters, onEventClick }) => {
    const events  = getEventsForDate(date, filters);
    const isToday = isSameDay(date, TODAY);
    const dayIdx  = (date.getDay() + 6) % 7;

    return (
        <div className="glass-card rounded-[2rem] overflow-hidden p-4 md:p-6">
            {/* Day header */}
            <div className="flex items-center gap-4 mb-6 pb-4 border-b border-[#1E2B58]/10 dark:border-white/10">
                <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center shrink-0 ${isToday ? 'bg-[#1E2B58]' : 'glass-card'}`}>
                    <span className={`text-[9px] font-black uppercase tracking-widest ${isToday ? 'text-white/70' : 'text-slate-400'}`}>
                        {DAY_SHORT[dayIdx]}
                    </span>
                    <span className={`text-2xl font-black leading-none ${isToday ? 'text-white' : 'text-[#1E2B58] dark:text-white'}`}>
                        {date.getDate()}
                    </span>
                </div>
                <div>
                    {isToday && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-black text-blue-600 dark:text-blue-400 mb-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                            Today
                        </span>
                    )}
                    <p className="text-lg font-extrabold text-[#1E2B58] dark:text-white">
                        {events.length === 0 ? 'No events scheduled' : `${events.length} event${events.length > 1 ? 's' : ''} scheduled`}
                    </p>
                    <p className="text-sm text-[#1E2B58]/50 dark:text-white/40 font-semibold">
                        {MONTH_NAMES[date.getMonth()]} {date.getDate()}, {date.getFullYear()}
                    </p>
                </div>
            </div>

            {events.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 gap-3">
                    <span className="material-symbols-rounded text-5xl text-[#1E2B58]/20 dark:text-white/15">calendar_month</span>
                    <p className="text-sm font-bold text-[#1E2B58]/40 dark:text-white/30">No events on this day</p>
                    <p className="text-xs text-[#1E2B58]/25 dark:text-white/20">Try adjusting filters or picking another date</p>
                </div>
            ) : (
                <div className="overflow-y-auto max-h-[540px]">
                    {HOURS.map(hour => {
                        const hourEvents = events.filter(e => e.startHour === hour);
                        return (
                            <div key={hour} className={`flex gap-4 border-b border-[#1E2B58]/5 dark:border-white/5 ${hourEvents.length > 0 ? 'py-3' : 'py-2'}`}>
                                <div className="w-12 text-right shrink-0 pt-0.5">
                                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-600">
                                        {String(hour).padStart(2, '0')}:00
                                    </span>
                                </div>
                                <div className="flex-1 flex flex-col gap-2">
                                    {hourEvents.map((ev, i) => (
                                        <button
                                            key={i}
                                            onClick={() => onEventClick(ev)}
                                            className={`w-full text-left p-4 rounded-2xl flex items-start gap-3 text-white hover:opacity-90 transition-all hover:scale-[1.01] ${TYPE_STYLE[ev.type].bg}`}
                                        >
                                            <span className="material-symbols-rounded text-xl mt-0.5 opacity-90">
                                                {TYPE_STYLE[ev.type].icon}
                                            </span>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-extrabold text-sm">{ev.title}</p>
                                                <p className="text-[11px] opacity-80 font-semibold flex items-center gap-1 mt-0.5">
                                                    <MapPin className="w-3 h-3 shrink-0" />{ev.location}
                                                </p>
                                                <p className="text-[11px] opacity-70 font-semibold flex items-center gap-1">
                                                    <Clock className="w-3 h-3 shrink-0" />
                                                    {fmt(ev.startHour, ev.startMin)} – {fmt(ev.endHour, ev.endMin)}
                                                </p>
                                            </div>
                                            <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-full shrink-0 ${TYPE_STYLE[ev.type].badgeBg}`}>
                                                {TYPE_STYLE[ev.type].badge}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

// ── Event Detail Modal ────────────────────────────────────────────────────────
const EventModal: React.FC<{
    event: ScheduleEvent;
    onClose: () => void;
    onNavigateRoom: () => void;
}> = ({ event, onClose, onNavigateRoom }) => {
    const style = TYPE_STYLE[event.type];

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="extreme-glass rounded-[2rem] w-full max-w-md shadow-2xl shadow-[#1E2B58]/20 overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                {/* Color header strip */}
                <div className={`${style.bg} px-6 pt-6 pb-5 flex items-start justify-between`}>
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center">
                            <span className="material-symbols-rounded text-white text-xl">{style.icon}</span>
                        </div>
                        <div>
                            <span className={`text-[9px] font-black uppercase tracking-widest ${style.badgeBg} px-2 py-0.5 rounded-full`}>
                                {style.badge}
                            </span>
                            <h3 className="text-white font-extrabold text-lg leading-tight mt-0.5">
                                {event.title}
                            </h3>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors shrink-0"
                    >
                        <X className="w-4 h-4 text-white" />
                    </button>
                </div>

                {/* Details */}
                <div className="p-6 space-y-3">
                    <div className="flex items-center gap-3 p-3 glass-card !rounded-xl">
                        <MapPin className="w-4 h-4 text-[#1E2B58]/50 dark:text-white/40 shrink-0" />
                        <div>
                            <p className="text-[9px] font-black uppercase tracking-widest text-[#1E2B58]/40 dark:text-white/40">Location</p>
                            <p className="text-sm font-bold text-[#1E2B58] dark:text-white">{event.location}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 glass-card !rounded-xl">
                        <Clock className="w-4 h-4 text-[#1E2B58]/50 dark:text-white/40 shrink-0" />
                        <div>
                            <p className="text-[9px] font-black uppercase tracking-widest text-[#1E2B58]/40 dark:text-white/40">Time</p>
                            <p className="text-sm font-bold text-[#1E2B58] dark:text-white">
                                {fmt(event.startHour, event.startMin)} – {fmt(event.endHour, event.endMin)}
                                <span className="ml-2 text-[#1E2B58]/40 dark:text-white/30 font-semibold text-xs">
                                    ({event.endHour - event.startHour}h)
                                </span>
                            </p>
                        </div>
                    </div>

                    {event.students !== undefined && (
                        <div className="flex items-center gap-3 p-3 glass-card !rounded-xl">
                            <Users className="w-4 h-4 text-[#1E2B58]/50 dark:text-white/40 shrink-0" />
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-widest text-[#1E2B58]/40 dark:text-white/40">
                                    {event.type === 'meeting' ? 'Attendees' : 'Students'}
                                </p>
                                <p className="text-sm font-bold text-[#1E2B58] dark:text-white">{event.students} people</p>
                            </div>
                        </div>
                    )}

                    {event.description && (
                        <div className="p-3 glass-card !rounded-xl">
                            <p className="text-[9px] font-black uppercase tracking-widest text-[#1E2B58]/40 dark:text-white/40 mb-1.5">Description</p>
                            <p className="text-sm text-[#1E2B58]/75 dark:text-white/65 font-medium leading-relaxed">
                                {event.description}
                            </p>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-1">
                        {event.type !== 'meeting' && (
                            <button
                                onClick={onNavigateRoom}
                                className="flex-1 py-3 rounded-2xl bg-[#1E2B58] text-white text-sm font-extrabold hover:bg-[#1E2B58]/90 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-[#1E2B58]/20"
                            >
                                View Room
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 rounded-2xl glass-card text-sm font-bold text-[#1E2B58]/70 dark:text-white/70 hover:opacity-80 transition-opacity"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────────────────────
export const AcademicCalendar: React.FC = () => {
    const navigate = useNavigate();

    const [viewMode,      setViewMode]      = useState<ViewMode>('month');
    const [viewDate,      setViewDate]      = useState<Date>(new Date(TODAY));
    const [filters,       setFilters]       = useState<Filters>({ myClasses: true, deptMeetings: true, labSessions: true });
    const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null);
    const [syncToast,     setSyncToast]     = useState(false);

    // ── Navigation ────────────────────────────────────────────────────────────
    const goToPrev = () => {
        const d = new Date(viewDate);
        if (viewMode === 'month') { d.setMonth(d.getMonth() - 1); d.setDate(1); }
        if (viewMode === 'week')  { d.setDate(d.getDate() - 7); }
        if (viewMode === 'day')   { d.setDate(d.getDate() - 1); }
        setViewDate(d);
    };

    const goToNext = () => {
        const d = new Date(viewDate);
        if (viewMode === 'month') { d.setMonth(d.getMonth() + 1); d.setDate(1); }
        if (viewMode === 'week')  { d.setDate(d.getDate() + 7); }
        if (viewMode === 'day')   { d.setDate(d.getDate() + 1); }
        setViewDate(d);
    };

    const goToToday   = () => setViewDate(new Date(TODAY));
    const handleDayClick = (date: Date) => { setViewDate(date); setViewMode('day'); };

    const handleSync = () => {
        setSyncToast(true);
        setTimeout(() => setSyncToast(false), 3000);
    };

    // ── Header text ───────────────────────────────────────────────────────────
    const headerLabel = () => {
        if (viewMode === 'month')
            return `${MONTH_NAMES[viewDate.getMonth()]} ${viewDate.getFullYear()}`;
        if (viewMode === 'week') {
            const mon = startOfWeek(viewDate);
            const sun = addDays(mon, 6);
            if (mon.getMonth() === sun.getMonth())
                return `${MONTH_NAMES[mon.getMonth()]} ${mon.getDate()}–${sun.getDate()}, ${mon.getFullYear()}`;
            return `${MONTH_NAMES[mon.getMonth()]} ${mon.getDate()} – ${MONTH_NAMES[sun.getMonth()]} ${sun.getDate()}, ${mon.getFullYear()}`;
        }
        const di = (viewDate.getDay() + 6) % 7;
        return `${DAY_SHORT[di]}, ${MONTH_NAMES[viewDate.getMonth()]} ${viewDate.getDate()}, ${viewDate.getFullYear()}`;
    };

    // ── Mini calendar days ────────────────────────────────────────────────────
    const miniDays = (() => {
        const y = viewDate.getFullYear(), m = viewDate.getMonth();
        const firstDay  = new Date(y, m, 1).getDay();
        const total     = new Date(y, m + 1, 0).getDate();
        const offset    = (firstDay - 1 + 7) % 7;  // Mon=0
        const cells: (number | null)[] = Array(offset).fill(null);
        for (let d = 1; d <= total; d++) cells.push(d);
        return cells;
    })();

    // ── Filter toggle ─────────────────────────────────────────────────────────
    const toggleFilter = (key: keyof Filters) =>
        setFilters(p => ({ ...p, [key]: !p[key] }));

    // ─────────────────────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen w-full flex flex-col bg-[#e0eafc] dark:bg-[#0f172a] text-slate-800 dark:text-slate-200 transition-colors duration-300">
            <LecturerNavbar />

            <main className="pt-32 md:pt-36 pb-10 px-4 sm:px-6 w-full max-w-[1400px] mx-auto flex-1 flex flex-col">

                {/* ── Header ── */}
                <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/lecturer/dashboard')}
                            className="w-10 h-10 flex items-center justify-center rounded-full glass-card hover:bg-white/60 transition-all text-[#1E2B58] dark:text-white shrink-0"
                            aria-label="Back"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-extrabold text-[#1E2B58] dark:text-white tracking-tight">
                                Academic Schedule
                            </h1>
                            <p className="text-[#1E2B58]/50 dark:text-white/40 font-semibold text-xs mt-0.5 uppercase tracking-widest">
                                {headerLabel()}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        {/* Prev / Today / Next */}
                        <div className="flex items-center gap-1">
                            <button
                                onClick={goToPrev}
                                className="w-9 h-9 flex items-center justify-center glass-card rounded-xl hover:bg-white/60 transition-all text-[#1E2B58] dark:text-white"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                                onClick={goToToday}
                                className="px-4 py-2 glass-card rounded-xl text-[10px] font-black uppercase tracking-widest text-[#1E2B58] dark:text-white hover:bg-white/60 transition-all"
                            >
                                Today
                            </button>
                            <button
                                onClick={goToNext}
                                className="w-9 h-9 flex items-center justify-center glass-card rounded-xl hover:bg-white/60 transition-all text-[#1E2B58] dark:text-white"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>

                        {/* View toggle */}
                        <div className="glass-card p-1 rounded-2xl flex items-center gap-1">
                            {(['day', 'week', 'month'] as ViewMode[]).map(mode => (
                                <button
                                    key={mode}
                                    onClick={() => setViewMode(mode)}
                                    className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-[#1E2B58] dark:text-white transition-all ${
                                        viewMode === mode ? 'active-pill-premium' : 'hover:bg-white/30'
                                    }`}
                                >
                                    {mode}
                                </button>
                            ))}
                        </div>
                    </div>
                </header>

                {/* ── Body ── */}
                <div className="flex flex-col lg:flex-row gap-5 items-start flex-1">

                    {/* ── Sidebar ── */}
                    <aside className="w-full lg:w-60 space-y-4 flex-shrink-0">

                        {/* Mini calendar + Filters */}
                        <div className="glass-card rounded-[2rem] p-5">

                            {/* Mini calendar nav */}
                            <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-[#1E2B58] dark:text-white mb-3">
                                Quick Calendar
                            </h4>
                            <div className="flex items-center justify-between mb-2">
                                <button
                                    onClick={() => { const d = new Date(viewDate); d.setMonth(d.getMonth() - 1); d.setDate(1); setViewDate(d); }}
                                    className="p-1 rounded-lg hover:bg-white/50 transition-all"
                                >
                                    <ChevronLeft className="w-3 h-3 text-[#1E2B58]/50 dark:text-white/40" />
                                </button>
                                <span className="text-[10px] font-black text-[#1E2B58] dark:text-white">
                                    {MONTH_NAMES[viewDate.getMonth()].slice(0, 3)} {viewDate.getFullYear()}
                                </span>
                                <button
                                    onClick={() => { const d = new Date(viewDate); d.setMonth(d.getMonth() + 1); d.setDate(1); setViewDate(d); }}
                                    className="p-1 rounded-lg hover:bg-white/50 transition-all"
                                >
                                    <ChevronRight className="w-3 h-3 text-[#1E2B58]/50 dark:text-white/40" />
                                </button>
                            </div>

                            {/* Mini day headers */}
                            <div className="grid grid-cols-7 gap-0.5 text-center mb-0.5">
                                {DAY_MINI.map((h, i) => (
                                    <span key={i} className="text-[8px] font-bold text-slate-400">{h}</span>
                                ))}
                            </div>

                            {/* Mini day cells */}
                            <div className="grid grid-cols-7 gap-0.5 text-center">
                                {miniDays.map((day, i) => {
                                    if (day === null) return <div key={i} />;
                                    const cellDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
                                    const isToday    = isSameDay(cellDate, TODAY);
                                    const isSelected = isSameDay(cellDate, viewDate);
                                    const hasEvent   = getEventsForDate(cellDate, filters).length > 0;

                                    return (
                                        <button
                                            key={i}
                                            onClick={() => handleDayClick(cellDate)}
                                            title={`View ${MONTH_NAMES[cellDate.getMonth()]} ${day}`}
                                            className={`relative text-[10px] font-bold p-1 rounded-lg transition-all hover:scale-110 ${
                                                isToday    ? 'bg-[#1E2B58] text-white' :
                                                isSelected ? 'bg-[#1E2B58]/15 text-[#1E2B58] dark:text-white' :
                                                             'text-slate-600 dark:text-slate-400 hover:bg-white/50'
                                            }`}
                                        >
                                            {day}
                                            {hasEvent && !isToday && (
                                                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#1E2B58]/40 dark:bg-white/40" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            <hr className="border-white/30 dark:border-white/10 my-4" />

                            {/* Filters */}
                            <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-[#1E2B58] dark:text-white mb-3">
                                Schedule Filters
                            </h4>
                            <div className="space-y-2.5">
                                {([
                                    { key: 'myClasses',    label: 'My Classes',    color: 'bg-[#1E2B58]'    },
                                    { key: 'deptMeetings', label: 'Dept. Meetings', color: 'bg-slate-500'   },
                                    { key: 'labSessions',  label: 'Lab Sessions',  color: 'bg-emerald-600'  },
                                ] as const).map(({ key, label, color }) => (
                                    <label key={key} className="flex items-center gap-2.5 cursor-pointer group">
                                        <div
                                            onClick={() => toggleFilter(key)}
                                            className={`w-4 h-4 rounded-md flex items-center justify-center transition-all border-2 shrink-0 ${
                                                filters[key]
                                                    ? `${color} border-transparent`
                                                    : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                                            }`}
                                        >
                                            {filters[key] && (
                                                <span className="text-white" style={{ fontSize: 9 }}>✓</span>
                                            )}
                                        </div>
                                        <span className={`w-2 h-2 rounded-full shrink-0 ${color}`} />
                                        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 group-hover:text-[#1E2B58] dark:group-hover:text-white transition-colors">
                                            {label}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Export Options */}
                        <div className="glass-card rounded-[2rem] p-5">
                            <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-[#1E2B58] dark:text-white mb-3">
                                Export Options
                            </h4>
                            <button
                                onClick={handleSync}
                                className="w-full py-3 rounded-xl border border-[#1E2B58]/20 dark:border-white/15 text-[10px] font-bold uppercase tracking-widest text-[#1E2B58] dark:text-white hover:bg-white/40 dark:hover:bg-white/10 transition-all flex items-center justify-center gap-2 active:scale-95"
                            >
                                <Download className="w-3.5 h-3.5" />
                                Sync to iCal / GCal
                            </button>
                        </div>

                        {/* Legend */}
                        <div className="glass-card rounded-[2rem] p-5">
                            <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-[#1E2B58] dark:text-white mb-3">
                                Legend
                            </h4>
                            <div className="space-y-2">
                                {[
                                    { color: 'bg-[#1E2B58]',   label: 'Class'       },
                                    { color: 'bg-slate-500',   label: 'Meeting'     },
                                    { color: 'bg-emerald-600', label: 'Lab Session' },
                                ].map(({ color, label }) => (
                                    <div key={label} className="flex items-center gap-2">
                                        <div className={`w-3 h-3 rounded-sm ${color}`} />
                                        <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">{label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* ── Main calendar view ── */}
                    <div className="flex-1 min-w-0">
                        {viewMode === 'month' && (
                            <MonthView
                                viewDate={viewDate}
                                filters={filters}
                                onDayClick={handleDayClick}
                                onEventClick={setSelectedEvent}
                            />
                        )}
                        {viewMode === 'week' && (
                            <WeekView
                                viewDate={viewDate}
                                filters={filters}
                                onDayClick={handleDayClick}
                                onEventClick={setSelectedEvent}
                            />
                        )}
                        {viewMode === 'day' && (
                            <DayView
                                date={viewDate}
                                filters={filters}
                                onEventClick={setSelectedEvent}
                            />
                        )}
                    </div>
                </div>
            </main>

            {/* ── Event Detail Modal ── */}
            {selectedEvent && (
                <EventModal
                    event={selectedEvent}
                    onClose={() => setSelectedEvent(null)}
                    onNavigateRoom={() => { setSelectedEvent(null); navigate('/lecturer/room-status'); }}
                />
            )}

            {/* ── Sync Toast ── */}
            {syncToast && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 glass-card rounded-2xl px-5 py-3.5 flex items-center gap-3 shadow-2xl shadow-[#1E2B58]/15" style={{ animation: 'fadeInDown 0.3s ease' }}>
                    <Download className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="text-sm font-bold text-[#1E2B58] dark:text-white whitespace-nowrap">
                        Schedule exported! Opening in calendar app…
                    </span>
                    <button onClick={() => setSyncToast(false)} className="ml-1 text-[#1E2B58]/40 hover:text-[#1E2B58] dark:text-white/40 dark:hover:text-white transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default AcademicCalendar;
