import React from 'react';
import { Asset } from '../../../types/admin.types';

interface BrokenAttentionCardProps {
    items: Asset[];
}

const BrokenAttentionCard: React.FC<BrokenAttentionCardProps> = ({ items }) => {
    return (
        <div className="mt-12 glass-card dark:!bg-slate-800/80 p-8 ambient-shadow border-red-200/50 dark:border-red-900/30 rounded-[32px] border bg-white/40 backdrop-blur-[30px]">
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
                <button className="text-xs font-bold text-[#1A2B56] dark:text-blue-400 underline hover:opacity-70 transition-all">
                    View All Issues
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map(item => (
                    <div key={item.id} className="bg-white/80 dark:bg-slate-700/60 p-4 rounded-2xl border border-white dark:border-slate-600 flex gap-4 row-shadow group hover:bg-white dark:hover:bg-slate-700 transition-colors cursor-pointer backdrop-blur-sm">
                        <div className="w-16 h-16 rounded-xl bg-slate-50 dark:bg-slate-800 p-1 flex-shrink-0">
                            <img alt={item.name} className="w-full h-full object-cover rounded-lg" src={item.imageUrl} />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <p className="text-sm font-bold text-slate-800 dark:text-white">{item.name}</p>
                                <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider inline-flex items-center justify-center whitespace-nowrap ${item.status === 'Repairing' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                                    {item.status}
                                </span>
                            </div>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold mb-2">ID: {item.id}</p>

                            <div className="flex gap-2">
                                {item.status === 'Repairing' ? (
                                    <button className="text-[9px] font-bold px-3 py-1 bg-slate-100 dark:bg-slate-600 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-500 transition-all">
                                        Track Order
                                    </button>
                                ) : (
                                    <>
                                        <button className="text-[9px] font-bold px-3 py-1 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg border border-red-100 dark:border-red-800/50 hover:bg-red-500 hover:text-white dark:hover:bg-red-600 transition-all">
                                            Report Repair
                                        </button>
                                        <button className="text-[9px] font-bold px-3 py-1 bg-slate-100 dark:bg-slate-600 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-500 transition-all">
                                            Details
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BrokenAttentionCard;
