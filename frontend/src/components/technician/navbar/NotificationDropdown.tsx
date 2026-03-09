import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_NOTIFICATIONS, Notification, NotifType } from '@/data/technician/mockNotifications';

// ── icon colour per type ────────────────────────────────────────────────────
const TYPE_STYLE: Record<NotifType, { bg: string; text: string }> = {
  ticket: { bg: 'bg-blue-100/80 dark:bg-blue-900/40', text: 'text-[#1A2B56] dark:text-blue-300' },
  assigned: { bg: 'bg-indigo-100/80 dark:bg-indigo-900/40', text: 'text-indigo-600 dark:text-indigo-300' },
  resolved: { bg: 'bg-emerald-100/80 dark:bg-emerald-900/40', text: 'text-emerald-600 dark:text-emerald-300' },
  alert: { bg: 'bg-rose-100/80 dark:bg-rose-900/40', text: 'text-rose-500 dark:text-rose-300' },
  handover: { bg: 'bg-amber-100/80 dark:bg-amber-900/40', text: 'text-amber-600 dark:text-amber-300' },
};

interface Props {
  isDark: boolean;
}

const NotificationDropdown: React.FC<Props> = ({ isDark }) => {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const unread = items.filter((n) => !n.read).length;

  // close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const markAllRead = () => setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  const markRead = (id: string) => setItems((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));

  return (
    <div className="relative" ref={ref}>
      {/* Bell button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-white/10 transition-all relative"
      >
        <span className="material-symbols-outlined text-[20px]">notifications</span>
        {unread > 0 && (
          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-[1.5px] border-white dark:border-slate-900 flex items-center justify-center">
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          className="absolute right-0 top-full mt-3 w-80 rounded-2xl z-50 overflow-hidden"
          style={{
            background: isDark
              ? 'rgba(13, 20, 40, 0.97)'
              : 'rgba(247, 249, 255, 0.98)',
            backdropFilter: 'blur(32px) saturate(200%)',
            WebkitBackdropFilter: 'blur(32px) saturate(200%)',
            border: isDark
              ? '1px solid rgba(255,255,255,0.10)'
              : '1px solid rgba(200,210,240,0.70)',
            boxShadow: isDark
              ? '0 20px 60px rgba(0,0,0,0.60), 0 4px 16px rgba(0,0,0,0.40)'
              : '0 20px 60px rgba(26,43,86,0.16), 0 4px 16px rgba(26,43,86,0.10)',
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3 border-b"
            style={{
              background: isDark ? 'rgba(26,43,86,0.50)' : 'rgba(26,43,86,0.05)',
              borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(26,43,86,0.08)',
            }}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-extrabold text-[#1A2B56] dark:text-white tracking-tight">
                Notifications
              </span>
              {unread > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[9px] font-extrabold bg-rose-500 text-white leading-none">
                  {unread}
                </span>
              )}
            </div>
            {unread > 0 && (
              <button
                onClick={markAllRead}
                className="text-[9px] font-bold text-slate-400 hover:text-[#1A2B56] dark:hover:text-blue-300 uppercase tracking-wider transition-colors"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-[340px] overflow-y-auto">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 gap-2 text-slate-400">
                <span className="material-symbols-outlined text-3xl">notifications_off</span>
                <p className="text-xs font-semibold">No notifications</p>
              </div>
            ) : (
              items.map((notif, idx) => {
                const style = TYPE_STYLE[notif.type];
                return (
                  <button
                    key={notif.id}
                    onClick={() => markRead(notif.id)}
                    className="w-full text-left flex items-start gap-3 px-4 py-3 transition-all"
                    style={{
                      background: notif.read
                        ? 'transparent'
                        : isDark ? 'rgba(58,82,152,0.18)' : 'rgba(26,43,86,0.04)',
                      borderBottom: idx < items.length - 1
                        ? isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(26,43,86,0.06)'
                        : 'none',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = isDark
                        ? 'rgba(58,82,152,0.28)'
                        : 'rgba(26,43,86,0.07)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = notif.read
                        ? 'transparent'
                        : isDark ? 'rgba(58,82,152,0.18)' : 'rgba(26,43,86,0.04)';
                    }}
                  >
                    {/* Icon badge */}
                    <div className={`mt-0.5 w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${style.bg}`}>
                      <span className={`material-symbols-outlined text-[16px] ${style.text}`}>
                        {notif.icon}
                      </span>
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <p className={`text-xs font-extrabold leading-tight truncate ${notif.read
                            ? 'text-slate-500 dark:text-slate-400'
                            : 'text-[#1A2B56] dark:text-white'
                          }`}>
                          {notif.title}
                        </p>
                        {!notif.read && (
                          <span className="w-1.5 h-1.5 bg-rose-500 rounded-full flex-shrink-0 mt-1" />
                        )}
                      </div>
                      <p className={`text-[10px] mt-0.5 leading-snug line-clamp-2 ${notif.read ? 'text-slate-400 dark:text-slate-500' : 'text-slate-600 dark:text-slate-300'
                        }`}>
                        {notif.body}
                      </p>
                      <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 mt-1 uppercase tracking-wider">
                        {notif.time}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div
            className="px-4 py-2.5 border-t"
            style={{
              background: isDark ? 'rgba(26,43,86,0.50)' : 'rgba(26,43,86,0.05)',
              borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(26,43,86,0.08)',
            }}
          >
            <button
              onClick={() => { setOpen(false); navigate('/technician/notifications'); }}
              className="w-full flex items-center justify-center gap-1.5 text-[10px] font-extrabold text-[#1A2B56] dark:text-blue-300 hover:opacity-70 uppercase tracking-widest transition-opacity py-0.5"
            >
              <span className="material-symbols-outlined text-sm">notifications</span>
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
