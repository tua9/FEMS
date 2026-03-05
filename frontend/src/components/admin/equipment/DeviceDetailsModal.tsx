import React from 'react';
import { createPortal } from 'react-dom';
import { Asset } from '../../../types/admin.types';

interface DeviceDetailsModalProps {
    isOpen: boolean;
    device: Asset | null;
    onClose: () => void;
    onEdit?: (device: Asset) => void;
    onReportDamage?: (device: Asset) => void;
}

const DeviceDetailsModal: React.FC<DeviceDetailsModalProps> = ({ isOpen, device, onClose, onEdit, onReportDamage }) => {
    if (!isOpen || !device) return null;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Available': return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20';
            case 'In Use': return 'text-blue-500 bg-blue-50 dark:bg-blue-900/20';
            case 'Maintenance': return 'text-orange-500 bg-orange-50 dark:bg-orange-900/20';
            case 'Broken': return 'text-red-500 bg-red-50 dark:bg-red-900/20';
            default: return 'text-slate-500 bg-slate-50 dark:bg-slate-800';
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Not Set';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric', day: 'numeric' });
        } catch (e) {
            return dateString;
        }
    };

    const formatWarranty = (dateString?: string) => {
        if (!dateString) return 'No Warranty';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        } catch (e) {
            return dateString;
        }
    };

    return (
        createPortal(
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <style dangerouslySetInnerHTML={{
                    __html: `
                    .no-scrollbar::-webkit-scrollbar { display: none; }
                    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                ` }} />
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
                    onClick={onClose}
                ></div>

                {/* Modal Content */}
                <div className="relative w-full max-w-4xl bg-white/95 dark:bg-slate-800/95 backdrop-blur-2xl rounded-[48px] border-2 border-white/60 dark:border-white/20 shadow-3xl overflow-hidden flex flex-col max-h-[92vh]">

                    {/* Header with Image Background */}
                    <div className="relative min-h-[220px] overflow-hidden">
                        <img
                            src={device.imageUrl || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=1026'}
                            alt={device.name}
                            className="absolute inset-0 w-full h-full object-cover opacity-40 blur-md scale-110"
                        />
                        {/* Soft blending gradient */}
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 dark:via-slate-800/50 to-white/95 dark:to-slate-800/95"></div>

                        <button
                            onClick={onClose}
                            className="absolute top-8 right-8 w-11 h-11 flex items-center justify-center bg-white/20 hover:bg-white/40 text-slate-700 dark:text-white rounded-full backdrop-blur-xl transition-all z-20 border-2 border-white/30"
                        >
                            <span className="material-symbols-outlined text-xl">close</span>
                        </button>

                        <div className="relative pt-16 pb-8 px-12 flex items-center gap-8 z-10">
                            <div className="w-24 h-24 rounded-3xl bg-white dark:bg-slate-700 p-2 shadow-2xl border-2 border-white dark:border-slate-600 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                                <img src={device.imageUrl || 'https://via.placeholder.com/150'} alt="" className="w-full h-full object-cover rounded-2xl" />
                            </div>
                            <div>
                                <h3 className="text-3xl font-black text-[#1A2B56] dark:text-white tracking-tight leading-none mb-3">{device.name}</h3>
                                <div className="flex items-center gap-3">
                                    <span className={`px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm border-2 border-transparent ${getStatusColor(device.status)}`}>
                                        {device.status}
                                    </span>
                                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{device.category} • ID: {device.id}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Grid */}
                    <div className="px-12 pb-12 overflow-y-auto no-scrollbar grid grid-cols-1 md:grid-cols-12 gap-10 relative z-10">

                        {/* Middle: Tech Specs & History */}
                        <div className="md:col-span-8 space-y-10">
                            <div>
                                <h4 className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-400 mb-6 flex items-center gap-3">
                                    <span className="w-8 h-px bg-slate-200 dark:bg-slate-700"></span>
                                    Asset Specifications
                                </h4>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="p-5 rounded-3xl bg-white/40 dark:bg-slate-900/30 border-2 border-white dark:border-slate-700 shadow-sm">
                                        <p className="text-[10px] text-slate-400 font-bold uppercase mb-2">Location</p>
                                        <p className="text-sm font-black text-slate-800 dark:text-slate-200">{device.location}</p>
                                    </div>
                                    <div className="p-5 rounded-3xl bg-white/40 dark:bg-slate-900/30 border-2 border-white dark:border-slate-700 shadow-sm">
                                        <p className="text-[10px] text-slate-400 font-bold uppercase mb-2">Warranty</p>
                                        <p className="text-sm font-black text-emerald-600 dark:text-emerald-400">{formatWarranty(device.warranty)}</p>
                                    </div>
                                </div>
                            </div>

                            {device.description && (
                                <div>
                                    <h4 className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-400 mb-4 flex items-center gap-3">
                                        <span className="w-8 h-0.5 bg-slate-200 dark:bg-slate-700"></span>
                                        General Description
                                    </h4>
                                    <div className="p-6 rounded-3xl bg-slate-50/50 dark:bg-slate-900/20 border-2 border-slate-200 dark:border-slate-800">
                                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                            {device.description}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {(device.status === 'Broken' || device.status === 'Repairing' || device.issueDescription) && (
                                <div className="mt-8">
                                    <h4 className="text-[11px] font-black uppercase tracking-[0.25em] text-red-500 mb-4 flex items-center gap-3">
                                        <span className="w-8 h-0.5 bg-red-200 dark:bg-red-900/50"></span>
                                        Damage Report / Issues
                                    </h4>
                                    <div className="p-6 rounded-3xl bg-red-50/50 dark:bg-red-900/10 border-2 border-red-200 dark:border-red-900/30">
                                        <p className="text-sm text-red-700 dark:text-red-300 font-bold leading-relaxed italic">
                                            {device.issueDescription || "No detailed damage report provided. Unit requires full diagnostic."}
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <h4 className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-400 flex items-center gap-3">
                                        <span className="w-8 h-0.5 bg-slate-200 dark:bg-slate-700"></span>
                                        Asset Timeline
                                    </h4>
                                    <button className="text-[10px] font-black text-[#1A2B56] dark:text-blue-400 uppercase tracking-widest hover:underline">Full History</button>
                                </div>
                                <div className="space-y-4">
                                    {[
                                        { date: 'Today, 10:24 AM', user: 'Technician Alex', action: 'Maintenance check completed' },
                                        { date: 'Yesterday', user: 'Student Sarah', action: 'Asset borrowed for 48 hours' },
                                        { date: 'Feb 24, 2026', user: 'System', action: 'Firmware updated to v2.4.1' }
                                    ].map((log, i) => (
                                        <div key={i} className="flex items-start gap-4 p-5 rounded-3xl bg-slate-50/50 dark:bg-slate-900/20 border-2 border-slate-200 dark:border-slate-800 transition-all hover:bg-white dark:hover:bg-slate-900/40">
                                            <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center text-[#1A2B56] dark:text-blue-400 shadow-sm">
                                                <span className="material-symbols-outlined text-[20px]">{i === 0 ? 'verified' : 'history'}</span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800 dark:text-white">{log.action}</p>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{log.user} • {log.date}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right: Actions & QR */}
                        <div className="md:col-span-4 space-y-8">
                            <div className="p-8 rounded-[40px] bg-[#1A2B56] dark:bg-slate-900 text-white shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                                <h5 className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-200 mb-6">Inventory Actions</h5>
                                <div className="space-y-4 relative z-10">
                                    <button
                                        onClick={() => onEdit && onEdit(device)}
                                        className="w-full flex items-center gap-4 p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all border-2 border-white/20 font-bold text-sm"
                                    >
                                        <span className="material-symbols-outlined">edit_square</span>
                                        Edit Details
                                    </button>
                                    <button
                                        onClick={() => onReportDamage && onReportDamage(device)}
                                        disabled={device.status === 'Broken' || device.status === 'Repairing'}
                                        className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all font-bold text-sm shadow-xl ${device.status === 'Broken' || device.status === 'Repairing' ? 'bg-slate-700 cursor-not-allowed opacity-50' : 'bg-red-500/80 hover:bg-red-500 shadow-red-900/20'}`}
                                    >
                                        <span className="material-symbols-outlined">report</span>
                                        {device.status === 'Broken' || device.status === 'Repairing' ? 'Issue Reported' : 'Report Damage'}
                                    </button>
                                </div>
                            </div>

                            <div className="p-8 rounded-[40px] border-2 border-slate-200 dark:border-slate-700 border-dashed text-center">
                                <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-600 mb-4 block">inventory_2</span>
                                <p className="text-[10px] text-slate-400 font-black tracking-widest uppercase mb-1">Purchased On</p>
                                <p className="text-sm font-black text-slate-700 dark:text-slate-300 tracking-tight">{formatDate(device.purchaseDate)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-12 py-8 border-t border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-900/20 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Active in Database</span>
                        </div>
                        <button
                            onClick={onClose}
                            className="px-8 py-3 bg-[#1A2B56] hover:bg-[#2A3B66] text-white rounded-2xl font-black text-xs uppercase tracking-[0.15em] transition-all shadow-xl shadow-blue-900/20"
                        >
                            Return to Fleet
                        </button>
                    </div>
                </div>
            </div>,
            document.body
        )
    );
};

export default DeviceDetailsModal;
