import React, { useEffect, useState } from 'react';
import StatCard from '../../components/admin/common/StatCard';
import DeviceHealthChart from '../../components/admin/dashboard/DeviceHealthChart';
import TopBrokenList from '../../components/admin/dashboard/TopBrokenList';
import InventoryRequestList from '../../components/admin/dashboard/InventoryRequestList';
import RecentDamageReports from '../../components/admin/dashboard/RecentDamageReports';
import { adminApi } from '../../services/api/adminApi';
import type { DashboardMetrics, EquipmentRequest, DamageReport, Asset, BorrowRecord, HealthStatus, TopBrokenItem } from '../../types/admin.types';
import { useNavigate } from 'react-router-dom';
import { PageShell, AnimatedSection, AnimatedList, AnimatedListItem } from '@/components/motion';

const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
    const [equipments, setEquipments] = useState<Asset[]>([]);
    const [borrowRecords, setBorrowRecords] = useState<BorrowRecord[]>([]);
    const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);
    const [topBroken, setTopBroken] = useState<TopBrokenItem[]>([]);
    const [requests, setRequests] = useState<EquipmentRequest[]>([]);
    const [reports, setReports] = useState<DamageReport[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [
                    metricsData,
                    healthData,
                    topBrokenData,
                    requestsData,
                    reportsData,
                    equipmentListData,
                    borrowingListData
                ] = await Promise.all([
                    adminApi.getDashboardMetrics(),
                    adminApi.getHealthStatus(),
                    adminApi.getTopBrokenEquipment(),
                    adminApi.getInventoryRequests(),
                    adminApi.getRecentDamageReports(),
                    adminApi.getEquipmentList(),
                    adminApi.getBorrowingList()
                ]);

                setMetrics(metricsData);
                setHealthStatus(healthData);
                setTopBroken(topBrokenData);
                setRequests(requestsData);
                setReports(reportsData);
                setEquipments(equipmentListData);
                setBorrowRecords(borrowingListData);
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading || !metrics || !healthStatus) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1A2B56] dark:border-blue-400" />
            </div>
        );
    }

    const totalEquipments = equipments.length;
    const brokenEquipment = equipments.filter(e => e.status === 'Broken' || e.status === 'Repairing').length;
    const pendingApprovals = borrowRecords.filter(r => r.status === 'Pending').length;

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
                        title="Total Equipments"
                        value={totalEquipments.toLocaleString()}
                        trendValue={`+${metrics.devicesTrend}%`}
                        trendLabel="from last month"
                        trendDirection="up"
                        iconName="devices"
                        onClick={() => navigate('/admin/equipment', { state: { status: 'All Status' } })}
                    />
                </AnimatedListItem>
                <AnimatedListItem>
                    <StatCard
                        title="Broken Equipment"
                        value={brokenEquipment}
                        trendValue={`${metrics.criticalRepairs}`}
                        trendLabel="critical repairs"
                        trendDirection="down"
                        iconName="build_circle"
                        onClick={() => navigate('/admin/equipment', { state: { status: 'Broken' } })}
                    />
                </AnimatedListItem>
                <AnimatedListItem>
                    <StatCard
                        title="Pending Approvals"
                        value={pendingApprovals}
                        trendValue={`Avg. ${metrics.avgResponseTimeHours}h`}
                        trendLabel="response"
                        trendDirection="neutral"
                        iconName="inventory_2"
                        onClick={() => navigate('/admin/borrowing', { state: { status: 'Pending' } })}
                    />
                </AnimatedListItem>
            </AnimatedList>

            {/* ── Analytics ── */}
            <AnimatedSection variant="fade" delay={0.1} className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
                <div className="lg:col-span-8 dashboard-card p-8 rounded-4xl transition-all duration-300">
                    <h4 className="font-extrabold text-[#1A2B56] dark:text-white text-lg mb-8">Equipment Performance Analytics</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <DeviceHealthChart
                            healthyPercentage={healthStatus.healthy}
                            availableNodes={healthStatus.available}
                            maintenanceNodes={healthStatus.maintenance}
                            brokenNodes={healthStatus.broken}
                        />
                        <TopBrokenList items={topBroken} />
                    </div>
                </div>
                <div className="lg:col-span-4 h-full">
                    <InventoryRequestList
                        requests={requests}
                        efficiencyRate={metrics.efficiencyRate}
                        onViewAll={() => navigate('/admin/borrowing')}
                        onItemClick={() => navigate('/admin/borrowing')}
                    />
                </div>
            </AnimatedSection>

            {/* ── Damage Reports ── */}
            <AnimatedSection variant="slide-up" delay={0.15}>
                <RecentDamageReports
                    reports={reports}
                    onViewAll={() => navigate('/admin/reports')}
                    onRowClick={() => navigate('/admin/reports')}
                />
            </AnimatedSection>
        </PageShell>
    );
};

export default AdminDashboard;
