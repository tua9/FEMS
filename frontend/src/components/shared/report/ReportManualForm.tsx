import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  Monitor,
  Armchair,
  MoreHorizontal,
  MapPin,
  ChevronDown,
  Camera,
  ImagePlus,
  ArrowRight,
  X,
  Loader2,
  AlertTriangle,
  Info,
  AlertOctagon,
  Flame,
} from "lucide-react";
import type { Room } from "@/types/room";

// ─── Types ────────────────────────────────────────────────────────────────────

export type IssueCategory = 'equipment' | 'infrastructure' | 'other';
export type ReportSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface ReportFormData {
  category: IssueCategory;
  room_id: string;
  description: string;
  files: File[];
  severity: ReportSeverity;
  equipment_id?: string;
}

interface ReportManualFormProps {
  prefillCategory?: IssueCategory;
  prefillRoomId?: string;
  prefillEquipmentId?: string;
  prefillDescription?: string;
  onSubmit: (data: ReportFormData) => void;
  isSubmitting?: boolean;
  rooms: Room[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { id: "equipment" as IssueCategory, icon: Monitor, label: "Equipment" },
  { id: "infrastructure" as IssueCategory, icon: Armchair, label: "Infrastructure" },
  { id: "other" as IssueCategory, icon: MoreHorizontal, label: "Other" },
];

const SEVERITIES = [
  { id: 'low' as ReportSeverity, icon: Info, label: 'Low', colorClass: 'text-blue-500', bgActive: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' },
  { id: 'medium' as ReportSeverity, icon: AlertTriangle, label: 'Medium', colorClass: 'text-yellow-500', bgActive: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' },
  { id: 'high' as ReportSeverity, icon: AlertOctagon, label: 'High', colorClass: 'text-orange-500', bgActive: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800' },
  { id: 'critical' as ReportSeverity, icon: Flame, label: 'Critical', colorClass: 'text-red-500', bgActive: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' },
];

// ─── Component ────────────────────────────────────────────────────────────────

export const ReportManualForm: React.FC<ReportManualFormProps> = ({
  prefillCategory,
  prefillRoomId,
  prefillEquipmentId,
  prefillDescription,
  onSubmit,
  isSubmitting = false,
  rooms,
}) => {
  const [category, setCategory] = useState<IssueCategory>(prefillCategory ?? "equipment");
  const [roomId, setRoomId] = useState(prefillRoomId ?? "");
  const [equipmentId, setEquipmentId] = useState(prefillEquipmentId ?? "");
  const [description, setDescription] = useState(prefillDescription ?? "");
  const [severity, setSeverity] = useState<ReportSeverity>("medium");
  const [files, setFiles] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof ReportFormData | "files" | "roomId", string>>>({});
  const [selectedBuildingId, setSelectedBuildingId] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync if props change (from QR scan)
  useEffect(() => {
    if (prefillCategory) setCategory(prefillCategory);
  }, [prefillCategory]);

  useEffect(() => {
    if (prefillRoomId) {
      setRoomId(prefillRoomId);
      const room = rooms.find(r => r._id === prefillRoomId);
      if (room && room.building_id) {
        setSelectedBuildingId(typeof room.building_id === 'string' ? room.building_id : room.building_id._id);
      }
    }
  }, [prefillRoomId, rooms]);

  useEffect(() => {
    if (prefillEquipmentId) setEquipmentId(prefillEquipmentId);
  }, [prefillEquipmentId]);

  useEffect(() => {
    if (prefillDescription) setDescription(prefillDescription);
  }, [prefillDescription]);

  // Extract unique buildings from rooms
  const buildings = React.useMemo(() => {
    const map = new Map<string, { id: string; name: string }>();
    rooms.forEach((room) => {
      if (!room.building_id) return;
      const id = typeof room.building_id === 'string' ? room.building_id : room.building_id._id;
      const name = typeof room.building_id === 'string' ? room.building_id : room.building_id.name;
      if (!map.has(id)) map.set(id, { id, name });
    });
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [rooms]);

  // Filter rooms by selected building
  const filteredRooms = React.useMemo(() => {
    if (!selectedBuildingId) return [];
    return rooms.filter((room) => {
      if (!room.building_id) return false;
      const bId = typeof room.building_id === 'string' ? room.building_id : room.building_id._id;
      return bId === selectedBuildingId;
    }).sort((a, b) => a.name.localeCompare(b.name));
  }, [rooms, selectedBuildingId]);

  // ── File handling ──────────────────────────────────────────────────────────
  const addFiles = useCallback((incoming: FileList | null) => {
    if (!incoming) return;
    const valid = Array.from(incoming).filter(f => f.type.startsWith("image/") && f.size <= 10 * 1024 * 1024);
    setFiles(prev => [...prev, ...valid].slice(0, 5));
    setErrors(prev => ({ ...prev, files: undefined }));
  }, []);

  const removeFile = (index: number) => setFiles(prev => prev.filter((_, i) => i !== index));

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    addFiles(e.dataTransfer.files);
  };

  // ── Validation + submit ────────────────────────────────────────────────────
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};
    if (!roomId) newErrors.roomId = "Please select an incident location.";
    if (description.length < 10) newErrors.description = "Description must be at least 10 characters.";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});

    const formData: ReportFormData = {
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
      className="glass-card mb-[2.5rem] space-y-[2.5rem] rounded-[2rem] border border-white bg-white/60 p-[2rem] shadow-[0_10px_30px_-5px_rgba(30,43,88,0.1)] dark:border-white/10 dark:bg-slate-800/70 lg:p-[2.5rem]"
    >
      {/* 1. Category ──────────────────────────────────────────────────── */}
      <div>
        <h3 className="mb-[1.5rem] text-[0.6875rem] font-bold tracking-[0.15em] text-slate-500 uppercase dark:text-slate-400">
          1. Select Issue Category
        </h3>
        <div className="grid grid-cols-2 gap-[1rem] sm:grid-cols-3">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = category === cat.id;
            return (
              <label key={cat.id} className="group cursor-pointer">
                <input
                  type="radio"
                  name="category"
                  className="hidden"
                  checked={isSelected}
                  onChange={() => {
                    setCategory(cat.id);
                    setErrors((p) => ({ ...p, category: undefined }));
                  }}
                />
                <div
                  className={`flex aspect-square flex-col items-center justify-center gap-[0.75rem] rounded-[1.5rem] border p-[1.5rem] transition-all hover:scale-[1.03] hover:bg-white/80 hover:shadow-sm active:scale-95 dark:hover:bg-white/10 ${isSelected
                    ? "scale-[1.02] border-[#1E2B58] bg-white shadow-md ring-1 ring-[#1E2B58]/20 dark:border-white dark:bg-slate-700 dark:ring-white/20"
                    : "border-white/60 bg-white/40 dark:border-white/5 dark:bg-slate-800/40"
                    }`}
                >
                  <Icon className={`h-[2rem] w-[2rem] ${isSelected ? "text-[#1E2B58] dark:text-white" : "text-slate-500 dark:text-slate-400"}`} strokeWidth={1.5} />
                  <span className={`text-[0.625rem] font-bold tracking-wider uppercase ${isSelected ? "text-[#1E2B58] dark:text-white" : "text-slate-500 dark:text-slate-400"}`}>
                    {cat.label}
                  </span>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* 2. Location ──────────────────────────────────────────────────── */}
      <div>
        <h3 className="mb-[1rem] text-[0.6875rem] font-bold tracking-[0.15em] text-slate-500 uppercase dark:text-slate-400">
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
              className={`text-[#1E2B58] h-[3.5rem] w-full appearance-none rounded-[1.5rem] border bg-white/40 pl-[3rem] pr-[3rem] font-medium shadow-sm outline-none transition-all cursor-pointer focus:ring-2 focus:border-[#1E2B58]/30 dark:bg-white/5 dark:text-white ${errors.roomId && !selectedBuildingId
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
              className={`text-[#1E2B58] h-[3.5rem] w-full appearance-none rounded-[1.5rem] border bg-white/40 pl-[1.5rem] pr-[3rem] font-medium shadow-sm outline-none transition-all cursor-pointer focus:ring-2 focus:border-[#1E2B58]/30 dark:bg-white/5 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed ${errors.roomId
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
        {errors.roomId && <p className="mt-2 pl-1 text-xs font-bold text-red-500 dark:text-red-400">{errors.roomId}</p>}
      </div>

      {/* 3. Severity ──────────────────────────────────────────────────── */}
      <div>
        <h3 className="mb-[1.5rem] text-[0.6875rem] font-bold tracking-[0.15em] text-slate-500 uppercase dark:text-slate-400">
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
                <div className={`flex items-center gap-[0.75rem] p-[1.25rem] rounded-[1.25rem] border transition-all hover:bg-white/80 dark:hover:bg-white/10 hover:scale-[1.02] active:scale-95 ${isSelected
                  ? `${sev.bgActive} shadow-sm ring-1 ring-black/5 dark:ring-white/10 scale-[1.01]`
                  : 'bg-white/40 dark:bg-slate-800/40 border-white/60 dark:border-white/5'
                  }`}>
                  <Icon className={`w-5 h-5 ${isSelected ? sev.colorClass : 'text-slate-400'}`} strokeWidth={2} />
                  <span className={`text-xs font-bold uppercase tracking-wider ${isSelected ? 'text-[#1E2B58] dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
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
        <h3 className="mb-[1rem] text-[0.6875rem] font-bold tracking-[0.15em] text-slate-500 uppercase dark:text-slate-400">
          4. Issue Description
        </h3>
        <textarea
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            setErrors((p) => ({ ...p, description: undefined }));
          }}
          className={`text-[#1E2B58] h-[9rem] w-full resize-none rounded-[1.5rem] border bg-white/40 p-[1.5rem] shadow-sm outline-none transition-all placeholder:text-slate-400 focus:ring-2 focus:border-[#1E2B58]/30 dark:bg-white/5 dark:text-white ${errors.description
            ? "border-red-400/60 focus:ring-red-400/20"
            : "border-white/50 focus:ring-[#1E2B58]/10 dark:border-white/10"
            }`}
          placeholder="Please provide specific details about the issue..."
        />
        <div className="mt-1.5 flex justify-between px-1">
          {errors.description ? <p className="text-xs font-bold text-red-500 dark:text-red-400">{errors.description}</p> : <span />}
          <span className={`text-[0.625rem] font-bold ${description.length < 10 ? "text-slate-400" : "text-emerald-500"}`}>{description.length} / 500</span>
        </div>
      </div>

      {/* 5. Evidence ──────────────────────────────────────────────────── */}
      <div>
        <h3 className="mb-[1rem] text-[0.6875rem] font-bold tracking-[0.15em] text-slate-500 uppercase dark:text-slate-400">
          5. Upload Evidence <span className="font-medium normal-case opacity-60">(optional, max 5 files)</span>
        </h3>
        <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => addFiles(e.target.files)} />
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative flex h-[12rem] w-full cursor-pointer flex-col items-center justify-center gap-[0.75rem] rounded-[2rem] border-2 border-dashed transition-all ${dragOver
            ? "scale-[1.01] border-[#1E2B58] bg-[#1E2B58]/5 dark:border-sky-400 dark:bg-sky-400/5"
            : "border-white/60 bg-white/40 hover:bg-white/50 dark:border-slate-600 dark:bg-white/5 dark:hover:bg-slate-800/50"
            }`}
        >
          <div className="group-hover:scale-110 flex h-[3rem] w-[3rem] items-center justify-center rounded-full bg-white shadow-sm transition-transform dark:bg-slate-700/50">
            <Camera className="h-[1.5rem] w-[1.5rem] text-slate-500 dark:text-slate-400" />
          </div>
          <div className="text-center">
            <p className="text-[#1E2B58] text-[0.875rem] font-bold dark:text-white">
              {files.length > 0 ? `${files.length} file${files.length > 1 ? "s" : ""} selected` : "Drag and drop photos here"}
            </p>
            <p className="mt-[0.25rem] text-[0.625rem] tracking-wider text-slate-400 uppercase dark:text-slate-500">PNG, JPG up to 10MB · Click to browse</p>
          </div>
          <div className="absolute bottom-[1rem] right-[1rem] flex gap-[0.5rem]" onClick={(e) => e.stopPropagation()}>
            <button type="button" onClick={() => fileInputRef.current?.click()} className="hover:scale-110 active:scale-95 rounded-xl bg-white/40 p-[0.5rem] text-slate-600 transition-all hover:bg-white/60 dark:bg-white/10 dark:text-slate-300 dark:hover:bg-white/20" title="Take Photo">
              <Camera className="h-[1.25rem] w-[1.25rem]" />
            </button>
            <button type="button" onClick={() => fileInputRef.current?.click()} className="hover:scale-110 active:scale-95 rounded-xl bg-white/40 p-[0.5rem] text-slate-600 transition-all hover:bg-white/60 dark:bg-white/10 dark:text-slate-300 dark:hover:bg-white/20" title="Upload from Gallery">
              <ImagePlus className="h-[1.25rem] w-[1.25rem]" />
            </button>
          </div>
        </div>
        {files.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {files.map((file, i) => (
              <div key={i} className="group relative">
                <img src={URL.createObjectURL(file)} alt={file.name} className="h-16 w-16 rounded-xl border border-white/60 object-cover shadow-sm dark:border-white/10" />
                <button type="button" onClick={() => removeFile(i)} className="hover:scale-110 active:scale-90 absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white opacity-0 shadow-sm transition-all group-hover:opacity-100">
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
        className="active:scale-[0.98] flex w-full items-center justify-center gap-[0.75rem] rounded-[1.25rem] bg-[#1E2B58] py-[1.25rem] font-bold text-white shadow-[0_10px_25px_-5px_rgba(30,43,88,0.4)] transition-all hover:bg-[#151f40] disabled:scale-100 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Submitting…
          </>
        ) : (
          <>
            Submit Report
            <ArrowRight className="h-[1.25rem] w-[1.25rem]" />
          </>
        )}
      </button>
    </form>
  );
};
