import React from 'react';
import { Download } from 'lucide-react';

export type Period = 'week' | 'month' | 'semester';

const PERIODS: { value: Period; label: string }[] = [
    { value: 'week',     label: 'Week'     },
    { value: 'month',    label: 'Month'    },
    { value: 'semester', label: 'Semester' },
];

interface StatsHeaderProps {
    activePeriod: Period;
    onPeriodChange: (p: Period) => void;
    onExport: () => void;
}

export const StatsHeader: React.FC<StatsHeaderProps> = ({ activePeriod, onPeriodChange, onExport }) => {
    return (
        <header className="mb-[2.5rem]">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                {/* Title */}
                <div>
                    <h2 className="text-[2.25rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[3.5rem] font-extrabold text-[#1E2B58] dark:text-white mb-[0.5rem] tracking-tight leading-tight">
                        Resource Efficiency by Subject
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 text-[1rem] sm:text-[1.125rem] leading-relaxed max-w-2xl">
                        Analyze how resources are distributed and utilized across different course tracks.
                    </p>
                </div>

                {/* Controls */}
                <div className="flex flex-col sm:items-end gap-3 shrink-0 mt-1">
                    {/* Period toggle */}
                    <div className="flex items-center bg-white/50 dark:bg-slate-800/40 border border-[#1E2B58]/10 dark:border-white/10 rounded-full p-1 gap-0.5">
                        {PERIODS.map(p => (
                            <button
                                key={p.value}
                                onClick={() => onPeriodChange(p.value)}
                                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                                    activePeriod === p.value
                                        ? 'bg-[#1E2B58] text-white shadow-md shadow-[#1E2B58]/20'
                                        : 'text-[#1E2B58]/60 dark:text-white/50 hover:text-[#1E2B58] dark:hover:text-white'
                                }`}
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>

                    {/* Export button */}
                    <button
                        onClick={onExport}
                        className="flex items-center gap-2 bg-[#1E2B58] text-white px-5 py-2.5 rounded-full font-bold text-xs hover:scale-105 active:scale-95 transition-all shadow-md shadow-[#1E2B58]/20"
                    >
                        <Download className="w-3.5 h-3.5" strokeWidth={2.5} />
                        Export Report
                    </button>
                </div>
            </div>
        </header>
    );
};
