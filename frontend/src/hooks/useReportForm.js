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

 const handleFormSubmit = async () => {
    // Evidence required
    if (!files || files.length < 1) {
      toast.error('Please upload at least 1 evidence image.');
      return;
    }

    setIsSubmitting(true);
    try {
      let imageUrls = [];
      if (files && files.length > 0) {
        // Limit to 2 files as per requirement
        const filesToUpload = files.slice(0, 2);
        imageUrls = await uploadImages(filesToUpload);
      }

      const response = await createReport({
        room_id: roomId,
        equipment_id: equipmentId || undefined,
        type: CATEGORY_TO_TYPE[category],
        description,
        severity: 'medium',
        images: imageUrls,
        img: imageUrls.length > 0 ? imageUrls[0] : undefined,
      });

      const newReport = response.report;
      const room = rooms.find(r => r._id === roomId);
      const locationStr = room ? room.name : 'Unknown Location';
      const subject = `${CATEGORY_LABELS[category]} Issue — ${locationStr}`;
      const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

      if (newReport) {
        setReportId(newReport.code || newReport._id.slice(-6).toUpperCase());
      } else {
        setReportId(response.report_id?.slice(-6).toUpperCase() || "SUCCESS");
      }

      setReportSubject(subject);
      setReportDate(today);
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
