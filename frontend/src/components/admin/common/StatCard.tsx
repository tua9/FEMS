import React from 'react';

interface StatCardProps {
    title: string;
    value: string | number;
    trendValue?: string;
    trendLabel?: string;
    trendDirection?: 'up' | 'down' | 'neutral';
    iconName: string;
    color?: string; // Hex color for the icon container
}

const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    trendValue,
    trendLabel,
    trendDirection = 'neutral',
    iconName
}) => {

    // Determine trend colors
    let trendColorClass = 'text-slate-600';
    let trendIcon = '';

    if (trendDirection === 'up') {
        trendColorClass = 'text-emerald-600 dark:text-emerald-400';
        trendIcon = 'trending_up';
    } else if (trendDirection === 'down') {
        trendColorClass = 'text-red-600 dark:text-red-400';
        trendIcon = 'trending_down';
    } else if (trendDirection === 'neutral') {
        trendColorClass = 'text-orange-600 dark:text-orange-400';
        trendIcon = 'pending_actions';
    }

    // Override icon if explicitly provided or neutral
    if (trendIcon === '' && trendValue) {
        trendIcon = 'info';
    }

    return (
        <div className="glass-card cursor-pointer hover:-translate-y-1 hover:bg-white/90 dark:hover:bg-slate-800/90 hover:shadow-2xl dark:!bg-slate-800/80 p-8 ambient-shadow flex items-center justify-between rounded-[32px] border border-white/40 dark:border-white/10 backdrop-blur-[30px] bg-white/60 transition-all duration-300">
            <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-600 dark:text-slate-400 mb-1">{title}</p>
                <h3 className="text-4xl font-extrabold text-[#1A2B56] dark:text-white tracking-tight">{value}</h3>

                {(trendValue || trendLabel) && (
                    <p className={`text-xs font-bold mt-2 flex items-center gap-1 ${trendColorClass}`}>
                        {trendIcon && <span className="material-symbols-outlined text-sm">{trendIcon}</span>}
                        {trendValue && <span>{trendValue}</span>}
                        {trendLabel && <span>{trendLabel}</span>}
                    </p>
                )}
            </div>

            <div className="bg-[#1A2B56]/10 dark:bg-slate-700/50 p-4 rounded-3xl text-[#1A2B56] dark:text-slate-300 border border-[#1A2B56]/20 dark:border-slate-600">
                <span className="material-symbols-outlined text-4xl block">{iconName}</span>
            </div>
        </div>
    );
};

export default StatCard;
