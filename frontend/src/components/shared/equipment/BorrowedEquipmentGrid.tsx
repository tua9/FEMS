import React from 'react';
import { Laptop, TabletSmartphone, Camera, ArrowRight } from 'lucide-react';

interface BorrowedItem {
    id: string;
    title: string;
    subtitle: string;
    statusLabel: string;
    statusColor: string;
    icon: React.ElementType;
    opacityClass: string;
}

const borrowedData: BorrowedItem[] = [
    {
        id: '1',
        title: 'MacBook Air M1',
        subtitle: 'DUE: 24 OCT 2024 • ',
        statusLabel: 'ON TIME',
        statusColor: 'text-[#10B981] dark:text-[#34D399]',
        icon: Laptop,
        opacityClass: 'opacity-100',
    },
    {
        id: '2',
        title: 'iPad Pro 11"',
        subtitle: 'DUE: 22 OCT 2024 • ',
        statusLabel: 'OVERDUE',
        statusColor: 'text-[#EF4444] dark:text-[#F87171]',
        icon: TabletSmartphone,
        opacityClass: 'opacity-100',
    },
    {
        id: '3',
        title: 'Sony DSLR',
        subtitle: 'RETURNED',
        statusLabel: '',
        statusColor: '',
        icon: Camera,
        opacityClass: 'opacity-60',
    },
];

interface BorrowedEquipmentGridProps {
    onViewHistory: () => void;
    onItemClick: (item: BorrowedItem) => void;
}

export const BorrowedEquipmentGrid: React.FC<BorrowedEquipmentGridProps> = ({
    onViewHistory,
    onItemClick,
}) => {
    return (
        <section className="dashboard-card rounded-[3rem] p-[2.5rem] mb-[3rem]">
            <div className="flex justify-between items-center mb-[2rem]">
                <h3 className="text-[1.5rem] font-bold text-[#1E2B58] dark:text-white">
                    Currently Borrowed
                </h3>
                <button
                    onClick={onViewHistory}
                    className="flex items-center gap-1.5 text-[0.6875rem] font-bold uppercase tracking-widest text-[#1E2B58] dark:text-white hover:opacity-60 transition-opacity"
                >
                    View History
                    <ArrowRight className="w-3 h-3" strokeWidth={3} />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-[1.5rem]">
                {borrowedData.map((item) => {
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.id}
                            onClick={() => onItemClick(item)}
                            className={`text-left bg-white/30 dark:bg-slate-800/40 rounded-[2rem] p-[1.5rem] flex items-center gap-[1.25rem] border border-white/40 dark:border-slate-700/50 hover:bg-white/50 dark:hover:bg-slate-800/60 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer ${item.opacityClass}`}
                        >
                            <div className="w-[4rem] h-[4rem] bg-white/50 dark:bg-slate-700/50 rounded-2xl flex items-center justify-center shrink-0">
                                <Icon className="w-[1.5rem] h-[1.5rem] text-[#1E2B58] dark:text-white" strokeWidth={2} />
                            </div>
                            <div>
                                <h5 className="font-bold text-[1rem] text-[#1E2B58] dark:text-white mb-[0.125rem]">
                                    {item.title}
                                </h5>
                                <p className="text-[0.625rem] opacity-60 uppercase font-bold text-[#1E2B58] dark:text-white">
                                    {item.subtitle}
                                    <span className={item.statusColor}>{item.statusLabel}</span>
                                </p>
                            </div>
                        </button>
                    );
                })}
            </div>
        </section>
    );
};
