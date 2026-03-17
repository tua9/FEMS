import React from 'react';
import { createPortal } from 'react-dom';

interface ActionConfirmationModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    onClose: () => void;
    onConfirm: () => void;
    itemName?: string;
    confirmText?: string;
    confirmColor?: string;
    icon?: string;
    iconColor?: string;
}

const ActionConfirmationModal: React.FC<ActionConfirmationModalProps> = ({
    isOpen,
    title,
    message,
    onClose,
    onConfirm,
    itemName,
    confirmText = "Confirm",
    confirmColor = "bg-[#1A2B56]",
    icon = "help",
    iconColor = "text-blue-500"
}) => {
    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[110] flex items-center justify-center px-4 py-6 bg-black/30 backdrop-blur-sm">
            {/* Backdrop */}
            <div
                className="absolute inset-0"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative w-full max-w-md dashboard-card rounded-4xl shadow-2xl shadow-[#1E2B58]/20 overflow-hidden p-8 flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-200">

                {/* Icon */}
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${iconColor.replace('text-', 'bg-').replace(/\d+$/, '500/10')}`}>
                    <div className={`w-11 h-11 rounded-full flex items-center justify-center shadow-lg ${iconColor.replace('text-', 'bg-')} ${iconColor.replace('text-', 'shadow-').replace(/\d+$/, '500/30')}`}>
                        <span className="material-symbols-outlined text-white text-2xl">{icon}</span>
                    </div>
                </div>

                <p className="text-[0.625rem] font-black uppercase tracking-widest text-[#1E2B58]/50 dark:text-white/40 mb-1">Confirm Action</p>
                <h3 className="text-xl font-extrabold text-[#1E2B58] dark:text-white mb-2">{title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-1">
                    {message}
                </p>
                {itemName && (
                    <p className="text-sm font-bold text-[#1E2B58] dark:text-white mb-8 px-4 py-2 bg-white/40 dark:bg-slate-800/40 rounded-[1.25rem]">
                        "{itemName}"
                    </p>
                )}

                <div className="flex flex-col sm:flex-row gap-3 w-full mt-4">
                    <button
                        onClick={onClose}
                        className="flex-1 px-6 py-3 rounded-[1.25rem] font-bold text-sm border border-[#1E2B58]/15 dark:border-white/15 text-[#1E2B58]/70 dark:text-white/70 hover:bg-[#1E2B58]/5 dark:hover:bg-white/5 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className={`flex-1 px-6 py-3 rounded-[1.25rem] font-bold text-sm ${confirmColor} hover:scale-[1.02] active:scale-95 text-white shadow-lg transition-all flex items-center justify-center gap-2`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ActionConfirmationModal;
