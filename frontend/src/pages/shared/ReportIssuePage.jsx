import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList } from 'lucide-react';

import { ReportFormShell } from '@/components/shared/report/ReportFormShell';
import { RecentReports } from '@/components/shared/report/RecentReports';
import { ReportSuccessModal } from '@/components/shared/report/ReportSuccessModal';
import { useReportForm } from '@/hooks/useReportForm';
import { useAuthStore } from '@/stores/useAuthStore';

// ─── Component ────────────────────────────────────────────────────────────────

export const ReportIssuePage = () => {
 const navigate = useNavigate();
 const { user } = useAuthStore();

 const {
 prefillRoomId, prefillCategory, prefillDescription, prefillEquipmentId,
 rooms, isSubmitting,
 showSuccess, reportId, reportSubject, reportDate,
 handleQRDetected, handleFormSubmit,
 handleSubmitAnother, closeSuccess,
 } = useReportForm();

 return (
 <div className="w-full">
 <main className="pt-6 sm:pt-24 pb-10 px-4 sm:px-6 w-full max-w-[90vw] xl:max-w-4xl mx-auto flex-1 flex flex-col overflow-hidden">
 <div className="w-full">
 <ReportFormShell
 prefillRoomId={prefillRoomId}
 prefillCategory={prefillCategory}
 prefillDescription={prefillDescription}
 prefillEquipmentId={prefillEquipmentId}
 rooms={rooms}
 isSubmitting={isSubmitting}
 onQRDetected={handleQRDetected}
 onSubmit={handleFormSubmit}
 >
 <RecentReports />
 </ReportFormShell>
 </div>
 </main>

 {showSuccess && reportId && (
 <ReportSuccessModal
 reportId={reportId}
 reportSubject={reportSubject}
 reportDate={reportDate}
 primaryLabel="View in My History"
 primaryIcon={<ClipboardList className="w-4 h-4" />}
 onPrimary={() => { closeSuccess(); navigate(`/${user?.role}/history`); }}
 onSubmitAnother={handleSubmitAnother}
 onClose={closeSuccess}
 />
 )}
 </div>
 );
};

export default ReportIssuePage;
