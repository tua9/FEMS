import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import CustomDropdown from '@/features/shared/components/CustomDropdown';
import { useEquipmentStore } from '@/stores/useEquipmentStore';
import { useRoomStore } from '@/stores/useRoomStore';
import { useBuildingStore } from '@/stores/useBuildingStore';
import { toast } from 'sonner';
import { uploadImages } from '@/utils/uploadHelper';

const toInputDate = (d) => {
 if (!d) return '';
 try {
 const x = new Date(d);
 return Number.isNaN(x.getTime()) ? '' : x.toISOString().slice(0, 10);
 } catch {
 return '';
 }
};

const STATUS_OPTIONS = [
 { value: 'available', label: 'Available' },
 { value: 'maintenance', label: 'Maintenance' },
 { value: 'broken', label: 'Broken' },
];

const AddEquipmentModal = ({ isOpen, onClose, equipment, onEquipmentUpdated, onCreated }) => {
 const isEdit = !!equipment;

 const [name, setName] = useState('');
 const [category, setCategory] = useState('');
 const [buildingId, setBuildingId] = useState('');
 const [roomId, setRoomId] = useState('');
 const [code, setCode] = useState('');
 const [status, setStatus] = useState('available');
 const [description, setDescription] = useState('');
 const [lastMaintenanceDate, setLastMaintenanceDate] = useState('');
 const [isSubmitting, setIsSubmitting] = useState(false);

 const createEquipment = useEquipmentStore(state => state.createEquipment);
 const updateEquipment = useEquipmentStore(state => state.updateEquipment);
 const { rooms, fetchAll: fetchRooms } = useRoomStore();
 const { buildings: allBuildings, fetchAll: fetchBuildings } = useBuildingStore();

 useEffect(() => {
 if (isOpen) {
 fetchRooms();
 fetchBuildings();
 }
 }, [isOpen, fetchRooms, fetchBuildings]);

 useEffect(() => {
 if (equipment) {
 setName(equipment.name);
 setCategory(equipment.category);
 setCode(equipment.code || '');
 setStatus(equipment.status || 'available');
 setDescription(equipment.description || '');
 setLastMaintenanceDate(toInputDate(equipment.last_maintenance_date || equipment.lastMaintenanceDate));
 
 // Set building and room for editing
 const rm = equipment.roomId;
 if (rm && typeof rm === 'object') {
 setRoomId(rm._id || '');
 setBuildingId(rm.buildingId?._id || rm.buildingId || '');
 } else if (rm) {
 setRoomId(rm);
 // Building will be fetched/matched later if possible
 }
 } else {
 setName('');
 setCategory('');
 setBuildingId('');
 setRoomId('');
 setCode('');
 setStatus('available');
 setDescription('');
 setLastMaintenanceDate('');
 }
 setPreviewUrl(equipment?.img || null);
 setImages([]);
 }, [equipment, isOpen]);

 // When editing and roomId is a string, infer buildingId from loaded rooms
 useEffect(() => {
 if (!isOpen) return;
 if (!equipment) return;
 if (!roomId) return;
 if (buildingId) return;

 const match = rooms.find((r) => r._id === roomId);
 const b = match?.buildingId;
 const bId = b && typeof b === 'object' ? b._id : b;
 if (bId) setBuildingId(bId);
 }, [isOpen, equipment, roomId, buildingId, rooms]);

 // ── Room Selection Logic ──────────────────────────────────────────────────
 
// Buildings dropdown should come from Buildings collection (not inferred from rooms)
const buildings = useMemo(() => {
 const list = Array.isArray(allBuildings)
  ? allBuildings
  : allBuildings?.buildings ?? allBuildings?.data ?? [];

 return (Array.isArray(list) ? list : [])
  .filter((b) => b && (b._id || b.id))
  .map((b) => ({ value: b._id || b.id, label: b.name || `Building ${String(b._id || b.id).slice(-6)}` }));
}, [allBuildings]);

 const roomOptions = useMemo(() => {
  const normalizeId = (v) => {
   if (!v) return '';
   if (typeof v === 'string') return v;
   if (typeof v === 'object') return v._id || v.id || '';
   return String(v);
  };

 const getRoomBuildingId = (room) => {
  // API hiện đang trả legacy field `building_id` (string) và `buildingId` bị null
  // Ưu tiên buildingId (nếu đã populate), fallback sang building_id.
  return normalizeId(room?.buildingId) || normalizeId(room?.building_id);
 };
 
  const selectedBuildingId = normalizeId(buildingId);
  const filtered = selectedBuildingId
   ? rooms.filter((r) => getRoomBuildingId(r) === selectedBuildingId)
   : rooms;
 
  return [
   { value: '', label: 'No Room / Storage' },
   ...filtered.map(r => ({ value: r._id, label: r.name }))
  ];
 }, [rooms, buildingId]);

// Auto-fill building when user picks a room first
useEffect(() => {
 const normalizeId = (v) => {
  if (!v) return '';
  if (typeof v === 'string') return v;
  if (typeof v === 'object') return v._id || v.id || '';
  return String(v);
 };
 const getRoomBuildingId = (room) => normalizeId(room?.buildingId) || normalizeId(room?.building_id);

 if (!isOpen) return;
 if (!roomId) return;

 const selectedRoom = rooms.find((r) => r._id === roomId);
 const bId = getRoomBuildingId(selectedRoom);
 if (bId && normalizeId(buildingId) !== bId) {
  setBuildingId(bId);
 }
}, [isOpen, roomId, rooms, buildingId]);

 const handleBuildingChange = (id) => {
  setBuildingId(id);
  setRoomId(''); // Reset room when building changes
 };

 const [images, setImages] = useState([]);
 const [previewUrl, setPreviewUrl] = useState(equipment?.img || null);
 const fileInputRef = React.useRef(null);

 const handleFileChange = (e) => {
 const selectedFiles = Array.from(e.target.files || []);
 if (selectedFiles.length > 1) {
 toast.warning("Chỉ được phép chọn tối đa 1 hình ảnh cho thiết bị!");
 }
 
 const validFile = selectedFiles.find(f => f.type.startsWith('image/'));
 if (validFile) {
 setImages([validFile]);
 setPreviewUrl(URL.createObjectURL(validFile));
 }
 };

 const handleSubmit = async (e) => {
 e.preventDefault();
 setIsSubmitting(true);

 try {
 let uploadedImageUrl = equipment?.img || null;
 if (images.length > 0) {
 const urls = await uploadImages(images);
 if (urls.length > 0) uploadedImageUrl = urls[0];
 }

 const payload= {
 name,
 category,
 ...(isEdit ? { status } : { status: 'available' }),
 roomId: roomId || null,
 img: uploadedImageUrl,
 description: description || null,
 last_maintenance_date: lastMaintenanceDate || null,
 ...(isEdit && { code: code || undefined })
 };

 if (isEdit && equipment) {
 await updateEquipment(equipment._id, payload);
 toast.success(`Asset "${name}" updated successfully`);
 if (onEquipmentUpdated) onEquipmentUpdated();
 onClose();
 } else {
 const newEquip = await createEquipment(payload);
 toast.success(`Registered product "${name}"`, {
 description: `System Code: ${newEquip.code || 'Generated'}`
 });
 if (onEquipmentUpdated) onEquipmentUpdated();
 if (onCreated) {
 onCreated(newEquip);
 } else {
 onClose();
 }
 }
 } catch (error) {
 toast.error("Failed to sync equipment data.");
 } finally {
 setIsSubmitting(false);
 }
 };

 if (!isOpen) return null;

 const inputClasses = "w-full bg-slate-50/50 dark:bg-slate-900/50 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-800 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-[#1E2B58] dark:focus:ring-blue-500 outline-none transition-all";
 const labelClasses = "text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 mb-2 block";
 const roomDropdownMenuClassName = "max-h-[240px] overflow-y-auto"; // ~5 options then scroll

 return createPortal(
 <div className="fixed inset-0 z-100 flex items-center justify-center px-4 py-6 bg-black/30 backdrop-blur-sm">
 <style dangerouslySetInnerHTML={{
 __html: `
 .no-scrollbar::-webkit-scrollbar { display: none; }
 .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
 ` }} />
 {/* Backdrop */}
 <div
 className="absolute inset-0"
 onClick={onClose}
 ></div>

 {/* Modal Content */}
 <div className="relative w-full max-w-2xl dashboard-card rounded-4xl shadow-2xl shadow-[#1E2B58]/20 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">

 {/* Header Section */}
 <div className="px-10 pt-8 pb-6 relative border-b border-black/8 dark:border-white/10">
 <button
 onClick={onClose}
 className="absolute top-6 right-8 w-8 h-8 flex items-center justify-center text-[#1E2B58]/50 hover:text-[#1E2B58] hover:bg-[#1E2B58]/8 dark:text-white/50 dark:hover:text-white dark:hover:bg-white/10 rounded-full transition-colors z-20"
 >
 <span className="material-symbols-outlined text-xl">close</span>
 </button>

 <div className="flex items-center gap-4 mb-3">
 <span className="px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 border-blue-100 dark:border-blue-900/30 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-sm">
 {isEdit ? 'Asset Modification' : 'Asset Acquisition'}
 </span>
 </div>

 <h3 className="text-2xl font-black text-[#1E2B58] dark:text-white tracking-tight">
 {isEdit ? 'Update Equipment Details' : 'Register New Equipment'}
 </h3>
 <p className="text-[0.625rem] font-black text-[#1E2B58]/50 dark:text-white/40 uppercase tracking-widest mt-1">
 Inventory Logistics • Asset Management System
 </p>
 </div>

 <div className="p-10 pt-0 overflow-y-auto no-scrollbar space-y-8 relative z-10 mt-6">
 <form id="equipmentForm" onSubmit={handleSubmit} className="space-y-6">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <div className="md:col-span-2 space-y-1.5">
 <label className={labelClasses}>Asset Name <span className="text-red-500">*</span></label>
 <input
 type="text"
 value={name}
 onChange={e => setName(e.target.value)}
 className={inputClasses}
 placeholder="e.g. Dell UltraSharp U2723QE"
 required
 />
 </div>

 {isEdit && (
 <div className="space-y-1.5">
 <label className={labelClasses}>Asset Code</label>
 <input
 type="text"
 value={code}
 onChange={e => setCode(e.target.value)}
 disabled={!isEdit}
 className={`${inputClasses} ${!isEdit ? 'opacity-50 bg-slate-100 dark:bg-slate-800 cursor-not-allowed' : ''}`}
 placeholder={!isEdit ? "Auto-generated" : "e.g. LA2603XYZ"}
 />
 </div>
 )}

 <div className="space-y-1.5 relative">
 <label className={labelClasses}>Primary Category <span className="text-red-500">*</span></label>
 <CustomDropdown
 value={category}
 options={[
 { value: '', label: 'Select Category' },
 { value: 'PC Lab', label: 'PC Lab' },
 { value: 'IoT Kit', label: 'IoT Kit' },
 { value: 'Infrastructure', label: 'Infrastructure' },
 { value: 'Others', label: 'Others' }
 ]}
 onChange={setCategory}
 className="w-full"
 triggerClassName={`${inputClasses} flex justify-between items-center cursor-pointer`}
 fullWidth={true}
 />
 </div>

 {/* Building Selection */}
 <div className="space-y-1.5">
 <label className={labelClasses}>Building</label>
 <CustomDropdown
 value={buildingId}
 options={[
 { value: '', label: 'All Buildings' },
 ...buildings
 ]}
 onChange={handleBuildingChange}
 className="w-full"
 triggerClassName={`${inputClasses} flex justify-between items-center cursor-pointer`}
 fullWidth={true}
 />
 </div>

 {/* Room Selection */}
 <div className="space-y-1.5">
 <label className={labelClasses}>Assigned Room</label>
 <CustomDropdown
 value={roomId}
 options={roomOptions}
 onChange={setRoomId}
 className="w-full"
 triggerClassName={`${inputClasses} flex justify-between items-center cursor-pointer`}
 menuClassName={roomDropdownMenuClassName}
 fullWidth={true}
 />
 </div>

 {isEdit ? (
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:col-span-2">
  <div className="space-y-1.5 relative">
   <label className={labelClasses}>Status</label>
   <CustomDropdown
    value={status}
    options={STATUS_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
    onChange={setStatus}
    className="w-full"
    triggerClassName={`${inputClasses} flex justify-between items-center cursor-pointer`}
    fullWidth={true}
   />
  </div>
 </div>
 ) : null}

 <div className="md:col-span-2 space-y-1.5">
  <label className={labelClasses}>Description</label>
  <textarea
   value={description}
   onChange={(e) => setDescription(e.target.value)}
   className={`${inputClasses} min-h-28 resize-none`}
   placeholder="Short description about this equipment (optional)"
  />
 </div>

 </div>

 {/* Image Upload Aesthetic */}
 <div className="space-y-1.5 pt-2">
 <label className={labelClasses}>Visual Documentation</label>
 <input 
 ref={fileInputRef}
 type="file" 
 accept="image/*" 
 className="hidden" 
 onChange={handleFileChange}
 />
 <div 
 onClick={() => fileInputRef.current?.click()}
 className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-8 flex flex-col items-center justify-center text-center bg-slate-50/30 dark:bg-black/10 hover:bg-slate-50/50 transition-colors cursor-pointer group relative overflow-hidden"
 >
 {previewUrl ? (
 <div className="relative group/preview w-full flex flex-col items-center">
 <div className="relative">
 <img src={previewUrl} alt="Preview" className="h-32 w-auto rounded-2xl object-cover shadow-lg border-4 border-white dark:border-slate-800" />
 <button 
 type="button"
 onClick={(e) => {
 e.stopPropagation();
 setImages([]);
 setPreviewUrl(null);
 }}
 className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
 >
 <span className="material-symbols-outlined text-lg">close</span>
 </button>
 </div>
 <p className="mt-4 text-[10px] font-black text-slate-400 uppercase tracking-widest italic opacity-60">Click to replace image</p>
 </div>
 ) : (
 <>
 <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 flex items-center justify-center text-blue-500 mb-3 group-hover:scale-110 transition-transform shadow-sm">
 <span className="material-symbols-outlined text-2xl font-light">camera_enhance</span>
 </div>
 <p className="text-xs font-black text-slate-700 dark:text-slate-300">Register asset image</p>
 <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-tight italic">WebP, PNG or JPG supported</p>
 </>
 )}
 </div>
 </div>
 </form>
 </div>

 {/* Footer Section */}
 <div className="px-8 py-5 border-t border-black/8 dark:border-white/10 bg-black/3 dark:bg-white/3 flex flex-wrap items-center justify-between gap-4">
 <button
 onClick={onClose}
 className="px-6 py-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold text-[10px] uppercase tracking-widest transition-colors"
 >
 Dismiss Entry
 </button>
 <div className="flex gap-3">
 <button
 type="submit"
 form="equipmentForm"
 disabled={isSubmitting}
 className={`px-8 py-3 bg-[#1A2B56] hover:bg-[#2A3B66] text-white rounded-xl font-black text-xs uppercase tracking-[0.15em] transition-all shadow-lg shadow-blue-900/20 active:scale-95 flex items-center gap-2 ${isSubmitting ? 'opacity-50 cursor-wait' : ''}`}
 >
 <span className="material-symbols-outlined text-sm">{isSubmitting ? 'hourglass_top' : (isEdit ? 'published_with_changes' : 'inventory')}</span>
 {isSubmitting ? 'Processing' : (isEdit ? 'Update Registry' : 'Confirm Registration')}
 </button>
 </div>
 </div>
 </div>
 </div>,
 document.body
 );
};

export default AddEquipmentModal;
