import React from 'react';

interface StatCardProps {
    title: string;
    value: string | number;
    trendValue?: string;
    trendLabel?: string;
    trendDirection?: 'up' | 'down' | 'neutral';
    iconName: string;
    color?: string; // Hex color for the icon container
    onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    trendValue,
    trendLabel,
    trendDirection = 'neutral',
    iconName,
    onClick
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

    const CardContent = (
        <>
            <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">{title}</p>
                <h3 className="text-3xl font-extrabold text-[#1A2B56] dark:text-white tracking-tight">{value}</h3>

                {(trendValue || trendLabel) && (
                    <p className={`text-xs font-bold mt-2 flex items-center gap-1 ${trendColorClass}`}>
                        {trendIcon && <span className="material-symbols-outlined text-sm">{trendIcon}</span>}
                        {trendValue && <span>{trendValue}</span>}
                        {trendLabel && <span>{trendLabel}</span>}
                    </p>
                )}
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-700/30 text-slate-400 dark:text-slate-500 transition-all duration-300">
                <span className="material-symbols-outlined text-3xl block">{iconName}</span>
            </div>
        </>
    );

    const baseClasses = "relative p-6 ambient-shadow flex items-center justify-between rounded-[24px] border transition-all duration-300 text-left w-full backdrop-blur-xl bg-white/60 dark:bg-slate-800/60 border-white/60 dark:border-white/10 hover:bg-white/80 dark:hover:bg-slate-700 hover:scale-[1.02] hover:shadow-2xl active:scale-95";

    if (onClick) {
        return (
            <button onClick={onClick} className={baseClasses}>
                {CardContent}
            </button>
        );
    }

    return (
        <div className={baseClasses}>
            {CardContent}
        </div>
    );
};

export default StatCard;
