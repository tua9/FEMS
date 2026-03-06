import { ArrowUpRight } from 'lucide-react';
import React from 'react';

export interface MetricItem {
    icon: React.ElementType;
    title: string;
    value: string;
    subtitle: string;
    navigateTo?: string;
    trend?: string;       // e.g. "+14.2%" displayed beside title
    trendPositive?: boolean;
}

interface StatsMetricsProps {
    metrics: MetricItem[];
    onNavigate: (path: string) => void;
}

export const StatsMetrics: React.FC<StatsMetricsProps> = ({ metrics, onNavigate }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[1.5rem]">
            {metrics.map((item, index) => {
                const Icon = item.icon;
                const isClickable = !!item.navigateTo;

                return (
                    <div
                        key={index}
                        onClick={() => isClickable && onNavigate(item.navigateTo!)}
                        className={`glass-card bg-white/50 dark:bg-slate-800/40 p-[2rem] rounded-[1.5rem] md:rounded-[2rem] border-none sm:border-solid sm:border border-[#1E2B58]/5 dark:border-white/10 group transition-all duration-200 shadow-[0_4px_24px_0_rgba(30,43,88,0.02)] relative overflow-hidden ${
                            isClickable
                                ? 'cursor-pointer hover:bg-white/80 dark:hover:bg-slate-800/60 hover:shadow-lg hover:scale-[1.02] active:scale-[0.99]'
                                : 'cursor-default hover:bg-white/80 dark:hover:bg-slate-800/60'
                        }`}
                    >
                        {/* Glow status dot – top right */}
                        <div className={`absolute top-4 right-4 h-2 w-2 rounded-full ${
                            item.trendPositive === false
                                ? 'bg-rose-400 glow-rose'
                                : item.trend
                                ? 'bg-emerald-400 glow-emerald'
                                : 'bg-blue-400 glow-blue'
                        }`} />

                        {/* Arrow indicator for navigable cards */}
                        {isClickable && (
                            <span className="absolute top-4 right-8 opacity-0 group-hover:opacity-60 transition-opacity">
                                <ArrowUpRight className="w-4 h-4 text-[#1E2B58] dark:text-white" />
                            </span>
                        )}

                        <div className="mb-[1.5rem]">
                            <Icon
                                className={`w-[1.5rem] h-[1.5rem] transition-colors ${isClickable ? 'text-[#1E2B58] dark:text-slate-300 group-hover:text-sky-500' : 'text-[#1E2B58] dark:text-slate-300'}`}
                                strokeWidth={2.5}
                            />
                        </div>

                        <h5 className="text-[0.875rem] font-bold text-[#1E2B58] dark:text-white mb-[0.5rem]">{item.title}</h5>

                        <p className="text-[2rem] font-black text-[#1E2B58] dark:text-white mb-[0.25rem] tracking-tight transition-all duration-500">
                            {item.value}
                        </p>

                        <div className="flex items-center gap-2">
                            <p className="text-[0.75rem] text-slate-500 dark:text-slate-400 font-medium">{item.subtitle}</p>
                            {item.trend && (
                                <span className={`text-[0.625rem] font-black px-1.5 py-0.5 rounded-full ${
                                    item.trendPositive !== false
                                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                        : 'bg-red-500/10 text-red-500'
                                }`}>
                                    {item.trend}
                                </span>
                            )}
                        </div>

                        {/* Bottom accent line on hover */}
                        {isClickable && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#1E2B58] to-sky-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full" />
                        )}
                    </div>
                );
            })}
        </div>
    );
};
