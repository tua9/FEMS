import React from 'react';

export interface TopBrokenItem {
    name: string;
    count: number;
    percentage: number;
}

interface TopBrokenListProps {
    items: TopBrokenItem[];
}

const TopBrokenList: React.FC<TopBrokenListProps> = ({ items }) => {
    return (
        <div className="border-l border-white/30 dark:border-white/10 pl-0 md:pl-10 h-full flex flex-col justify-center">
            <p className="text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-6">Top 5 Most Broken</p>
            <div className="space-y-6">
                {items.map((item, index) => {
                    // Different opacities for the progress bar based on index to recreate the UI
                    const opacities = ['', '/80', '/60', '/40', '/20'];
                    const opacityClass = opacities[index] || '/20';

                    return (
                        <div key={index} className="space-y-1.5">
                            <div className="flex justify-between text-[11px] font-bold text-slate-700 dark:text-slate-300">
                                <span>{item.name}</span>
                                <span className="text-[#1A2B56] dark:text-blue-400">{item.count} Units</span>
                            </div>
                            <div className="w-full bg-white/40 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                                <div
                                    className={`bg-[#1A2B56] dark:bg-blue-500 h-full rounded-full opacity-${(100 - index * 20)}`}
                                    style={{ width: `${item.percentage}%`, opacity: 1 - index * 0.2 }}
                                ></div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TopBrokenList;
