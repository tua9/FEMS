import React from "react";
import { Link } from "react-router-dom";
import {
  Package,
  History,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import { AnimatedList, AnimatedListItem } from "@/components/motion";
import { useBorrowRequestStore } from "@/stores/useBorrowRequestStore";

const StatCards: React.FC = () => {
  const borrowRequests = useBorrowRequestStore((state) => state.borrowRequests);

  const totalRequests = borrowRequests.length;

  const activeBorrowCount = borrowRequests.filter(
    (item) => item.status === "approved"
  ).length;

  const pendingRequestCount = borrowRequests.filter(
    (item) => item.status === "pending"
  ).length;

  const returnedCount = borrowRequests.filter(
    (item) => item.status === "returned"
  ).length;

  const usageScore =
    totalRequests === 0
      ? 0
      : Math.round((returnedCount / totalRequests) * 100);

  const statCards = [
    {
      id: "active-borrows",
      title: "Active Borrow",
      value: String(activeBorrowCount),
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
      value: String(totalRequests),
      icon: History,
      color: "bg-purple-500",
      iconShadow: "shadow-purple-500/40",
      dot: "bg-purple-400",
      glow: "glow-purple",
      route: "/student/borrow-history",
    },
    {
      id: "pending-requests",
      title: "Pending Request",
      value: String(pendingRequestCount),
      icon: AlertCircle,
      color: "bg-orange-500",
      iconShadow: "shadow-orange-500/40",
      dot: "bg-orange-400",
      glow: "glow-orange",
      route: "/student/borrow-history",
    },
    {
      id: "usage",
      title: "Usage Score",
      value: `${usageScore}%`,
      icon: TrendingUp,
      color: "bg-emerald-500",
      iconShadow: "shadow-emerald-500/40",
      dot: "bg-emerald-400",
      glow: "glow-emerald",
      route: "/student/borrow-history",
    },
  ];

  return (
    <AnimatedList className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-7">
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

export default StatCards;