import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_NOTIFICATIONS, Notification, NotifType } from '@/data/technician/mockNotifications';

// ── icon colour per type ─────────────────────────────────────────────────────
const TYPE_STYLE: Record<NotifType, { bg: string; text: string; label: string }> = {
  ticket:   { bg: 'bg-blue-100 dark:bg-blue-900/40',      text: 'text-[#1A2B56] dark:text-blue-300',    label: 'Ticket'   },
  assigned: { bg: 'bg-indigo-100 dark:bg-indigo-900/40',  text: 'text-indigo-600 dark:text-indigo-300', label: 'Assigned' },
  resolved: { bg: 'bg-emerald-100 dark:bg-emerald-900/40',text: 'text-emerald-600 dark:text-emerald-300',label: 'Resolved' },
  alert:    { bg: 'bg-rose-100 dark:bg-rose-900/40',      text: 'text-rose-500 dark:text-rose-300',     label: 'Alert'    },
  handover: { bg: 'bg-amber-100 dark:bg-amber-900/40',    text: 'text-amber-600 dark:text-amber-300',   label: 'Handover' },
};

const FILTERS = ['All', 'Unread', 'Ticket', 'Alert', 'Resolved', 'Handover', 'Assigned'] as const;
type Filter = typeof FILTERS[number];

const TechnicianNotifications: React.FC = () => {
  const navigate = useNavigate();
  const [items, setItems]     = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [filter, setFilter]   = useState<Filter>('All');

  const unread = items.filter((n) => !n.read).length;

  const markAllRead = () => setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  const markRead    = (id: string) =>
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));

  const filtered = items.filter((n) => {
    if (filter === 'All')    return true;
    if (filter === 'Unread') return !n.read;
    return n.type === filter.toLowerCase();
  });

  return (
    <main className="pt-32 pb-16 px-6 max-w-4xl mx-auto space-y-8">

      {/* ── Page header ── */}
      <section className="flex items-end justify-between gap-4">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-[#1A2B56] dark:hover:text-white uppercase tracking-wider transition-colors mb-3"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            Back
          </button>
          <h1 className="text-4xl font-extrabold text-[#1A2B56] dark:text-white tracking-tight">
            Notifications
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mt-1">
            {unread > 0 ? `${unread} unread notification${unread > 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        {unread > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1A2B56] text-white text-xs font-extrabold uppercase tracking-wider hover:opacity-90 transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-sm">done_all</span>
            Mark all read
          </button>
        )}
      </section>

      {/* ── Filter pills ── */}
      <div className="flex gap-2 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all ${
              filter === f
                ? 'bg-[#1A2B56] text-white shadow-sm dark:bg-[#3a5298]'
                : 'bg-white/60 dark:bg-white/10 text-slate-500 dark:text-slate-400 hover:text-[#1A2B56] dark:hover:text-white hover:bg-white dark:hover:bg-white/20'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* ── Notification list ── */}
      <div
        className="rounded-3xl overflow-hidden"
        style={{
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(200,210,240,0.60)',
          boxShadow: '0 8px 40px rgba(26,43,86,0.10)',
        }}
      >
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-600">notifications_off</span>
            <p className="text-sm font-bold text-slate-400 dark:text-slate-500">No notifications found</p>
          </div>
        ) : (
          filtered.map((notif, idx) => {
            const style = TYPE_STYLE[notif.type];
            return (
              <div
                key={notif.id}
                className={`flex items-start gap-4 px-6 py-5 transition-all cursor-pointer ${
                  idx < filtered.length - 1 ? 'border-b border-slate-100 dark:border-white/5' : ''
                } ${
                  notif.read
                    ? 'bg-transparent hover:bg-slate-50/80 dark:hover:bg-white/5'
                    : 'bg-blue-50/60 dark:bg-[#1a2b56]/20 hover:bg-blue-50 dark:hover:bg-[#1a2b56]/30'
                }`}
                onClick={() => markRead(notif.id)}
              >
                {/* Icon */}
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 ${style.bg}`}>
                  <span className={`material-symbols-outlined text-[22px] ${style.text}`}>
                    {notif.icon}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className={`text-sm font-extrabold leading-tight ${
                          notif.read ? 'text-slate-500 dark:text-slate-400' : 'text-[#1A2B56] dark:text-white'
                        }`}>
                          {notif.title}
                        </p>
                        {/* Type badge */}
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${style.bg} ${style.text}`}>
                          {style.label}
                        </span>
                      </div>
                      <p className={`text-xs mt-1 leading-relaxed ${
                        notif.read ? 'text-slate-400 dark:text-slate-500' : 'text-slate-600 dark:text-slate-300'
                      }`}>
                        {notif.body}
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 dark:text-slate-600 mt-1.5 uppercase tracking-widest">
                        {notif.time}
                      </p>
                    </div>

                    {/* Unread dot */}
                    <div className="flex-shrink-0 pt-1">
                      {!notif.read
                        ? <span className="w-2.5 h-2.5 bg-rose-500 rounded-full block" />
                        : <span className="w-2.5 h-2.5 rounded-full block" />
                      }
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

    </main>
  );
};

export default TechnicianNotifications;
