import React from 'react';
import { EquipmentRequest } from '../../../types/admin.types';

interface InventoryRequestListProps {
    requests: EquipmentRequest[];
    efficiencyRate: number;
}

const InventoryRequestList: React.FC<InventoryRequestListProps> = ({ requests, efficiencyRate }) => {
    // Helper to pick a color based on priority
    const getPriorityColor = (priority: string) => {
        switch (priority.toLowerCase()) {
            case 'high': return 'bg-red-500';
            case 'medium': return 'bg-amber-500';
            case 'low': return 'bg-emerald-500';
            default: return 'bg-slate-500';
        }
    };

    return (
        <div className="bg-white/40 dark:bg-slate-800/60 p-8 ambient-shadow flex flex-col h-full rounded-[32px] border border-white/40 dark:border-white/10 backdrop-blur-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-8">
                <h4 className="font-extrabold text-[#1A2B56] dark:text-white text-lg">Inventory Requests</h4>
                <a className="text-xs font-bold text-[#1A2B56] dark:text-blue-400 hover:underline cursor-pointer">View All</a>
            </div>
            <div className="flex-1 space-y-5">
                {requests.map(request => (
                    <div key={request.id} className="flex items-start gap-4 p-3 hover:bg-white/30 dark:hover:bg-slate-700/50 rounded-2xl transition-all cursor-pointer">
                        {request.requesterAvatar ? (
                            <img alt="Avatar" className="w-10 h-10 rounded-full border border-white dark:border-slate-600 object-cover" src={request.requesterAvatar} />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-[#1A2B56] text-white flex items-center justify-center font-bold">
                                {request.requesterName.charAt(0)}
                            </div>
                        )}

                        <div className="flex-1">
                            <p className="text-xs font-bold text-[#1A2B56] dark:text-blue-300">
                                {request.requesterName} <span className="text-slate-500 dark:text-slate-400 font-medium">requested</span>
                            </p>
                            <p className="text-sm font-extrabold text-slate-800 dark:text-white">{request.equipmentName}</p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">{request.timeRequested} • {request.department}</p>
                        </div>
                        <span className={`w-2 h-2 rounded-full mt-2 ${getPriorityColor(request.priority)}`}></span>
                    </div>
                ))}
            </div>
            <div className="mt-8 pt-6 border-t border-white/40 dark:border-white/10">
                <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 dark:text-slate-400 font-bold uppercase tracking-widest">Efficiency Rate</span>
                    <span className="text-[#1A2B56] dark:text-white font-black text-sm">{efficiencyRate}%</span>
                </div>
            </div>
        </div>
    );
};

export default InventoryRequestList;
