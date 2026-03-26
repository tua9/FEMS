import React, { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { toast } from "sonner";
import {
 Monitor,
 Armchair,
 MoreHorizontal,
 MapPin,
 ChevronDown,
 Camera,
 ArrowRight,
 X,
 Loader2,
 AlertTriangle,
 Info,
 AlertOctagon,
 Flame,
 Search,
 CheckCircle2,
} from "lucide-react";
import { useEquipmentStore } from "@/stores/useEquipmentStore";

// ─── Types ────────────────────────────────────────────────────────────────────

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES = [
 { id: "equipment", icon: Monitor, label: "Equipment" },
 { id: "infrastructure", icon: Armchair, label: "Infrastructure" },
 { id: "other", icon: MoreHorizontal, label: "Other" },
];

const SEVERITIES = [
 { id: 'low', icon: Info, label: 'Low', colorClass: 'text-blue-500', bgActive: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' },
 { id: 'medium', icon: AlertTriangle, label: 'Medium', colorClass: 'text-yellow-500', bgActive: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' },
 { id: 'high', icon: Flame, label: 'High', colorClass: 'text-orange-500', bgActive: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800' },
 { id: 'critical', icon: AlertOctagon, label: 'Critical', colorClass: 'text-red-500', bgActive: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' },
];

// ─── Component ────────────────────────────────────────────────────────────────

export const ReportManualForm = ({
 prefillCategory,
 prefillRoomId,
 prefillEquipmentId,
 prefillDescription,
 onSubmit,
 isSubmitting = false,
 rooms: roomsProp,
}) => {
 const rooms = Array.isArray(roomsProp) ? roomsProp : [];
 const [category, setCategory] = useState(prefillCategory ?? "equipment");
 const [roomId, setRoomId] = useState(prefillRoomId ?? "");
 const [equipmentId, setEquipmentId] = useState(prefillEquipmentId ?? "");
 const [description, setDescription] = useState(prefillDescription ?? "");
 const [severity, setSeverity] = useState("medium");
 const [files, setFiles] = useState([]);
 const [dragOver, setDragOver] = useState(false);
 const [errors, setErrors] = useState({});
 const [selectedBuildingId, setSelectedBuildingId] = useState("");

 // Equipment selection state
 const [eqSearch, setEqSearch] = useState("");
 const [showEqResults, setShowEqResults] = useState(false);
 const equipmentsRaw = useEquipmentStore(state => state.equipments);
 const equipments = Array.isArray(equipmentsRaw) ? equipmentsRaw : [];
 const fetchEquipments = useEquipmentStore(state => state.fetchAll);

 const fileInputRef = useRef(null);

 useEffect(() => {
 fetchEquipments();
 }, [fetchEquipments]);

 // Sync if props change (from QR scan)
 useEffect(() => {
 if (prefillCategory) setCategory(prefillCategory);
 }, [prefillCategory]);

 useEffect(() => {
 if (prefillRoomId) {
 setRoomId(prefillRoomId);
 const room = rooms.find(r => r._id === prefillRoomId);
 if (room && room.buildingId) {
 setSelectedBuildingId(typeof room.buildingId === 'string' ? room.buildingId : room.buildingId._id);
 }
 }
 }, [prefillRoomId, rooms]);

 useEffect(() => {
 if (prefillEquipmentId) {
 setEquipmentId(prefillEquipmentId);
 const eq = equipments.find((e) => String(e._id) === String(prefillEquipmentId));
 if (eq) setEqSearch(eq.code || eq.name || "");
 }
 }, [prefillEquipmentId, equipments]);

 useEffect(() => {
 if (prefillDescription) setDescription(prefillDescription);
 }, [prefillDescription]);

 // Extract unique buildings from rooms
 const buildings = React.useMemo(() => {
 const map = new Map();
 rooms.forEach((room) => {
 if (!room.buildingId) return;
 const id = typeof room.buildingId === 'string' ? room.buildingId : room.buildingId._id;
 const name = typeof room.buildingId === 'string' ? room.buildingId : room.buildingId.name;
 if (!map.has(id)) map.set(id, { id, name });
 });
 return Array.from(map.values()).sort((a, b) =>
 String(a.name ?? "").localeCompare(String(b.name ?? ""), undefined, { sensitivity: "base" })
 );
 }, [rooms]);

 // Filter rooms by selected building
 const filteredRooms = React.useMemo(() => {
 if (!selectedBuildingId) return [];
 return rooms.filter((room) => {
 if (!room.buildingId) return false;
 const bId = typeof room.buildingId === 'string' ? room.buildingId : room.buildingId._id;
 return bId === selectedBuildingId;
 }).sort((a, b) =>
 String(a.name ?? "").localeCompare(String(b.name ?? ""), undefined, { sensitivity: "base" })
 );
 }, [rooms, selectedBuildingId]);

 // Filter equipments based on search
 const filteredEquipments = useMemo(() => {
 if (!eqSearch) return [];
 const term = eqSearch.toUpperCase();
 return equipments.filter(e =>
 (e.code && String(e.code).toUpperCase().startsWith(term)) ||
 (e.name && String(e.name).toUpperCase().includes(term))
 ).slice(0, 10);
 }, [equipments, eqSearch]);

 const handleSelectEquipment = (eq) => {
 setEquipmentId(eq._id);
 setEqSearch(eq.code || eq.name);
 setShowEqResults(false);
 setErrors(prev => ({ ...prev, equipmentCode: undefined }));
 
 // Auto populate room_id if equipment has one
 if (eq.room_id) {
 const rid = typeof eq.room_id === 'object' ? eq.room_id._id : eq.room_id;
 setRoomId(rid);
 }
 };

 // ── File handling ──────────────────────────────────────────────────────────
 const addFiles = useCallback((incoming) => {
 if (!incoming) return;
 const valid = Array.from(incoming).filter(f => f.type.startsWith("image/") && f.size <= 10 * 1024 * 1024);
 
 if (valid.length > 2 || (files.length + valid.length) > 2) {
 toast.warning("Hệ thống chỉ cho phép nộp tối đa 2 hình ảnh bằng chứng!");
 }

 setFiles(prev => [...prev, ...valid].slice(0, 2));
 setErrors(prev => ({ ...prev, files: undefined }));
 }, [files]);

 const removeFile = (index) => setFiles(prev => prev.filter((_, i) => i !== index));

 const handleDrop = (e) => {
 e.preventDefault();
 setDragOver(false);
 addFiles(e.dataTransfer.files);
 };

 // ── Validation + submit ────────────────────────────────────────────────────
 const handleSubmit = (e) => {
 e.preventDefault();
 const newErrors = {};
 
 if (category === 'equipment' && !equipmentId) {
 newErrors.equipmentCode = "Please search and select an equipment code.";
 }

 if (category !== 'equipment' && !roomId) {
 newErrors.roomId = "Please select an incident location.";
 }

 // Fallback if equipment category doesn't have a room resolved yet
 if (category === 'equipment' && equipmentId && !roomId) {
 newErrors.equipmentCode = "This equipment has no assigned location. Please contact admin.";
 }

 if (description.length < 10) newErrors.description = "Description must be at least 10 characters.";
 
 if (Object.keys(newErrors).length > 0) {
 setErrors(newErrors);
 return;
 }
 setErrors({});

 const formData= {
 category,
 room_id: roomId,
 description,
 files,
 severity
 };
 if (equipmentId) formData.equipment_id = equipmentId;

 onSubmit(formData);
 };

 return (
 <form
 onSubmit={handleSubmit}
 className="glass-card mb-[2.5rem] space-y-[2.5rem] rounded-[2rem] border border-white bg-white/60 p-[1.5rem] shadow-[0_10px_30px_-5px_rgba(30,43,88,0.1)] dark:border-white/10 dark:bg-slate-800/70 lg:p-[2.5rem]"
 >
 {/* 1. Category ──────────────────────────────────────────────────── */}
 <div>
 <h3 className="mb-[1rem] text-[0.625rem] font-black tracking-[0.2em] text-slate-500 uppercase dark:text-slate-400 opacity-60">
 1. Select Issue Category
 </h3>
 <div className="flex flex-wrap gap-[0.75rem]">
 {CATEGORIES.map((cat) => {
 const Icon = cat.icon;
 const isSelected = category === cat.id;
 return (
 <label key={cat.id} className="cursor-pointer group">
 <input
 type="radio"
 name="category"
 className="hidden"
 checked={isSelected}
 onChange={() => {
 setCategory(cat.id);
 setErrors((p) => ({ ...p, category, equipmentCode, roomId: undefined }));
 if (cat.id !== 'equipment') {
 setEquipmentId("");
 setEqSearch("");
 }
 }}
 />
 <div
 className={`flex items-center gap-[0.75rem] px-[1.25rem] py-[0.75rem] rounded-2xl border transition-all hover:scale-[1.02] active:scale-95 ${isSelected
 ? "border-[#1E2B58] bg-white shadow-md ring-1 ring-[#1E2B58]/10 dark:border-white dark:bg-slate-700 dark:ring-white/10"
 : "border-white/60 bg-white/20 dark:border-white/5 dark:bg-slate-800/40 opacity-70 hover:opacity-100"
 }`}
 >
 <Icon className={`h-4 w-4 ${isSelected ? "text-[#1E2B58] dark:text-white" : "text-slate-400 dark:text-slate-400"}`} strokeWidth={2.5} />
 <span className={`text-[0.6875rem] font-black tracking-widest uppercase ${isSelected ? "text-[#1E2B58] dark:text-white" : "text-slate-500 dark:text-slate-400"}`}>
 {cat.label}
 </span>
 </div>
 </label>
 );
 })}
 </div>
 </div>

 {/* 2. Logic Controller for Location / Equipment ─────────────────── */}
 <div className="animate-in fade-in slide-in-from-top-2 duration-300">
 {category === 'equipment' ? (
 <div>
 <h3 className="mb-[1rem] text-[0.625rem] font-black tracking-[0.2em] text-slate-500 uppercase dark:text-slate-400 opacity-60">
 2. Identify Equipment
 </h3>
 <div className="relative">
 <div className="pointer-events-none absolute inset-y-0 left-[1.25rem] flex items-center">
 <Search className={`h-[1.25rem] w-[1.25rem] ${errors.equipmentCode ? "text-red-400" : "text-slate-400"}`} />
 </div>
 <input
 type="text"
 placeholder="Search equipment code (e.g. LA26...)"
 value={eqSearch}
 onChange={(e) => {
 setEqSearch(e.target.value);
 setShowEqResults(true);
 if (equipmentId) setEquipmentId(""); // Clear selection if typing
 }}
 onFocus={() => setShowEqResults(true)}
 className={`text-[#1E2B58] h-[3.5rem] w-full rounded-[1.5rem] border bg-white/40 pl-[3.25rem] pr-[1.5rem] font-bold shadow-sm outline-none transition-all placeholder:text-slate-400 focus:ring-2 dark:bg-white/5 dark:text-white ${errors.equipmentCode 
 ? "border-red-400/60 focus:ring-red-400/20" 
 : "border-white/50 focus:ring-[#1E2B58]/10 dark:border-white/10"
 }`}
 />
 
 {equipmentId && (
 <div className="absolute inset-y-0 right-[1.25rem] flex items-center">
 <CheckCircle2 className="h-5 w-5 text-emerald-500" />
 </div>
 )}

 {/* Equipment Search Dropdown */}
 {showEqResults && eqSearch && !equipmentId && (
 <div className="absolute top-[110%] left-0 right-0 z-50 max-h-[15rem] overflow-y-auto rounded-3xl border border-white/50 bg-white shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-slate-800 no-scrollbar animate-in zoom-in-95 duration-200">
 {filteredEquipments.length > 0 ? (
 filteredEquipments.map((eq) => (
 <button
 key={eq._id}
 type="button"
 onClick={() => handleSelectEquipment(eq)}
 className="flex w-full items-center justify-between px-6 py-4 transition-colors hover:bg-slate-50 dark:hover:bg-white/5 border-b border-black/5 dark:border-white/5 last:border-0"
 >
 <div className="text-left">
 <p className="text-sm font-black text-[#1E2B58] dark:text-white uppercase tracking-tight">{eq.code || "NO CODE"}</p>
 <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500">{eq.name}</p>
 </div>
 <div className="text-right">
 <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest italic opacity-60">
 Room: {(eq.room_id)?.name || "N/A"}
 </p>
 </div>
 </button>
 ))
 ) : (
 <div className="px-6 py-4 text-center">
 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest italic">No matching equipment</p>
 </div>
 )}
 </div>
 )}
 </div>
 {errors.equipmentCode && <p className="mt-2 pl-4 text-[10px] font-black text-red-500 dark:text-red-400 uppercase tracking-widest">{errors.equipmentCode}</p>}
 {equipmentId && (
 <p className="mt-2 pl-4 text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1.5 opacity-80 italic">
 <MapPin className="w-3 h-3" />
 Location resolved: {rooms.find(r => r._id === roomId)?.name || "Unknown"}
 </p>
 )}
 </div>
 ) : (
 <div>
 <h3 className="mb-[1rem] text-[0.625rem] font-black tracking-[0.2em] text-slate-500 uppercase dark:text-slate-400 opacity-60">
 2. Incident Location
 </h3>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-[1rem]">
 <div className="relative">
 <div className="pointer-events-none absolute inset-y-0 left-[1.25rem] flex items-center">
 <MapPin className={`h-[1.25rem] w-[1.25rem] ${errors.roomId && !selectedBuildingId ? "text-red-400" : "text-slate-400"}`} />
 </div>
 <select
 value={selectedBuildingId}
 onChange={(e) => {
 setSelectedBuildingId(e.target.value);
 setRoomId("");
 }}
 className={`text-[#1E2B58] h-[3.5rem] w-full appearance-none rounded-[1.5rem] border bg-white/40 pl-[3rem] pr-[3rem] font-bold shadow-sm outline-none transition-all cursor-pointer focus:ring-2 focus:border-[#1E2B58]/30 dark:bg-white/5 dark:text-white ${errors.roomId && !selectedBuildingId
 ? "border-red-400/60 focus:ring-red-400/20"
 : "border-white/50 focus:ring-[#1E2B58]/10 dark:border-white/10"
 }`}
 >
 <option value="">Select Building</option>
 {buildings.map((b) => (
 <option key={b.id} value={b.id}>{b.name}</option>
 ))}
 </select>
 <div className="pointer-events-none absolute inset-y-0 right-[1.25rem] flex items-center">
 <ChevronDown className="h-[1.25rem] w-[1.25rem] text-slate-400" />
 </div>
 </div>
 <div className="relative">
 <select
 value={roomId}
 onChange={(e) => {
 setRoomId(e.target.value);
 setErrors((p) => ({ ...p, roomId: undefined }));
 }}
 disabled={!selectedBuildingId}
 className={`text-[#1E2B58] h-[3.5rem] w-full appearance-none rounded-[1.5rem] border bg-white/40 pl-[1.5rem] pr-[3rem] font-bold shadow-sm outline-none transition-all cursor-pointer focus:ring-2 focus:border-[#1E2B58]/30 dark:bg-white/5 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed ${errors.roomId
 ? "border-red-400/60 focus:ring-red-400/20"
 : "border-white/50 focus:ring-[#1E2B58]/10 dark:border-white/10"
 }`}
 >
 <option value="">{selectedBuildingId ? "Select Room" : "Select Building First"}</option>
 {filteredRooms.map((room) => (
 <option key={room._id} value={room._id}>{room.name}</option>
 ))}
 </select>
 <div className="pointer-events-none absolute inset-y-0 right-[1.25rem] flex items-center">
 <ChevronDown className="h-[1.25rem] w-[1.25rem] text-slate-400" />
 </div>
 </div>
 </div>
 {errors.roomId && <p className="mt-2 pl-4 text-[10px] font-black text-red-500 dark:text-red-400 uppercase tracking-widest">{errors.roomId}</p>}
 </div>
 )}
 </div>

 {/* 3. Severity ──────────────────────────────────────────────────── */}
 <div>
 <h3 className="mb-[1rem] text-[0.625rem] font-black tracking-[0.2em] text-slate-500 uppercase dark:text-slate-400 opacity-60">
 3. Severity Level
 </h3>
 <div className="grid grid-cols-2 sm:grid-cols-4 gap-[1rem]">
 {SEVERITIES.map(sev => {
 const Icon = sev.icon;
 const isSelected = severity === sev.id;
 return (
 <label key={sev.id} className="cursor-pointer group">
 <input
 type="radio"
 name="severity"
 className="hidden"
 checked={isSelected}
 onChange={() => setSeverity(sev.id)}
 />
 <div className={`flex items-center gap-[0.75rem] p-[1rem] rounded-[1.25rem] border transition-all hover:bg-white/80 dark:hover:bg-white/10 hover:scale-[1.02] active:scale-95 ${isSelected
 ? `${sev.bgActive} shadow-sm ring-1 ring-black/5 dark:ring-white/10 scale-[1.01]`
 : 'bg-white/40 dark:bg-slate-800/40 border-white/60 dark:border-white/5 opacity-80'
 }`}>
 <Icon className={`w-4 h-4 ${isSelected ? sev.colorClass : 'text-slate-400'}`} strokeWidth={2.5} />
 <span className={`text-[0.6875rem] font-black uppercase tracking-widest ${isSelected ? 'text-[#1E2B58] dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
 {sev.label}
 </span>
 </div>
 </label>
 );
 })}
 </div>
 </div>

 {/* 4. Description ───────────────────────────────────────────────── */}
 <div>
 <h3 className="mb-[1rem] text-[0.625rem] font-black tracking-[0.2em] text-slate-500 uppercase dark:text-slate-400 opacity-60">
 4. Issue Description
 </h3>
 <textarea
 value={description}
 onChange={(e) => {
 setDescription(e.target.value);
 setErrors((p) => ({ ...p, description: undefined }));
 }}
 className={`text-[#1E2B58] h-[9rem] w-full resize-none rounded-[1.5rem] border bg-white/40 p-[1.5rem] font-bold shadow-sm outline-none transition-all placeholder:text-slate-400 focus:ring-2 focus:border-[#1E2B58]/30 dark:bg-white/5 dark:text-white ${errors.description
 ? "border-red-400/60 focus:ring-red-400/20"
 : "border-white/50 focus:ring-[#1E2B58]/10 dark:border-white/10"
 }`}
 placeholder="Please provide specific details about the issue..."
 />
 <div className="mt-1.5 flex justify-between px-1">
 {errors.description ? <p className="text-[10px] font-black text-red-500 dark:text-red-400 uppercase tracking-widest">{errors.description}</p> : <span />}
 <span className={`text-[0.625rem] font-bold ${description.length < 10 ? "text-slate-400" : "text-emerald-500"}`}>{description.length} / 500</span>
 </div>
 </div>

 {/* 5. Evidence ──────────────────────────────────────────────────── */}
 <div>
 <h3 className="mb-[1rem] text-[0.625rem] font-black tracking-[0.2em] text-slate-500 uppercase dark:text-slate-400 opacity-60">
 5. Upload Evidence <span className="font-medium normal-case opacity-60 tracking-normal">(optional, max 2 files)</span>
 </h3>
 <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => addFiles(e.target.files)} />
 <div
 onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
 onDragLeave={() => setDragOver(false)}
 onDrop={handleDrop}
 onClick={() => fileInputRef.current?.click()}
 className={`relative flex h-[10rem] w-full cursor-pointer flex-col items-center justify-center gap-[0.75rem] rounded-[2rem] border-2 border-dashed transition-all ${dragOver
 ? "scale-[1.01] border-[#1E2B58] bg-[#1E2B58]/5 dark:border-sky-400 dark:bg-sky-400/5"
 : "border-white/60 bg-white/40 hover:bg-white/50 dark:border-slate-600 dark:bg-white/5 dark:hover:bg-slate-800/50"
 }`}
 >
 <div className="group-hover:scale-110 flex h-[2.5rem] w-[2.5rem] items-center justify-center rounded-2xl bg-white shadow-sm transition-transform dark:bg-slate-700/50 border border-slate-100 dark:border-slate-600">
 <Camera className="h-[1.25rem] w-[1.25rem] text-slate-500 dark:text-slate-400" />
 </div>
 <div className="text-center px-4">
 <p className="text-[#1E2B58] text-[0.75rem] font-black uppercase tracking-widest dark:text-white">
 {files.length > 0 ? `${files.length} file${files.length > 1 ? "s" : ""} selected` : "Drag or Click to upload"}
 </p>
 <p className="mt-[0.25rem] text-[0.5rem] font-bold tracking-widest text-slate-400 uppercase dark:text-slate-500">PNG, JPG up to 10MB</p>
 </div>
 </div>
 {files.length > 0 && (
 <div className="mt-3 flex flex-wrap gap-2 animate-in fade-in zoom-in-95 duration-200">
 {files.map((file, i) => (
 <div key={i} className="group relative">
 <img src={URL.createObjectURL(file)} alt={file.name} className="h-16 w-16 rounded-xl border-2 border-white object-cover shadow-md dark:border-slate-700" />
 <button type="button" onClick={() => removeFile(i)} className="hover:scale-110 active:scale-90 absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white shadow-sm transition-all">
 <X className="h-2.5 w-2.5" />
 </button>
 </div>
 ))}
 </div>
 )}
 </div>

 {/* Submit ───────────────────────────────────────────────────────── */}
 <button
 type="submit"
 disabled={isSubmitting}
 className="active:scale-[0.98] flex w-full items-center justify-center gap-[0.75rem] rounded-[1.5rem] bg-[#1E2B58] py-[1.25rem] text-[0.75rem] font-black uppercase tracking-[0.2em] text-white shadow-[0_10px_25px_-5px_rgba(30,43,88,0.4)] transition-all hover:bg-[#151f40] disabled:scale-100 disabled:cursor-not-allowed disabled:opacity-60"
 >
 {isSubmitting ? (
 <>
 <Loader2 className="h-4 w-4 animate-spin" />
 Processing…
 </>
 ) : (
 <>
 Emit Report Signal
 <ArrowRight className="h-[1.25rem] w-[1.25rem]" />
 </>
 )}
 </button>
 </form>
 );
};
