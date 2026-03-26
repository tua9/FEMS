import React from 'react';
import type { Equipment } from '../../../types/equipment';
import { getDerivedStatus } from '../../../utils/equipmentHelpers';

interface EquipmentTableProps {
    equipments: Equipment[];
    onOpenDetails?: (asset: Equipment) => void;
    onOpenQRCode?: (asset: Equipment) => void;
    onEdit?: (asset: Equipment) => void;
    onDelete?: (asset: Equipment) => void;
    onReportDamage?: (asset: Equipment) => void;
    activeRequests?: any[];
}

const EquipmentTable: React.FC<EquipmentTableProps> = ({ equipments, onOpenDetails, onOpenQRCode, onEdit, onDelete, onReportDamage, activeRequests = [] }) => {

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Available': return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400';
            case 'In Use': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400';
            case 'Reserved': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
            case 'Broken': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
            case 'Maintenance': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400';
            default: return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300';
        }
    };

    const rowBg = "bg-white/70 group-hover:bg-white dark:bg-slate-800/60 dark:group-hover:bg-slate-700/80 backdrop-blur-sm transition-colors";

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-y-4 min-w-[900px] table-fixed">
                <thead>
                    <tr className="text-slate-800 dark:text-slate-300">
                        <th className="px-6 pb-2 text-[11px] font-semibold uppercase tracking-[0.2em] opacity-80">Equipment</th>
                        <th className="px-6 pb-2 text-[11px] font-semibold uppercase tracking-[0.2em] opacity-80 hidden md:table-cell">Category</th>
                        <th className="px-6 pb-2 text-[11px] font-semibold uppercase tracking-[0.2em] opacity-80 hidden sm:table-cell">Location</th>
                        <th className="px-6 pb-2 text-[11px] font-semibold uppercase tracking-[0.2em] opacity-80">Status</th>
                        <th className="px-6 pb-2 text-[11px] font-semibold uppercase tracking-[0.2em] opacity-80 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="space-y-4">
                    {equipments.length > 0 ? (
                        equipments.map(item => (
                            <tr key={item._id} className="group cursor-pointer" onClick={() => onOpenDetails && onOpenDetails(item)}>
                                <td className={`p-4 rounded-l-2xl ${rowBg}`}>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-700 p-1 shadow-sm overflow-hidden flex-shrink-0">
                                            <img alt={item.name} className="w-full h-full object-cover rounded-lg" src={item.img || 'https://via.placeholder.com/150'} />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-semibold text-slate-800 dark:text-white truncate" title={item.name}>{item.name}</p>
                                            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium truncate">Code: {item.code || "#" + item._id.slice(-6).toUpperCase()}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className={`p-4 text-sm font-medium text-slate-600 dark:text-slate-300 hidden md:table-cell max-w-[150px] truncate ${rowBg}`} title={item.category}>{item.category}</td>
                                <td className={`p-4 text-sm font-medium text-slate-600 dark:text-slate-300 hidden sm:table-cell max-w-[150px] truncate ${rowBg}`} title={(item.room_id as any)?.name}>{(item.room_id as any)?.name || 'N/A'}</td>
                                <td className={`p-4 ${rowBg}`}>
                                    {(() => {
                                        const vStatus = getDerivedStatus(item, activeRequests);
                                        return (
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider inline-flex items-center justify-center whitespace-nowrap ${getStatusStyle(vStatus)}`}>
                                                {vStatus}
                                            </span>
                                        );
                                    })()}
                                </td>
                                <td className={`p-4 rounded-r-2xl text-right ${rowBg}`} onClick={e => e.stopPropagation()}>
                                    <div className="flex items-center justify-end gap-2 text-slate-400">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onOpenQRCode && onOpenQRCode(item); }}
                                            className="p-2 hover:bg-white/80 dark:hover:bg-slate-600 rounded-lg transition-all text-slate-400 hover:text-[#1A2B56] dark:hover:text-blue-400"
                                        >
                                            <span className="material-symbols-outlined text-xl">qr_code_2</span>
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onEdit && onEdit(item); }}
                                            className="p-2 hover:bg-white/80 dark:hover:bg-slate-600 rounded-lg transition-all text-slate-400 hover:text-[#1A2B56] dark:hover:text-blue-400"
                                        >
                                            <span className="material-symbols-outlined text-xl">edit</span>
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onReportDamage && onReportDamage(item); }}
                                            className="p-2 hover:bg-orange-50 dark:hover:bg-orange-900/30 rounded-lg transition-all text-slate-400 hover:text-orange-500"
                                            title="Report Damage"
                                        >
                                            <span className="material-symbols-outlined text-xl">report</span>
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onDelete && onDelete(item); }}
                                            className="p-2 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all text-slate-400 hover:text-red-500"
                                            title="Remove from Inventory"
                                        >
                                            <span className="material-symbols-outlined text-xl">delete_forever</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5} className="py-16 text-center bg-white/40 dark:bg-slate-800/40 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700">
                                <div className="flex flex-col items-center gap-4">
                                    <span className="material-symbols-outlined text-5xl text-slate-300">inventory</span>
                                    <div>
                                        <p className="text-sm font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">No equipment found</p>
                                        <p className="text-xs text-slate-400 font-medium">No assets matching your current search or filter criteria.</p>
                                    </div>
                                    <button
                                        onClick={() => window.location.reload()}
                                        className="mt-2 px-6 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                                    >
                                        Clear All Filters
                                    </button>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default EquipmentTable;
