import React, { useEffect, useState } from 'react';
import StatCard from '../components/common/StatCard';
import EquipmentHealthChart from '../components/dashboard/EquipmentHealthChart';
import TopBorrowedList from '../components/dashboard/TopBorrowedList';
import BorrowRequestList from '../components/dashboard/BorrowRequestList';
import RecentDamageReports from '../components/dashboard/RecentDamageReports';
import EquipmentStatusPieChart from '../components/dashboard/EquipmentStatusPieChart';
import MonthlyBorrowTrendChart from '../components/dashboard/MonthlyBorrowTrendChart';
import DamageTrendChart from '../components/dashboard/DamageTrendChart';
import MaintenanceAttentionList from '../components/dashboard/MaintenanceAttentionList';
import MTTRCard from '../components/dashboard/MTTRCard';
import DamageCauseChart from '../components/dashboard/DamageCauseChart';
import TopBrokenList from '../components/dashboard/TopBrokenList';
import RepairOutcomeChart from '../components/dashboard/RepairOutcomeChart';
import { useAdminStore } from '@/stores/useAdminStore';
import type { TopBorrowedItem } from '@/types/admin.types';
import { useNavigate } from 'react-router-dom';
import { PageShell, AnimatedSection, AnimatedList, AnimatedListItem } from '@/components/motion';

const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();
    const {
        stats, fetchStats,
        healthStatus, fetchHealthStatus,
        chartData, fetchChartData,
        borrowRequests, fetchBorrowRequests,
        damageReports, fetchDamageReports,
        equipmentAnalytics, fetchEquipmentAnalytics,
        reportAnalytics, fetchReportAnalytics,
        loading: statsLoading
    } = useAdminStore();

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch from real store
                        await Promise.all([
                    fetchStats(),
                    fetchHealthStatus(),
                    fetchChartData(),
                    fetchBorrowRequests(),
                    fetchDamageReports(),
                    fetchEquipmentAnalytics(),
                    fetchReportAnalytics(),
                ]);
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [fetchStats, fetchHealthStatus, fetchChartData, fetchBorrowRequests, fetchDamageReports, fetchEquipmentAnalytics, fetchReportAnalytics]);

    const topBorrowedDisplay: TopBorrowedItem[] = React.useMemo(() => {
        const raw =
            equipmentAnalytics?.topBorrowedModels?.length > 0
                ? equipmentAnalytics.topBorrowedModels
                : equipmentAnalytics?.topBorrowedEquipment?.length > 0
                    ? equipmentAnalytics.topBorrowedEquipment
                    : chartData?.topBorrowedEquipment ?? [];
        if (!raw.length) return [];
        const maxCount = Math.max(...raw.map((i: any) => i.count), 1);
        return raw.map((item: any) => ({
            name: item.name,
            count: item.count,
            percentage: (item.count / maxCount) * 100
        }));
    }, [equipmentAnalytics, chartData]);

    if (loading || statsLoading || !stats || !healthStatus) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1A2B56] dark:border-blue-400" />
            </div>
        );
    }

    return (
        <PageShell
            title="Admin Dashboard"
            subtitle="Overview of equipment, borrowings and damage reports"
            topPadding="pt-6"
            className="px-6 pb-16"
        >
            {/* ── Stat Cards ── */}
            <AnimatedList className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <AnimatedListItem>
                    <StatCard
                        title="Total Equipment"
                        value={(stats.totalEquipment ?? 0).toLocaleString()}
                        trendValue={`+${stats.equipmentTrend ?? 0}%`}
                        trendLabel="from last month"
                        trendDirection="up"
                        iconName="devices"
                        colorTheme="blue"
                        onClick={() => navigate('/admin/equipment')}
                    />
                </AnimatedListItem>
                <AnimatedListItem>
                    <StatCard
                        title="Broken Equipment"
                        value={stats.brokenEquipment ?? 0}
                        trendValue={`${stats.criticalRepairs ?? 0}`}
                        trendLabel="critical repairs"
                        trendDirection="down"
                        iconName="build_circle"
                        colorTheme="red"
                        onClick={() => navigate('/admin/equipment', { state: { status: 'Broken' } })}
                    />
                </AnimatedListItem>
                <AnimatedListItem>
                    <StatCard
                        title="Pending Approvals"
                        value={stats.pendingRequests ?? 0}
                        trendValue={`Avg. ${stats.avgResponseTimeHours ?? 0}h`}
                        trendLabel="response"
                        trendDirection="neutral"
                        iconName="inventory_2"
                        colorTheme="amber"
                        onClick={() => navigate('/admin/borrowing', { state: { status: 'pending' } })}
                    />
                </AnimatedListItem>
            </AnimatedList>

            <AnimatedList className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <AnimatedListItem>
                    <StatCard
                        title="Borrow rate"
                        value={`${stats.borrowRate ?? 0}%`}
                        trendValue={`${stats.inUseEquipment ?? 0} in use`}
                        trendLabel="of total fleet"
                        trendDirection="neutral"
                        iconName="swap_horiz"
                        colorTheme="blue"
                        onClick={() => navigate('/admin/borrowing')}
                    />
                </AnimatedListItem>
                <AnimatedListItem>
                    <StatCard
                        title="Damage & maintenance load"
                        value={`${stats.damageRate ?? 0}%`}
                        trendValue={`${stats.maintenanceEquipment ?? 0} under care`}
                        trendLabel="broken + maintenance"
                        trendDirection="down"
                        iconName="crisis_alert"
                        colorTheme="amber"
                        onClick={() => navigate('/admin/equipment', { state: { status: 'Maintenance' } })}
                    />
                </AnimatedListItem>
                <AnimatedListItem>
                    <StatCard
                        title="Equipment fault share"
                        value={reportAnalytics != null ? `${reportAnalytics.damageReportRate ?? 0}%` : '—'}
                        trendValue={reportAnalytics != null ? `${reportAnalytics.fixedCount ?? 0} resolved` : 'Loading…'}
                        trendLabel="of all reports"
                        trendDirection="neutral"
                        iconName="assignment_late"
                        colorTheme="red"
                        onClick={() => navigate('/admin/reports')}
                    />
                </AnimatedListItem>
            </AnimatedList>

            {/* ── Analytics ── */}
            <AnimatedSection variant="fade" delay={0.1} className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
                <div className="lg:col-span-8 dashboard-card p-10 rounded-4xl transition-all duration-300 flex flex-col justify-between">
                    <h4 className="font-extrabold text-[#1A2B56] dark:text-white text-xl mb-10">Equipment Performance Analytics</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 flex-1">
                        <EquipmentHealthChart
                            healthyPercentage={healthStatus.healthy}
                            availableNodes={healthStatus.available}
                            maintenanceNodes={healthStatus.maintenance}
                            brokenNodes={healthStatus.broken}
                        />
                        <TopBorrowedList items={topBorrowedDisplay} />
                    </div>
                </div>
                <div className="lg:col-span-4 h-full">
                    <BorrowRequestList
                        requests={borrowRequests}
                        efficiencyRate={stats.efficiencyRate}
                        onViewAll={() => navigate('/admin/borrowing')}
                        onItemClick={(req) => navigate('/admin/borrowing', { state: { requestId: req._id } })}
                    />
                </div>
            </AnimatedSection>

            {/* ── Damage Reports ── */}
            <AnimatedSection variant="slide-up" delay={0.15}>
                <RecentDamageReports
                    reports={damageReports}
                    onViewAll={() => navigate('/admin/reports')}
                    onRowClick={(rep) => navigate('/admin/reports', { state: { reportId: rep._id } })}
                />
            </AnimatedSection>

            {/* ── Section 2: Equipment Warehouse Analytics ── */}
            {equipmentAnalytics && (
                <AnimatedSection variant="slide-up" delay={0.2} className="mt-10">
                    <h3 className="text-lg font-extrabold text-[#1A2B56] dark:text-white mb-6">
                        Warehouse and borrowing analytics
                    </h3>
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
                        {/* Status pie */}
                        <div className="lg:col-span-3 dashboard-card p-6 rounded-4xl">
                            <EquipmentStatusPieChart data={equipmentAnalytics.statusDistribution} />
                        </div>
                        {/* Monthly trend */}
                        <div className="lg:col-span-9 dashboard-card p-6 rounded-4xl">
                            <MonthlyBorrowTrendChart data={equipmentAnalytics.monthlyBorrowTrend} />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Top borrowed */}
                        <div className="lg:col-span-4 dashboard-card p-6 rounded-4xl">
                            <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-4">
                                Most borrowed equipment (by model)
                            </p>
                            <TopBorrowedList items={topBorrowedDisplay} />
                        </div>
                        {/* Damage trend */}
                        <div className="lg:col-span-4 dashboard-card p-6 rounded-4xl">
                            <DamageTrendChart data={equipmentAnalytics.damageTrend} />
                        </div>
                        {/* Maintenance attention */}
                        <div className="lg:col-span-4 dashboard-card p-6 rounded-4xl">
                            <MaintenanceAttentionList items={equipmentAnalytics.maintenanceAttention} />
                        </div>
                    </div>
                </AnimatedSection>
            )}

            {/* ── Section 3: Fault Report Analytics ── */}
            {reportAnalytics && (
                <AnimatedSection variant="slide-up" delay={0.25} className="mt-10">
                    <h3 className="text-lg font-extrabold text-[#1A2B56] dark:text-white mb-6">
                        Fault report analytics
                    </h3>
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
                        {/* MTTR */}
                        <div className="lg:col-span-3 dashboard-card p-6 rounded-4xl">
                            <MTTRCard
                                mttrHours={reportAnalytics.mttrHours}
                                fixedCount={reportAnalytics.fixedCount}
                                damageReportRate={reportAnalytics.damageReportRate}
                            />
                        </div>
                        {/* Cause chart */}
                        <div className="lg:col-span-5 dashboard-card p-6 rounded-4xl">
                            <DamageCauseChart data={reportAnalytics.causeDistribution} />
                        </div>
                        {/* Repair outcome */}
                        <div className="lg:col-span-4 dashboard-card p-6 rounded-4xl">
                            <RepairOutcomeChart data={reportAnalytics.repairOutcomes} />
                        </div>
                    </div>
                    {/* Top broken */}
                    <div className="dashboard-card p-6 rounded-4xl">
                        <TopBrokenList items={reportAnalytics.topBrokenEquipment} />
                    </div>
                </AnimatedSection>
            )}
        </PageShell>
    );
};

export default AdminDashboard;
