import React from 'react';
import { ReportHeader } from '@/features/shared/components/report/ReportHeader';
import { QuickScanReport } from '@/features/shared/components/report/QuickScanReport';
import { ReportManualForm } from '@/features/shared/components/report/ReportManualForm';
// ─── Props ────────────────────────────────────────────────────────────────────

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Shared layout shell used by both ReportIssuePage and GuestReportPage.
 * Renders: ReportHeader → QuickScanReport → divider → ReportManualForm → {children}
 */
export const ReportFormShell = ({
 prefillRoomId,
 prefillCategory,
 prefillDescription,
 prefillEquipmentId,
 rooms,
 buildings,
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
 key={`${prefillRoomId}-${prefillCategory}-${prefillEquipmentId}`}
 prefillRoomId={prefillRoomId}
 prefillCategory={prefillCategory}
 prefillDescription={prefillDescription}
 prefillEquipmentId={prefillEquipmentId}
 onSubmit={onSubmit}
 isSubmitting={isSubmitting}
 rooms={rooms}
 buildings={buildings}
 />

 {children}
 </>
);
