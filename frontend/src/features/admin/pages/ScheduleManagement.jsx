import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import { PageHeader } from '@/features/shared/components/PageHeader';
import { scheduleService } from '@/services/scheduleService';
import { toVNDateStr } from '@/utils/dateUtils';
import { slotService } from '@/services/slotService';
import { roomService } from '@/services/roomService';
import { userService } from '@/services/userService';
import { classService } from '@/services/classService';

// ─── Constants ────────────────────────────────────────────────────────────────

const TODAY = new Date();
const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAY_SHORT   = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

const STATUS_CFG = {
  scheduled: { label: 'Scheduled', cls: 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/30' },
  ongoing:   { label: 'Ongoing',   cls: 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/30' },
  completed: { label: 'Completed', cls: 'bg-slate-50 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700' },
  cancelled: { label: 'Cancelled', cls: 'bg-red-50 text-red-500 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30' },
};

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

function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

// ─── Shared sub-components ────────────────────────────────────────────────────

const StatusBadge = ({ status }) => {
  const c = STATUS_CFG[status] || { label: status, cls: 'bg-slate-100 text-slate-600 border-slate-200' };
  return (
    <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${c.cls}`}>
      {c.label}
    </span>
  );
};

const FieldLabel = ({ children }) => (
  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1.5">
    {children}
  </label>
);

const Input = ({ className = '', ...props }) => (
  <input
    className={`w-full rounded-xl border border-[#1E2B58]/10 dark:border-white/10 bg-white/60 dark:bg-white/5 px-3 py-2.5 text-sm font-semibold text-[#1E2B58] dark:text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-[#1E2B58]/20 dark:focus:ring-white/10 transition-all ${className}`}
    {...props}
  />
);

const Select = ({ children, className = '', ...props }) => (
  <select
    className={`w-full rounded-xl border border-[#1E2B58]/10 dark:border-white/10 bg-white/60 dark:bg-slate-800 px-3 py-2.5 text-sm font-semibold text-[#1E2B58] dark:text-white outline-none focus:ring-2 focus:ring-[#1E2B58]/20 dark:focus:ring-white/10 transition-all ${className}`}
    {...props}
  >
    {children}
  </select>
);

/**
 * SearchableSelect — reusable styled dropdown with live search.
 * Props:
 *   value     — currently selected value (string)
 *   onChange  — (value: string) => void
 *   options   — Array<{ value: string, label: string }>
 *   placeholder — string
 *   className — extra classes for the trigger button
 *   disabled  — boolean
 */
const SearchableSelect = ({ value, onChange, options = [], placeholder = 'Select…', className = '', disabled = false }) => {
  const [open, setOpen]   = useState(false);
  const [query, setQuery] = useState('');
  const ref               = useRef(null);
  const inputRef          = useRef(null);

  const selected = options.find(o => String(o.value) === String(value));
  const filtered = query.trim()
    ? options.filter(o => o.label.toLowerCase().includes(query.toLowerCase()))
    : options;

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Focus search when opening
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  const handleSelect = (opt) => {
    onChange(opt.value);
    setOpen(false);
    setQuery('');
  };

  const triggerErr = className.includes('border-red');

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen(o => !o)}
        className={`w-full flex items-center justify-between rounded-xl border px-3 py-2.5 text-sm font-semibold text-left outline-none transition-all
          bg-white/60 dark:bg-white/5
          ${triggerErr
            ? 'border-red-400 dark:border-red-500 focus:ring-2 focus:ring-red-200'
            : open
              ? 'border-[#1E2B58]/30 dark:border-white/20 ring-2 ring-[#1E2B58]/20 dark:ring-white/10'
              : 'border-[#1E2B58]/10 dark:border-white/10 hover:border-[#1E2B58]/20 dark:hover:border-white/20'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <span className={`truncate ${selected ? 'text-[#1E2B58] dark:text-white' : 'text-slate-400'}`}>
          {selected?.label || placeholder}
        </span>
        <span className={`material-symbols-rounded text-base text-slate-400 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
          expand_more
        </span>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute z-[60] left-0 right-0 mt-1.5 dashboard-card rounded-2xl shadow-2xl shadow-[#1E2B58]/10 border border-[#1E2B58]/8 dark:border-white/8 overflow-hidden">
          {/* Search bar */}
          <div className="p-2 border-b border-[#1E2B58]/8 dark:border-white/8">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#1E2B58]/5 dark:bg-white/5">
              <span className="material-symbols-rounded text-sm text-slate-400 shrink-0">search</span>
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search…"
                className="flex-1 min-w-0 bg-transparent text-sm font-semibold text-[#1E2B58] dark:text-white outline-none placeholder-slate-400"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="shrink-0 text-slate-400 hover:text-[#1E2B58] dark:hover:text-white transition-colors"
                >
                  <span className="material-symbols-rounded text-sm">close</span>
                </button>
              )}
            </div>
          </div>

          {/* Options */}
          <div className="max-h-52 overflow-y-auto py-1 hide-scrollbar">
            {filtered.length === 0 ? (
              <div className="px-4 py-4 text-xs font-semibold text-slate-400 text-center">
                No results found
              </div>
            ) : (
              filtered.map(opt => {
                const isSelected = String(opt.value) === String(value);
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSelect(opt)}
                    className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-left transition-colors
                      ${isSelected
                        ? 'bg-[#1E2B58]/8 dark:bg-white/8 text-[#1E2B58] dark:text-white font-bold'
                        : 'text-[#1E2B58]/80 dark:text-white/70 font-semibold hover:bg-[#1E2B58]/5 dark:hover:bg-white/5'
                      }`}
                  >
                    <span className={`material-symbols-rounded text-sm shrink-0 transition-opacity ${isSelected ? 'text-[#1E2B58] dark:text-white opacity-100' : 'opacity-0'}`}>
                      check
                    </span>
                    <span className="truncate">{opt.label}</span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const BtnPrimary = ({ children, loading, className = '', ...props }) => (
  <button
    className={`flex items-center gap-2 rounded-xl bg-[#1E2B58] px-5 py-2.5 text-xs font-black uppercase tracking-widest text-white shadow-sm transition-all hover:bg-[#1E2B58]/90 active:scale-[0.98] disabled:opacity-60 ${className}`}
    disabled={loading}
    {...props}
  >
    {loading && <span className="material-symbols-rounded animate-spin text-sm">refresh</span>}
    {children}
  </button>
);

const BtnGhost = ({ children, className = '', ...props }) => (
  <button
    className={`flex items-center gap-2 rounded-xl border border-[#1E2B58]/12 dark:border-white/10 bg-transparent px-4 py-2.5 text-xs font-black uppercase tracking-widest text-[#1E2B58] dark:text-white transition-all hover:bg-[#1E2B58]/6 dark:hover:bg-white/6 active:scale-[0.98] ${className}`}
    {...props}
  >
    {children}
  </button>
);

// ─── Confirm Delete Modal ─────────────────────────────────────────────────────

const ConfirmModal = ({ title, message, onConfirm, onCancel, loading }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4" onClick={onCancel}>
    <div className="dashboard-card rounded-3xl p-8 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
      <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-4">
        <span className="material-symbols-rounded text-2xl text-red-500">delete</span>
      </div>
      <h3 className="text-lg font-extrabold text-[#1E2B58] dark:text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-500 mb-6">{message}</p>
      <div className="flex gap-3">
        <button
          onClick={onConfirm}
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500 text-white text-xs font-black uppercase tracking-widest hover:bg-red-600 transition-all disabled:opacity-60"
        >
          {loading && <span className="material-symbols-rounded animate-spin text-sm">refresh</span>}
          Delete
        </button>
        <button onClick={onCancel} className="flex-1 py-3 rounded-xl border border-[#1E2B58]/10 dark:border-white/10 text-xs font-black text-[#1E2B58] dark:text-white uppercase tracking-widest hover:bg-[#1E2B58]/5 transition-all">
          Cancel
        </button>
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// TAB 1 — SCHEDULE MANAGEMENT
// ─────────────────────────────────────────────────────────────────────────────

// ── Mini calendar for schedule tab ───────────────────────────────────────────
const MiniCalendar = ({ viewDate, schedules, selectedDate, onSelectDate, onPrev, onNext }) => {
  const y = viewDate.getFullYear(), m = viewDate.getMonth();
  const firstDay = new Date(y, m, 1).getDay();
  const total = new Date(y, m + 1, 0).getDate();
  const offset = (firstDay - 1 + 7) % 7;
  const cells = Array(offset).fill(null);
  for (let d = 1; d <= total; d++) cells.push(d);

  const hasOnDay = (day) => {
    const d = new Date(y, m, day);
    return schedules.some(s => isSameDay(new Date(s.date || s.startAt), d));
  };

  return (
    <div className="dashboard-card rounded-3xl p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-extrabold text-[#1E2B58] dark:text-white">
          {MONTH_NAMES[m]} {y}
        </p>
        <div className="flex gap-1">
          <button onClick={onPrev} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[#1E2B58]/8 dark:hover:bg-white/10 transition-colors">
            <span className="material-symbols-rounded text-sm text-[#1E2B58]/60 dark:text-white/60">chevron_left</span>
          </button>
          <button onClick={onNext} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[#1E2B58]/8 dark:hover:bg-white/10 transition-colors">
            <span className="material-symbols-rounded text-sm text-[#1E2B58]/60 dark:text-white/60">chevron_right</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {['S','M','T','W','T','F','S'].map((d, i) => (
          <div key={i} className="text-center text-[8px] font-black uppercase text-slate-400">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;
          const d = new Date(y, m, day);
          const isToday    = isSameDay(d, TODAY);
          const isSelected = selectedDate && isSameDay(d, selectedDate);
          const hasSched   = hasOnDay(day);
          return (
            <button
              key={i}
              onClick={() => onSelectDate(d)}
              className={`w-8 h-8 mx-auto flex items-center justify-center rounded-full text-[11px] font-black transition-all relative ${
                isSelected
                  ? 'bg-[#1E2B58] text-white'
                  : isToday
                    ? 'ring-2 ring-[#1E2B58]/30 text-[#1E2B58] dark:ring-white/30 dark:text-white'
                    : 'text-[#1E2B58]/70 dark:text-white/70 hover:bg-[#1E2B58]/8 dark:hover:bg-white/10'
              }`}
            >
              {day}
              {hasSched && !isSelected && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#4f75ff]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ── Mock subject list (replace with API when available) ───────────────────────
const MOCK_SUBJECTS = [
  'SWP391 - Software Development Project',
  'SWR302 - Software Requirements',
  'SWT301 - Software Testing',
  'WDU203c - UI/UX Design',
  'PRF192 - Programming Fundamentals',
  'PRO192 - Object-Oriented Programming',
  'DSA201 - Data Structures and Algorithms',
  'DBM301 - Database Management Systems',
  'MAE101 - Mathematics for Engineering',
  'CEA201 - Computer Organization and Architecture',
  'NWC203c - Computer Networking',
  'SWD392 - Software Architecture and Design',
];

// ── Schedule form modal ───────────────────────────────────────────────────────
const SCHEDULE_DEFAULTS = { title: '', date: '', slotId: '', roomId: '', lecturerId: '', classId: '', status: 'scheduled' };

const ScheduleFormModal = ({ initial, slots, rooms, lecturers, classes, onSave, onClose, saving }) => {
  const isEdit = !!initial?._id;

  const buildForm = (src) => src
    ? {
        title: src.title || '',
        date: src.date ? toVNDateStr(new Date(src.date)) : '',
        slotId: src.slotId?._id || src.slotId || '',
        roomId: src.roomId?._id || src.roomId || '',
        lecturerId: src.lecturerId?._id || src.lecturerId || '',
        classId: src.classId?._id || src.classId || '',
        status: src.status || 'scheduled',
      }
    : { ...SCHEDULE_DEFAULTS };

  const [form, setForm]     = useState(() => buildForm(initial));
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm(buildForm(initial));
    setErrors({});
  }, [initial]);

  const set = (k, v) => {
    setForm(p => ({ ...p, [k]: v }));
    setErrors(p => ({ ...p, [k]: undefined }));
  };

  const validate = () => {
    const errs = {};
    if (!form.title)      errs.title = 'Subject is required';
    if (!form.date)       errs.date = 'Date is required';
    if (!form.slotId)     errs.slotId = 'Time slot is required';
    if (!form.roomId)     errs.roomId = 'Room is required';
    if (!form.lecturerId) errs.lecturerId = 'Lecturer is required';
    if (!form.classId)    errs.classId = 'Class is required';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSave(form);
  };

  const FieldError = ({ name }) => errors[name]
    ? <p className="text-[10px] text-red-500 mt-1 font-semibold">{errors[name]}</p>
    : null;

  const errCls = (name) => errors[name] ? 'border-red-400 focus:ring-red-200 dark:border-red-500' : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4 py-6" onClick={onClose}>
        <div className="dashboard-card rounded-3xl w-full max-w-lg shadow-2xl overflow-auto max-h-[90vh] hide-scrollbar" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#1E2B58]/8 dark:border-white/8">
          <div>
            <h2 className="text-lg font-extrabold text-[#1E2B58] dark:text-white">
              {isEdit ? 'Edit Schedule' : 'Create Schedule'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {isEdit ? 'Update class session details' : 'Assign a class to a room and slot'}
            </p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#1E2B58]/8 dark:hover:bg-white/10 transition-colors">
            <span className="material-symbols-rounded text-[#1E2B58]/50 dark:text-white/50">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Subject */}
          <div>
            <FieldLabel>Subject *</FieldLabel>
            <SearchableSelect
              value={form.title}
              onChange={v => set('title', v)}
              options={MOCK_SUBJECTS.map(s => ({ value: s, label: s }))}
              placeholder="Select subject…"
              className={errCls('title')}
            />
            <FieldError name="title" />
          </div>

          {/* Class */}
          <div>
            <FieldLabel>Class *</FieldLabel>
            <SearchableSelect
              value={form.classId}
              onChange={v => set('classId', v)}
              options={classes.map(c => ({ value: c._id, label: `${c.code} — ${c.name}` }))}
              placeholder="Select class…"
              className={errCls('classId')}
            />
            <FieldError name="classId" />
          </div>

          {/* Date + Slot row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel>Date *</FieldLabel>
              <Input type="date" value={form.date} onChange={e => set('date', e.target.value)} className={errCls('date')} />
              <FieldError name="date" />
            </div>
            <div>
              <FieldLabel>Time Slot *</FieldLabel>
              <SearchableSelect
                value={form.slotId}
                onChange={v => set('slotId', v)}
                options={slots.map(s => ({ value: s._id, label: `${s.name} (${s.startTime}–${s.endTime})` }))}
                placeholder="Select slot…"
                className={errCls('slotId')}
              />
              <FieldError name="slotId" />
            </div>
          </div>

          {/* Room */}
          <div>
            <FieldLabel>Room *</FieldLabel>
            <SearchableSelect
              value={form.roomId}
              onChange={v => set('roomId', v)}
              options={rooms.map(r => ({ value: r._id, label: `${r.name} (${r.type})` }))}
              placeholder="Select room…"
              className={errCls('roomId')}
            />
            <FieldError name="roomId" />
          </div>

          {/* Lecturer */}
          <div>
            <FieldLabel>Assigned Lecturer *</FieldLabel>
            <SearchableSelect
              value={form.lecturerId}
              onChange={v => set('lecturerId', v)}
              options={lecturers.map(u => ({ value: u._id, label: `${u.displayName || u.username} (${u.email || u.username})` }))}
              placeholder="Select lecturer…"
              className={errCls('lecturerId')}
            />
            <FieldError name="lecturerId" />
          </div>

          {/* Status (edit only) */}
          {isEdit && (
            <div>
              <FieldLabel>Status</FieldLabel>
              <SearchableSelect
                value={form.status}
                onChange={v => set('status', v)}
                options={[
                  { value: 'scheduled', label: 'Scheduled' },
                  { value: 'ongoing',   label: 'Ongoing' },
                  { value: 'completed', label: 'Completed' },
                  { value: 'cancelled', label: 'Cancelled' },
                ]}
              />
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <BtnPrimary type="submit" loading={saving} className="flex-1 justify-center">
              {isEdit ? 'Save Changes' : 'Create Schedule'}
            </BtnPrimary>
            <BtnGhost type="button" onClick={onClose} className="flex-1 justify-center">Cancel</BtnGhost>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── Schedule list item ────────────────────────────────────────────────────────
const ScheduleItem = ({ schedule, onEdit, onDelete }) => {
  const slot = schedule.slotId || {};
  const room = schedule.roomId || {};
  const lecturer = schedule.lecturerId || {};
  const cls = schedule.classId || {};
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#1E2B58]/4 dark:bg-white/5 hover:bg-[#1E2B58]/6 dark:hover:bg-white/7 transition-colors">
      <div className="flex items-start gap-3 min-w-0">
        <div className="w-10 h-10 shrink-0 rounded-xl bg-[#1E2B58]/10 dark:bg-white/10 flex items-center justify-center">
          <span className="material-symbols-rounded text-base text-[#1E2B58] dark:text-white">school</span>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-[#1E2B58] dark:text-white truncate">{schedule.title}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {cls.code ? <span className="font-semibold text-[#1E2B58]/70 dark:text-white/70">{cls.code}</span> : '—'}
            {' · '}{room.name || '—'} · {slot.name || '—'} ({slot.startTime || ''}–{slot.endTime || ''})
          </p>
          <p className="text-[11px] text-slate-400">
            {lecturer.displayName || lecturer.username || '—'} · {fmtDate(schedule.date)}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <StatusBadge status={schedule.status} />
        <button onClick={() => onEdit(schedule)} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-[#1E2B58]/10 dark:hover:bg-white/10 transition-colors" title="Edit">
          <span className="material-symbols-rounded text-base text-[#1E2B58]/60 dark:text-white/50">edit</span>
        </button>
        <button onClick={() => onDelete(schedule)} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" title="Delete">
          <span className="material-symbols-rounded text-base text-red-400">delete</span>
        </button>
      </div>
    </div>
  );
};

// ── Main Schedules Tab ────────────────────────────────────────────────────────
const SchedulesTab = () => {
  const [schedules, setSchedules]       = useState([]);
  const [loading, setLoading]           = useState(false);
  const [slots, setSlots]               = useState([]);
  const [rooms, setRooms]               = useState([]);
  const [lecturers, setLecturers]       = useState([]);
  const [classes, setClasses]           = useState([]);

  const [calDate, setCalDate]           = useState(new Date(TODAY));
  const [selectedDate, setSelectedDate] = useState(new Date(TODAY));

  const [formModal, setFormModal]       = useState(null); // null | 'create' | schedule-obj
  const [saving, setSaving]             = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting]         = useState(false);

  // ── Fetch all schedules for the current month view ────────────────────────
  const fetchSchedules = useCallback(async () => {
    setLoading(true);
    try {
      const y = calDate.getFullYear(), m = calDate.getMonth();
      const data = await scheduleService.getAllSchedules({
        startDate: toVNDateStr(new Date(y, m, 1)),
        endDate:   toVNDateStr(new Date(y, m + 1, 0)),
      });
      setSchedules(Array.isArray(data) ? data : []);
    } catch {
      setSchedules([]);
    } finally {
      setLoading(false);
    }
  }, [calDate.getFullYear(), calDate.getMonth()]);

  useEffect(() => { fetchSchedules(); }, [fetchSchedules]);

  // ── Load reference data (slots, rooms, lecturers, classes) once ──────────
  useEffect(() => {
    slotService.getAllSlots().then(d => setSlots(Array.isArray(d) ? d : [])).catch(() => {});
    roomService.getAll().then(d => setRooms(Array.isArray(d) ? d : [])).catch(() => {});
    userService.getAll()
      .then(d => setLecturers((Array.isArray(d) ? d : d?.users || []).filter(u => u.role === 'lecturer')))
      .catch(() => {});
    classService.getAllClasses().then(d => setClasses(Array.isArray(d) ? d : [])).catch(() => {});
  }, []);

  // ── Filter schedules for the selected date ────────────────────────────────
  const daySchedules = useMemo(() =>
    schedules.filter(s => isSameDay(new Date(s.date || s.startAt), selectedDate)),
    [schedules, selectedDate]
  );

  // ── Calendar month navigation ──────────────────────────────────────────────
  const prevMonth = () => setCalDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const nextMonth = () => setCalDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  // ── CRUD handlers ─────────────────────────────────────────────────────────
  const handleSave = async (formData) => {
    setSaving(true);
    try {
      if (formModal?._id) {
        await scheduleService.updateSchedule(formModal._id, formData);
        toast.success('Schedule updated.');
      } else {
        await scheduleService.createSchedule(formData);
        toast.success('Schedule created.');
      }
      setFormModal(null);
      fetchSchedules();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to save schedule.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await scheduleService.deleteSchedule(deleteTarget._id);
      toast.success('Schedule deleted.');
      setDeleteTarget(null);
      fetchSchedules();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to delete schedule.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[320px_1fr] gap-6">
      {/* Left: mini calendar */}
      <div className="space-y-4">
        <MiniCalendar
          viewDate={calDate}
          schedules={schedules}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          onPrev={prevMonth}
          onNext={nextMonth}
        />

        {/* Add schedule CTA */}
        <BtnPrimary
          onClick={() => setFormModal('create')}
          className="w-full justify-center"
        >
          <span className="material-symbols-rounded text-sm">add</span>
          New Schedule
        </BtnPrimary>
      </div>

      {/* Right: day detail */}
      <div className="dashboard-card rounded-3xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-extrabold text-[#1E2B58] dark:text-white">
              {selectedDate
                ? `${MONTH_NAMES[selectedDate.getMonth()]} ${selectedDate.getDate()}, ${selectedDate.getFullYear()}`
                : 'Select a date'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {daySchedules.length} class{daySchedules.length !== 1 ? 'es' : ''} scheduled
            </p>
          </div>
          {isSameDay(selectedDate, TODAY) && (
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />Today
            </span>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-slate-400">
            <span className="material-symbols-rounded animate-spin text-xl">refresh</span>
            <span className="text-sm">Loading…</span>
          </div>
        ) : daySchedules.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
            <span className="material-symbols-rounded text-4xl text-slate-300 dark:text-slate-600">event_busy</span>
            <p className="text-sm font-bold text-slate-400">No schedules on this day</p>
            <BtnPrimary onClick={() => setFormModal('create')}>
              <span className="material-symbols-rounded text-sm">add</span>
              Add Schedule
            </BtnPrimary>
          </div>
        ) : (
          <div className="space-y-3">
            {daySchedules.map(s => (
              <ScheduleItem
                key={s._id}
                schedule={s}
                onEdit={s => setFormModal(s)}
                onDelete={setDeleteTarget}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create / Edit modal */}
      {formModal && (
        <ScheduleFormModal
          initial={formModal === 'create' ? { date: selectedDate ? toVNDateStr(selectedDate) : '' } : formModal}
          slots={slots}
          rooms={rooms}
          lecturers={lecturers}
          classes={classes}
          saving={saving}
          onSave={handleSave}
          onClose={() => setFormModal(null)}
        />
      )}

      {/* Delete confirm */}
      {deleteTarget && (
        <ConfirmModal
          title="Delete Schedule"
          message={`Are you sure you want to delete "${deleteTarget.title}"? This cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// TAB 2 — SLOT MANAGEMENT
// ─────────────────────────────────────────────────────────────────────────────

const SLOT_DEFAULTS = { code: '', name: '', startTime: '', endTime: '', order: '', isActive: true };

const SlotFormModal = ({ initial, onSave, onClose, saving }) => {
  const isEdit = !!initial?._id;

  const buildForm = (src) => src
    ? { code: src.code ?? '', name: src.name ?? '', startTime: src.startTime ?? '', endTime: src.endTime ?? '', order: src.order ?? '', isActive: src.isActive ?? true }
    : { ...SLOT_DEFAULTS };

  const [form, setForm]     = useState(() => buildForm(initial));
  const [errors, setErrors] = useState({});

  // Re-sync when opening a different record or switching create→edit
  useEffect(() => {
    setForm(buildForm(initial));
    setErrors({});
  }, [initial]);

  const set = (k, v) => {
    setForm(p => ({ ...p, [k]: v }));
    setErrors(p => ({ ...p, [k]: undefined }));
  };

  const validate = () => {
    const errs = {};
    if (!form.code.trim())  errs.code = 'Code is required';
    if (!form.name.trim())  errs.name = 'Name is required';
    if (!form.startTime)    errs.startTime = 'Start time is required';
    if (!form.endTime)      errs.endTime = 'End time is required';
    else if (form.startTime && form.endTime && form.startTime >= form.endTime)
      errs.endTime = 'End time must be after start time';
    if (form.order === '' || form.order === undefined) {
      errs.order = 'Order is required';
    } else if (Number(form.order) < 1) {
      errs.order = 'Order must be a positive number';
    }
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSave({ ...form, order: Number(form.order) });
  };

  const FieldError = ({ name }) => errors[name]
    ? <p className="text-[10px] text-red-500 mt-1 font-semibold">{errors[name]}</p>
    : null;

  const errCls = (name) => errors[name] ? 'border-red-400 focus:ring-red-200 dark:border-red-500' : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4" onClick={onClose}>
      <div className="dashboard-card rounded-3xl w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#1E2B58]/8 dark:border-white/8">
          <div>
            <h2 className="text-lg font-extrabold text-[#1E2B58] dark:text-white">
              {isEdit ? 'Edit Slot' : 'Create Slot'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Define a teaching time slot</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#1E2B58]/8 dark:hover:bg-white/10 transition-colors">
            <span className="material-symbols-rounded text-[#1E2B58]/50 dark:text-white/50">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Code + Name */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel>Code *</FieldLabel>
              <Input placeholder="e.g. Ca 1" value={form.code} onChange={e => set('code', e.target.value)} className={errCls('code')} />
              <FieldError name="code" />
            </div>
            <div>
              <FieldLabel>Name *</FieldLabel>
              <Input placeholder="e.g. Slot 1" value={form.name} onChange={e => set('name', e.target.value)} className={errCls('name')} />
              <FieldError name="name" />
            </div>
          </div>

          {/* Start + End Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel>Start Time *</FieldLabel>
              <Input type="time" value={form.startTime} onChange={e => set('startTime', e.target.value)} className={errCls('startTime')} />
              <FieldError name="startTime" />
            </div>
            <div>
              <FieldLabel>End Time *</FieldLabel>
              <Input type="time" value={form.endTime} onChange={e => set('endTime', e.target.value)} className={errCls('endTime')} />
              <FieldError name="endTime" />
            </div>
          </div>

          {/* Order */}
          <div>
            <FieldLabel>Order *</FieldLabel>
            <Input
              type="number" min="1" step="1"
              placeholder="e.g. 1"
              value={form.order}
              onChange={e => set('order', e.target.value)}
              className={errCls('order')}
            />
            <FieldError name="order" />
          </div>

          {/* isActive toggle */}
          <div className="flex items-center justify-between rounded-xl border border-[#1E2B58]/10 dark:border-white/10 bg-white/40 dark:bg-white/5 px-4 py-3">
            <div>
              <FieldLabel>Active</FieldLabel>
              <p className="text-xs text-slate-400 -mt-1">{form.isActive ? 'Slot is visible to users' : 'Slot is hidden'}</p>
            </div>
            <button
              type="button"
              onClick={() => set('isActive', !form.isActive)}
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${form.isActive ? 'bg-[#1E2B58]' : 'bg-slate-200 dark:bg-slate-700'}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${form.isActive ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <BtnPrimary type="submit" loading={saving} className="flex-1 justify-center">
              {isEdit ? 'Save Changes' : 'Create Slot'}
            </BtnPrimary>
            <BtnGhost type="button" onClick={onClose} className="flex-1 justify-center">Cancel</BtnGhost>
          </div>
        </form>
      </div>
    </div>
  );
};

const SlotsTab = () => {
  const [slots, setSlots]               = useState([]);
  const [loading, setLoading]           = useState(false);
  const [formModal, setFormModal]       = useState(null);
  const [saving, setSaving]             = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting]         = useState(false);

  const fetchSlots = useCallback(async () => {
    setLoading(true);
    try {
      const data = await slotService.getAllSlots();
      setSlots(Array.isArray(data) ? data : []);
    } catch {
      setSlots([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSlots(); }, [fetchSlots]);

  const handleSave = async (formData) => {
    setSaving(true);
    try {
      if (formModal?._id) {
        await slotService.updateSlot(formModal._id, formData);
        toast.success('Slot updated.');
      } else {
        await slotService.createSlot(formData);
        toast.success('Slot created.');
      }
      setFormModal(null);
      fetchSlots();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to save slot.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await slotService.deleteSlot(deleteTarget._id);
      toast.success('Slot deactivated.');
      setDeleteTarget(null);
      fetchSlots();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to delete slot.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-extrabold text-[#1E2B58] dark:text-white">Time Slots</h3>
          <p className="text-xs text-slate-400 mt-0.5">{slots.length} active slot{slots.length !== 1 ? 's' : ''}</p>
        </div>
        <BtnPrimary onClick={() => setFormModal('create')}>
          <span className="material-symbols-rounded text-sm">add</span>
          New Slot
        </BtnPrimary>
      </div>

      {/* Slots table */}
      <div className="dashboard-card rounded-3xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-slate-400">
            <span className="material-symbols-rounded animate-spin text-xl">refresh</span>
            <span className="text-sm">Loading slots…</span>
          </div>
        ) : slots.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <span className="material-symbols-rounded text-4xl text-slate-300 dark:text-slate-600">schedule</span>
            <p className="text-sm font-bold text-slate-400">No slots defined yet</p>
            <BtnPrimary onClick={() => setFormModal('create')}>
              <span className="material-symbols-rounded text-sm">add</span>
              Create First Slot
            </BtnPrimary>
          </div>
        ) : (
          <>
            {/* Table header */}
            <div className="grid grid-cols-[2rem_1fr_1fr_1fr_1fr_auto] gap-4 px-6 py-3 border-b border-[#1E2B58]/8 dark:border-white/8">
              {['#', 'Code', 'Name', 'Start', 'End', 'Actions'].map(h => (
                <p key={h} className="text-[9px] font-black uppercase tracking-widest text-slate-400">{h}</p>
              ))}
            </div>
            {slots.map((slot, idx) => (
              <div
                key={slot._id}
                className="grid grid-cols-[2rem_1fr_1fr_1fr_1fr_auto] gap-4 items-center px-6 py-4 border-b border-[#1E2B58]/5 dark:border-white/5 last:border-0 hover:bg-[#1E2B58]/2 dark:hover:bg-white/2 transition-colors"
              >
                <span className="text-xs font-black text-slate-300 dark:text-slate-600">{idx + 1}</span>
                <span className="text-xs font-black text-[#1E2B58] dark:text-white">{slot.code}</span>
                <span className="text-sm font-semibold text-[#1E2B58] dark:text-white">{slot.name}</span>
                <span className="text-sm font-bold text-slate-600 dark:text-slate-300">{slot.startTime}</span>
                <span className="text-sm font-bold text-slate-600 dark:text-slate-300">{slot.endTime}</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => setFormModal(slot)}
                    className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-[#1E2B58]/10 dark:hover:bg-white/10 transition-colors"
                    title="Edit"
                  >
                    <span className="material-symbols-rounded text-base text-[#1E2B58]/60 dark:text-white/50">edit</span>
                  </button>
                  <button
                    onClick={() => setDeleteTarget(slot)}
                    className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    title="Delete"
                  >
                    <span className="material-symbols-rounded text-base text-red-400">delete</span>
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {formModal && (
        <SlotFormModal
          initial={formModal === 'create' ? null : formModal}
          saving={saving}
          onSave={handleSave}
          onClose={() => setFormModal(null)}
        />
      )}

      {deleteTarget && (
        <ConfirmModal
          title="Deactivate Slot"
          message={`Deactivate "${deleteTarget.name}" (${deleteTarget.startTime}–${deleteTarget.endTime})? Existing schedules using this slot will not be affected.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────────────────────

const TABS = [
  { id: 'schedules', label: 'Schedules', icon: 'calendar_month' },
  { id: 'slots',     label: 'Time Slots', icon: 'schedule' },
];

const ScheduleManagement = () => {
  const [activeTab, setActiveTab] = useState('schedules');

  return (
    <div className="pb-20 px-6 pt-6 w-full max-w-350 mx-auto">
      <PageHeader
        title="Schedule Management"
        subtitle="Manage class schedules, assign lecturers, and configure time slots."
      />

      {/* Tab switcher */}
      <div className="flex gap-2 mb-8 border-b border-[#1E2B58]/8 dark:border-white/8">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-3 text-xs font-black uppercase tracking-widest border-b-2 transition-all -mb-px ${
              activeTab === tab.id
                ? 'border-[#1E2B58] text-[#1E2B58] dark:border-white dark:text-white'
                : 'border-transparent text-slate-400 hover:text-[#1E2B58] dark:hover:text-white'
            }`}
          >
            <span className="material-symbols-rounded text-sm">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'schedules' && <SchedulesTab />}
      {activeTab === 'slots'     && <SlotsTab />}
    </div>
  );
};

export default ScheduleManagement;
