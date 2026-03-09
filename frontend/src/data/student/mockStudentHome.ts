import {
  AlertCircle,
  History,
  Package,
  TrendingUp,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────────────

export interface StatCard {
  id: string;
  title: string;
  value: string;
  icon: LucideIcon;
  color: string;
  iconShadow: string;
  dot: string;
  glow: string;
  route: string;
}

export interface RecentActivity {
  id: number;
  title: string;
  time: string;
  type: "borrow" | "report" | "return";
  route: string;
}

export interface UpcomingItem {
  id: number;
  title: string;
  due: string;
  sku: string;
  route: string;
}

// ── Data ─────────────────────────────────────────────────────────────────────

export const STAT_CARDS: StatCard[] = [
  {
    id: "active-borrows",
    title: "Active Borrows",
    value: "3",
    icon: Package,
    color: "bg-blue-500",
    iconShadow: "shadow-blue-500/40",
    dot: "bg-blue-400",
    glow: "glow-blue",
    route: "/student/borrow-history",
  },
  {
    id: "history",
    title: "Total History",
    value: "24",
    icon: History,
    color: "bg-purple-500",
    iconShadow: "shadow-purple-500/40",
    dot: "bg-purple-400",
    glow: "glow-purple",
    route: "/student/borrow-history",
  },
  {
    id: "pending-reports",
    title: "Pending Reports",
    value: "1",
    icon: AlertCircle,
    color: "bg-orange-500",
    iconShadow: "shadow-orange-500/40",
    dot: "bg-orange-400",
    glow: "glow-orange",
    route: "/student/report",
  },
  {
    id: "usage",
    title: "Usage Score",
    value: "92%",
    icon: TrendingUp,
    color: "bg-emerald-500",
    iconShadow: "shadow-emerald-500/40",
    dot: "bg-emerald-400",
    glow: "glow-emerald",
    route: "/student/borrow-history",
  },
];

export const RECENT_ACTIVITIES: RecentActivity[] = [
  {
    id: 1,
    title: "Borrowed MacBook Pro M2",
    time: "2 hours ago",
    type: "borrow",
    route: "/student/borrow-history",
  },
  {
    id: 2,
    title: "Submitted issue: Projector lamp",
    time: "Yesterday",
    type: "report",
    route: "/student/report",
  },
  {
    id: 3,
    title: "Returned iPad Air 5th Gen",
    time: "3 days ago",
    type: "return",
    route: "/student/borrow-history",
  },
];

export const UPCOMING_ITEMS: UpcomingItem[] = [
  {
    id: 1,
    title: "MacBook Pro M2",
    due: "Due in 2 days",
    sku: "FPT-LAP-082",
    route: "/student/borrow-history",
  },
  {
    id: 2,
    title: "4K Laser Projector",
    due: "Due in 5 days",
    sku: "FPT-PJ-014",
    route: "/student/borrow-history",
  },
];
