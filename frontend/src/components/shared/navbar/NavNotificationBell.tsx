/**
 * NavNotificationBell — Chuông thông báo + dropdown panel.
 * Dùng chung cho tất cả role.
 */
import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, CheckCheck, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";

// ── Types ─────────────────────────────────────────────────────────────────────

export type NotificationType =
  | "approval"
  | "borrow"
  | "return"
  | "equipment"
  | "report"
  | "general";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  to?: string;
}

// ── Mock data ─────────────────────────────────────────────────────────────────

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "approval",
    title: "Equipment Request Approved",
    message: "Your request for Laptop has been approved and is ready for pickup.",
    timestamp: "2 hours ago",
    read: false,
  },
  {
    id: "2",
    type: "return",
    title: "Return Reminder",
    message: "Please return the Projector by tomorrow to avoid late fees.",
    timestamp: "1 day ago",
    read: false,
  },
  {
    id: "3",
    type: "equipment",
    title: "New Equipment Available",
    message: "Camera equipment is now available for borrowing.",
    timestamp: "3 days ago",
    read: true,
  },
  {
    id: "4",
    type: "report",
    title: "Issue Resolved",
    message: "Your reported issue with the Monitor has been resolved.",
    timestamp: "1 week ago",
    read: true,
  },
];

// ── Per-type config ───────────────────────────────────────────────────────────

const TYPE_CONFIG: Record<
  NotificationType,
  { icon: string; bg: string; color: string }
> = {
  approval: {
    icon: "check_circle",
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    color: "text-emerald-500",
  },
  borrow: {
    icon: "inventory_2",
    bg: "bg-blue-50 dark:bg-blue-900/20",
    color: "text-blue-500",
  },
  return: {
    icon: "assignment_return",
    bg: "bg-amber-50 dark:bg-amber-900/20",
    color: "text-amber-500",
  },
  equipment: {
    icon: "devices",
    bg: "bg-violet-50 dark:bg-violet-900/20",
    color: "text-violet-500",
  },
  report: {
    icon: "build_circle",
    bg: "bg-rose-50 dark:bg-rose-900/20",
    color: "text-rose-500",
  },
  general: {
    icon: "notifications",
    bg: "bg-slate-100 dark:bg-slate-700/40",
    color: "text-slate-500",
  },
};

// ── NotificationItem ──────────────────────────────────────────────────────────

interface ItemProps {
  notification: Notification;
  onRead: (id: string) => void;
  onClose: () => void;
  role: string;
}

const NotificationItem: React.FC<ItemProps> = ({
  notification,
  onRead,
  onClose,
  role,
}) => {
  const navigate = useNavigate();
  const { icon, bg, color } = TYPE_CONFIG[notification.type];

  const handleClick = () => {
    onRead(notification.id);
    onClose();
    navigate(notification.to ?? `/${role}/notifications`);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`w-full px-5 py-4 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/20 border-b border-slate-100 dark:border-slate-700/40 last:border-0 group ${
        !notification.read ? "bg-blue-50/60 dark:bg-blue-900/10" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div
          className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-105 ${bg}`}
        >
          <span className={`material-symbols-rounded text-[18px] ${color}`}>
            {icon}
          </span>
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p
              className={`text-[0.8125rem] font-bold leading-snug ${
                notification.read
                  ? "text-slate-600 dark:text-slate-300"
                  : "text-slate-800 dark:text-slate-100"
              }`}
            >
              {notification.title}
            </p>
            {!notification.read && (
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
            )}
          </div>
          <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            {notification.message}
          </p>
          <span className="mt-1.5 block text-[0.6875rem] text-slate-400 dark:text-slate-500">
            {notification.timestamp}
          </span>
        </div>
      </div>
    </button>
  );
};

// ── NavNotificationBell ───────────────────────────────────────────────────────

const dropdownVariants = {
  hidden: { opacity: 0, y: -8, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
  exit: {
    opacity: 0,
    y: -6,
    scale: 0.97,
    transition: { duration: 0.15 },
  },
};

const NavNotificationBell: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] =
    useState<Notification[]>(MOCK_NOTIFICATIONS);
  const containerRef = useRef<HTMLDivElement>(null);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const unreadCount = notifications.filter((n) => !n.read).length;
  const role = user?.role ?? "student";

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  const handleMarkRead = (id: string) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

  const handleMarkAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  return (
    <div ref={containerRef} className="relative">
      {/* ── Bell button ── */}
      <button
        onClick={() => setIsOpen((p) => !p)}
        aria-label="Notifications"
        className="relative flex h-9 w-9 items-center justify-center rounded-full border border-[#1E2B58]/20 transition-all hover:bg-white/60 dark:border-white/20 dark:hover:bg-white/10"
      >
        <span className="material-symbols-outlined text-[18px] text-[#1E2B58] dark:text-white">
          notifications
        </span>

        {/* Unread badge */}
        {unreadCount > 0 ? (
          <span className="absolute -right-0.5 -top-0.5 flex h-[1.1rem] min-w-[1.1rem] items-center justify-center rounded-full border-2 border-white bg-red-500 px-0.5 text-[0.5625rem] font-black leading-none text-white dark:border-[#0f172a]">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        ) : (
          <span className="absolute right-0 top-0 h-2 w-2 rounded-full border-2 border-white bg-slate-300 dark:border-[#0f172a] dark:bg-slate-600" />
        )}
      </button>

      {/* ── Dropdown panel ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute right-0 z-50 mt-3 w-88 overflow-hidden rounded-3xl border border-slate-200/60 bg-white shadow-2xl shadow-[#1E2B58]/15 dark:border-slate-700/50 dark:bg-slate-900 dark:shadow-black/40"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-700/50">
              <div className="flex items-center gap-2.5">
                <Bell className="h-4 w-4 text-[#1E2B58] dark:text-white" />
                <h3 className="text-[0.9375rem] font-extrabold text-slate-800 dark:text-slate-100">
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <span className="rounded-full bg-blue-500 px-1.5 py-0.5 text-[0.625rem] font-black leading-none text-white">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="flex items-center gap-1 rounded-lg px-2 py-1 text-[0.6875rem] font-bold text-blue-500 transition-colors hover:bg-blue-50 hover:text-blue-600 dark:text-blue-400 dark:hover:bg-blue-900/20 dark:hover:text-blue-300"
                  >
                    <CheckCheck className="h-3.5 w-3.5" />
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  aria-label="Close"
                  className="ml-1 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700/40 dark:hover:text-slate-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="max-h-88 overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((n) => (
                  <NotificationItem
                    key={n.id}
                    notification={n}
                    onRead={handleMarkRead}
                    onClose={() => setIsOpen(false)}
                    role={role}
                  />
                ))
              ) : (
                <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-700/40">
                    <Bell className="h-6 w-6 text-slate-400" />
                  </div>
                  <p className="text-sm font-semibold text-slate-400 dark:text-slate-500">
                    No notifications
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="border-t border-slate-100 px-5 py-3.5 text-center dark:border-slate-700/50">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    navigate(`/${role}/notifications`);
                  }}
                  className="text-[0.8125rem] font-bold text-[#1E2B58] transition-colors hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  View All Notifications →
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NavNotificationBell;
