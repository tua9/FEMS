import React from 'react';
import { ReportHeader }    from '@/components/shared/report/ReportHeader';
import { QuickScanReport } from '@/components/shared/report/QuickScanReport';
import { ReportManualForm } from '@/components/shared/report/ReportManualForm';
import type { QRResult } from '@/components/shared/report/QuickScanReport';
import type { ReportFormData, IssueCategory } from '@/components/shared/report/ReportManualForm';
import type { Room } from '@/types/room';

// ─── Props ────────────────────────────────────────────────────────────────────

interface ReportFormShellProps {
    prefillRoomId:      string;
    prefillCategory:    IssueCategory | undefined;
    prefillDescription: string;
    rooms:              Room[];
    isSubmitting:       boolean;
    onQRDetected:       (result: QRResult) => void;
    onSubmit:           (data: ReportFormData) => Promise<void>;
    children?:          React.ReactNode; // slot for extra content below the form (e.g. RecentReports)
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Shared layout shell used by both ReportIssuePage and GuestReportPage.
 * Renders: ReportHeader → QuickScanReport → divider → ReportManualForm → {children}
 */
export const ReportFormShell: React.FC<ReportFormShellProps> = ({
    prefillRoomId,
    prefillCategory,
    prefillDescription,
    rooms,
    isSubmitting,
    onQRDetected,
    onSubmit,
    children,
}) => (
    <>
        <ReportHeader />

        <QuickScanReport onQRDetected={onQRDetected} />

        {/* Divider */}
        <div className="flex items-center gap-4 mb-8">
            <div className="grow h-px bg-slate-300 dark:bg-slate-700/50" />
            <span className="text-[0.625rem] font-bold text-slate-400 uppercase tracking-widest px-2">
                Or create manual request
            </span>
            <div className="grow h-px bg-slate-300 dark:bg-slate-700/50" />
        </div>

        <ReportManualForm
            key={`${prefillRoomId}-${prefillCategory}`}
            prefillRoomId={prefillRoomId}
            prefillCategory={prefillCategory}
            prefillDescription={prefillDescription}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            rooms={rooms}
        />

        {children}
    </>
);
