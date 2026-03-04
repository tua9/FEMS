import React from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Package,
  History,
  AlertCircle,
  TrendingUp,
  Clock,
  ChevronRight,
  MoreVertical,
} from "lucide-react";

// ── Stat card config ────────────────────────────────────────────────────────
const STAT_CARDS = [
  {
    id: "active-borrows",
    title: "Active Borrows",
    value: "3",
    icon: Package,
    color: "bg-blue-500",
    route: "/student/borrow-history",
  },
  {
    id: "history",
    title: "Total History",
    value: "24",
    icon: History,
    color: "bg-purple-500",
    route: "/student/borrow-history",
  },
  {
    id: "pending-reports",
    title: "Pending Reports",
    value: "1",
    icon: AlertCircle,
    color: "bg-orange-500",
    route: "/student/report",
  },
  {
    id: "usage",
    title: "Usage Score",
    value: "92%",
    icon: TrendingUp,
    color: "bg-emerald-500",
    route: "#",
  },
];

const RECENT_ACTIVITIES = [
  {
    id: 1,
    title: "Borrowed MacBook Pro M2",
    time: "2 hours ago",
    type: "borrow",
  },
  {
    id: 2,
    title: "Submitted issue: Projector lamp",
    time: "Yesterday",
    type: "report",
  },
  {
    id: 3,
    title: "Returned iPad Air 5th Gen",
    time: "3 days ago",
    type: "return",
  },
];

const UPCOMING_ITEMS = [
  {
    id: 1,
    title: "MacBook Pro M2",
    due: "Due in 2 days",
    sku: "FPT-LAP-082",
  },
  {
    id: 2,
    title: "4K Laser Projector",
    due: "Due in 5 days",
    sku: "FPT-PJ-014",
  },
];

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="student-layout transition-colors duration-300">
      <main className="mx-auto w-full max-w-[1400px] px-6 pt-36 pb-20">
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
        <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STAT_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.id}
                to={card.route}
                className="glass-card group flex flex-col gap-4 rounded-4xl p-6 transition-all hover:translate-y-[-4px] hover:shadow-2xl"
              >
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${card.color} text-white shadow-lg`}
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
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Recent Activity */}
          <div className="lg:col-span-8">
            <div className="glass-card overflow-hidden rounded-[40px] shadow-sm">
              <div className="flex items-center justify-between border-b border-[#1E2B58]/5 p-8 dark:border-white/5">
                <h3 className="text-xl font-black text-[#1E2B58] dark:text-white">
                  Recent Activity
                </h3>
                <button className="rounded-full p-2 text-[#1E2B58]/40 transition hover:bg-[#1E2B58]/5 dark:text-white/40 dark:hover:bg-white/5">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </div>
              <div className="p-4">
                {RECENT_ACTIVITIES.map((activity) => (
                  <div
                    key={activity.id}
                    className="group flex items-center gap-4 rounded-[2rem] p-4 transition hover:bg-[#1E2B58]/4 dark:hover:bg-white/4"
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
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Upcoming / Due Items */}
          <div className="lg:col-span-4">
            <div className="glass-card h-full rounded-[40px] shadow-sm">
              <div className="flex items-center justify-between border-b border-[#1E2B58]/5 p-8 dark:border-white/5">
                <h3 className="text-xl font-black text-[#1E2B58] dark:text-white">
                  Upcoming Due
                </h3>
              </div>
              <div className="flex flex-col gap-4 p-8">
                {UPCOMING_ITEMS.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-[2rem] border border-[#1E2B58]/5 bg-white/20 p-5 dark:border-white/5 dark:bg-white/5"
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
                  </div>
                ))}
                <button className="mt-4 w-full rounded-2xl border border-dashed border-[#1E2B58]/20 p-4 text-sm font-bold text-[#1E2B58]/40 transition hover:bg-[#1E2B58]/5 dark:border-white/20 dark:text-white/40 dark:hover:bg-white/5">
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
