import React, { useMemo } from "react";
import { Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AnimatedSection } from "@/components/motion";
import type { BorrowRequest } from "@/types/borrowRequest";

type UpcomingDueProps = {
  borrowRequests: BorrowRequest[];
};

const getUpcomingTitle = (item: BorrowRequest) => {
  if (item.type === "equipment") {
    return typeof item.equipment_id === "object" && item.equipment_id
      ? item.equipment_id.name
      : "Equipment";
  }

  return typeof item.room_id === "object" && item.room_id
    ? item.room_id.name
    : "Room";
};

const getUpcomingSubtitle = (item: BorrowRequest) => {
  if (item.type === "equipment") {
    return typeof item.equipment_id === "object" && item.equipment_id?.category
      ? item.equipment_id.category
      : "Equipment";
  }

  return typeof item.room_id === "object" && item.room_id?.type
    ? item.room_id.type
    : "Room";
};

const formatDueLabel = (returnDate: string) => {
  const dueDate = new Date(returnDate);
  const today = new Date();

  const diffMs = dueDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "Overdue";
  if (diffDays === 0) return "Due today";
  if (diffDays === 1) return "Due in 1 day";
  return `Due in ${diffDays} days`;
};

const UpcomingDue: React.FC<UpcomingDueProps> = ({ borrowRequests }) => {
  const navigate = useNavigate();

  const upcomingItems = useMemo(() => {
    return [...borrowRequests]
      .filter(
        (item) =>
          item.status === "approved" || item.status === "handed_over"
      )
      .sort(
        (a, b) =>
          new Date(a.return_date).getTime() - new Date(b.return_date).getTime()
      )
      .slice(0, 5);
  }, [borrowRequests]);

  return (
    <AnimatedSection variant="slide-up" delay={0.15} className="lg:col-span-4">
      <div className="glass-card flex h-full flex-col rounded-[40px] shadow-sm">
        <div className="flex items-center justify-between border-b border-[#1E2B58]/5 px-6 py-5 sm:px-8 sm:py-6 dark:border-white/5">
          <h3 className="text-xl font-black text-[#1E2B58] dark:text-white">
            Upcoming Due
          </h3>
        </div>

        <div className="flex flex-1 flex-col gap-4 px-6 py-5 sm:px-8 sm:py-6">
          {upcomingItems.length === 0 ? (
            <div className="text-sm font-medium text-[#1E2B58]/50 dark:text-white/50">
              Không có lịch trả sắp tới.
            </div>
          ) : (
            upcomingItems.map((item) => (
              <button
                key={item._id}
                type="button"
                onClick={() => navigate("/student/borrow-history")}
                className="rounded-4xl border border-white/60 bg-white/40 p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-white/8 dark:bg-white/5"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="flex items-center gap-2 rounded-full bg-[#1E2B58] px-3 py-1 text-[10px] font-bold text-white">
                    <Clock className="h-3 w-3" />
                    {formatDueLabel(item.return_date)}
                  </span>
                </div>

                <h4 className="font-black text-[#1E2B58] dark:text-white">
                  {getUpcomingTitle(item)}
                </h4>

                <p className="text-xs font-bold tracking-widest text-[#1E2B58]/40 uppercase dark:text-white/40">
                  {getUpcomingSubtitle(item)}
                </p>
              </button>
            ))
          )}

          <button
            type="button"
            onClick={() => navigate("/student/borrow-history")}
            className="glass-btn mt-2 w-full rounded-2xl p-4 text-sm font-bold text-[#1E2B58]/60 transition hover:text-[#1E2B58] dark:text-white/50 dark:hover:text-white"
          >
            View All Deadlines
          </button>
        </div>
      </div>
    </AnimatedSection>
  );
};

export default UpcomingDue;