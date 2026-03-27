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

const HomePage = () => {
  const user = useAuthStore((state) => state.user);
  const { activeSchedule, loading: sessionLoading } = useCurrentSession();

  const fetchMyBorrowRequests = useBorrowRequestStore((state) => state.fetchMyBorrowRequests);
  const fetchMyReports = useReportStore((state) => state.fetchMyReports);
  const borrowRequests = useBorrowRequestStore((state) => state.borrowRequests);
  const myReports = useReportStore((state) => state.myReports) || [];

  useEffect(() => {
    fetchMyBorrowRequests();
    fetchMyReports();
  }, [fetchMyBorrowRequests, fetchMyReports]);

  const mappedActivities = useMemo(() => {
    const borrowActs = borrowRequests.map(req => {
      const eqName = req.equipmentId?.name || req.equipmentId?.code || "Equipment";
      const eqCode = req.equipmentId?.code || "EQ";
      
      let title = "";
      let type = "return";
      
      switch (req.status) {
        case 'pending': title = `You requested ${eqName}`; type = "return"; break;
        case 'approved': title = `Your request for ${eqName} was approved`; type = "access"; break;
        case 'handed_over': title = `You received ${eqName}`; type = "return"; break;
        case 'returning': title = `You are returning ${eqName}`; type = "return"; break;
        case 'returned': title = `You returned ${eqName}`; type = "return"; break;
        case 'rejected': title = `Your request for ${eqName} was rejected`; type = "report"; break;
        case 'cancelled': title = `You cancelled ${eqName} request`; type = "report"; break;
        default: title = `Borrow request for ${eqName}`; type = "return"; break;
      }
      
      return {
        id: req._id,
        type,
        title,
        subject: `Code: ${eqCode}`,
        time: req.updatedAt || req.createdAt || req.borrowDate,
      };
    });
    
    const reportActs = myReports.map(rep => {
      const equipInfo = rep.equipmentSnapshot?.name || rep.equipmentId?.name || "Equipment";
      return {
        id: rep._id,
        type: "report",
        title: `You submitted a report for ${equipInfo}`,
        subject: `Report ID: ${String(rep._id).slice(-6).toUpperCase()}`,
        time: rep.createdAt,
      };
    });
    
    return [...borrowActs, ...reportActs]
      .sort((a, b) => new Date(b.time) - new Date(a.time))
      .slice(0, 5);
  }, [borrowRequests, myReports]);

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
