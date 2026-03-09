import {
    ChevronRight,
    Clock,
    MoreVertical,
} from "lucide-react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { PageShell, AnimatedList, AnimatedListItem, AnimatedSection } from "@/components/motion";
import {
  STAT_CARDS,
  RECENT_ACTIVITIES,
  UPCOMING_ITEMS,
} from "@/data/student/mockStudentHome";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <PageShell topPadding="pt-32" className="pb-20 px-4 sm:px-6">
      <div className="mx-auto w-full max-w-350">
        {/* Welcome Header */}
        <AnimatedSection variant="curtain" delay={0} className="mb-12">
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
        </AnimatedSection>

        {/* Stat Cards */}
        <AnimatedList className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-7">
          {STAT_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <AnimatedListItem key={card.id}>
                <Link
                  to={card.route}
                  className="glass-card group relative flex min-h-42.5 flex-col justify-between gap-4 rounded-4xl p-6 transition-all hover:-translate-y-1 hover:shadow-2xl"
                >
                  <div className={`absolute top-5 right-5 h-2 w-2 rounded-full ${card.dot} ${card.glow}`} />
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${card.color} text-white shadow-xl ${card.iconShadow}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs font-black tracking-widest text-[#1E2B58]/40 uppercase dark:text-white/40">{card.title}</p>
                    <h3 className="mt-1 text-3xl font-black text-[#1E2B58] dark:text-white">{card.value}</h3>
                  </div>
                </Link>
              </AnimatedListItem>
            );
          })}
        </AnimatedList>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
          {/* Recent Activity */}
          <AnimatedSection variant="fade" delay={0.1} className="lg:col-span-8">
            <div className="glass-card flex h-full flex-col overflow-hidden rounded-[40px] shadow-sm">
              <div className="flex items-center justify-between border-b border-[#1E2B58]/5 px-6 py-5 sm:px-8 sm:py-6 dark:border-white/5">
                <h3 className="text-xl font-black text-[#1E2B58] dark:text-white">Recent Activity</h3>
                <button type="button" onClick={() => navigate("/student/borrow-history")} className="rounded-full p-2 text-[#1E2B58]/40 transition hover:bg-[#1E2B58]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E2B58]/30 dark:text-white/40 dark:hover:bg-white/5" aria-label="View full activity history">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 space-y-1 px-3 py-4 sm:px-4 sm:py-5">
                {RECENT_ACTIVITIES.map((activity) => (
                  <button key={activity.id} type="button" onClick={() => navigate(activity.route)} className="group flex w-full items-center gap-4 rounded-4xl px-4 py-3 text-left transition hover:bg-[#1E2B58]/4 dark:hover:bg-white/4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#1E2B58]/8 transition-colors group-hover:bg-[#1E2B58]/10 dark:bg-[#4f75ff]/15 dark:group-hover:bg-[#4f75ff]/25">
                      <Clock className="h-5 w-5 text-[#1E2B58] dark:text-[#4f75ff]" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-[#1E2B58] dark:text-white">{activity.title}</h4>
                      <p className="text-sm font-medium text-[#1E2B58]/50 dark:text-white/50">{activity.time}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-[#1E2B58]/20 transition-transform group-hover:translate-x-1 dark:text-white/20" />
                  </button>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* Upcoming / Due Items */}
          <AnimatedSection variant="slide-up" delay={0.15} className="lg:col-span-4">
            <div className="glass-card flex h-full flex-col rounded-[40px] shadow-sm">
              <div className="flex items-center justify-between border-b border-[#1E2B58]/5 px-6 py-5 sm:px-8 sm:py-6 dark:border-white/5">
                <h3 className="text-xl font-black text-[#1E2B58] dark:text-white">Upcoming Due</h3>
              </div>
              <div className="flex flex-1 flex-col gap-4 px-6 py-5 sm:px-8 sm:py-6">
                {UPCOMING_ITEMS.map((item) => (
                  <button key={item.id} type="button" onClick={() => navigate(item.route)} className="rounded-4xl border border-white/60 bg-white/40 p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-white/8 dark:bg-white/5">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="flex items-center gap-2 rounded-full bg-[#1E2B58] px-3 py-1 text-[10px] font-bold text-white">
                        <Clock className="h-3 w-3" />{item.due}
                      </span>
                    </div>
                    <h4 className="font-black text-[#1E2B58] dark:text-white">{item.title}</h4>
                    <p className="text-xs font-bold tracking-widest text-[#1E2B58]/40 uppercase dark:text-white/40">{item.sku}</p>
                  </button>
                ))}
                <button type="button" onClick={() => navigate("/student/borrow-history")} className="glass-btn mt-2 w-full rounded-2xl p-4 text-sm font-bold text-[#1E2B58]/60 transition hover:text-[#1E2B58] dark:text-white/50 dark:hover:text-white">
                  View All Deadlines
                </button>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </PageShell>
  );
};

export default HomePage;
