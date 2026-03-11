import React from "react";
import { useNavigate } from "react-router-dom";
import { Clock, ChevronRight } from "lucide-react";
import { AnimatedSection } from "@/components/motion";
import { useBorrowRequestStore } from "@/stores/useBorrowRequestStore";

const RecentActivities: React.FC = () => {
  const borrowRequests = useBorrowRequestStore((state) => state.borrowRequests);
  const navigate = useNavigate();

  // Lấy 5 request gần đây, sắp xếp theo borrow_date giảm dần
  const recentActivities = [...borrowRequests]
    .sort((a, b) => new Date(b.borrow_date).getTime() - new Date(a.borrow_date).getTime())
    .slice(0, 5);

  return (
    <AnimatedSection variant="fade" delay={0.1} className="lg:col-span-8">
      <div className="glass-card flex h-full flex-col overflow-hidden rounded-[40px] shadow-sm">
        <div className="flex items-center justify-between border-b border-[#1E2B58]/5 px-6 py-5 sm:px-8 sm:py-6 dark:border-white/5">
          <h3 className="text-xl font-black text-[#1E2B58] dark:text-white">Recent Activity</h3>
        </div>
        <div className="flex-1 space-y-1 px-3 py-4 sm:px-4 sm:py-5">
          {recentActivities.map((item) => (
            <button
              key={item._id}
              type="button"
              onClick={() => navigate(`/student/borrow-history`)}
              className="group flex w-full items-center gap-4 rounded-4xl px-4 py-3 text-left transition hover:bg-[#1E2B58]/4 dark:hover:bg-white/4"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#1E2B58]/8 transition-colors group-hover:bg-[#1E2B58]/10 dark:bg-[#4f75ff]/15 dark:group-hover:bg-[#4f75ff]/25">
                <Clock className="h-5 w-5 text-[#1E2B58] dark:text-[#4f75ff]" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-[#1E2B58] dark:text-white">
                  {item.type} request
                </h4>
                <p className="text-sm font-medium text-[#1E2B58]/50 dark:text-white/50">
                  {new Intl.DateTimeFormat("en-US", {
                    dateStyle: "short",
                    timeStyle: "short",
                  }).format(new Date(item.borrow_date))}
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-[#1E2B58]/20 transition-transform group-hover:translate-x-1 dark:text-white/20" />
            </button>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
};

export default RecentActivities;