import React, { useEffect, useState } from 'react';
import StatCard from '../../components/admin/common/StatCard';
import DeviceHealthChart from '../../components/admin/dashboard/DeviceHealthChart';
import TopBrokenList from '../../components/admin/dashboard/TopBrokenList';
import InventoryRequestList from '../../components/admin/dashboard/InventoryRequestList';
import RecentDamageReports from '../../components/admin/dashboard/RecentDamageReports';
import { adminApi } from '../../services/api/adminApi';
import { DashboardMetrics, EquipmentRequest, DamageReport } from '../../types/admin.types';

const AdminDashboard: React.FC = () => {
    const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
    const [healthStatus, setHealthStatus] = useState<any>(null);
    const [topBroken, setTopBroken] = useState<any[]>([]);
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
                    reportsData
                ] = await Promise.all([
                    adminApi.getDashboardMetrics(),
                    adminApi.getHealthStatus(),
                    adminApi.getTopBrokenEquipment(),
                    adminApi.getInventoryRequests(),
                    adminApi.getRecentDamageReports()
                ]);

                setMetrics(metricsData);
                setHealthStatus(healthData);
                setTopBroken(topBrokenData);
                setRequests(requestsData);
                setReports(reportsData);
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
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1A2B56] dark:border-blue-400"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-6 pb-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 mt-6">
                <StatCard
                    title="Total Devices"
                    value={metrics.totalDevices.toLocaleString()}
                    trendValue={`+${metrics.devicesTrend}%`}
                    trendLabel="from last month"
                    trendDirection="up"
                    iconName="devices"
                />
                <StatCard
                    title="Broken Devices"
                    value={metrics.brokenDevices}
                    trendValue={`${metrics.criticalRepairs}`}
                    trendLabel="critical repairs"
                    trendDirection="down"
                    iconName="build_circle"
                />
                <StatCard
                    title="Pending Requests"
                    value={metrics.pendingRequests}
                    trendValue={`Avg. ${metrics.avgResponseTimeHours}h`}
                    trendLabel="response"
                    trendDirection="neutral"
                    iconName="inventory_2"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
                <div className="lg:col-span-8 bg-white/40 dark:bg-slate-800/60 p-8 ambient-shadow rounded-[32px] border border-white/40 dark:border-white/10 backdrop-blur-xl transition-all duration-300">
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
                    />
                </div>
            </div>

            <RecentDamageReports reports={reports} />
        </div>
    );
};

export default AdminDashboard;
