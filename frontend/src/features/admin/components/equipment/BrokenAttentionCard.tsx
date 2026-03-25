import React from 'react';
import type { Equipment } from '@/types/equipment';

interface BrokenAttentionCardProps {
    items: Equipment[];
    onViewDetails?: (item: Equipment) => void;
    onUpdateStatus?: (id: string, newStatus: string) => void;
    onViewAll?: () => void;
}

const BrokenAttentionCard: React.FC<BrokenAttentionCardProps> = ({ items, onViewDetails, onUpdateStatus, onViewAll }) => {
    return (
        <div className="mt-12 dashboard-card p-8 rounded-4xl transition-none">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-extrabold text-[#1A2B56] dark:text-white tracking-tight flex items-center gap-2">
                        <span className="material-symbols-outlined text-red-500">error</span>
                        Broken Equipment Attention
                    </h3>
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-1 uppercase tracking-wider">
                        Assets marked as broken requiring immediate repair or replacement
                    </p>
                </div>
                <button
                    onClick={onViewAll}
                    className="px-5 py-2.5 rounded-2xl bg-white/30 dark:bg-slate-700/40 border border-white/50 dark:border-slate-600/50 backdrop-blur-md text-xs font-bold text-[#1A2B56] dark:text-blue-300 shadow-sm transition-all duration-300 hover:bg-white/60 dark:hover:bg-slate-700/80 hover:-translate-y-1 hover:shadow-lg active:scale-95 flex items-center gap-2"
                >
                    View All Issues
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map(item => (
                    <div key={item._id} className="bg-white/80 dark:bg-slate-700/60 p-4 rounded-2xl border border-white dark:border-slate-600 flex gap-4 transition-all duration-300 cursor-pointer backdrop-blur-sm hover:-translate-y-1.5 hover:shadow-2xl hover:bg-white dark:hover:bg-slate-700 hover:border-blue-200 dark:hover:border-slate-500 active:scale-95 group">
                        <div className="w-12 h-12 rounded-2xl overflow-hidden shrink-0 border-2 border-white dark:border-slate-700 shadow-sm">
                        <img src={item.img || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=1026'} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <p className="text-sm font-bold text-slate-800 dark:text-white">{item.name}</p>
                                <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider inline-flex items-center justify-center whitespace-nowrap ${item.status === 'Repairing' || item.status === 'maintenance' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                                    {item.status}
                                </span>
                            </div>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold mb-2">Code: {item.code || "#" + item._id.slice(-6).toUpperCase()}</p>

                            <div className="flex gap-1.5 flex-wrap">
                                {item.status === 'maintenance' ? (
                                    <>
                                        <button
                                            onClick={() => onUpdateStatus?.(item._id, 'good')}
                                            className="text-[9px] font-bold px-3 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg border border-emerald-100 dark:border-emerald-800/50 hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-600 transition-all flex-grow text-center"
                                        >
                                            Complete
                                        </button>
                                        <button
                                            onClick={() => onUpdateStatus?.(item._id, 'broken')}
                                            className="text-[9px] font-bold px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
                                            title="Cancel Repair"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => onUpdateStatus?.(item._id, 'Decommissioned')}
                                            className="text-[9px] font-bold px-2 py-1 bg-red-50 dark:bg-red-900/20 text-red-400 dark:text-red-500 rounded-lg border border-red-100 dark:border-red-900/30 hover:bg-red-500 hover:text-white transition-all"
                                            title="Mark as Unrepairable"
                                        >
                                            Scrap
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => onUpdateStatus?.(item._id, 'maintenance')}
                                        className="text-[9px] font-bold px-3 py-1 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg border border-red-100 dark:border-red-800/50 hover:bg-red-500 hover:text-white dark:hover:bg-red-600 transition-all flex-grow text-center"
                                    >
                                        Start Repair
                                    </button>
                                )}
                                <button
                                    onClick={() => onViewDetails?.(item)}
                                    className="text-[9px] font-bold px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800/30 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800 transition-all"
                                >
                                    Details
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BrokenAttentionCard;
