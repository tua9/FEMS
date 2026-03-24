import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'sonner';

import { useReportStore } from '@/stores/useReportStore';
import { useRoomStore } from '@/stores/useRoomStore';
import type { ReportFormData, IssueCategory } from '@/components/shared/report/ReportManualForm';
import type { QRResult } from '@/components/shared/report/QuickScanReport';
import { uploadImages } from '@/utils/uploadHelper';

// ─── Constants ────────────────────────────────────────────────────────────────

export const CATEGORY_TO_TYPE: Record<IssueCategory, any> = {
    equipment:      'equipment',
    infrastructure: 'infrastructure',
    other:          'other',
};

export const CATEGORY_LABELS: Record<IssueCategory, string> = {
    equipment:      'Equipment',
    infrastructure: 'Infrastructure',
    other:          'Other',
};

// ─── Navigation state (from Room Status page) ─────────────────────────────────

interface NavState {
    prefillRoom?:     string;
    prefillBuilding?: string;
}

// ─── Return type ──────────────────────────────────────────────────────────────

export interface ReportFormState {
    // prefill
    prefillRoomId:       string;
    prefillCategory:     IssueCategory | undefined;
    prefillDescription:  string;
    // rooms
    rooms:               ReturnType<typeof useRoomStore.getState>['rooms'];
    // submission
    isSubmitting:        boolean;
    // success data
    showSuccess:         boolean;
    reportId:            string | null;
    reportSubject:       string;
    reportDate:          string;
    // handlers
    handleQRDetected:    (result: QRResult) => void;
    handleFormSubmit:    (data: ReportFormData) => Promise<void>;
    handleSubmitAnother: () => void;
    closeSuccess:        () => void;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useReportForm(): ReportFormState {
    const location   = useLocation();
    const routeState = (location.state ?? {}) as NavState;

    const { createReport } = useReportStore();
    const { rooms, fetchAll: fetchRooms }  = useRoomStore();

    useEffect(() => {
        fetchRooms();
    }, [fetchRooms]);

    // ── Prefill ───────────────────────────────────────────────────────────────
    const [prefillRoomId,      setPrefillRoomId]      = useState<string>(routeState.prefillRoom ?? '');
    const [prefillCategory,    setPrefillCategory]    = useState<IssueCategory | undefined>(undefined);
    const [prefillDescription, setPrefillDescription] = useState<string>('');

    // ── Submission ────────────────────────────────────────────────────────────
    const [isSubmitting,  setIsSubmitting]  = useState(false);
    const [showSuccess,   setShowSuccess]   = useState(false);
    const [reportId,      setReportId]      = useState<string | null>(null);
    const [reportSubject, setReportSubject] = useState('');
    const [reportDate,    setReportDate]    = useState('');

    // ── Handlers ──────────────────────────────────────────────────────────────
    const handleQRDetected = (result: QRResult) => {
        setPrefillRoomId(result.roomId);
        setPrefillCategory(result.category);
        setPrefillDescription(result.description);
    };

    const handleFormSubmit = async (data: ReportFormData) => {
        setIsSubmitting(true);
        try {
            let imageUrls: string[] = [];
            if (data.files && data.files.length > 0) {
                // Limit to 2 files as per requirement
                const filesToUpload = data.files.slice(0, 2);
                imageUrls = await uploadImages(filesToUpload);
            }

            const response = await createReport({
                room_id:      data.room_id,
                equipment_id: data.equipment_id,
                type:         CATEGORY_TO_TYPE[data.category],
                description:  data.description,
                severity:     data.severity,
                images:       imageUrls,
                img:          imageUrls.length > 0 ? imageUrls[0] : undefined,
            }) as any;

            const newReport = response.report;
            const room        = rooms.find(r => r._id === data.room_id);
            const locationStr = room ? room.name : 'Unknown Location';
            const subject     = `${CATEGORY_LABELS[data.category]} Issue — ${locationStr}`;
            const today       = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

            if (newReport) {
                setReportId(newReport.code || newReport._id.slice(-6).toUpperCase());
            } else {
                setReportId(response.report_id?.slice(-6).toUpperCase() || "SUCCESS");
            }

            setReportSubject(subject);
            setReportDate(today);
            setShowSuccess(true);
        } catch (err: any) {
            toast.error('Failed to submit report', {
                description: err?.response?.data?.message || 'Please try again.',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSubmitAnother = () => {
        setShowSuccess(false);
        setPrefillRoomId('');
        setPrefillCategory(undefined);
        setPrefillDescription('');
    };

    const closeSuccess = () => setShowSuccess(false);

    return {
        prefillRoomId,
        prefillCategory,
        prefillDescription,
        rooms,
        isSubmitting,
        showSuccess,
        reportId,
        reportSubject,
        reportDate,
        handleQRDetected,
        handleFormSubmit,
        handleSubmitAnother,
        closeSuccess,
    };
}
