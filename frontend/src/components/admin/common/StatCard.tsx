import React from 'react';

interface StatCardProps {
    title: string;
    value: string | number;
    trendValue?: string;
    trendLabel?: string;
    trendDirection?: 'up' | 'down' | 'neutral';
    iconName: string;
    colorTheme?: 'blue' | 'emerald' | 'amber' | 'red' | 'slate';
    onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    trendValue,
    trendLabel,
    trendDirection = 'neutral',
    iconName,
    colorTheme = 'slate',
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

    // Theme-based icon colors
    const themeClasses = {
        blue: 'bg-blue-50 dark:bg-blue-900/20 text-[#1A2B56] dark:text-blue-400',
        emerald: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500',
        amber: 'bg-amber-50 dark:bg-amber-900/20 text-amber-500',
        red: 'bg-red-50 dark:bg-red-900/20 text-red-500',
        slate: 'bg-slate-50 dark:bg-slate-700/30 text-slate-400 dark:text-slate-500'
    };

    const CardContent = (
        <>
            <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500 mb-1">{title}</p>
                <h3 className="text-3xl font-bold text-[#1A2B56] dark:text-white tracking-tight">{value}</h3>

                {(trendValue || trendLabel) && (
                    <p className={`text-xs font-semibold mt-2 flex items-center gap-1 ${trendColorClass}`}>
                        {trendIcon && <span className="material-symbols-outlined text-sm">{trendIcon}</span>}
                        {trendValue && <span>{trendValue}</span>}
                        {trendLabel && <span>{trendLabel}</span>}
                    </p>
                )}
            </div>

            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${themeClasses[colorTheme]}`}>
                <span className="material-symbols-outlined text-3xl block">{iconName}</span>
            </div>
        </>
    );

    const baseClasses = "relative p-6 dashboard-card flex items-center justify-between rounded-[24px] transition-all duration-300 text-left w-full hover:scale-[1.02] active:scale-95";

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
