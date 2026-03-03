import React from 'react';
import { ArrowRight } from 'lucide-react';

export type EquipmentStatus = 'Available' | 'In Use' | 'Maintenance';
export type EquipmentType = 'laptop' | 'projector' | 'tablet' | 'monitor' | 'camera' | 'audio';
export type LocationKey = 'gamma' | 'alpha';

export interface EquipmentItem {
    id: string;
    title: string;
    sku: string;
    location: string;
    locationKey: LocationKey;
    type: EquipmentType;
    status: EquipmentStatus;
    icon: React.ElementType;
}

interface EquipmentGridProps {
    items: EquipmentItem[];
    totalCount: number;
    onBorrowRequest: (item: EquipmentItem) => void;
}

const statusConfig: Record<EquipmentStatus, { color: string; label: string; disabled: boolean }> = {
    'Available':   { color: 'bg-[#D1FAE5] text-[#059669] dark:bg-[#059669]/20 dark:text-[#34D399]',    label: 'Request Borrow', disabled: false },
    'In Use':      { color: 'bg-[#FEF3C7] text-[#D97706] dark:bg-[#D97706]/20 dark:text-[#FBBF24]',   label: 'In Use',         disabled: true  },
    'Maintenance': { color: 'bg-[#FEE2E2] text-[#DC2626] dark:bg-[#DC2626]/20 dark:text-[#F87171]',   label: 'Under Maintenance', disabled: true  },
};

export const EquipmentGrid: React.FC<EquipmentGridProps> = ({ items, totalCount, onBorrowRequest }) => {
    return (
        <section className="mb-[3rem]">
            <div className="flex justify-between items-end mb-[2rem] px-[0.5rem]">
                <h3 className="text-[1.5rem] md:text-[2rem] font-bold text-[#1E2B58] dark:text-white">
                    Available Equipment
                </h3>
                <span className="text-[0.625rem] md:text-[0.75rem] font-bold uppercase tracking-widest opacity-60 text-[#1E2B58] dark:text-white">
                    Showing {totalCount} Item{totalCount !== 1 ? 's' : ''}
                </span>
            </div>

            {items.length === 0 ? (
                <div className="glass-card rounded-[2rem] p-[4rem] flex flex-col items-center justify-center text-center gap-4">
                    <span className="material-symbols-outlined text-4xl text-[#1E2B58]/30 dark:text-white/20">
                        search_off
                    </span>
                    <p className="text-lg font-black text-[#1E2B58]/40 dark:text-white/30">
                        No equipment matches your search.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[2rem]">
                    {items.map((item) => {
                        const Icon = item.icon;
                        const cfg = statusConfig[item.status];

                        return (
                            <div key={item.id} className="flex flex-col gap-[1.5rem]">
                                {/* Card image area */}
                                <div className="glass-card aspect-[4/3] rounded-[2rem] relative flex items-center justify-center p-[2rem] group overflow-hidden border border-white/30 dark:border-slate-700/50">
                                    <span className={`absolute top-[1.5rem] right-[1.5rem] px-[0.75rem] py-[0.25rem] rounded-full text-[0.65rem] font-bold uppercase tracking-[0.05em] ${cfg.color}`}>
                                        {item.status}
                                    </span>
                                    <Icon
                                        className={`w-[6rem] h-[6rem] text-[#1E2B58] dark:text-white opacity-20 transition-transform duration-300 ${!cfg.disabled ? 'group-hover:scale-110' : ''}`}
                                        strokeWidth={1}
                                    />
                                </div>

                                {/* Info */}
                                <div className="px-[0.5rem]">
                                    <h4 className="font-bold text-[1.25rem] text-[#1E2B58] dark:text-white mb-[0.25rem]">
                                        {item.title}
                                    </h4>
                                    <p className="text-[0.6875rem] font-bold uppercase tracking-widest opacity-60 text-[#1E2B58] dark:text-white">
                                        {item.sku} • {item.location}
                                    </p>
                                </div>

                                {/* Action button */}
                                <button
                                    disabled={cfg.disabled}
                                    onClick={() => !cfg.disabled && onBorrowRequest(item)}
                                    className={`py-[1.25rem] rounded-[1.5rem] font-bold flex items-center justify-center gap-[0.5rem] transition-all duration-300 w-full text-[1rem] ${
                                        cfg.disabled
                                            ? 'bg-white/40 dark:bg-slate-800/40 text-[#1E2B58]/40 dark:text-white/40 cursor-not-allowed'
                                            : 'bg-[#1E2B58] text-white hover:shadow-xl hover:shadow-[#1E2B58]/30 hover:scale-[1.02] active:scale-95'
                                    }`}
                                >
                                    {cfg.label}
                                    {!cfg.disabled && <ArrowRight className="w-[1rem] h-[1rem]" strokeWidth={3} />}
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
};
