import React, { useState } from 'react';

import { StatsHeader, Period } from '../../components/lecturer/stats/StatsHeader';
import { StatsOverview, SubjectData } from '../../components/lecturer/stats/StatsOverview';

// ─── Data ─────────────────────────────────────────────────────────────────────

const CHART_DATA= {
 week: [
 { name: 'CS101', label: 'Intro to CS', avg: 60, cur: 85 },
 { name: 'AI202', label: 'Artificial Intelligence', avg: 40, cur: 55 },
 { name: 'SWE301', label: 'Software Engineering', avg: 70, cur: 95 },
 { name: 'NET401', label: 'Computer Networks', avg: 30, cur: 45 },
 { name: 'DS502', label: 'Data Science', avg: 50, cur: 65 },
 ],
 month: [
 { name: 'CS101', label: 'Intro to CS', avg: 65, cur: 72 },
 { name: 'AI202', label: 'Artificial Intelligence', avg: 45, cur: 61 },
 { name: 'SWE301', label: 'Software Engineering', avg: 75, cur: 88 },
 { name: 'NET401', label: 'Computer Networks', avg: 38, cur: 52 },
 { name: 'DS502', label: 'Data Science', avg: 55, cur: 70 },
 ],
 semester: [
 { name: 'CS101', label: 'Intro to CS', avg: 68, cur: 78 },
 { name: 'AI202', label: 'Artificial Intelligence', avg: 48, cur: 58 },
 { name: 'SWE301', label: 'Software Engineering', avg: 78, cur: 91 },
 { name: 'NET401', label: 'Computer Networks', avg: 42, cur: 49 },
 { name: 'DS502', label: 'Data Science', avg: 58, cur: 68 },
 ],
};

// ─── Component ────────────────────────────────────────────────────────────────

export const UsageStatsCenter = () => {

 // ── State ──────────────────────────────────────────────────────────────────
 const [activePeriod, setActivePeriod] = useState('week');
 const [activeSubject, setActiveSubject] = useState(null);
 const [showCurrent, setShowCurrent] = useState(true);
 const [showAverage, setShowAverage] = useState(true);

 const currentChartData = CHART_DATA[activePeriod];

 // ── Period change resets subject selection ─────────────────────────────────
 const handlePeriodChange = (p) => {
 setActivePeriod(p);
 setActiveSubject(null);
 };

 // ── Export CSV ─────────────────────────────────────────────────────────────
 const handleExport = () => {
 const periodLabel = activePeriod.charAt(0).toUpperCase() + activePeriod.slice(1);

 const chartHeader = 'Subject Code,Subject Name,Average Utilization (%),Current Utilization (%)\n';
 const chartRows = currentChartData
 .map(d => `"${d.name}","${d.label}","${d.avg}","${d.cur}"`)
 .join('\n');

 const content = `F-EMS Usage Statistics Report — ${periodLabel}\nGenerated: ${new Date().toLocaleString()}\n\n${chartHeader}${chartRows}`;

 const blob = new Blob([content], { type: 'text/csv' });
 const url = URL.createObjectURL(blob);
 const a = document.createElement('a');
 a.href = url;
 a.download = `usage-stats-${activePeriod}-${new Date().toISOString().slice(0, 10)}.csv`;
 a.click();
 URL.revokeObjectURL(url);
 };

 // ─────────────────────────────────────────────────────────────────────────

 return (
 <div className="w-full"> <main className="pt-6 sm:pt-8 pb-10 px-4 sm:px-6 w-full max-w-[90vw] xl:max-w-7xl mx-auto flex-1 flex flex-col overflow-hidden">
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

 </div>
 </main>

 </div>
 );
};
