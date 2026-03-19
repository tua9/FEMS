import { ChevronRight } from "lucide-react";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageShell, AnimatedSection } from "@/components/motion";
import { useBorrowRequestStore } from "@/stores/useBorrowRequestStore";
import { useReportStore } from "@/stores/useReportStore";
import { useAuthStore } from "@/stores/useAuthStore";

import StudentStatCard from "@/components/student/dashboard/StudentStatCard";
import RecentActivities from "@/components/student/dashboard/RecentActivities";
import UpcomingDue from "@/components/student/dashboard/UpcomingDue";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  // fetch borrowRequests khi vào HomePage
  const fetchMyBorrowRequests = useBorrowRequestStore(
    (state) => state.fetchMyBorrowRequests
  );

  // fetch reports khi vào HomePage
  const fetchMyReports = useReportStore((state) => state.fetchMyReports);

  useEffect(() => {
    fetchMyBorrowRequests();
    fetchMyReports();
  }, [fetchMyBorrowRequests, fetchMyReports]);

  return (
    <PageShell className="pb-20 px-4 sm:px-6">
      <div className="mx-auto w-full max-w-350">
        {/* Welcome Header */}
        <AnimatedSection variant="curtain" delay={0} className="mb-12">
          <header className="student-page-header">
            <h2>Hello, {user?.displayName || user?.username || "User"}</h2>
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
        <StudentStatCard />

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
          {/* Recent Activity */}
          <RecentActivities />

          {/* Upcoming / Due Items */}
          <UpcomingDue />
        </div>
      </div>
    </PageShell>
  );
};

export default HomePage;