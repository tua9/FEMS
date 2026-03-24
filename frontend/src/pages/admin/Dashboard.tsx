import React, { useEffect, useState } from 'react';
import StatCard from '../../components/admin/common/StatCard';
import EquipmentHealthChart from '../../components/admin/dashboard/EquipmentHealthChart';
import TopBorrowedList from '../../components/admin/dashboard/TopBorrowedList';
import BorrowRequestList from '../../components/admin/dashboard/BorrowRequestList';
import RecentDamageReports from '../../components/admin/dashboard/RecentDamageReports';
import { useAdminStore } from '../../stores/useAdminStore';
import type { TopBorrowedItem } from '../../types/admin.types';
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
                    fetchDamageReports()
                ]);
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [fetchStats, fetchHealthStatus, fetchChartData, fetchBorrowRequests, fetchDamageReports]);

    const topBorrowed: TopBorrowedItem[] = React.useMemo(() => {
        if (!chartData?.topBorrowedEquipment) return [];
        const maxCount = Math.max(...chartData.topBorrowedEquipment.map((i: any) => i.count), 1);
        return chartData.topBorrowedEquipment.map((item: any) => ({
            name: item.name,
            count: item.count,
            percentage: (item.count / maxCount) * 100
        }));
    }, [chartData]);

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
                        <TopBorrowedList items={topBorrowed} />
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
        </PageShell>
    );
};

export default AdminDashboard;
