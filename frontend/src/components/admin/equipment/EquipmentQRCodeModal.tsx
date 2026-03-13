import React from 'react';
import { createPortal } from 'react-dom';
import type { Equipment } from '../../../types/equipment';

interface EquipmentQRCodeModalProps {
    isOpen: boolean;
    onClose: () => void;
    equipment: Equipment | null;
}

const EquipmentQRCodeModal: React.FC<EquipmentQRCodeModalProps> = ({ isOpen, onClose, equipment }) => {
    if (!isOpen || !equipment) return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

            <div className="relative w-full max-w-sm glass-card hover:transform-none hover:bg-white/60 dark:hover:bg-slate-800/70 hover:shadow-2xl dark:!bg-slate-800/70 rounded-[32px] border border-white/40 dark:border-white/10 p-8 shadow-2xl bg-white/60 backdrop-blur-xl transition-all transform animate-in fade-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                    <span className="material-symbols-outlined xl">close</span>
                </button>

                <div className="text-center mb-6">
                    <div className="w-16 h-16 mx-auto bg-white dark:bg-slate-700 p-1 rounded-2xl shadow-sm mb-4">
                        <img src={equipment.imageUrl} alt={equipment.name} className="w-full h-full object-cover rounded-xl" />
                    </div>
                    <h3 className="text-xl font-extrabold text-[#1A2B56] dark:text-white">{equipment.name}</h3>
                    <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">ID: {equipment._id}</p>
                </div>

                <div className="bg-white p-4 rounded-2xl shadow-inner mx-auto w-48 h-48 flex items-center justify-center border border-slate-100">
                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${equipment._id}`} alt="QR Code" className="w-full h-full opacity-90" />
                </div>

                <div className="mt-8 flex gap-3">
                    <button className="flex-1 py-3 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold rounded-xl border border-slate-200 dark:border-slate-600 transition-all flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-lg">download</span>
                        Save
                    </button>
                    <button className="flex-1 py-3 bg-[#1A2B56] hover:bg-[#2A3B66] text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-lg">print</span>
                        Print
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default EquipmentQRCodeModal;
