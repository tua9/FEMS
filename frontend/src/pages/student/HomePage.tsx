import {
    AlertCircle,
    ChevronRight,
    Clock,
    History,
    MoreVertical,
    Package,
    TrendingUp,
} from "lucide-react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";

// ── Stat card config ────────────────────────────────────────────────────────
const STAT_CARDS = [
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
    // Navigate to history for a deeper usage breakdown
    route: "/student/borrow-history",
  },
];

const RECENT_ACTIVITIES = [
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

const UPCOMING_ITEMS = [
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

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="student-layout transition-colors duration-300">
      <main className="mx-auto w-full max-w-[1400px] px-4 pt-32 pb-20 sm:px-6 lg:pt-36">
        {/* Welcome Header */}
        <header className="student-page-header">
          <h2>Hello, Alex Chen</h2>
          <p>Welcome back to your University Dashboard.</p>
          <div className="mt-8">
            <button
              onClick={() => navigate("/student/equipment")}
              className="btn-navy group flex items-center gap-3 rounded-full px-8 py-4 font-bold shadow-xl shadow-[#1E2B58]/20 hover:scale-105 active:scale-95"
            >
              Borrow Equipment
              <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </header>

        {/* Stat Cards */}
        <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-7">
          {STAT_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.id}
                to={card.route}
                className="glass-card group relative flex min-h-[170px] flex-col justify-between gap-4 rounded-4xl p-6 transition-all hover:-translate-y-1 hover:shadow-2xl"
              >
                {/* Glow status dot – top right */}
                <div className={`absolute top-5 right-5 h-2 w-2 rounded-full ${card.dot} ${card.glow}`} />

                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${card.color} text-white shadow-xl ${card.iconShadow}`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-black tracking-widest text-[#1E2B58]/40 uppercase dark:text-white/40">
                    {card.title}
                  </p>
                  <h3 className="mt-1 text-3xl font-black text-[#1E2B58] dark:text-white">
                    {card.value}
                  </h3>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
          {/* Recent Activity */}
          <div className="lg:col-span-8">
            <div className="glass-card flex h-full flex-col overflow-hidden rounded-[40px] shadow-sm">
              <div className="flex items-center justify-between border-b border-[#1E2B58]/5 px-6 py-5 sm:px-8 sm:py-6 dark:border-white/5">
                <h3 className="text-xl font-black text-[#1E2B58] dark:text-white">
                  Recent Activity
                </h3>
                <button
                  type="button"
                  onClick={() => navigate("/student/borrow-history")}
                  className="rounded-full p-2 text-[#1E2B58]/40 transition hover:bg-[#1E2B58]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E2B58]/30 dark:text-white/40 dark:hover:bg-white/5"
                  aria-label="View full activity history"
                >
                  <MoreVertical className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 space-y-1 px-3 py-4 sm:px-4 sm:py-5">
                {RECENT_ACTIVITIES.map((activity) => (
                  <button
                    key={activity.id}
                    type="button"
                    onClick={() => navigate(activity.route)}
                    className="group flex w-full items-center gap-4 rounded-[2rem] px-4 py-3 text-left transition hover:bg-[#1E2B58]/4 dark:hover:bg-white/4"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#1E2B58]/8 transition-colors group-hover:bg-[#1E2B58]/10 dark:bg-[#4f75ff]/15 dark:group-hover:bg-[#4f75ff]/25">
                      <Clock className="h-5 w-5 text-[#1E2B58] dark:text-[#4f75ff]" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-[#1E2B58] dark:text-white">
                        {activity.title}
                      </h4>
                      <p className="text-sm font-medium text-[#1E2B58]/50 dark:text-white/50">
                        {activity.time}
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-[#1E2B58]/20 transition-transform group-hover:translate-x-1 dark:text-white/20" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Upcoming / Due Items */}
          <div className="lg:col-span-4">
            <div className="glass-card flex h-full flex-col rounded-[40px] shadow-sm">
              <div className="flex items-center justify-between border-b border-[#1E2B58]/5 px-6 py-5 sm:px-8 sm:py-6 dark:border-white/5">
                <h3 className="text-xl font-black text-[#1E2B58] dark:text-white">
                  Upcoming Due
                </h3>
              </div>
              <div className="flex flex-1 flex-col gap-4 px-6 py-5 sm:px-8 sm:py-6">
                {UPCOMING_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => navigate(item.route)}
                    className="rounded-[2rem] border border-white/60 bg-white/40 p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-white/8 dark:bg-white/5"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className="flex items-center gap-2 rounded-full bg-[#1E2B58] px-3 py-1 text-[10px] font-bold text-white">
                        <Clock className="h-3 w-3" />
                        {item.due}
                      </span>
                    </div>
                    <h4 className="font-black text-[#1E2B58] dark:text-white">
                      {item.title}
                    </h4>
                    <p className="text-xs font-bold tracking-widest text-[#1E2B58]/40 uppercase dark:text-white/40">
                      {item.sku}
                    </p>
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => navigate("/student/borrow-history")}
                  className="glass-btn mt-2 w-full rounded-2xl p-4 text-sm font-bold text-[#1E2B58]/60 transition hover:text-[#1E2B58] dark:text-white/50 dark:hover:text-white"
                >
                  View All Deadlines
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
};

export default HomePage;
