import React from 'react';

export interface TopBorrowedItem {
    name: string;
    count: number;
    percentage: number;
}

interface TopBorrowedListProps {
    items: TopBorrowedItem[];
}

const TopBorrowedList: React.FC<TopBorrowedListProps> = ({ items }) => {
    return (
        <div className="border-l border-white/30 dark:border-white/10 pl-0 md:pl-10 h-full flex flex-col justify-center">
            <p className="text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-6">Top 5 Most Borrowed</p>
            <div className="space-y-6">
                {items.map((item, index) => {
                    return (
                        <div key={index} className="space-y-1.5">
                            <div className="flex justify-between text-[11px] font-bold text-slate-700 dark:text-slate-300">
                                <span>{item.name}</span>
                                <span className="text-[#1A2B56] dark:text-blue-400">{item.count} Times</span>
                            </div>
                            <div className="w-full bg-white/40 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                                <div
                                    className="bg-[#1A2B56] dark:bg-blue-500 h-full rounded-full transition-all duration-700 ease-out"
                                    style={{
                                        width: `${item.percentage}%`,
                                        opacity: 1 - (index * 0.15) // Subtle fading: 1.0, 0.85, 0.70, 0.55, 0.40
                                    }}
                                ></div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TopBorrowedList;
