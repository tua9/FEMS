import React from 'react';
import { createPortal } from 'react-dom';
import type { Equipment } from '../../../types/equipment';

interface DeviceDetailsModalProps {
    isOpen: boolean;
    device: Equipment | null;
    onClose: () => void;
    onEdit?: (device: Equipment) => void;
    onReportDamage?: (device: Equipment) => void;
}

const DeviceDetailsModal: React.FC<DeviceDetailsModalProps> = ({ isOpen, device, onClose, onEdit, onReportDamage }) => {
    if (!isOpen || !device) return null;

    const getStatusStyle = (status: string) => {
        const s = status.toLowerCase();
        switch (s) {
            case 'good': return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200/50';
            case 'maintenance': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-200/50';
            case 'broken': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200/50';
            default: return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200/50';
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

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6 bg-black/30 backdrop-blur-sm">
            <style dangerouslySetInnerHTML={{
                __html: `
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            ` }} />
            {/* Backdrop */}
            <div
                className="absolute inset-0"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative w-full max-w-2xl dashboard-card rounded-4xl shadow-2xl shadow-[#1E2B58]/20 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">

                {/* Header Section */}
                <div className="px-10 pt-8 pb-6 relative border-b border-black/8 dark:border-white/10">
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-8 w-8 h-8 flex items-center justify-center text-[#1E2B58]/50 hover:text-[#1E2B58] hover:bg-[#1E2B58]/8 dark:text-white/50 dark:hover:text-white dark:hover:bg-white/10 rounded-full transition-colors z-20"
                    >
                        <span className="material-symbols-outlined text-xl">close</span>
                    </button>

                    <div className="flex items-center gap-4 mb-3">
                        <span className={`px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 shadow-sm ${getStatusStyle(device.status)}`}>
                            {device.status}
                        </span>
                        <span className="px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 border-blue-100 dark:border-blue-900/30 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-sm">
                            {device.category}
                        </span>
                    </div>

                    <h3 className="text-2xl font-black text-[#1E2B58] dark:text-white tracking-tight">{device.name}</h3>
                    <p className="text-[0.625rem] font-black text-[#1E2B58]/50 dark:text-white/40 uppercase tracking-widest mt-1">Asset ID: {device._id}</p>
                </div>

                <div className="p-10 pt-0 overflow-y-auto no-scrollbar space-y-8 relative z-10 mt-6">
                    {/* Image and Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="relative group rounded-3xl overflow-hidden aspect-video border-2 border-white dark:border-slate-700 shadow-lg">
                            <img
                                src={device.imageUrl || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=1026'}
                                alt={device.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                                <p className="text-white font-black text-sm uppercase tracking-widest">Equipment Visual</p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4">
                            <div className="p-6 rounded-3xl bg-white/40 dark:bg-slate-900/30 border-2 border-white dark:border-slate-700 shadow-sm grow flex flex-col justify-center">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Current Location</h4>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 flex items-center justify-center border-2 border-indigo-100 dark:border-indigo-900/30">
                                        <span className="material-symbols-outlined text-xl">location_on</span>
                                    </div>
                                    <p className="font-black text-slate-800 dark:text-white leading-tight">{(device.room_id as any)?.name || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="p-6 rounded-3xl bg-white/40 dark:bg-slate-900/30 border-2 border-white dark:border-slate-700 shadow-sm grow flex flex-col justify-center">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Purchased Date</h4>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 flex items-center justify-center border-2 border-emerald-100 dark:border-emerald-900/30">
                                        <span className="material-symbols-outlined text-xl">calendar_today</span>
                                    </div>
                                    <p className="font-black text-slate-800 dark:text-white leading-tight">{formatDate(device.createdAt)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="p-8 rounded-[32px] bg-slate-50/50 dark:bg-slate-900/20 border-2 border-slate-100 dark:border-slate-800">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 text-center">Equipment Description</h4>
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-relaxed text-center">
                            {device.description || 'No description provided for this asset.'}
                        </p>
                    </div>

                    {/* QR Code / Placeholder for more info */}
                    <div className="p-8 rounded-[32px] border-2 border-slate-200 dark:border-slate-700 border-dashed flex flex-col items-center justify-center text-center group hover:border-blue-400/50 transition-colors">
                        <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-600 mb-4 group-hover:text-blue-400 transition-colors">qr_code_2</span>
                        <p className="text-[10px] text-slate-400 font-black tracking-widest uppercase">Asset Tracking QR</p>
                        <p className="text-xs font-bold text-slate-500 mt-2">Scan for inventory verification</p>
                    </div>
                </div>

                {/* Footer Section */}
                <div className="px-8 py-5 border-t border-black/8 dark:border-white/10 bg-black/3 dark:bg-white/3 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex gap-3">
                        {onEdit && (
                            <button
                                onClick={() => onEdit(device)}
                                className="px-6 py-2.5 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 text-[#1E2B58] dark:text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-sm hover:shadow-md hover:bg-slate-50 dark:hover:bg-slate-700/80 flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined text-lg">edit_square</span>
                                Edit Asset
                            </button>
                        )}
                        {onReportDamage && device.status !== 'Broken' && device.status !== 'Repairing' && (
                            <button
                                onClick={() => onReportDamage(device)}
                                className="px-6 py-2.5 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 border-2 border-red-100 dark:border-red-900/30 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-sm hover:shadow-red-500/10 hover:bg-red-100 flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined text-lg">report</span>
                                Report Damage
                            </button>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="px-6 py-3 bg-[#1A2B56] hover:bg-[#2A3B66] text-white rounded-xl font-black text-xs uppercase tracking-[0.15em] transition-all shadow-lg shadow-blue-900/20"
                    >
                        Dismiss View
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default DeviceDetailsModal;
