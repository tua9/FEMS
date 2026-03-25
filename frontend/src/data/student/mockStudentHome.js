import {
 AlertCircle,
 History,
 Package,
 TrendingUp,
} from "lucide-react";
// ── Types ────────────────────────────────────────────────────────────────────

// ── Data ─────────────────────────────────────────────────────────────────────

export const STAT_CARDS= [
 {
 id: "active-borrows",
 title: "Active Borrows",
 value: "3",
 icon,
 color: "bg-blue-500",
 iconShadow: "shadow-blue-500/40",
 dot: "bg-blue-400",
 glow: "glow-blue",
 route: "/student/borrow-history",
 },
 {
 id: "history",
 title: "Total History",
 value: "25",
 icon,
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
 icon,
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
 icon,
 color: "bg-emerald-500",
 iconShadow: "shadow-emerald-500/40",
 dot: "bg-emerald-400",
 glow: "glow-emerald",
 route: "/student/borrow-history",
 },
];

export const RECENT_ACTIVITIES= [
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

export const UPCOMING_ITEMS= [
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
