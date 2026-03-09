import React from 'react';
import { createPortal } from 'react-dom';

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    onClose: () => void;
    onConfirm: () => void;
    itemName?: string;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
    isOpen,
    title,
    message,
    onClose,
    onConfirm,
    itemName
}) => {
    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative w-full max-w-md bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-[32px] border border-white/50 dark:border-white/10 shadow-2xl overflow-hidden p-8 flex flex-col items-center text-center">

                {/* Warning Icon */}
                <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-500 mb-6">
                    <span className="material-symbols-outlined text-3xl">delete_forever</span>
                </div>

                <h3 className="text-xl font-extrabold text-[#1A2B56] dark:text-white mb-2">{title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-1">
                    {message}
                </p>
                {itemName && (
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-8 px-4 py-2 bg-slate-100 dark:bg-slate-700/50 rounded-xl">
                        "{itemName}"
                    </p>
                )}

                <div className="flex flex-col sm:flex-row gap-3 w-full">
                    <button
                        onClick={onClose}
                        className="flex-1 px-6 py-3 rounded-2xl font-bold text-sm text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className="flex-1 px-6 py-3 rounded-2xl font-bold text-sm bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20 transition-all flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined text-lg">delete</span>
                        Confirm Delete
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default DeleteConfirmationModal;
