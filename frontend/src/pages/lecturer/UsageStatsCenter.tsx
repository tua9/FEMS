import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Zap, Clock, Package } from 'lucide-react';

import { StatsHeader, Period } from '../../components/lecturer/stats/StatsHeader';
import { StatsOverview, SubjectData } from '../../components/lecturer/stats/StatsOverview';
import { StatsMetrics, MetricItem } from '../../components/lecturer/stats/StatsMetrics';

// ─── Data ─────────────────────────────────────────────────────────────────────

const CHART_DATA: Record<Period, SubjectData[]> = {
    week: [
        { name: 'CS101',  label: 'Intro to CS',            avg: 60, cur: 85 },
        { name: 'AI202',  label: 'Artificial Intelligence', avg: 40, cur: 55 },
        { name: 'SWE301', label: 'Software Engineering',    avg: 70, cur: 95 },
        { name: 'NET401', label: 'Computer Networks',       avg: 30, cur: 45 },
        { name: 'DS502',  label: 'Data Science',            avg: 50, cur: 65 },
    ],
    month: [
        { name: 'CS101',  label: 'Intro to CS',            avg: 65, cur: 72 },
        { name: 'AI202',  label: 'Artificial Intelligence', avg: 45, cur: 61 },
        { name: 'SWE301', label: 'Software Engineering',    avg: 75, cur: 88 },
        { name: 'NET401', label: 'Computer Networks',       avg: 38, cur: 52 },
        { name: 'DS502',  label: 'Data Science',            avg: 55, cur: 70 },
    ],
    semester: [
        { name: 'CS101',  label: 'Intro to CS',            avg: 68, cur: 78 },
        { name: 'AI202',  label: 'Artificial Intelligence', avg: 48, cur: 58 },
        { name: 'SWE301', label: 'Software Engineering',    avg: 78, cur: 91 },
        { name: 'NET401', label: 'Computer Networks',       avg: 42, cur: 49 },
        { name: 'DS502',  label: 'Data Science',            avg: 58, cur: 68 },
    ],
};

const METRICS_DATA: Record<Period, MetricItem[]> = {
    week: [
        { icon: TrendingUp, title: 'Efficiency Gain',   value: '14.2%', subtitle: 'vs last week',        trend: '+14.2%', trendPositive: true,  navigateTo: '/lecturer/history'     },
        { icon: Zap,        title: 'Active Requests',   value: '342',   subtitle: 'Processing real-time',                                       navigateTo: '/lecturer/approval'    },
        { icon: Clock,      title: 'Avg. Return Time',  value: '2.4 d', subtitle: 'Within target limit',                                        navigateTo: '/lecturer/history'     },
        { icon: Package,    title: 'Stock Health',      value: '98%',   subtitle: 'Operational readiness', trend: 'Good',  trendPositive: true,  navigateTo: '/lecturer/room-status' },
    ],
    month: [
        { icon: TrendingUp, title: 'Efficiency Gain',   value: '11.8%', subtitle: 'vs last month',        trend: '+11.8%', trendPositive: true,  navigateTo: '/lecturer/history'     },
        { icon: Zap,        title: 'Active Requests',   value: '1,284', subtitle: 'Processing real-time',                                        navigateTo: '/lecturer/approval'    },
        { icon: Clock,      title: 'Avg. Return Time',  value: '2.1 d', subtitle: 'Within target limit',                                         navigateTo: '/lecturer/history'     },
        { icon: Package,    title: 'Stock Health',      value: '96%',   subtitle: 'Operational readiness', trend: 'Good',  trendPositive: true,  navigateTo: '/lecturer/room-status' },
    ],
    semester: [
        { icon: TrendingUp, title: 'Efficiency Gain',   value: '9.5%',  subtitle: 'vs last semester',      trend: '+9.5%',  trendPositive: true,  navigateTo: '/lecturer/history'     },
        { icon: Zap,        title: 'Active Requests',   value: '5,420', subtitle: 'Processing real-time',                                         navigateTo: '/lecturer/approval'    },
        { icon: Clock,      title: 'Avg. Return Time',  value: '2.8 d', subtitle: 'Slightly above avg.',   trend: 'Watch',  trendPositive: false, navigateTo: '/lecturer/history'     },
        { icon: Package,    title: 'Stock Health',      value: '94%',   subtitle: 'Operational readiness',  trend: 'Fair',  trendPositive: true,  navigateTo: '/lecturer/room-status' },
    ],
};

// ─── Component ────────────────────────────────────────────────────────────────

export const UsageStatsCenter: React.FC = () => {
    const navigate = useNavigate();

    // ── State ──────────────────────────────────────────────────────────────────
    const [activePeriod,   setActivePeriod]   = useState<Period>('week');
    const [activeSubject,  setActiveSubject]  = useState<string | null>(null);
    const [showCurrent,    setShowCurrent]    = useState(true);
    const [showAverage,    setShowAverage]    = useState(true);

    // ── Derived data ───────────────────────────────────────────────────────────
    const currentChartData   = CHART_DATA[activePeriod];
    const currentMetrics     = METRICS_DATA[activePeriod];

    // ── Period change resets subject selection ─────────────────────────────────
    const handlePeriodChange = (p: Period) => {
        setActivePeriod(p);
        setActiveSubject(null);
    };

    // ── Export CSV ─────────────────────────────────────────────────────────────
    const handleExport = () => {
        const periodLabel = activePeriod.charAt(0).toUpperCase() + activePeriod.slice(1);

        const chartHeader = 'Subject Code,Subject Name,Average Utilization (%),Current Utilization (%)\n';
        const chartRows   = currentChartData
            .map(d => `"${d.name}","${d.label}","${d.avg}","${d.cur}"`)
            .join('\n');

        const metricsHeader = '\n\nMetric,Value,Note\n';
        const metricsRows   = currentMetrics
            .map(m => `"${m.title}","${m.value}","${m.subtitle}"`)
            .join('\n');

        const content = `F-EMS Usage Statistics Report — ${periodLabel}\nGenerated: ${new Date().toLocaleString()}\n\n${chartHeader}${chartRows}${metricsHeader}${metricsRows}`;

        const blob = new Blob([content], { type: 'text/csv' });
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement('a');
        a.href     = url;
        a.download = `usage-stats-${activePeriod}-${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    // ─────────────────────────────────────────────────────────────────────────

    return (
        <div className="w-full">                <main className="pt-6 sm:pt-8 pb-10 px-4 sm:px-6 w-full max-w-[90vw] xl:max-w-7xl mx-auto flex-1 flex flex-col overflow-hidden">
                <div className="w-full">

                    {/* Period toggle + Export */}
                    <StatsHeader
                        activePeriod={activePeriod}
                        onPeriodChange={handlePeriodChange}
                        onExport={handleExport}
                    />

                    {/* Bar chart + donut chart */}
                    <StatsOverview
                        chartData={currentChartData}
                        activeSubject={activeSubject}
                        onSubjectChange={setActiveSubject}
                        showCurrent={showCurrent}
                        showAverage={showAverage}
                        onToggleCurrent={() => setShowCurrent(p => !p)}
                        onToggleAverage={() => setShowAverage(p => !p)}
                    />

                    {/* 4 metric cards */}
                    <StatsMetrics
                        metrics={currentMetrics}
                        onNavigate={navigate}
                    />

                </div>
            </main>

        </div>
    );
};
