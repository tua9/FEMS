import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'sonner';

import { useReportStore } from '@/stores/useReportStore';
import { useRoomStore } from '@/stores/useRoomStore';
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

 useEffect(() => {
 fetchRooms();
 }, [fetchRooms]);

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

 // ── Handlers ──────────────────────────────────────────────────────────────
 const handleQRDetected = (result) => {
 setPrefillRoomId(result.roomId);
 setPrefillCategory(result.category);
 setPrefillDescription(result.description);
 };

 const handleFormSubmit = async (data) => {
 setIsSubmitting(true);
 try {
 let imageUrls= [];
 if (data.files && data.files.length > 0) {
 // Limit to 2 files as per requirement
 const filesToUpload = data.files.slice(0, 2);
 imageUrls = await uploadImages(filesToUpload);
 }

 const response = await createReport({
 room_id: data.room_id,
 equipment_id: data.equipment_id,
 type: CATEGORY_TO_TYPE[data.category],
 description: data.description,
 severity: data.severity,
 images: imageUrls,
 img: imageUrls.length > 0 ? imageUrls[0] : undefined,
 });

 const newReport = response.report;
 const room = rooms.find(r => r._id === data.room_id);
 const locationStr = room ? room.name : 'Unknown Location';
 const subject = `${CATEGORY_LABELS[data.category]} Issue — ${locationStr}`;
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
 setPrefillRoomId('');
 setPrefillCategory(undefined);
 setPrefillDescription('');
 };

 const closeSuccess = () => setShowSuccess(false);

 return {
 prefillRoomId,
 prefillCategory,
 prefillDescription,
 prefillEquipmentId,
 qrEquipmentCode,
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
