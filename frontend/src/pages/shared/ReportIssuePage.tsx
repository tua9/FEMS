import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle2, X, ArrowRight, ClipboardList } from 'lucide-react';
import { toast } from 'sonner';

import { ReportHeader }     from '@/components/shared/report/ReportHeader';
import { QuickScanReport, type QRResult } from '@/components/shared/report/QuickScanReport';
import { ReportManualForm, type ReportFormData, type IssueCategory } from '@/components/shared/report/ReportManualForm';
import { RecentReports }    from '@/components/shared/report/RecentReports';

import { useReportStore }   from '@/stores/useReportStore';
import { useRoomStore }     from '@/stores/useRoomStore';
import { useAuthStore }     from '@/stores/useAuthStore';
import type { ReportType }  from '@/types/report';

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Map frontend UI category → DB Report.type
const CATEGORY_TO_TYPE: Record<IssueCategory, ReportType> = {
    equipment: 'equipment',
    infrastructure: 'infrastructure',
    other:      'other',
};

// Convert File to base64 string
const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload  = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });

// ─── Navigation state from Room Status ────────────────────────────────────────
interface NavState {
    prefillRoom?:     string;
    prefillBuilding?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const ReportIssuePage: React.FC = () => {
    const navigate   = useNavigate();
    const location   = useLocation();
    const routeState = (location.state ?? {}) as NavState;
    const { user }   = useAuthStore();

    const { createReport, fetchMyReports } = useReportStore();
    const { rooms, fetchAll: fetchRooms } = useRoomStore();

    useEffect(() => {
        fetchRooms();
    }, [fetchRooms]);

    // ── Prefill from Room Status / QR scan ────────────────────────────────────
    const [prefillRoomId,    setPrefillRoomId]    = useState<string>(routeState.prefillRoom ?? '');
    const [prefillCategory,    setPrefillCategory]    = useState<IssueCategory | undefined>(undefined);
    const [prefillDescription, setPrefillDescription] = useState<string>('');

    // ── Submission state ──────────────────────────────────────────────────────
    const [isSubmitting,  setIsSubmitting]  = useState(false);
    const [reportId,      setReportId]      = useState<string | null>(null);
    const [reportSubject, setReportSubject] = useState('');
    const [reportDate,    setReportDate]    = useState('');
    const [showSuccess,   setShowSuccess]   = useState(false);

    // ── QR Scan handler ───────────────────────────────────────────────────────
    const handleQRDetected = (result: QRResult) => {
        setPrefillRoomId(result.roomId);
        setPrefillCategory(result.category);
        setPrefillDescription(result.description);
    };

    // ── Form submit — REAL API CALL ───────────────────────────────────────────
    const handleFormSubmit = async (data: ReportFormData) => {
        setIsSubmitting(true);
        try {
            // 1. Optional: encode first image as base64
            let imgBase64: string | null = null;
            if (data.files.length > 0) {
                imgBase64 = await fileToBase64(data.files[0]);
            }

            // 2. Build JSON payload
            const payload = {
                room_id:     data.room_id,
                equipment_id: data.equipment_id,
                type:        CATEGORY_TO_TYPE[data.category],
                description: data.description,
                severity:    data.severity,
                img:         imgBase64,
            };

            // 3. Call store → service → POST /tickets/report (JSON)
            await createReport(payload);

            // 4. Build success display data
            const categoryLabels: Record<IssueCategory, string> = {
                equipment: 'Equipment',
                infrastructure: 'Infrastructure',
                other:      'Other',
            };
            
            const room = rooms.find(r => r._id === data.room_id);
            const locationStr = room ? room.name : 'Unknown Location';
            const subject = `${categoryLabels[data.category]} Issue — ${locationStr}`;
            const today   = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

            setReportId(`#REP-${Date.now().toString().slice(-6)}`);
            setReportSubject(subject);
            setReportDate(today);
            setShowSuccess(true);

            // 5. Refresh recent reports list
            await fetchMyReports();

        } catch (err: any) {
            toast.error('Failed to submit report', {
                description: err?.response?.data?.message || 'Please try again.',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // ── Success modal actions ─────────────────────────────────────────────────
    const handleViewHistory = () => {
        setShowSuccess(false);
        navigate(`/${user?.role}/history`);
    };

    const handleSubmitAnother = () => {
        setShowSuccess(false);
        setPrefillRoomId('');
        setPrefillCategory(undefined);
        setPrefillDescription('');
    };

    // ─────────────────────────────────────────────────────────────────────────

    return (
        <div className="w-full">
            <main className="pt-6 sm:pt-24 pb-10 px-4 sm:px-6 w-full max-w-[90vw] xl:max-w-4xl mx-auto flex-1 flex flex-col overflow-hidden">
                <div className="w-full">
                    <ReportHeader />

                    {/* QR Scan */}
                    <QuickScanReport onQRDetected={handleQRDetected} />

                    {/* Divider */}
                    <div className="flex items-center gap-4 mb-8">
                        <div className="grow h-px bg-slate-300 dark:bg-slate-700/50" />
                        <span className="text-[0.625rem] font-bold text-slate-400 uppercase tracking-widest px-2">
                            Or create manual request
                        </span>
                        <div className="grow h-px bg-slate-300 dark:bg-slate-700/50" />
                    </div>

                    {/* Manual form */}
                    <ReportManualForm
                        key={`${prefillRoomId}-${prefillCategory}`}
                        prefillRoomId={prefillRoomId}
                        prefillCategory={prefillCategory}
                        prefillDescription={prefillDescription}
                        onSubmit={handleFormSubmit}
                        isSubmitting={isSubmitting}
                        rooms={rooms}
                    />

                    {/* Recent reports — real data from store */}
                    <RecentReports />
                </div>
            </main>


            {/* ── Success Modal ─────────────────────────────────────────────── */}
            {showSuccess && reportId && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4"
                    onClick={e => { if (e.target === e.currentTarget) setShowSuccess(false); }}
                >
                    <div className="dashboard-card rounded-4xl p-8 w-full max-w-sm shadow-2xl shadow-[#1E2B58]/20 relative animate-in fade-in zoom-in-95 duration-200">
                        {/* Close */}
                        <button
                            onClick={() => setShowSuccess(false)}
                            className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#1E2B58]/10 dark:hover:bg-white/10 transition"
                        >
                            <X className="w-4 h-4 text-[#1E2B58]/60 dark:text-white/60" />
                        </button>

                        {/* Icon */}
                        <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-5">
                            <CheckCircle2 className="w-9 h-9 text-emerald-500" />
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-black text-[#1E2B58] dark:text-white text-center mb-1">
                            Report Submitted!
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-6">
                            Your issue has been logged successfully.
                        </p>

                        {/* Report details */}
                        <div className="bg-white/40 dark:bg-slate-800/40 rounded-[1.25rem] p-4 mb-6 space-y-2.5">
                            <div className="flex justify-between text-xs">
                                <span className="text-[#1E2B58]/60 dark:text-white/50 font-medium">Report ID</span>
                                <span className="font-black text-[#1E2B58] dark:text-white">{reportId}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-[#1E2B58]/60 dark:text-white/50 font-medium">Subject</span>
                                <span className="font-bold text-[#1E2B58] dark:text-white text-right ml-4 truncate max-w-[11rem]">{reportSubject}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-[#1E2B58]/60 dark:text-white/50 font-medium">Date</span>
                                <span className="font-bold text-[#1E2B58] dark:text-white">{reportDate}</span>
                            </div>
                            <div className="flex justify-between text-xs items-center pt-1 border-t border-[#1E2B58]/10 dark:border-white/10">
                                <span className="text-[#1E2B58]/60 dark:text-white/50 font-medium">Status</span>
                                <span className="bg-slate-200 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 text-[0.625rem] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                                    Pending Review
                                </span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={handleViewHistory}
                                className="w-full py-3.5 rounded-[1.25rem] font-bold text-sm bg-[#1E2B58] text-white hover:bg-[#151f40] hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-[#1E2B58]/20 flex items-center justify-center gap-2"
                            >
                                <ClipboardList className="w-4 h-4" />
                                View in My History
                                <ArrowRight className="w-4 h-4" />
                            </button>
                            <button
                                onClick={handleSubmitAnother}
                                className="w-full py-3 rounded-[1.25rem] font-bold text-sm border border-[#1E2B58]/20 dark:border-white/20 text-[#1E2B58]/70 dark:text-white/70 hover:bg-[#1E2B58]/5 dark:hover:bg-white/5 transition-all"
                            >
                                Submit Another Report
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReportIssuePage;
