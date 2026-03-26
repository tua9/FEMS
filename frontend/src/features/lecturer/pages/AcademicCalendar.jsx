import { ChevronLeft, ChevronRight, Clock, MapPin, Users, X } from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { scheduleService } from '@/services/scheduleService';
import { toVNDateStr } from '@/utils/dateUtils';

// ─── Constants ────────────────────────────────────────────────────────────────

const TODAY = new Date();

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];
const DAY_SHORT = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const HOURS = Array.from({ length: 14 }, (_, i) => i + 7); // 07–20

// Fixed university time slots
const FIXED_SLOTS = [
  { order: 1, name: 'Slot 1', startH: 7,  startM: 0,  endH: 9,  endM: 15 },
  { order: 2, name: 'Slot 2', startH: 9,  startM: 30, endH: 11, endM: 45 },
  { order: 3, name: 'Slot 3', startH: 12, startM: 30, endH: 14, endM: 45 },
  { order: 4, name: 'Slot 4', startH: 15, startM: 0,  endH: 17, endM: 15 },
];

function getActiveSlotOrder() {
  const vnNow = new Date(Date.now() + 7 * 60 * 60 * 1000);
  const cur = vnNow.getUTCHours() * 60 + vnNow.getUTCMinutes();
  const s = FIXED_SLOTS.find(sl => cur >= sl.startH * 60 + sl.startM && cur <= sl.endH * 60 + sl.endM);
  return s ? s.order : null;
}

function eventMatchesSlot(ev, slot) {
  const evStart = ev.startHour * 60 + ev.startMin;
  return evStart >= slot.startH * 60 + slot.startM && evStart < slot.endH * 60 + slot.endM;
}

// ─── Map backend schedule → internal event ───────────────────────────────────

function mapSchedule(s) {
  const slot = s.slotId || {};
  const [sh = 7, sm = 0] = (slot.startTime || '07:00').split(':').map(Number);
  const [eh = 9, em = 0] = (slot.endTime   || '09:00').split(':').map(Number);
  const d = new Date(s.date || s.startAt);
  const roomType = s.roomId?.type || 'classroom';
  return {
    id: s._id,
    title: s.title,
    location: s.roomId?.name || '—',
    type: roomType === 'lab' ? 'lab' : 'class',
    year: d.getFullYear(),
    month: d.getMonth(),
    day: d.getDate(),
    startHour: sh,
    startMin: sm,
    endHour: eh,
    endMin: em,
    students: s.studentIds?.length ?? 0,
    description: `${slot.name || ''} · ${s.roomId?.name || '—'}`,
    slotName: slot.name || '',
    status: s.status,
    roomId: s.roomId?._id || s.roomId,
    _id: s._id,
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate();
}

function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

function startOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - (day === 0 ? 6 : day - 1));
  return d;
}

function fmt(h, m) {
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function getEventsForDate(events, date) {
  return events.filter(
    e => e.year === date.getFullYear()
      && e.month === date.getMonth()
      && e.day === date.getDate()
  );
}

// ─── Event type styles ────────────────────────────────────────────────────────

const TYPE_STYLE = {
  class: { bg: 'bg-[#1E2B58]', badge: 'CLASS', badgeBg: 'bg-blue-100 text-blue-700', icon: 'school' },
  lab:   { bg: 'bg-emerald-600', badge: 'LAB',   badgeBg: 'bg-emerald-100 text-emerald-700', icon: 'science' },
};

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

// ── Month View ────────────────────────────────────────────────────────────────
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
                isToday
                  ? 'bg-[#1E2B58] text-white'
                  : isCurMonth ? 'text-[#1E2B58] dark:text-white' : 'text-slate-300 dark:text-slate-700'
              }`}>
                {date.getDate()}
              </span>
              {dayEvents.slice(0, 2).map((ev, i) => (
                <button
                  key={i}
                  onClick={e => { e.stopPropagation(); onEventClick(ev); }}
                  className={`w-full text-left px-1.5 py-1 rounded-lg text-[8px] md:text-[9px] font-bold leading-tight text-white hover:opacity-90 transition-opacity truncate ${TYPE_STYLE[ev.type]?.bg || 'bg-[#1E2B58]'}`}
                >
                  {ev.title}
                </button>
              ))}
              {dayEvents.length > 2 && (
                <span className="text-[8px] font-bold text-[#1E2B58]/40 dark:text-white/30 pl-1">
                  +{dayEvents.length - 2} more
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

      <div className="overflow-y-auto max-h-[520px] md:max-h-[580px]">
        {HOURS.map(hour => {
          const rowEvents = days.map(date =>
            getEventsForDate(events, date).filter(e => e.startHour === hour)
          );
          const hasAny = rowEvents.some(e => e.length > 0);
          return (
            <div key={hour} className={`grid grid-cols-[56px_repeat(7,1fr)] border-b border-[#1E2B58]/5 dark:border-white/5 ${hasAny ? 'min-h-[64px]' : 'min-h-[40px]'}`}>
              <div className="text-[9px] font-bold text-slate-400 dark:text-slate-600 pt-1.5 text-right pr-2 shrink-0">
                {String(hour).padStart(2, '0')}:00
              </div>
              {rowEvents.map((evs, dayIdx) => (
                <div key={dayIdx} className="border-l border-[#1E2B58]/5 dark:border-white/5 p-1 flex flex-col gap-1">
                  {evs.map((ev, eIdx) => (
                    <button
                      key={eIdx}
                      onClick={() => onEventClick(ev)}
                      className={`w-full text-left p-1 rounded-lg text-[8px] font-bold leading-tight text-white hover:opacity-90 transition-opacity ${TYPE_STYLE[ev.type]?.bg || 'bg-[#1E2B58]'}`}
                    >
                      {ev.title}<br />
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
          <span className="material-symbols-rounded text-5xl text-[#1E2B58]/20 dark:text-white/15">calendar_month</span>
          <p className="text-sm font-bold text-[#1E2B58]/40 dark:text-white/30">No classes on this day</p>
        </div>
      ) : (
        <div className="overflow-y-auto max-h-[540px]">
          {HOURS.map(hour => {
            const hourEvents = dayEvents.filter(e => e.startHour === hour);
            return (
              <div key={hour} className={`flex gap-4 border-b border-[#1E2B58]/5 dark:border-white/5 ${hourEvents.length > 0 ? 'py-3' : 'py-2'}`}>
                <div className="w-12 text-right shrink-0 pt-0.5">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-600">{String(hour).padStart(2, '0')}:00</span>
                </div>
                <div className="flex-1 flex flex-col gap-2">
                  {hourEvents.map((ev, i) => (
                    <button
                      key={i}
                      onClick={() => onEventClick(ev)}
                      className={`w-full text-left p-4 rounded-2xl flex items-start gap-3 text-white hover:opacity-90 transition-all hover:scale-[1.01] ${TYPE_STYLE[ev.type]?.bg || 'bg-[#1E2B58]'}`}
                    >
                      <span className="material-symbols-rounded text-xl mt-0.5 opacity-90">{TYPE_STYLE[ev.type]?.icon || 'school'}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-extrabold text-sm">{ev.title}</p>
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

// ── Slot Grid View ────────────────────────────────────────────────────────────
const SlotGridView = ({ viewDate, events, onEventClick }) => {
  const mon = startOfWeek(viewDate);
  const days = Array.from({ length: 7 }, (_, i) => addDays(mon, i));
  const activeSlotOrder = getActiveSlotOrder();
  const isThisWeek = days.some(d => isSameDay(d, TODAY));

  return (
    <div className="glass-card rounded-[2rem] overflow-hidden p-4 md:p-6">
      {/* Header: day columns */}
      <div className="grid grid-cols-[88px_repeat(7,1fr)] border-b border-[#1E2B58]/10 dark:border-white/10 pb-3 mb-2">
        <div className="text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-end pb-1">Slot</div>
        {days.map((date, i) => {
          const isToday = isSameDay(date, TODAY);
          return (
            <div key={i} className="text-center">
              <div className="text-[9px] font-black uppercase tracking-widest text-slate-400">{DAY_SHORT[i]}</div>
              <div className={`text-sm md:text-base font-black mx-auto mt-0.5 w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded-full transition-all ${
                isToday ? 'bg-[#1E2B58] text-white' : 'text-[#1E2B58] dark:text-white'
              }`}>
                {date.getDate()}
              </div>
            </div>
          );
        })}
      </div>

      {/* Slot rows */}
      {FIXED_SLOTS.map(slot => {
        const isActive = isThisWeek && activeSlotOrder === slot.order;
        return (
          <div
            key={slot.order}
            className={`grid grid-cols-[88px_repeat(7,1fr)] border-b border-[#1E2B58]/5 dark:border-white/5 min-h-[88px] ${
              isActive ? 'bg-blue-50/60 dark:bg-blue-900/10 rounded-xl' : ''
            }`}
          >
            {/* Slot label */}
            <div className="p-2 md:p-3 flex flex-col justify-center gap-0.5 shrink-0">
              <div className="flex items-center gap-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-[#1E2B58] dark:text-white">{slot.name}</p>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                )}
              </div>
              <p className="text-[9px] text-slate-400 dark:text-slate-500 font-semibold leading-snug">
                {String(slot.startH).padStart(2,'0')}:{String(slot.startM).padStart(2,'0')}
                <span className="mx-0.5">–</span>
                {String(slot.endH).padStart(2,'0')}:{String(slot.endM).padStart(2,'0')}
              </p>
            </div>

            {/* Day cells */}
            {days.map((date, dayIdx) => {
              const isToday = isSameDay(date, TODAY);
              const cellEvents = getEventsForDate(events, date).filter(ev => eventMatchesSlot(ev, slot));
              return (
                <div
                  key={dayIdx}
                  className={`border-l border-[#1E2B58]/5 dark:border-white/5 p-1 flex flex-col gap-1 ${
                    isToday && isActive ? 'bg-emerald-50/40 dark:bg-emerald-900/10' : ''
                  }`}
                >
                  {cellEvents.map((ev, eIdx) => {
                    const evDate = new Date(ev.year, ev.month, ev.day);
                    const todayMidnight = new Date(); todayMidnight.setHours(0,0,0,0);
                    const vnCur = new Date(Date.now() + 7*60*60*1000);
                    const curMin = vnCur.getUTCHours() * 60 + vnCur.getUTCMinutes();
                    const isDone = ev.status === 'completed'
                      || evDate < todayMidnight
                      || (isSameDay(evDate, TODAY) && curMin > slot.endH * 60 + slot.endM);
                    return (
                      <button
                        key={eIdx}
                        onClick={() => onEventClick(ev)}
                        className={`w-full text-left p-1.5 rounded-lg text-[8px] md:text-[9px] font-bold leading-tight text-white hover:opacity-90 transition-all hover:scale-[1.02] ${TYPE_STYLE[ev.type]?.bg || 'bg-[#1E2B58]'} ${isDone ? 'opacity-50' : ''}`}
                      >
                        <div className="truncate font-extrabold">{ev.title}</div>
                        <div className="opacity-70 truncate mt-0.5">{ev.location}</div>
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

// ── Event Detail Modal ────────────────────────────────────────────────────────
const EventModal = ({ event, onClose, onNavigateEquipment }) => {
  const style = TYPE_STYLE[event.type] || TYPE_STYLE.class;
  const rawDiff = (event.endHour * 60 + event.endMin) - (event.startHour * 60 + event.startMin);
  const durationLabel = `${Math.floor(rawDiff / 60)}h${rawDiff % 60 ? ` ${rawDiff % 60}m` : ''}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 bg-black/30 backdrop-blur-sm" onClick={onClose}>
      <div className="glass-card rounded-[2rem] w-full max-w-md shadow-2xl shadow-[#1E2B58]/20 overflow-hidden animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
        {/* Color header */}
        <div className={`${style.bg} px-6 pt-6 pb-5 flex items-start justify-between`}>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center">
              <span className="material-symbols-rounded text-white text-xl">{style.icon}</span>
            </div>
            <div>
              <span className={`text-[9px] font-black uppercase tracking-widest ${style.badgeBg} px-2 py-0.5 rounded-full`}>{style.badge}</span>
              <h3 className="text-white font-extrabold text-lg leading-tight mt-0.5">{event.title}</h3>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors shrink-0">
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
                <span className="ml-2 text-[#1E2B58]/40 dark:text-white/30 font-semibold text-xs">({durationLabel})</span>
              </p>
            </div>
          </div>

          {event.slotName && (
            <div className="flex items-center gap-3 p-3 glass-card !rounded-xl">
              <span className="material-symbols-rounded text-base text-[#1E2B58]/50 dark:text-white/40 shrink-0">layers</span>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-[#1E2B58]/40 dark:text-white/40">Slot</p>
                <p className="text-sm font-bold text-[#1E2B58] dark:text-white">{event.slotName}</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 p-3 glass-card !rounded-xl">
            <Users className="w-4 h-4 text-[#1E2B58]/50 dark:text-white/40 shrink-0" />
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-[#1E2B58]/40 dark:text-white/40">Students</p>
              <p className="text-sm font-bold text-[#1E2B58] dark:text-white">{event.students} enrolled</p>
            </div>
          </div>

          {event.status && (
            <div className="flex items-center gap-3 p-3 glass-card !rounded-xl">
              <span className="material-symbols-rounded text-base text-[#1E2B58]/50 dark:text-white/40 shrink-0">info</span>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-[#1E2B58]/40 dark:text-white/40">Status</p>
                <p className="text-sm font-bold text-[#1E2B58] dark:text-white capitalize">{event.status}</p>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button
              onClick={onNavigateEquipment}
              className="flex-1 py-3 rounded-2xl bg-[#1E2B58] text-white text-sm font-extrabold hover:bg-[#1E2B58]/90 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-[#1E2B58]/20"
            >
              View Equipment
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

// ─────────────────────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────────────────────
const AcademicCalendar = () => {
  const navigate = useNavigate();

  const [viewMode, setViewMode]       = useState('month');
  const [viewDate, setViewDate]       = useState(new Date(TODAY));
  const [selectedEvent, setSelectedEvent] = useState(null);

  // ── Real data ─────────────────────────────────────────────────────────────
  const [rawSchedules, setRawSchedules] = useState([]);
  const [loading, setLoading]           = useState(false);

  const events = useMemo(() => rawSchedules.map(mapSchedule), [rawSchedules]);

  // ── Compute fetch params based on current view ────────────────────────────
  const fetchParams = useMemo(() => {
    const y = viewDate.getFullYear();
    const m = viewDate.getMonth();
    if (viewMode === 'month') {
      return {
        startDate: toVNDateStr(new Date(y, m - 1, 25)),
        endDate:   toVNDateStr(new Date(y, m + 1,  6)),
      };
    }
    if (viewMode === 'week' || viewMode === 'slot') {
      const mon = startOfWeek(viewDate);
      return {
        startDate: toVNDateStr(mon),
        endDate:   toVNDateStr(addDays(mon, 6)),
      };
    }
    return { date: toVNDateStr(viewDate) };
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
    if (viewMode === 'week' || viewMode === 'slot') d.setDate(d.getDate() - 7);
    if (viewMode === 'day')   d.setDate(d.getDate() - 1);
    setViewDate(d);
  };

  const goToNext = () => {
    const d = new Date(viewDate);
    if (viewMode === 'month') { d.setMonth(d.getMonth() + 1); d.setDate(1); }
    if (viewMode === 'week' || viewMode === 'slot') d.setDate(d.getDate() + 7);
    if (viewMode === 'day')   d.setDate(d.getDate() + 1);
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

  // ── Mini calendar ─────────────────────────────────────────────────────────
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
      <main className="pt-6 sm:pt-8 pb-10 px-4 sm:px-6 w-full max-w-350 mx-auto flex-1 flex flex-col">

        {/* ── Header ── */}
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/lecturer/dashboard')}
              className="w-10 h-10 flex items-center justify-center rounded-full glass-card hover:bg-white/60 transition-all text-[#1E2B58] dark:text-white shrink-0"
            >
              <ChevronLeft className="w-5 h-5" />
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

          {/* Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1">
              <button onClick={goToPrev} className="w-8 h-8 flex items-center justify-center rounded-full glass-card hover:bg-white/60 transition-all text-[#1E2B58] dark:text-white">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={goToToday} className="px-4 h-8 rounded-full glass-card text-[10px] font-black uppercase tracking-widest text-[#1E2B58] dark:text-white hover:bg-white/60 transition-all">
                Today
              </button>
              <button onClick={goToNext} className="w-8 h-8 flex items-center justify-center rounded-full glass-card hover:bg-white/60 transition-all text-[#1E2B58] dark:text-white">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* View mode switcher */}
            <div className="flex glass-card rounded-full p-1 gap-1">
              {[
                { key: 'month', label: 'Month' },
                { key: 'slot', label: 'Slots' },
                { key: 'week', label: 'Week' },
                { key: 'day', label: 'Day' },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setViewMode(key)}
                  className={`px-3 h-6 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
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

        {/* ── Loading bar ── */}
        {loading && (
          <div className="flex items-center gap-2 mb-4 text-xs text-slate-400">
            <span className="material-symbols-rounded animate-spin text-sm">refresh</span>
            Loading schedule…
          </div>
        )}

        {/* ── Layout: calendar + sidebar ── */}
        <div className="flex flex-col xl:flex-row gap-6 flex-1">

          {/* Calendar view (main) */}
          <div className="flex-1 min-w-0">
            {viewMode === 'month' && (
              <MonthView viewDate={viewDate} events={events} onDayClick={handleDayClick} onEventClick={setSelectedEvent} />
            )}
            {viewMode === 'slot' && (
              <SlotGridView viewDate={viewDate} events={events} onEventClick={setSelectedEvent} />
            )}
            {viewMode === 'week' && (
              <WeekView viewDate={viewDate} events={events} onDayClick={handleDayClick} onEventClick={setSelectedEvent} />
            )}
            {viewMode === 'day' && (
              <DayView date={viewDate} events={events} onEventClick={setSelectedEvent} />
            )}
          </div>

          {/* Sidebar */}
          <aside className="xl:w-64 shrink-0 flex flex-col gap-4">

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
                        isSelected
                          ? 'bg-[#1E2B58] text-white'
                          : isToday
                            ? 'text-[#1E2B58] dark:text-white ring-2 ring-[#1E2B58]/30 dark:ring-white/30'
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
              </div>
            </div>

            {/* Summary */}
            <div className="glass-card rounded-[1.5rem] p-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-[#1E2B58]/60 dark:text-white/40 mb-3">Summary</p>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Total classes</span>
                  <span className="text-xs font-black text-[#1E2B58] dark:text-white">{events.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Avg. students</span>
                  <span className="text-xs font-black text-[#1E2B58] dark:text-white">
                    {events.length ? Math.round(events.reduce((a, e) => a + e.students, 0) / events.length) : 0}
                  </span>
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
          onClose={() => setSelectedEvent(null)}
          onNavigateEquipment={() => { setSelectedEvent(null); navigate('/lecturer/equipment'); }}
        />
      )}
    </div>
  );
};

export default AcademicCalendar;
