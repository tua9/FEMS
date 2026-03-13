import React from 'react';
import { BarChart3, CheckCircle2, X } from 'lucide-react';

// ─── Types (shared with UsageStatsCenter) ────────────────────────────────────

export interface SubjectData {
    name: string;
    label: string;
    avg: number;   // 0–100
    cur: number;   // 0–100
}

interface StatsOverviewProps {
    chartData: SubjectData[];
    activeSubject: string | null;
    onSubjectChange: (name: string | null) => void;
    showCurrent: boolean;
    showAverage: boolean;
    onToggleCurrent: () => void;
    onToggleAverage: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const StatsOverview: React.FC<StatsOverviewProps> = ({
    chartData,
    activeSubject,
    onSubjectChange,
    showCurrent,
    showAverage,
    onToggleCurrent,
    onToggleAverage,
}) => {
    const anySelected = activeSubject !== null;

    // Compute peak subject (highest `cur`)
    const peakSubject = [...chartData].sort((a, b) => b.cur - a.cur)[0];
    // Show selected subject details if any, otherwise peak
    const focusSubject = activeSubject
        ? chartData.find(d => d.name === activeSubject) ?? peakSubject
        : peakSubject;

    // Resource availability = average of all cur values
    const avgAvailability = Math.round(chartData.reduce((s, d) => s + d.cur, 0) / chartData.length);

    return (
        <div className="dashboard-card rounded-3xl sm:rounded-4xl p-6 sm:p-8 lg:p-12 mb-10 relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute -top-[6rem] -right-[6rem] w-[16rem] h-[16rem] bg-sky-400/10 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-[2.5rem] relative z-10">

                {/* ── Left: Bar chart ──────────────────────────────────────── */}
                <div className="lg:col-span-2 space-y-[1.5rem]">

                    {/* Chart header + legend toggles */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-[1rem] mb-[0.5rem]">
                        <h3 className="text-[1.25rem] font-bold text-[#1E2B58] dark:text-white flex items-center gap-[0.5rem]">
                            <BarChart3 className="text-sky-500 w-[1.25rem] h-[1.25rem]" />
                            Weekly Resource Allocation
                        </h3>

                        {/* Clickable legend toggles */}
                        <div className="flex gap-[0.75rem]">
                            <button
                                onClick={onToggleCurrent}
                                className={`flex items-center gap-[0.375rem] text-[0.75rem] font-bold transition-all hover:scale-105 active:scale-95 px-2.5 py-1 rounded-full ${
                                    showCurrent
                                        ? 'bg-[#1E2B58]/10 dark:bg-white/10 text-[#1E2B58] dark:text-white'
                                        : 'text-slate-400 dark:text-slate-600 line-through'
                                }`}
                            >
                                <span className={`w-[0.5rem] h-[0.5rem] rounded-full transition-colors ${showCurrent ? 'bg-[#1E2B58] dark:bg-white' : 'bg-slate-300 dark:bg-slate-600'}`} />
                                Current
                            </button>
                            <button
                                onClick={onToggleAverage}
                                className={`flex items-center gap-[0.375rem] text-[0.75rem] font-bold transition-all hover:scale-105 active:scale-95 px-2.5 py-1 rounded-full ${
                                    showAverage
                                        ? 'bg-sky-400/10 text-sky-600 dark:text-sky-400'
                                        : 'text-slate-400 dark:text-slate-600 line-through'
                                }`}
                            >
                                <span className={`w-[0.5rem] h-[0.5rem] rounded-full transition-colors ${showAverage ? 'bg-sky-400' : 'bg-slate-300 dark:bg-slate-600'}`} />
                                Average
                            </button>
                        </div>
                    </div>

                    {/* Bar Chart */}
                    <div className="h-[16rem] flex items-end justify-between gap-[1rem] sm:gap-[2rem] px-[0.5rem] sm:px-[1rem] border-b border-slate-200 dark:border-slate-700 pb-[0.5rem]">
                        {chartData.map((item) => {
                            const isSelected = activeSubject === item.name;
                            const isDimmed = anySelected && !isSelected;

                            return (
                                <button
                                    key={item.name}
                                    onClick={() => onSubjectChange(isSelected ? null : item.name)}
                                    className={`flex-1 flex flex-col items-center gap-[0.5rem] h-full transition-all duration-200 group rounded-t-lg ${
                                        isDimmed ? 'opacity-35' : 'opacity-100'
                                    } ${isSelected ? 'scale-[1.04]' : 'hover:scale-[1.02]'}`}
                                    title={`${item.label}: ${item.cur}% current, ${item.avg}% average`}
                                >
                                    <div className="w-full flex justify-center gap-[0.125rem] sm:gap-[0.25rem] items-end h-full">
                                        {showAverage && (
                                            <div
                                                className={`w-[0.5rem] sm:w-[1.25rem] rounded-t-[0.125rem] transition-all duration-500 ${isSelected ? 'bg-sky-400' : 'bg-sky-400/30 group-hover:bg-sky-400/60'}`}
                                                style={{ height: `${item.avg}%` }}
                                            />
                                        )}
                                        {showCurrent && (
                                            <div
                                                className={`w-[0.75rem] sm:w-[1.5rem] rounded-t-[0.125rem] transition-all duration-500 ${isSelected ? 'bg-[#1E2B58] dark:bg-sky-400 shadow-lg' : 'bg-[#1E2B58] dark:bg-sky-500 group-hover:opacity-80'}`}
                                                style={{ height: `${item.cur}%` }}
                                            />
                                        )}
                                    </div>
                                    <span className={`text-[0.625rem] sm:text-[0.75rem] font-bold uppercase transition-colors ${isSelected ? 'text-[#1E2B58] dark:text-white' : 'text-slate-500 dark:text-slate-400 group-hover:text-[#1E2B58] dark:group-hover:text-white'}`}>
                                        {item.name}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Tooltip hint */}
                    {!anySelected && (
                        <p className="text-[0.625rem] text-slate-400 dark:text-slate-500 font-medium text-center -mt-2">
                            Click a bar to inspect a subject in detail
                        </p>
                    )}

                    {/* Small detail cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-[1rem] pt-[0.5rem]">
                        {/* Peak / Selected subject card */}
                        <div className="dashboard-card p-6 rounded-3xl relative transition-all duration-300">
                            {activeSubject && (
                                <button
                                    onClick={() => onSubjectChange(null)}
                                    className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[#1E2B58]/10 dark:bg-white/10 flex items-center justify-center hover:bg-[#1E2B58]/20 dark:hover:bg-white/20 transition"
                                >
                                    <X className="w-3 h-3 text-[#1E2B58] dark:text-white" />
                                </button>
                            )}
                            <p className="text-[0.6875rem] font-bold text-slate-500 dark:text-slate-400 mb-[0.25rem] uppercase tracking-wider">
                                {activeSubject ? 'Selected Subject' : 'Peak Demand Subject'}
                            </p>
                            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-2">
                                <div>
                                    <h4 className="text-[1.125rem] sm:text-[1.25rem] font-bold text-[#1E2B58] dark:text-white leading-tight">
                                        {focusSubject.label}
                                    </h4>
                                    {activeSubject && (
                                        <p className="text-[0.65rem] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                                            Current: {focusSubject.cur}% · Avg: {focusSubject.avg}%
                                        </p>
                                    )}
                                </div>
                                <span className="bg-[#1E2B58] text-white text-[0.6875rem] px-[0.625rem] py-[0.25rem] rounded-full font-bold w-fit whitespace-nowrap">
                                    {activeSubject ? `${focusSubject.cur}% usage` : `+${focusSubject.cur - focusSubject.avg}%`}
                                </span>
                            </div>
                        </div>

                        {/* Availability card */}
                        <div className="dashboard-card p-6 rounded-3xl">
                            <p className="text-[0.6875rem] font-bold text-slate-500 dark:text-slate-400 mb-[0.25rem] uppercase tracking-wider">Resource Availability</p>
                            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-2">
                                <div>
                                    <h4 className="text-[1.125rem] sm:text-[1.25rem] font-bold text-[#1E2B58] dark:text-white leading-tight">
                                        {avgAvailability >= 85 ? 'Optimal' : avgAvailability >= 70 ? 'Moderate' : 'Low'} ({avgAvailability}%)
                                    </h4>
                                    <p className="text-[0.65rem] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                                        Avg. across {chartData.length} subjects
                                    </p>
                                </div>
                                <CheckCircle2 className={`w-[1.5rem] h-[1.5rem] transition-colors ${avgAvailability >= 85 ? 'text-sky-500' : avgAvailability >= 70 ? 'text-amber-400' : 'text-red-400'}`} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Right: Donut chart ───────────────────────────────────── */}
                <div className="flex flex-col border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-700/50 pt-[2rem] lg:pt-0 lg:pl-[2.5rem]">
                    <h3 className="text-[0.875rem] font-bold text-[#1E2B58] dark:text-white mb-[2rem]">Resource Type Distribution</h3>

                    {/* SVG Donut */}
                    <div className="relative w-[12rem] h-[12rem] mb-[2rem] mx-auto">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                            <circle className="text-[#1E2B58] dark:text-white" cx="50" cy="50" fill="transparent" r="40" stroke="currentColor" strokeDasharray="251.2" strokeDashoffset="60"  strokeWidth="12" strokeLinecap="round" />
                            <circle className="text-sky-400"                   cx="50" cy="50" fill="transparent" r="40" stroke="currentColor" strokeDasharray="251.2" strokeDashoffset="180" strokeWidth="12" strokeLinecap="round" />
                            <circle className="text-slate-300 dark:text-slate-600" cx="50" cy="50" fill="transparent" r="40" stroke="currentColor" strokeDasharray="251.2" strokeDashoffset="220" strokeWidth="12" strokeLinecap="round" />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-[2rem] font-extrabold text-[#1E2B58] dark:text-white leading-none mb-[0.125rem]">1.2k</span>
                            <span className="text-[0.625rem] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Total Items</span>
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="w-full space-y-[1rem]">
                        {[
                            { color: 'bg-[#1E2B58] dark:bg-white', label: 'Computing Devices', pct: '55%' },
                            { color: 'bg-sky-400',                  label: 'AV Equipment',      pct: '30%' },
                            { color: 'bg-slate-300 dark:bg-slate-600', label: 'Other Assets',   pct: '15%' },
                        ].map(item => (
                            <div key={item.label} className="flex items-center justify-between text-[0.75rem]">
                                <div className="flex items-center gap-[0.5rem]">
                                    <div className={`w-[0.5rem] h-[0.5rem] rounded-full ${item.color}`} />
                                    <span className="font-bold text-slate-700 dark:text-slate-300">{item.label}</span>
                                </div>
                                <span className="font-black text-[#1E2B58] dark:text-white">{item.pct}</span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};
