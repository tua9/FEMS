import React from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../stores/useAuthStore';

import { ReportDetailModal } from './ReportDetailModal';
import { BorrowDetailModal } from './BorrowDetailModal';
import { ApprovalDetailModal } from './ApprovalDetailModal';

import type { ReportHistoryItem } from './ReportHistoryTable';
import type { BorrowHistoryItem } from './BorrowHistoryTable';
import type { ApprovalHistoryItem } from './ApprovalHistoryTable';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ModalItem =
    | { type: 'report';   item: ReportHistoryItem }
    | { type: 'borrow';   item: BorrowHistoryItem; mode?: 'view' | 'edit' }
    | { type: 'approval'; item: ApprovalHistoryItem };

// ─── Props ────────────────────────────────────────────────────────────────────

interface HistoryDetailModalProps {
    modal: ModalItem;
    onClose: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const HistoryDetailModal: React.FC<HistoryDetailModalProps> = ({ modal, onClose }) => {
    const navigate = useNavigate();
    const { user } = useAuthStore();

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4"
            onClick={e => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="glass-card rounded-[2rem] p-8 w-full max-w-md shadow-2xl shadow-[#1E2B58]/20 relative animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#1E2B58]/10 dark:hover:bg-white/10 transition"
                >
                    <X className="w-4 h-4 text-[#1E2B58]/60 dark:text-white/60" />
                </button>

                {modal.type === 'report' && (
                    <ReportDetailModal
                        item={modal.item}
                        onClose={onClose}
                        onReportAgain={() => { onClose(); navigate(`/${user?.role}/report-issue`); }}
                    />
                )}

                {modal.type === 'borrow' && (
                    <BorrowDetailModal
                        item={modal.item}
                        initialMode={modal.mode || 'view'}
                        onClose={onClose}
                        onBorrowAgain={() => { onClose(); navigate(`/${user?.role}/equipment`); }}
                    />
                )}

                {modal.type === 'approval' && (
                    <ApprovalDetailModal
                        item={modal.item}
                        onClose={onClose}
                        onViewRequests={() => { onClose(); navigate(`/${user?.role}/approval`); }}
                    />
                )}
            </div>
        </div>
    );
};
