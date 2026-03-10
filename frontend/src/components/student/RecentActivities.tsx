import React, { useMemo } from "react";
import { ChevronRight, Clock, MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AnimatedSection } from "@/components/motion";
import type { BorrowRequest } from "@/types/borrowRequest";

type RecentActivitiesProps = {
  borrowRequests: BorrowRequest[];
};

const formatActivityTitle = (item: BorrowRequest) => {
  const equipmentName =
    typeof item.equipment_id === "object" && item.equipment_id
      ? item.equipment_id.name
      : "Equipment";

  const roomName =
    typeof item.room_id === "object" && item.room_id
      ? item.room_id.name
      : "Room";

  if (item.type === "equipment") {
    return `Borrow request for ${equipmentName}`;
  }

  return `Borrow request for ${roomName}`;
};

const formatActivityTime = (dateString?: string) => {
  if (!dateString) return "Unknown time";

  return new Date(dateString).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const RecentActivities: React.FC<RecentActivitiesProps> = ({ borrowRequests }) => {
  const navigate = useNavigate();

  const recentActivities = useMemo(() => {
    return [...borrowRequests]
      .sort((a, b) => {
        const aTime = new Date(a.createdAt || a.borrow_date).getTime();
        const bTime = new Date(b.createdAt || b.borrow_date).getTime();
        return bTime - aTime;
      })
      .slice(0, 5);
  }, [borrowRequests]);

  return (
    <AnimatedSection variant="fade" delay={0.1} className="lg:col-span-8">
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
          {recentActivities.length === 0 ? (
            <div className="px-4 py-6 text-sm font-medium text-[#1E2B58]/50 dark:text-white/50">
              Chưa có hoạt động nào.
            </div>
          ) : (
            recentActivities.map((activity) => (
              <button
                key={activity._id}
                type="button"
                onClick={() => navigate("/student/borrow-history")}
                className="group flex w-full items-center gap-4 rounded-4xl px-4 py-3 text-left transition hover:bg-[#1E2B58]/4 dark:hover:bg-white/4"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#1E2B58]/8 transition-colors group-hover:bg-[#1E2B58]/10 dark:bg-[#4f75ff]/15 dark:group-hover:bg-[#4f75ff]/25">
                  <Clock className="h-5 w-5 text-[#1E2B58] dark:text-[#4f75ff]" />
                </div>

                <div className="flex-1">
                  <h4 className="font-bold text-[#1E2B58] dark:text-white">
                    {formatActivityTitle(activity)}
                  </h4>
                  <p className="text-sm font-medium text-[#1E2B58]/50 dark:text-white/50">
                    {formatActivityTime(activity.createdAt || activity.borrow_date)}
                  </p>
                </div>

                <ChevronRight className="h-5 w-5 text-[#1E2B58]/20 transition-transform group-hover:translate-x-1 dark:text-white/20" />
              </button>
            ))
          )}
        </div>
      </div>
    </AnimatedSection>
  );
};

export default RecentActivities;