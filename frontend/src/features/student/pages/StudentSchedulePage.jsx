import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, MapPin, User, Laptop, BookOpen, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { scheduleService } from '@/services/scheduleService';
import { toVNDateStr } from '@/utils/dateUtils';
import CustomDropdown from '@/features/shared/components/CustomDropdown';

// ─── Constants ────────────────────────────────────────────────────────────────

const TODAY = new Date();

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];
const DAY_SHORT = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const HOURS = Array.from({ length: 14 }, (_, i) => i + 7); // 07–20

const FIXED_SLOTS = [
  { order: 1, name: 'Slot 1', startH: 7,  startM: 0,  endH: 9,  endM: 15 },
  { order: 2, name: 'Slot 2', startH: 9,  startM: 30, endH: 11, endM: 45 },
  { order: 3, name: 'Slot 3', startH: 12, startM: 30, endH: 14, endM: 45 },
  { order: 4, name: 'Slot 4', startH: 15, startM: 0,  endH: 17, endM: 15 },
];

const STATUS_CONFIG = {
  not_yet:   { label: 'Upcoming',  dot: 'bg-slate-400',   badge: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400' },
  ongoing:   { label: 'Ongoing',   dot: 'bg-emerald-500', badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
  completed: { label: 'Completed', dot: 'bg-blue-400',    badge: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
};

const TYPE_STYLE = {
  class: { bg: 'bg-[#1E2B58]', badge: 'CLASS', badgeBg: 'bg-blue-100 text-blue-700', icon: 'school' },
  lab:   { bg: 'bg-emerald-600', badge: 'LAB', badgeBg: 'bg-emerald-100 text-emerald-700', icon: 'science' },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate();
}
function addDays(date, n) {
  const d = new Date(date); d.setDate(d.getDate() + n); return d;
}
function startOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - (day === 0 ? 6 : day - 1));
  d.setHours(0, 0, 0, 0);
  return d;
}
function fmt(h, m) {
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
}

/** API titles are often "CODE - Course name"; filters show CODE only. */
function courseCodeFromTitle(title) {
  const t = String(title ?? '').trim();
  if (!t) return t;
  const head = t.split(' - ')[0].trim();
  return head || t;
}
function getEventsForDate(events, date) {
  return events.filter(e => e.year === date.getFullYear() && e.month === date.getMonth() && e.day === date.getDate());
}
function getVNMinutes() {
  const vnNow = new Date(Date.now() + 7 * 60 * 60 * 1000);
  return vnNow.getUTCHours() * 60 + vnNow.getUTCMinutes();
}
function getActiveSlotOrder() {
  const cur = getVNMinutes();
  const s = FIXED_SLOTS.find(sl => cur >= sl.startH * 60 + sl.startM && cur <= sl.endH * 60 + sl.endM);
  return s ? s.order : null;
}
function eventMatchesSlot(ev, slot) {
  const evStart = ev.startHour * 60 + ev.startMin;
  return evStart >= slot.startH * 60 + slot.startM && evStart < slot.endH * 60 + slot.endM;
}

/** Derive visual status from time, not just backend status */
function deriveStatus(ev, slot, isToday) {
  if (ev.backendStatus === 'completed') return 'completed';
  if (isToday) {
    const cur = getVNMinutes();
    const slotEnd = slot.endH * 60 + slot.endM;
    const slotStart = slot.startH * 60 + slot.startM;
    if (cur > slotEnd)   return 'completed';
    if (cur >= slotStart) return 'ongoing';
  }
  const evDate = new Date(ev.year, ev.month, ev.day);
  const midnight = new Date(); midnight.setHours(0,0,0,0);
  if (evDate < midnight) return 'completed';
  return 'not_yet';
}

// ─── Map backend → internal event ────────────────────────────────────────────

function mapSchedule(s) {
  const slot = s.slotId || {};
  const [sh = 7, sm = 0] = (slot.startTime || '07:00').split(':').map(Number);
  const [eh = 9, em = 15] = (slot.endTime || '09:15').split(':').map(Number);
  const d = new Date(s.date || s.startAt);
  return {
    id: s._id,
    title: s.title || 'Unknown Course',
    location: s.roomId?.name || '—',
    roomId: s.roomId?._id || null,
    lecturer: s.lecturerId?.displayName || s.lecturerId?.username || '—',
    type: s.roomId?.type === 'lab' ? 'lab' : 'class',
    year: d.getFullYear(),
    month: d.getMonth(),
    day: d.getDate(),
    startHour: sh,
    startMin: sm,
    endHour: eh,
    endMin: em,
    slotName: slot.name || '',
    slotOrder: slot.order || null,
    backendStatus: s.status,
  };
}

// ─── Month View ───────────────────────────────────────────────────────────────

const MonthView = ({ viewDate, events, onDayClick, onEventClick }) => {
  const y = viewDate.getFullYear(), m = viewDate.getMonth();
  const firstDay = new Date(y, m, 1).getDay();
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const startOffset = firstDay === 0 ? 6 : firstDay - 1;

  const cells = [];
  for (let i = startOffset - 1; i >= 0; i--) cells.push(new Date(y, m, -i));
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(y, m, d));
  while (cells.length % 7 !== 0) cells.push(new Date(y, m + 1, cells.length - daysInMonth - startOffset + 1));
  const numRows = cells.length / 7;

  return (
    <div className="glass-card rounded-[2rem] overflow-hidden p-4 md:p-6">
      <div className="grid grid-cols-7 pb-3 mb-2 border-b border-[#1E2B58]/10 dark:border-white/10">
        {DAY_SHORT.map(d => (
          <div key={d} className={`text-center text-[9px] md:text-[10px] font-black uppercase tracking-widest ${
            d === 'Sat' || d === 'Sun' ? 'text-[#1E2B58]/30 dark:text-white/20' : 'text-slate-400'
          }`}>{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7" style={{ gridTemplateRows: `repeat(${numRows}, minmax(80px, 1fr))` }}>
        {cells.map((date, idx) => {
          const isCurMonth = date.getMonth() === m;
          const isToday = isSameDay(date, TODAY);
          const isWeekend = date.getDay() === 0 || date.getDay() === 6;
          const dayEvents = getEventsForDate(events, date);
          return (
            <div
              key={idx}
              onClick={() => onDayClick(date)}
              className={`p-1.5 border border-[#1E2B58]/5 dark:border-white/5 flex flex-col gap-1 cursor-pointer transition-all hover:bg-white/40 dark:hover:bg-white/5 group ${
                isWeekend ? 'bg-white/10 dark:bg-white/[0.02]' : ''
              } ${isToday ? 'ring-2 ring-inset ring-[#1E2B58]/25 bg-white/50 dark:bg-white/10' : ''}`}
            >
              <span className={`text-[10px] md:text-xs font-black w-6 h-6 flex items-center justify-center rounded-full transition-all group-hover:scale-110 ${
                isToday ? 'bg-[#1E2B58] text-white' : isCurMonth ? 'text-[#1E2B58] dark:text-white' : 'text-slate-300 dark:text-slate-700'
              }`}>
                {date.getDate()}
              </span>
              {dayEvents.slice(0, 2).map((ev, i) => (
                <button
                  key={i}
                  onClick={e => { e.stopPropagation(); onEventClick(ev, null); }}
                  className={`w-full text-left px-1.5 py-1 rounded-lg text-[8px] md:text-[9px] font-bold leading-tight text-white hover:opacity-90 transition-opacity truncate ${TYPE_STYLE[ev.type]?.bg || 'bg-[#1E2B58]'}`}
                >
                  {courseCodeFromTitle(ev.title)}
                </button>
              ))}
              {dayEvents.length > 2 && (
                <span className="text-[8px] font-bold text-[#1E2B58]/40 dark:text-white/30 pl-1">+{dayEvents.length - 2} more</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── Week View ────────────────────────────────────────────────────────────────

const WeekView = ({ viewDate, events, onDayClick, onEventClick }) => {
  const mon = startOfWeek(viewDate);
  const days = Array.from({ length: 7 }, (_, i) => addDays(mon, i));
  return (
    <div className="glass-card rounded-[2rem] overflow-hidden p-4 md:p-6">
      <div className="grid grid-cols-[56px_repeat(7,1fr)] border-b border-[#1E2B58]/10 dark:border-white/10 pb-3 mb-2">
        <div />
        {days.map((date, i) => {
          const isToday = isSameDay(date, TODAY);
          return (
            <button key={i} onClick={() => onDayClick(date)} className="text-center transition-all hover:opacity-70 group">
              <div className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">{DAY_SHORT[i]}</div>
              <div className={`text-base md:text-xl font-black mx-auto mt-1 w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-full transition-all group-hover:scale-110 ${
                isToday ? 'bg-[#1E2B58] text-white' : 'text-[#1E2B58] dark:text-white'
              }`}>
                {date.getDate()}
              </div>
            </button>
          );
        })}
      </div>
      <div className="overflow-y-auto max-h-[520px] md:max-h-[580px] hide-scrollbar">
        {HOURS.map(hour => {
          const rowEvents = days.map(date => getEventsForDate(events, date).filter(e => e.startHour === hour));
          const hasAny = rowEvents.some(e => e.length > 0);
          return (
            <div key={hour} className={`grid grid-cols-[56px_repeat(7,1fr)] border-b border-[#1E2B58]/5 dark:border-white/5 ${hasAny ? 'min-h-[64px]' : 'min-h-[40px]'}`}>
              <div className="text-[9px] font-bold text-slate-400 dark:text-slate-600 pt-1.5 text-right pr-2 shrink-0">{String(hour).padStart(2,'0')}:00</div>
              {rowEvents.map((evs, dayIdx) => (
                <div key={dayIdx} className="border-l border-[#1E2B58]/5 dark:border-white/5 p-1 flex flex-col gap-1">
                  {evs.map((ev, eIdx) => (
                    <button
                      key={eIdx}
                      onClick={() => onEventClick(ev, null)}
                      className={`w-full text-left p-1 rounded-lg text-[8px] font-bold leading-tight text-white hover:opacity-90 transition-opacity ${TYPE_STYLE[ev.type]?.bg || 'bg-[#1E2B58]'}`}
                    >
                      {courseCodeFromTitle(ev.title)}<br />
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

// ─── Day View ─────────────────────────────────────────────────────────────────

const DayView = ({ date, events, onEventClick }) => {
  const dayEvents = getEventsForDate(events, date);
  const isToday = isSameDay(date, TODAY);
  const dayIdx = (date.getDay() + 6) % 7;
  return (
    <div className="glass-card rounded-[2rem] overflow-hidden p-4 md:p-6">
      <div className="flex items-center gap-4 mb-6 pb-4 border-b border-[#1E2B58]/10 dark:border-white/10">
        <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center shrink-0 ${isToday ? 'bg-[#1E2B58]' : 'glass-card'}`}>
          <span className={`text-[9px] font-black uppercase tracking-widest ${isToday ? 'text-white/70' : 'text-slate-400'}`}>{DAY_SHORT[dayIdx]}</span>
          <span className={`text-2xl font-black leading-none ${isToday ? 'text-white' : 'text-[#1E2B58] dark:text-white'}`}>{date.getDate()}</span>
        </div>
        <div>
          {isToday && (
            <span className="inline-flex items-center gap-1 text-[10px] font-black text-blue-600 dark:text-blue-400 mb-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />Today
            </span>
          )}
          <p className="text-lg font-extrabold text-[#1E2B58] dark:text-white">
            {dayEvents.length === 0 ? 'No classes scheduled' : `${dayEvents.length} class${dayEvents.length > 1 ? 'es' : ''} scheduled`}
          </p>
          <p className="text-sm text-[#1E2B58]/50 dark:text-white/40 font-semibold">
            {MONTH_NAMES[date.getMonth()]} {date.getDate()}, {date.getFullYear()}
          </p>
        </div>
      </div>
      {dayEvents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <BookOpen className="w-12 h-12 text-[#1E2B58]/15 dark:text-white/15" />
          <p className="text-sm font-bold text-[#1E2B58]/40 dark:text-white/30">No classes on this day</p>
        </div>
      ) : (
        <div className="overflow-y-auto max-h-[540px] hide-scrollbar">
          {HOURS.map(hour => {
            const hourEvents = dayEvents.filter(e => e.startHour === hour);
            return (
              <div key={hour} className={`flex gap-4 border-b border-[#1E2B58]/5 dark:border-white/5 ${hourEvents.length > 0 ? 'py-3' : 'py-2'}`}>
                <div className="w-12 text-right shrink-0 pt-0.5">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-600">{String(hour).padStart(2,'0')}:00</span>
                </div>
                <div className="flex-1 flex flex-col gap-2">
                  {hourEvents.map((ev, i) => (
                    <button
                      key={i}
                      onClick={() => onEventClick(ev, null)}
                      className={`w-full text-left p-4 rounded-2xl flex items-start gap-3 text-white hover:opacity-90 transition-all hover:scale-[1.01] ${TYPE_STYLE[ev.type]?.bg || 'bg-[#1E2B58]'}`}
                    >
                      <span className="material-symbols-rounded text-xl mt-0.5 opacity-90">{TYPE_STYLE[ev.type]?.icon || 'school'}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-extrabold text-sm">{courseCodeFromTitle(ev.title)}</p>
                        <p className="text-[11px] opacity-80 font-semibold flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 shrink-0" />{ev.location}
                        </p>
                        <p className="text-[11px] opacity-70 font-semibold flex items-center gap-1">
                          <Clock className="w-3 h-3 shrink-0" />{fmt(ev.startHour, ev.startMin)} – {fmt(ev.endHour, ev.endMin)}
                        </p>
                      </div>
                      <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-full shrink-0 ${TYPE_STYLE[ev.type]?.badgeBg || 'bg-blue-100 text-blue-700'}`}>
                        {TYPE_STYLE[ev.type]?.badge || 'CLASS'}
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

// ─── Slot Grid View ───────────────────────────────────────────────────────────

const SlotGridView = ({ viewDate, events, onEventClick }) => {
  const mon = startOfWeek(viewDate);
  const days = Array.from({ length: 7 }, (_, i) => addDays(mon, i));
  const activeSlotOrder = getActiveSlotOrder();
  const isThisWeek = days.some(d => isSameDay(d, TODAY));

  return (
    <div className="glass-card rounded-[2rem] overflow-hidden p-4 md:p-6">
      <div className="grid grid-cols-[88px_repeat(7,1fr)] border-b border-[#1E2B58]/10 dark:border-white/10 pb-3 mb-2">
        <div className="text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-end pb-1">Slot</div>
        {days.map((date, i) => {
          const isToday = isSameDay(date, TODAY);
          const isWeekend = i >= 5;
          return (
            <div key={i} className="text-center">
              <div className={`text-[9px] font-black uppercase tracking-widest ${isWeekend ? 'text-[#1E2B58]/30 dark:text-white/20' : 'text-slate-400'}`}>{DAY_SHORT[i]}</div>
              <div className={`text-sm md:text-base font-black mx-auto mt-0.5 w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded-full transition-all ${
                isToday ? 'bg-[#1E2B58] text-white' : isWeekend ? 'text-[#1E2B58]/35 dark:text-white/25' : 'text-[#1E2B58] dark:text-white'
              }`}>
                {date.getDate()}
              </div>
            </div>
          );
        })}
      </div>

      {FIXED_SLOTS.map(slot => {
        const isActive = isThisWeek && activeSlotOrder === slot.order;
        return (
          <div
            key={slot.order}
            className={`grid grid-cols-[88px_repeat(7,1fr)] border-b border-[#1E2B58]/5 dark:border-white/5 last:border-b-0 min-h-[96px] ${
              isActive ? 'bg-blue-50/60 dark:bg-blue-900/10 rounded-xl' : ''
            }`}
          >
            <div className="p-2 md:p-3 flex flex-col justify-center gap-0.5 shrink-0 border-r border-[#1E2B58]/5 dark:border-white/5">
              <div className="flex items-center gap-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-[#1E2B58] dark:text-white">{slot.name}</p>
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />}
              </div>
              <p className="text-[9px] text-slate-400 dark:text-slate-500 font-semibold leading-snug">
                {fmt(slot.startH, slot.startM)}<span className="mx-0.5">–</span>{fmt(slot.endH, slot.endM)}
              </p>
            </div>

            {days.map((date, dayIdx) => {
              const isToday = isSameDay(date, TODAY);
              const isWeekend = dayIdx >= 5;
              const cellEvents = getEventsForDate(events, date).filter(ev => eventMatchesSlot(ev, slot));
              return (
                <div
                  key={dayIdx}
                  className={`border-l border-[#1E2B58]/5 dark:border-white/5 p-1 flex flex-col justify-center gap-1 ${
                    isToday && isActive ? 'bg-emerald-50/40 dark:bg-emerald-900/10' : ''
                  } ${isWeekend ? 'bg-[#1E2B58]/[0.02] dark:bg-white/[0.015]' : ''}`}
                >
                  {cellEvents.map((ev, eIdx) => {
                    const evDate = new Date(ev.year, ev.month, ev.day);
                    const evIsToday = isSameDay(evDate, TODAY);
                    const status = deriveStatus(ev, slot, evIsToday);
                    const sc = STATUS_CONFIG[status] || STATUS_CONFIG.not_yet;
                    const isOngoing = status === 'ongoing';
                    const isDone = status === 'completed';
                    return (
                      <button
                        key={eIdx}
                        onClick={() => onEventClick(ev, slot)}
                        className={`w-full text-left p-2 rounded-xl text-white transition-all hover:opacity-90 hover:scale-[1.02] active:scale-95 overflow-hidden flex flex-col justify-between ${TYPE_STYLE[ev.type]?.bg || 'bg-[#1E2B58]'} ${
                          isOngoing ? 'ring-2 ring-emerald-400 ring-offset-1' : ''
                        } ${isDone ? 'opacity-55' : ''}`}
                      >
                        <div className="min-w-0">
                          <div className="text-[9px] md:text-[10px] font-extrabold truncate leading-tight">{courseCodeFromTitle(ev.title)}</div>
                          <div className="text-[8px] md:text-[9px] opacity-80 truncate mt-0.5 flex items-center gap-0.5">
                            <MapPin className="w-2.5 h-2.5 shrink-0" /><span className="truncate">{ev.location}</span>
                          </div>
                          <div className="text-[8px] md:text-[9px] opacity-70 truncate flex items-center gap-0.5">
                            <User className="w-2.5 h-2.5 shrink-0" /><span className="truncate">{ev.lecturer}</span>
                          </div>
                        </div>
                        <div className={`mt-1 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[7px] md:text-[8px] font-black uppercase tracking-wider w-fit ${sc.badge}`}>
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
  );
};

// ─── Event Detail Modal ───────────────────────────────────────────────────────

const EventModal = ({ event, slot, onClose, onBorrow }) => {
  const style = TYPE_STYLE[event.type] || TYPE_STYLE.class;
  const rawDiff = (event.endHour * 60 + event.endMin) - (event.startHour * 60 + event.startMin);
  const durationLabel = `${Math.floor(rawDiff / 60)}h${rawDiff % 60 ? ` ${rawDiff % 60}m` : ''}`;

  const evDate = new Date(event.year, event.month, event.day);
  const dateLabel = evDate.toLocaleDateString('en-GB', { weekday: 'long', day: '2-digit', month: 'short', year: 'numeric' });

  // Derive status if we have a slot; otherwise just use backend status
  const slotForStatus = slot || FIXED_SLOTS.find(s => s.order === event.slotOrder) || FIXED_SLOTS[0];
  const status = deriveStatus(event, slotForStatus, isSameDay(evDate, TODAY));
  const sc = STATUS_CONFIG[status] || STATUS_CONFIG.not_yet;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 bg-black/30 backdrop-blur-sm" onClick={onClose}>
      <div
        className="glass-card rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Coloured header */}
        <div className={`${style.bg} px-6 pt-6 pb-5 flex items-start justify-between`}>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
              <span className="material-symbols-rounded text-white text-xl">{style.icon}</span>
            </div>
            <div className="min-w-0">
              <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${sc.badge}`}>
                {status === 'ongoing' && <span className={`w-1.5 h-1.5 rounded-full ${sc.dot} animate-pulse`} />}
                {sc.label}
              </span>
              <h3 className="text-white font-extrabold text-lg leading-tight mt-0.5 truncate">{courseCodeFromTitle(event.title)}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors shrink-0 ml-2"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Details */}
        <div className="p-6 space-y-3">
          {/* Date */}
          <div className="flex items-center gap-3 p-3 glass-card !rounded-xl">
            <span className="material-symbols-rounded text-base text-[#1E2B58]/50 dark:text-white/40 shrink-0">calendar_month</span>
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-[#1E2B58]/40 dark:text-white/40">Date</p>
              <p className="text-sm font-bold text-[#1E2B58] dark:text-white">{dateLabel}</p>
            </div>
          </div>

          {/* Time */}
          <div className="flex items-center gap-3 p-3 glass-card !rounded-xl">
            <Clock className="w-4 h-4 text-[#1E2B58]/50 dark:text-white/40 shrink-0" />
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-[#1E2B58]/40 dark:text-white/40">
                {event.slotName || (slot ? slot.name : 'Time')}
              </p>
              <p className="text-sm font-bold text-[#1E2B58] dark:text-white">
                {fmt(event.startHour, event.startMin)} – {fmt(event.endHour, event.endMin)}
                <span className="ml-2 text-[#1E2B58]/40 dark:text-white/30 font-semibold text-xs">({durationLabel})</span>
              </p>
            </div>
          </div>

          {/* Room */}
          <div className="flex items-center gap-3 p-3 glass-card !rounded-xl">
            <MapPin className="w-4 h-4 text-[#1E2B58]/50 dark:text-white/40 shrink-0" />
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-[#1E2B58]/40 dark:text-white/40">Room</p>
              <p className="text-sm font-bold text-[#1E2B58] dark:text-white">{event.location}</p>
            </div>
          </div>

          {/* Lecturer */}
          <div className="flex items-center gap-3 p-3 glass-card !rounded-xl">
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

// ─── Main Page ────────────────────────────────────────────────────────────────

const StudentSchedulePage = () => {
  const navigate = useNavigate();

  const [viewMode,       setViewMode]       = useState('slot');
  const [viewDate,       setViewDate]       = useState(new Date(TODAY));
  const [selectedEvent,  setSelectedEvent]  = useState(null);
  const [selectedSlot,   setSelectedSlot]   = useState(null);
  const [rawSchedules,   setRawSchedules]   = useState([]);
  const [loading,        setLoading]        = useState(false);
  const [filterCourse,   setFilterCourse]   = useState('all');
  const [filterRoom,     setFilterRoom]     = useState('all');

  const events = useMemo(() => rawSchedules.map(mapSchedule), [rawSchedules]);

  // ── Filter options ───────────────────────────────────────────────────────
  const courseOptions = useMemo(() => [...new Set(events.map(e => e.title))].sort(), [events]);
  const roomOptions   = useMemo(() => [...new Set(events.map(e => e.location).filter(r => r !== '—'))].sort(), [events]);

  const filteredEvents = useMemo(() => events.filter(e => {
    if (filterCourse !== 'all' && e.title !== filterCourse) return false;
    if (filterRoom   !== 'all' && e.location !== filterRoom) return false;
    return true;
  }), [events, filterCourse, filterRoom]);

  const courseFilterOptions = useMemo(() => [
    { value: 'all', label: 'All courses' },
    ...courseOptions.map(c => ({ value: c, label: courseCodeFromTitle(c) })),
  ], [courseOptions]);

  const roomFilterOptions = useMemo(() => [
    { value: 'all', label: 'All rooms' },
    ...roomOptions.map(r => ({ value: r, label: r })),
  ], [roomOptions]);

  const scheduleFilterTriggerClass =
    'flex items-center gap-2 bg-transparent text-xs font-bold text-[#1E2B58] dark:text-white px-3 py-2 min-h-[2.25rem] cursor-pointer hover:opacity-70 transition-opacity select-none w-full max-w-full min-w-0';

  // ── Fetch ────────────────────────────────────────────────────────────────
  const fetchParams = useMemo(() => {
    const y = viewDate.getFullYear();
    const m = viewDate.getMonth();
    if (viewMode === 'month') {
      return { startDate: toVNDateStr(new Date(y, m - 1, 25)), endDate: toVNDateStr(new Date(y, m + 1, 6)) };
    }
    if (viewMode === 'week' || viewMode === 'slot') {
      const mon = startOfWeek(viewDate);
      return { startDate: toVNDateStr(mon), endDate: toVNDateStr(addDays(mon, 6)) };
    }
    return { startDate: toVNDateStr(viewDate), endDate: toVNDateStr(viewDate) };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewMode, viewDate.getFullYear(), viewDate.getMonth(), viewDate.getDate()]);

  const loadSchedules = useCallback(async () => {
    setLoading(true);
    try {
      const data = await scheduleService.getMySchedules(fetchParams);
      setRawSchedules(Array.isArray(data) ? data : []);
    } catch {
      setRawSchedules([]);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(fetchParams)]);

  useEffect(() => { loadSchedules(); }, [loadSchedules]);

  // ── Navigation ────────────────────────────────────────────────────────────
  const goToPrev = () => {
    const d = new Date(viewDate);
    if (viewMode === 'month') { d.setMonth(d.getMonth() - 1); d.setDate(1); }
    else if (viewMode === 'week' || viewMode === 'slot') d.setDate(d.getDate() - 7);
    else d.setDate(d.getDate() - 1);
    setViewDate(d);
  };
  const goToNext = () => {
    const d = new Date(viewDate);
    if (viewMode === 'month') { d.setMonth(d.getMonth() + 1); d.setDate(1); }
    else if (viewMode === 'week' || viewMode === 'slot') d.setDate(d.getDate() + 7);
    else d.setDate(d.getDate() + 1);
    setViewDate(d);
  };
  const goToToday    = () => setViewDate(new Date(TODAY));
  const handleDayClick = (date) => { setViewDate(date); setViewMode('day'); };

  // ── Header label ──────────────────────────────────────────────────────────
  const headerLabel = () => {
    if (viewMode === 'month')
      return `${MONTH_NAMES[viewDate.getMonth()]} ${viewDate.getFullYear()}`;
    if (viewMode === 'week' || viewMode === 'slot') {
      const mon = startOfWeek(viewDate);
      const sun = addDays(mon, 6);
      if (mon.getMonth() === sun.getMonth())
        return `${MONTH_NAMES[mon.getMonth()]} ${mon.getDate()}–${sun.getDate()}, ${mon.getFullYear()}`;
      return `${MONTH_NAMES[mon.getMonth()]} ${mon.getDate()} – ${MONTH_NAMES[sun.getMonth()]} ${sun.getDate()}, ${mon.getFullYear()}`;
    }
    const di = (viewDate.getDay() + 6) % 7;
    return `${DAY_SHORT[di]}, ${MONTH_NAMES[viewDate.getMonth()]} ${viewDate.getDate()}, ${viewDate.getFullYear()}`;
  };

  // ── Week stats ─────────────────────────────────────────────────────────────
  const weekStats = useMemo(() => {
    const total = events.length;
    const completed = events.filter(e => {
      const evDate = new Date(e.year, e.month, e.day);
      const midnight = new Date(); midnight.setHours(0,0,0,0);
      return e.backendStatus === 'completed' || evDate < midnight;
    }).length;
    return { total, completed, upcoming: total - completed };
  }, [events]);

  // ── Mini calendar ──────────────────────────────────────────────────────────
  const miniDays = useMemo(() => {
    const y = viewDate.getFullYear(), m = viewDate.getMonth();
    const firstDay = new Date(y, m, 1).getDay();
    const total = new Date(y, m + 1, 0).getDate();
    const offset = (firstDay - 1 + 7) % 7;
    const cells = Array(offset).fill(null);
    for (let d = 1; d <= total; d++) cells.push(d);
    return cells;
  }, [viewDate.getFullYear(), viewDate.getMonth()]);

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="w-full">
      <main className="pt-6 sm:pt-8 pb-10 px-4 sm:px-6 w-full max-w-[90vw] xl:max-w-7xl mx-auto flex-1 flex flex-col">

        {/* ── Header ── */}
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#1E2B58] dark:text-white tracking-tight">Schedule</h1>
            <p className="text-[#1E2B58]/50 dark:text-white/40 font-semibold text-xs mt-0.5 uppercase tracking-widest">
              {headerLabel()}
            </p>
          </div>

          {/* Controls — same pattern as admin EquipmentManagement (dashboard-card + CustomDropdown) */}
          <div className="dashboard-card rounded-3xl flex flex-wrap items-center p-1 gap-y-1 w-full md:w-auto md:max-w-full">
            {courseOptions.length > 1 && (
              <>
                <CustomDropdown
                  value={filterCourse}
                  options={courseFilterOptions}
                  onChange={setFilterCourse}
                  align="left"
                  fullWidth
                  className="min-w-0 flex-1 basis-[11rem] sm:basis-auto sm:max-w-[min(100%,20rem)]"
                  triggerClassName={scheduleFilterTriggerClass}
                />
                <div className="h-5 w-px bg-[#1E2B58]/10 dark:bg-white/10 mx-0.5 sm:mx-1 shrink-0" />
              </>
            )}
            {roomOptions.length > 1 && (
              <>
                <CustomDropdown
                  value={filterRoom}
                  options={roomFilterOptions}
                  onChange={setFilterRoom}
                  align="left"
                  fullWidth
                  className="min-w-0 flex-1 basis-[8rem] sm:basis-auto sm:max-w-[12rem]"
                  triggerClassName={scheduleFilterTriggerClass}
                />
                <div className="h-5 w-px bg-[#1E2B58]/10 dark:bg-white/10 mx-0.5 sm:mx-1 shrink-0" />
              </>
            )}

            <div className="flex items-center gap-1 px-0.5">
              <button
                type="button"
                onClick={goToPrev}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-transparent hover:bg-[#1E2B58]/[0.06] dark:hover:bg-white/10 transition-all text-[#1E2B58] dark:text-white"
                aria-label="Previous period"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={goToToday}
                className="px-3 h-8 rounded-full bg-transparent text-[10px] font-black uppercase tracking-widest text-[#1E2B58] dark:text-white hover:bg-[#1E2B58]/[0.06] dark:hover:bg-white/10 transition-all"
              >
                Today
              </button>
              <button
                type="button"
                onClick={goToNext}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-transparent hover:bg-[#1E2B58]/[0.06] dark:hover:bg-white/10 transition-all text-[#1E2B58] dark:text-white"
                aria-label="Next period"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="h-5 w-px bg-[#1E2B58]/10 dark:bg-white/10 mx-0.5 sm:mx-1 shrink-0 hidden sm:block" />

            <div className="flex rounded-full p-0.5 gap-0.5 bg-[#1E2B58]/[0.04] dark:bg-white/[0.06]">
              {[
                { key: 'month', label: 'Month' },
                { key: 'slot',  label: 'Slots'  },
                { key: 'week',  label: 'Week'   },
                { key: 'day',   label: 'Day'    },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setViewMode(key)}
                  className={`px-2.5 sm:px-3 h-7 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all ${
                    viewMode === key
                      ? 'bg-[#1E2B58] text-white shadow-sm'
                      : 'text-[#1E2B58]/50 dark:text-white/50 hover:text-[#1E2B58] dark:hover:text-white'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* ── Loading ── */}
        {loading && (
          <div className="flex items-center gap-2 mb-4 text-xs text-slate-400">
            <span className="material-symbols-rounded animate-spin text-sm">refresh</span>
            Loading schedule…
          </div>
        )}

        {/* ── Layout: calendar + sidebar ── */}
        <div className="flex flex-col xl:flex-row gap-6 flex-1">

          {/* Main calendar */}
          <div className="flex-1 min-w-0">
            {viewMode === 'month' && (
              <MonthView viewDate={viewDate} events={filteredEvents} onDayClick={handleDayClick} onEventClick={(ev, slot) => { setSelectedEvent(ev); setSelectedSlot(slot); }} />
            )}
            {viewMode === 'slot' && (
              <SlotGridView viewDate={viewDate} events={filteredEvents} onEventClick={(ev, slot) => { setSelectedEvent(ev); setSelectedSlot(slot); }} />
            )}
            {viewMode === 'week' && (
              <WeekView viewDate={viewDate} events={filteredEvents} onDayClick={handleDayClick} onEventClick={(ev, slot) => { setSelectedEvent(ev); setSelectedSlot(slot); }} />
            )}
            {viewMode === 'day' && (
              <DayView date={viewDate} events={filteredEvents} onEventClick={(ev, slot) => { setSelectedEvent(ev); setSelectedSlot(slot); }} />
            )}
          </div>

          {/* Sidebar */}
          <aside className="xl:w-60 shrink-0 flex flex-col gap-4">

            {/* Mini calendar */}
            <div className="glass-card rounded-[1.5rem] p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] font-black uppercase tracking-widest text-[#1E2B58] dark:text-white">
                  {MONTH_NAMES[viewDate.getMonth()].slice(0, 3)} {viewDate.getFullYear()}
                </p>
                <div className="flex gap-1">
                  <button onClick={goToPrev} className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-[#1E2B58]/8 dark:hover:bg-white/10 transition-colors">
                    <ChevronLeft className="w-3 h-3 text-[#1E2B58]/60 dark:text-white/60" />
                  </button>
                  <button onClick={goToNext} className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-[#1E2B58]/8 dark:hover:bg-white/10 transition-colors">
                    <ChevronRight className="w-3 h-3 text-[#1E2B58]/60 dark:text-white/60" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-0.5 mb-1">
                {['S','M','T','W','T','F','S'].map((d, i) => (
                  <div key={i} className="text-center text-[8px] font-black text-slate-400 uppercase">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-0.5">
                {miniDays.map((day, i) => {
                  if (!day) return <div key={i} />;
                  const d = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
                  const isToday    = isSameDay(d, TODAY);
                  const isSelected = isSameDay(d, viewDate);
                  const hasEvents  = getEventsForDate(events, d).length > 0;
                  return (
                    <button
                      key={i}
                      onClick={() => { setViewDate(d); setViewMode('day'); }}
                      className={`w-7 h-7 mx-auto flex items-center justify-center rounded-full text-[10px] font-black transition-all relative ${
                        isSelected ? 'bg-[#1E2B58] text-white'
                          : isToday ? 'text-[#1E2B58] dark:text-white ring-2 ring-[#1E2B58]/30 dark:ring-white/30'
                          : 'text-[#1E2B58]/70 dark:text-white/70 hover:bg-[#1E2B58]/8 dark:hover:bg-white/10'
                      }`}
                    >
                      {day}
                      {hasEvents && !isSelected && (
                        <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#4f75ff]" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Stats */}
            <div className="glass-card rounded-[1.5rem] p-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-[#1E2B58]/60 dark:text-white/40 mb-3">This period</p>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Total classes</span>
                  <span className="text-sm font-black text-[#1E2B58] dark:text-white">{weekStats.total}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Completed</span>
                  <span className="text-sm font-black text-blue-500">{weekStats.completed}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Upcoming</span>
                  <span className="text-sm font-black text-amber-500">{weekStats.upcoming}</span>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="glass-card rounded-[1.5rem] p-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-[#1E2B58]/60 dark:text-white/40 mb-3">Legend</p>
              <div className="space-y-2">
                {Object.entries(TYPE_STYLE).map(([key, s]) => (
                  <div key={key} className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${s.bg}`} />
                    <span className="text-xs font-bold text-[#1E2B58]/70 dark:text-white/60 capitalize">{key}</span>
                  </div>
                ))}
                <div className="mt-2 pt-2 border-t border-[#1E2B58]/5 dark:border-white/5 space-y-1.5">
                  {Object.entries(STATUS_CONFIG).map(([key, s]) => (
                    <div key={key} className="flex items-center gap-1.5">
                      <span className={`px-1.5 py-0.5 rounded-full text-[8px] font-black uppercase ${s.badge}`}>{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </aside>
        </div>

      </main>

      {/* ── Event Detail Modal ── */}
      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          slot={selectedSlot}
          onClose={() => { setSelectedEvent(null); setSelectedSlot(null); }}
          onBorrow={() => { setSelectedEvent(null); setSelectedSlot(null); navigate('/student/equipment'); }}
        />
      )}
    </div>
  );
};

export default StudentSchedulePage;
