import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'sonner';

import { useReportStore } from '@/stores/useReportStore';
import { useRoomStore } from '@/stores/useRoomStore';
import { useBuildingStore } from '@/stores/useBuildingStore';
import { equipmentService } from '@/services/equipmentService';
import { uploadImages } from '@/utils/uploadHelper';

// ─── Constants ────────────────────────────────────────────────────────────────

export const CATEGORY_TO_TYPE= {
 equipment: 'equipment',
 infrastructure: 'infrastructure',
 other: 'other',
};

export const CATEGORY_LABELS= {
 equipment: 'Equipment',
 infrastructure: 'Infrastructure',
 other: 'Other',
};

// ─── Navigation state (from Room Status page) ─────────────────────────────────

// ─── Return type ──────────────────────────────────────────────────────────────

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useReportForm() {
 const location = useLocation();
 const routeState = (location.state ?? {});

 // Read QR scan params from URL: ?eq=EQUIP_CODE&id=EQUIP_ID
 const searchParams = new URLSearchParams(location.search);
 const qrEquipmentCode = searchParams.get('eq');
 const qrEquipmentId = searchParams.get('id');

 const { createReport } = useReportStore();
 const { rooms, fetchAll: fetchRooms } = useRoomStore();
 const { buildings, fetchAll: fetchBuildings } = useBuildingStore();

 useEffect(() => {
    fetchRooms();
    fetchBuildings();
 }, [fetchRooms, fetchBuildings]);

 // ── Prefill ───────────────────────────────────────────────────────────────
 const [prefillRoomId, setPrefillRoomId] = useState(routeState.prefillRoom ?? '');
 const [prefillCategory, setPrefillCategory] = useState(qrEquipmentId ? 'equipment' : undefined);
 const [prefillDescription, setPrefillDescription] = useState('');
 const [prefillEquipmentId, setPrefillEquipmentId] = useState(qrEquipmentId ?? '');

 // QR with only ?eq=CODE — resolve equipment (public GET /equipments/code/:code)
 useEffect(() => {
 if (!qrEquipmentCode || qrEquipmentId) return;
 let cancelled = false;
 (async () => {
 try {
 const eq = await equipmentService.getByCode(qrEquipmentCode);
 if (cancelled || !eq?._id) return;
 setPrefillEquipmentId(eq._id);
 setPrefillCategory('equipment');
 const rm = eq.roomId || eq.room_id;
 if (rm) {
 const rid = typeof rm === 'object' ? rm._id : rm;
 setPrefillRoomId(rid || '');
 }
 } catch {
 // invalid or unknown code — user can still file a manual report
 }
 })();
 return () => {
 cancelled = true;
 };
 }, [qrEquipmentCode, qrEquipmentId]);

 // ── Submission ────────────────────────────────────────────────────────────
 const [isSubmitting, setIsSubmitting] = useState(false);
 const [showSuccess, setShowSuccess] = useState(false);
 const [reportId, setReportId] = useState(null);
 const [reportSubject, setReportSubject] = useState('');
 const [reportDate, setReportDate] = useState('');
 const [reportImages, setReportImages] = useState([]);

 // Controlled form state (single source of truth)
 const [category, setCategory] = useState(qrEquipmentId ? 'equipment' : (routeState.prefillCategory ?? 'equipment'));
 const [roomId, setRoomId] = useState(routeState.prefillRoom ?? '');
 const [equipmentId, setEquipmentId] = useState(qrEquipmentId ?? '');
 const [description, setDescription] = useState(routeState.prefillDescription ?? '');
 const [files, setFiles] = useState([]);

 // Ref that ReportManualForm assigns so hook can clear native file input value
 const resetFileInputRef = useRef(null);

 // ── Handlers ──────────────────────────────────────────────────────────────
 const handleQRDetected = (result) => {
    // keep prefill states for backward compatibility
    setPrefillRoomId(result.roomId);
    setPrefillCategory(result.category);
    setPrefillDescription(result.description);

    // update controlled states (source of truth)
    if (result.category) setCategory(result.category);
    if (result.roomId) setRoomId(result.roomId);
    if (typeof result.description === 'string') setDescription(result.description);
 };

 const handleResetForm = () => {
 setPrefillRoomId('');
 setPrefillCategory(undefined);
 setPrefillDescription('');
 setPrefillEquipmentId('');

 setCategory('equipment');
 setRoomId('');
 setEquipmentId('');
 setDescription('');
 setFiles([]);

 if (resetFileInputRef.current) resetFileInputRef.current();
 };

 // formData is passed directly from the form's validated submit handler
 const handleFormSubmit = async (formData) => {
    const submittedFiles       = formData?.files       ?? files;
    const submittedRoomId      = formData?.room_id     ?? roomId;
    const submittedEquipmentId = formData?.equipment_id ?? (equipmentId || undefined);
    const submittedCategory    = formData?.category    ?? category;
    const submittedDescription = formData?.description ?? description;

    // Evidence required
    if (!submittedFiles || submittedFiles.length < 1) {
      toast.error('Please upload at least 1 evidence image.');
      return;
    }

    setIsSubmitting(true);
    try {
      const filesToUpload = submittedFiles.slice(0, 2);
      const imageUrls = await uploadImages(filesToUpload);

      // Backend returns { message, report_id, report: populated }
      const data = await createReport({
        room_id: submittedRoomId,
        equipment_id: submittedEquipmentId || undefined,
        type: CATEGORY_TO_TYPE[submittedCategory],
        description: submittedDescription,
        severity: 'medium',
        images: imageUrls,
        img: imageUrls.length > 0 ? imageUrls[0] : undefined,
      });

      const newReport = data?.report;
      const room = rooms.find(r => r._id === submittedRoomId);
      const locationStr = room ? room.name : 'Unknown Location';
      const subject = `${CATEGORY_LABELS[submittedCategory]} Issue — ${locationStr}`;
      const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

      setReportId(
        newReport?.code
        || newReport?._id?.slice(-6).toUpperCase()
        || data?.report_id?.toString().slice(-6).toUpperCase()
        || 'NEW'
      );
      setReportSubject(subject);
      setReportDate(today);
      setReportImages(imageUrls);
      setShowSuccess(true);
    } catch (err) {
      toast.error('Failed to submit report', {
        description: err?.response?.data?.message || 'Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
 };

 const handleSubmitAnother = () => {
 setShowSuccess(false);
 setReportImages([]);
 handleResetForm();
 };

 const closeSuccess = () => setShowSuccess(false);

 return {
 prefillRoomId,
 prefillCategory,
 prefillDescription,
 prefillEquipmentId,
 qrEquipmentCode,
 rooms,
 buildings,
 isSubmitting,
 showSuccess,
 reportId,
 reportSubject,
 reportDate,
 reportImages,
 handleQRDetected,
 handleFormSubmit,
 handleSubmitAnother,
 closeSuccess,

 // Expose controlled state to form
 category,
 setCategory,
 roomId,
 setRoomId,
 equipmentId,
 setEquipmentId,
 description,
 setDescription,
 files,
 setFiles,
 resetFileInputRef,
 handleResetForm,
 };
}
