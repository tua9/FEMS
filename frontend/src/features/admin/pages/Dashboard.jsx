import React, { useEffect, useState } from 'react';
import EquipmentHealthChart from '../components/dashboard/EquipmentHealthChart';
import TopBorrowedList from '../components/dashboard/TopBorrowedList';
import RecentDamageReports from '../components/dashboard/RecentDamageReports';
import MaintenanceAttentionList from '../components/dashboard/MaintenanceAttentionList';
import TopBrokenList from '../components/dashboard/TopBrokenList';
import RepairOutcomeChart from '../components/dashboard/RepairOutcomeChart';
import TechnicianPerformanceCard from '../components/dashboard/TechnicianPerformanceCard';
import { useAdminStore } from '@/stores/useAdminStore';
import { useNavigate } from 'react-router-dom';
import { PageShell, AnimatedSection } from '@/components/motion';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const {
        stats, fetchStats,
        healthStatus, fetchHealthStatus,
        chartData, fetchChartData,
        damageReports, fetchDamageReports,
        equipmentAnalytics, fetchEquipmentAnalytics,
        reportAnalytics, fetchReportAnalytics,
        technicianPerformance, fetchTechnicianPerformance,
        loading: statsLoading
    } = useAdminStore();

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                await Promise.all([
                    fetchStats(),
                    fetchHealthStatus(),
                    fetchChartData(),
                    fetchDamageReports(),
                    fetchEquipmentAnalytics(),
                    fetchReportAnalytics(),
                    fetchTechnicianPerformance(),
                ]);
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [fetchStats, fetchHealthStatus, fetchChartData, fetchDamageReports, fetchEquipmentAnalytics, fetchReportAnalytics, fetchTechnicianPerformance]);

    const topBorrowedDisplay = React.useMemo(() => {
        const raw =
            equipmentAnalytics?.topBorrowedModels?.length > 0
                ? equipmentAnalytics.topBorrowedModels
                : equipmentAnalytics?.topBorrowedEquipment?.length > 0
                    ? equipmentAnalytics.topBorrowedEquipment
                    : chartData?.topBorrowedEquipment ?? [];
        if (!raw.length) return [];
        const maxCount = Math.max(...raw.map((i) => i.count), 1);
        return raw.map((item) => ({
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

            {/* ── Section 1: Equipment Performance Analytics ── */}
            <AnimatedSection variant="fade" delay={0.1} className="mb-8">
                <div className="dashboard-card p-10 rounded-4xl transition-all duration-300">
                    <h4 className="font-extrabold text-[#1A2B56] dark:text-white text-xl mb-10">Equipment Performance Analytics</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
                        <div className="md:col-span-1 border-r border-slate-100 dark:border-slate-700/50 pr-8">
                            <EquipmentHealthChart
                                healthyPercentage={healthStatus.healthy}
                                availableNodes={healthStatus.available}
                                maintenanceNodes={healthStatus.maintenance}
                                brokenNodes={healthStatus.broken}
                            />
                        </div>
                        <div className="md:col-span-1 lg:col-span-2">
                            <TopBorrowedList items={topBorrowedDisplay} />
                        </div>
                    </div>
                </div>
            </AnimatedSection>

            {/* ── Section 2: Recent Damage Reports (Table) ── */}
            <AnimatedSection variant="slide-up" delay={0.15} className="mb-10">
                <RecentDamageReports
                    reports={damageReports}
                    onViewAll={() => navigate('/admin/reports')}
                    onRowClick={(rep) => navigate('/admin/reports', { state: { reportId: rep._id } })}
                />
            </AnimatedSection>

            {/* ── Section 3: Strategic Analytics Matrix ── */}
            <AnimatedSection variant="slide-up" delay={0.2}>
                <h3 className="text-lg font-extrabold text-[#1A2B56] dark:text-white mb-6">
                    Fleet and Repair Performance Matrix
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-fr">
                    {/* Repair Quality - 3/4 Wide Landscape */}
                    <div className="lg:col-span-3 md:col-span-2 dashboard-card p-8 rounded-4xl">
                        <RepairOutcomeChart data={reportAnalytics?.repairOutcomes || []} />
                    </div>

                    {/* Team Productivity - 1/4 Compact Portrait */}
                    <div className="lg:col-span-1 md:col-span-1 dashboard-card p-8 rounded-4xl">
                        <TechnicianPerformanceCard data={technicianPerformance} />
                    </div>

                    {/* Problematic Assets - 2/4 Medium Wide */}
                    <div className="lg:col-span-2 md:col-span-1 dashboard-card p-8 rounded-4xl">
                        <TopBrokenList items={reportAnalytics?.topBrokenEquipment || []} />
                    </div>

                    {/* System Reliability - 2/4 Medium Wide */}
                    <div className="lg:col-span-2 md:col-span-1 dashboard-card p-8 rounded-4xl">
                        <MaintenanceAttentionList 
                            items={equipmentAnalytics?.maintenanceAttention || []} 
                            trendData={equipmentAnalytics?.damageTrend || []}
                        />
                    </div>
                </div>
            </AnimatedSection>
        </PageShell>
    );
};

export default AdminDashboard;
