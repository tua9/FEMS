import React from "react";
import { Link } from "react-router-dom";
import { Package, Clock, AlertCircle } from "lucide-react";
import { AnimatedList, AnimatedListItem } from "@/components/motion";
import { useBorrowRequestStore } from "@/stores/useBorrowRequestStore";
import { useReportStore } from "@/stores/useReportStore";

const StudentStatCard = () => {
  const borrowRequests = useBorrowRequestStore((state) => state.borrowRequests);
  const myReports = useReportStore((state) => state.myReports);

  const statCards = [
    {
      id: "active-borrows",
      title: "Active Borrowings",
      value: String(
        borrowRequests.filter((r) =>
          ["approved", "handed_over", "returning"].includes(r.status)
        ).length
      ),
      icon: Package,
      color: "bg-blue-500",
      iconShadow: "shadow-blue-500/40",
      dot: "bg-blue-400",
      glow: "glow-blue",
      route: "/student/borrow-history",
    },
    {
      id: "pending-requests",
      title: "Pending Requests",
      value: String(borrowRequests.filter((r) => r.status === "pending").length),
      icon: Clock,
      color: "bg-amber-500",
      iconShadow: "shadow-amber-500/40",
      dot: "bg-amber-400",
      glow: "glow-amber",
      route: "/student/borrow-history",
    },
    {
      id: "reports-submitted",
      title: "Reports Submitted",
      value: String(myReports.length),
      icon: AlertCircle,
      color: "bg-rose-500",
      iconShadow: "shadow-rose-500/40",
      dot: "bg-rose-400",
      glow: "glow-rose",
      route: "/student/borrow-history?tab=report",
    },
  ];

  return (
    <AnimatedList className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-3 lg:grid-cols-3 lg:gap-7">
      {statCards.map((card) => {
        const Icon = card.icon;
        return (
          <AnimatedListItem key={card.id}>
            <Link
              to={card.route}
              className="glass-card group relative flex min-h-42.5 flex-col justify-between gap-4 rounded-4xl p-6 transition-all hover:-translate-y-1 hover:shadow-2xl"
            >
              <div
                className={`absolute top-5 right-5 h-2 w-2 rounded-full ${card.dot} ${card.glow}`}
              />
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
          </AnimatedListItem>
        );
      })}
    </AnimatedList>
  );
};

export default StudentStatCard;