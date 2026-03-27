import React, { useEffect, useState } from 'react';
import EquipmentStatusPieChart from '@/features/admin/components/dashboard/EquipmentStatusPieChart';
import MonthlyBorrowTrendChart from '@/features/admin/components/dashboard/MonthlyBorrowTrendChart';
import DamageTrendChart from '@/features/admin/components/dashboard/DamageTrendChart';
import MaintenanceAttentionList from '@/features/admin/components/dashboard/MaintenanceAttentionList';
import MTTRCard from '@/features/admin/components/dashboard/MTTRCard';
import DamageCauseChart from '@/features/admin/components/dashboard/DamageCauseChart';
import TopBrokenList from '@/features/admin/components/dashboard/TopBrokenList';
import RepairOutcomeChart from '@/features/admin/components/dashboard/RepairOutcomeChart';
import TopBorrowedList from '@/features/admin/components/dashboard/TopBorrowedList';
import { PageShell, AnimatedSection } from '@/components/motion';
import { technicianApi } from '@/services/technicianApi';

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
      {/* ── Section 1: Equipment Warehouse Analytics ── */}
      {equipmentAnalytics && (
        <AnimatedSection variant="slide-up" delay={0.1} className="mt-4">
          <h3 className="text-lg font-extrabold text-[#1A2B56] dark:text-white mb-6">
            Equipment Warehouse Analytics
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
                Most Borrowed Equipment
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

      {/* ── Section 2: Damage Report Analytics ── */}
      {reportAnalytics && (
        <AnimatedSection variant="slide-up" delay={0.2} className="mt-12">
          <h3 className="text-lg font-extrabold text-[#1A2B56] dark:text-white mb-6">
            Damage Report Analytics — Technician KPIs
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
