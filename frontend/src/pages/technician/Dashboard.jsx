import React, { useEffect, useState } from 'react';
import EquipmentHealth from '../../components/technician/dashboard/EquipmentHealth';
import StatsOverview from '../../components/technician/dashboard/StatsOverview';
import TaskQueue from '../../components/technician/dashboard/TaskQueue';
import TicketPipeline from '../../components/technician/dashboard/TicketPipeline';
import EquipmentStatusPieChart from '../../components/admin/dashboard/EquipmentStatusPieChart';
import MonthlyBorrowTrendChart from '../../components/admin/dashboard/MonthlyBorrowTrendChart';
import DamageTrendChart from '../../components/admin/dashboard/DamageTrendChart';
import MaintenanceAttentionList from '../../components/admin/dashboard/MaintenanceAttentionList';
import MTTRCard from '../../components/admin/dashboard/MTTRCard';
import DamageCauseChart from '../../components/admin/dashboard/DamageCauseChart';
import TopBrokenList from '../../components/admin/dashboard/TopBrokenList';
import RepairOutcomeChart from '../../components/admin/dashboard/RepairOutcomeChart';
import TopBorrowedList from '../../components/admin/dashboard/TopBorrowedList';
import { PageShell, AnimatedSection, AnimatedList, AnimatedListItem } from '@/components/motion';
import { technicianApi } from '@/services/api/technicianApi';

const Dashboard = () => {
  const [equipmentAnalytics, setEquipmentAnalytics] = useState(null);
  const [reportAnalytics, setReportAnalytics] = useState(null);

  useEffect(() => {
    Promise.all([
      technicianApi.getEquipmentAnalytics().then(setEquipmentAnalytics).catch(() => {}),
      technicianApi.getReportAnalytics().then(setReportAnalytics).catch(() => {}),
    ]);
  }, []);

  const topBorrowed = React.useMemo(() => {
    if (!equipmentAnalytics?.topBorrowedEquipment) return [];
    const max = Math.max(...equipmentAnalytics.topBorrowedEquipment.map((i) => i.count), 1);
    return equipmentAnalytics.topBorrowedEquipment.map((item) => ({
      name: item.name,
      count: item.count,
      percentage: (item.count / max) * 100,
    }));
  }, [equipmentAnalytics]);

  return (
    <PageShell
      title="System Status"
      subtitle="Real-time facility maintenance and ticket management"
      topPadding="pt-6"
      className="pb-16 px-6"
    >
      {/* Stats Cards */}
      <AnimatedList className="mb-10">
        <AnimatedListItem>
          <StatsOverview />
        </AnimatedListItem>
      </AnimatedList>

      {/* Ticket Pipeline + Device Health */}
      <AnimatedSection variant="fade" delay={0.1} className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-10">
        <div className="lg:col-span-3">
          <TicketPipeline />
        </div>
        <div className="lg:col-span-2">
          <EquipmentHealth />
        </div>
      </AnimatedSection>

      {/* Active Work Orders */}
      <AnimatedSection variant="slide-up" delay={0.15}>
        <TaskQueue />
      </AnimatedSection>

      {/* ── Section 2: Equipment Warehouse Analytics ── */}
      {equipmentAnalytics && (
        <AnimatedSection variant="slide-up" delay={0.2} className="mt-12">
          <h3 className="text-lg font-extrabold text-[#1A2B56] dark:text-white mb-6">
            Thống kê Quản lý Thiết bị trong Kho
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
            <div className="lg:col-span-3 dashboard-card p-6 rounded-4xl">
              <EquipmentStatusPieChart data={equipmentAnalytics.statusDistribution} />
            </div>
            <div className="lg:col-span-9 dashboard-card p-6 rounded-4xl">
              <MonthlyBorrowTrendChart data={equipmentAnalytics.monthlyBorrowTrend} />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 dashboard-card p-6 rounded-4xl">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-4">
                Top thiết bị được mượn nhiều nhất
              </p>
              <TopBorrowedList items={topBorrowed} />
            </div>
            <div className="lg:col-span-4 dashboard-card p-6 rounded-4xl">
              <DamageTrendChart data={equipmentAnalytics.damageTrend} />
            </div>
            <div className="lg:col-span-4 dashboard-card p-6 rounded-4xl">
              <MaintenanceAttentionList items={equipmentAnalytics.maintenanceAttention} />
            </div>
          </div>
        </AnimatedSection>
      )}

      {/* ── Section 3: Fault Report Analytics ── */}
      {reportAnalytics && (
        <AnimatedSection variant="slide-up" delay={0.25} className="mt-12">
          <h3 className="text-lg font-extrabold text-[#1A2B56] dark:text-white mb-6">
            Thống kê Báo cáo Hư hỏng — KPI Technician
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
            <div className="lg:col-span-3 dashboard-card p-6 rounded-4xl">
              <MTTRCard
                mttrHours={reportAnalytics.mttrHours}
                fixedCount={reportAnalytics.fixedCount}
                damageReportRate={reportAnalytics.damageReportRate}
              />
            </div>
            <div className="lg:col-span-5 dashboard-card p-6 rounded-4xl">
              <DamageCauseChart data={reportAnalytics.causeDistribution} />
            </div>
            <div className="lg:col-span-4 dashboard-card p-6 rounded-4xl">
              <RepairOutcomeChart data={reportAnalytics.repairOutcomes} />
            </div>
          </div>
          <div className="dashboard-card p-6 rounded-4xl">
            <TopBrokenList items={reportAnalytics.topBrokenEquipment} />
          </div>
        </AnimatedSection>
      )}
    </PageShell>
  );
};

export default Dashboard;
