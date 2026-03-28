import React from 'react';
import { useNavigate } from 'react-router-dom';

import DarkModeToggle from '@/features/shared/components/navbar/DarkModeToggle';
import Footer from '@/features/shared/components/Footer';
import { ReportFormShell } from '@/features/shared/components/report/ReportFormShell';
import { ReportSuccessModal } from '@/features/shared/components/report/ReportSuccessModal';
import { useReportForm } from '@/hooks/useReportForm';

// ─── Component ────────────────────────────────────────────────────────────────

const GuestReportPage = () => {
 const navigate = useNavigate();

 const {
 prefillRoomId, prefillCategory, prefillDescription, prefillEquipmentId,
 rooms, buildings, isSubmitting,
 showSuccess, reportId, reportSubject, reportDate,
 handleQRDetected, handleFormSubmit,
 handleSubmitAnother, closeSuccess,

 category, setCategory,
 roomId, setRoomId,
 equipmentId, setEquipmentId,
 description, setDescription,
 files, setFiles,
 resetFileInputRef,
 } = useReportForm();

 return (
 <div className="flex min-h-screen w-full flex-col bg-[#e0eafc] text-slate-800 transition-colors duration-300 dark:bg-[#0f172a] dark:text-slate-200">

 {/* ── Navbar ── */}
 <header className="fixed inset-x-0 top-0 z-10 flex items-center justify-between px-6 py-4 sm:px-10 sm:py-5">
 <div className="flex items-center gap-2.5">
 <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full shadow-sm ring-1 ring-black/8 dark:ring-white/10">
 <img src="/logo1.png" alt="F-EMS Logo" className="h-full w-full object-cover" />
 </div>
 <span className="text-[0.9375rem] font-bold tracking-tight text-slate-800 dark:text-white">
 F-EMS
 <span className="ml-1 text-sm font-normal text-slate-400 dark:text-slate-500">| FPT University</span>
 </span>
 </div>
 <div className="flex items-center gap-3">
 <DarkModeToggle />
 <button
 type="button"
 onClick={() => navigate('/login')}
 className="flex items-center gap-1.5 rounded-full bg-[#1E2B58] px-5 py-2 text-[0.8rem] font-bold text-white shadow-md shadow-[#1E2B58]/20 transition hover:bg-[#151f40] hover:scale-[1.03] active:scale-95"
 >
 Login
 </button>
 </div>
 </header>

 {/* ── Main ── */}
 <main className="mx-auto flex w-full max-w-[90vw] flex-1 flex-col overflow-hidden px-4 pt-28 sm:pt-32 pb-10 sm:px-6 xl:max-w-4xl">
 <ReportFormShell
 prefillRoomId={prefillRoomId}
 prefillCategory={prefillCategory}
 prefillDescription={prefillDescription}
 prefillEquipmentId={prefillEquipmentId}
 rooms={rooms}
 buildings={buildings}
 isSubmitting={isSubmitting}
 onQRDetected={handleQRDetected}
 onSubmit={handleFormSubmit}

 category={category}
 setCategory={setCategory}
 roomId={roomId}
 setRoomId={setRoomId}
 equipmentId={equipmentId}
 setEquipmentId={setEquipmentId}
 description={description}
 setDescription={setDescription}
 files={files}
 setFiles={setFiles}
 resetFileInputRef={resetFileInputRef}
 />
 </main>

 <Footer role="auth" />

 {/* ── Success Modal (shared, guest primary action = Login) ── */}
 {showSuccess && reportId && (
 <ReportSuccessModal
 reportId={reportId}
 reportSubject={reportSubject}
 reportDate={reportDate}
 primaryLabel="Login"
 onPrimary={() => navigate('/login')}
 onSubmitAnother={handleSubmitAnother}
 onClose={closeSuccess}
 />
 )}
 </div>
 );
};

export default GuestReportPage;
