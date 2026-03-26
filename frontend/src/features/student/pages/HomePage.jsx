import React, { useEffect, useMemo } from "react";
import { PageShell, AnimatedSection } from "@/components/motion";
import { useAuthStore } from "@/stores/useAuthStore";
import { useBorrowRequestStore } from "@/stores/useBorrowRequestStore";
import { useReportStore } from "@/stores/useReportStore";
import { useCurrentSession } from "@/hooks/student/useCurrentSession";

import CurrentSessionCard from "@/features/student/components/dashboard/CurrentSessionCard";
import StudentStatCard from "@/features/student/components/dashboard/StudentStatCard";
import { RecentActivityList } from "@/features/shared/components/dashboard/RecentActivityList";
import UpcomingDue from "@/features/student/components/dashboard/UpcomingDue";

const STATUS_LABEL = {
  pending:     "You submitted a borrow request",
  approved:    "Your request was approved",
  handed_over: "You received equipment",
  returned:    "You returned equipment",
  rejected:    "Your request was rejected",
  cancelled:   "Your request was cancelled",
};

const STATUS_TYPE = {
  pending:     "return",
  approved:    "access",
  handed_over: "return",
  returned:    "return",
  rejected:    "report",
  cancelled:   "report",
};

const HomePage = () => {
  const user = useAuthStore((state) => state.user);
  const { activeSchedule, loading: sessionLoading } = useCurrentSession();

  const fetchMyBorrowRequests = useBorrowRequestStore((state) => state.fetchMyBorrowRequests);
  const fetchMyReports = useReportStore((state) => state.fetchMyReports);
  const borrowRequests = useBorrowRequestStore((state) => state.borrowRequests);

  useEffect(() => {
    fetchMyBorrowRequests();
    fetchMyReports();
  }, [fetchMyBorrowRequests, fetchMyReports]);

  const mappedActivities = useMemo(() => {
    return [...borrowRequests]
      .sort((a, b) => new Date(b.createdAt || b.borrowDate) - new Date(a.createdAt || a.borrowDate))
      .slice(0, 5)
      .map((req) => ({
        id:      req._id,
        type:    STATUS_TYPE[req.status] || "return",
        title:   STATUS_LABEL[req.status] || "Borrow request",
        subject: req.equipmentId?.name || req.equipmentId || "Equipment",
        time:    req.createdAt || req.borrowDate,
      }));
  }, [borrowRequests]);

  return (
    <PageShell className="pb-20 px-4 sm:px-6">
      <div className="mx-auto w-full max-w-350">
        {/* Welcome Header */}
        <AnimatedSection variant="curtain" delay={0} className="mb-12">
          <header className="student-page-header">
            <h2>Hello, {user?.displayName || user?.username || "User"}</h2>
            <p>Welcome back to your University Dashboard.</p>
          </header>
        </AnimatedSection>

        {/* Current Learning Session */}
        <CurrentSessionCard schedule={activeSchedule} loading={sessionLoading} />

        {/* Quick Stats */}
        <StudentStatCard />

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
          <RecentActivityList
            activities={mappedActivities}
            viewAllRoute="/student/borrow-history"
            className="lg:col-span-8"
          />
          <UpcomingDue />
        </div>
      </div>
    </PageShell>
  );
};

export default HomePage;
