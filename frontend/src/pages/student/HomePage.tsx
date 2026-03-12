import {
    ChevronRight,
    Clock,
    MoreVertical,
} from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { PageShell, AnimatedList, AnimatedListItem, AnimatedSection } from "@/components/motion";
import { PageHeader } from "@/components/shared/PageHeader";
import { StudentStatCard } from "@/components/student/dashboard";
import {
  STUDENT_STAT_CARDS as STAT_CARDS,
  STUDENT_RECENT_ACTIVITIES as RECENT_ACTIVITIES,
  STUDENT_UPCOMING_ITEMS as UPCOMING_ITEMS,
} from "@/data/student/mockStudentData";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <PageShell className="pb-20 px-4 sm:px-6">
      <div className="mx-auto w-full max-w-350">
        {/* Welcome Header */}
        <AnimatedSection variant="curtain" delay={0} className="mb-10">
          <PageHeader
            title="Hello, Alex Chen"
            subtitle="Welcome back to your University Dashboard."
          />
        </AnimatedSection>

        {/* Stat Cards */}
        <AnimatedList className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-7">
          {STAT_CARDS.map((card) => (
            <AnimatedListItem key={card.id}>
              <StudentStatCard card={card} />
            </AnimatedListItem>
          ))}
        </AnimatedList>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
          {/* Recent Activity */}
          <AnimatedSection variant="fade" delay={0.1} className="lg:col-span-8">
            <div className="dashboard-card flex h-full flex-col overflow-hidden rounded-[40px]">
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
            <div className="dashboard-card flex h-full flex-col rounded-[40px]">
              <div className="flex items-center justify-between border-b border-[#1E2B58]/5 px-6 py-5 sm:px-8 sm:py-6 dark:border-white/5">
                <h3 className="text-xl font-black text-[#1E2B58] dark:text-white">Upcoming Due</h3>
              </div>
              <div className="flex flex-1 flex-col gap-4 px-6 py-5 sm:px-8 sm:py-6">
                {UPCOMING_ITEMS.map((item) => (
                  <button key={item.id} type="button" onClick={() => navigate(item.route)} className="dashboard-card rounded-4xl p-5 text-left transition hover:-translate-y-0.5">
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
