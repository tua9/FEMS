import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
    Zap, Droplet, Monitor, Armchair, MoreHorizontal,
    MapPin, ChevronDown, Camera, ImagePlus, ArrowRight,
    X, Loader2,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

export type IssueCategory = 'electrical' | 'plumbing' | 'it' | 'furniture' | 'other';

export interface ReportFormData {
    category: IssueCategory;
    location: string;
    description: string;
    files: File[];
}

interface ReportManualFormProps {
    prefillCategory?: IssueCategory;
    prefillLocation?: string;
    prefillDescription?: string;
    onSubmit: (data: ReportFormData) => void;
    isSubmitting?: boolean;
}

// ─── Static data ──────────────────────────────────────────────────────────────

const CATEGORIES = [
    { id: 'electrical' as IssueCategory, icon: Zap,            label: 'Electrical' },
    { id: 'plumbing'   as IssueCategory, icon: Droplet,        label: 'Plumbing'   },
    { id: 'it'         as IssueCategory, icon: Monitor,        label: 'IT Device'  },
    { id: 'furniture'  as IssueCategory, icon: Armchair,       label: 'Furniture'  },
    { id: 'other'      as IssueCategory, icon: MoreHorizontal, label: 'Other'      },
];

const LOCATIONS = [
    { group: 'Gamma Building', options: [
        'Room G402', 'Room G405', 'Room G408', 'Room G410', 'Room G412', 'Room G415', 'Room G420',
    ]},
    { group: 'Alpha Building', options: [
        'Room A101', 'Room A102', 'Room A105', 'Room A108', 'Room A110', 'Room A112', 'Room A115',
    ]},
    { group: 'Common Areas', options: [
        'Library Floor 1', 'Library Floor 2', 'Cafeteria', 'Lobby Gamma', 'Lobby Alpha', 'Parking Area',
    ]},
];

// ─── Component ────────────────────────────────────────────────────────────────

export const ReportManualForm: React.FC<ReportManualFormProps> = ({
    prefillCategory,
    prefillLocation,
    prefillDescription,
    onSubmit,
    isSubmitting = false,
}) => {
    const [category,    setCategory]    = useState<IssueCategory>(prefillCategory ?? 'electrical');
    const [location,    setLocation]    = useState(prefillLocation ?? '');
    const [description, setDescription] = useState(prefillDescription ?? '');
    const [files,       setFiles]       = useState<File[]>([]);
    const [dragOver,    setDragOver]    = useState(false);
    const [errors,      setErrors]      = useState<Partial<Record<keyof ReportFormData | 'files', string>>>({});

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Sync if props change (from QR scan)
    useEffect(() => { if (prefillCategory) setCategory(prefillCategory); }, [prefillCategory]);
    useEffect(() => { if (prefillLocation) setLocation(prefillLocation); }, [prefillLocation]);
    useEffect(() => { if (prefillDescription) setDescription(prefillDescription); }, [prefillDescription]);

    // ── File handling ──────────────────────────────────────────────────────────
    const addFiles = useCallback((incoming: FileList | null) => {
        if (!incoming) return;
        const valid = Array.from(incoming).filter(f =>
            f.type.startsWith('image/') && f.size <= 10 * 1024 * 1024
        );
        setFiles(prev => {
            const combined = [...prev, ...valid];
            return combined.slice(0, 5); // max 5 files
        });
        setErrors(prev => ({ ...prev, files: undefined }));
    }, []);

    const removeFile = (index: number) =>
        setFiles(prev => prev.filter((_, i) => i !== index));

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        addFiles(e.dataTransfer.files);
    };

    // ── Validation + submit ────────────────────────────────────────────────────
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: typeof errors = {};
        if (!location)           newErrors.location    = 'Please select an incident location.';
        if (description.length < 10) newErrors.description = 'Description must be at least 10 characters.';
        if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
        setErrors({});
        onSubmit({ category, location, description, files });
    };

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <form
            onSubmit={handleSubmit}
            className="glass-card bg-white/60 dark:bg-slate-800/70 p-[2rem] lg:p-[2.5rem] space-y-[2.5rem] rounded-[2rem] border border-white dark:border-white/10 shadow-[0_10px_30px_-5px_rgba(30,43,88,0.1)]"
        >
            {/* 1. Category ──────────────────────────────────────────────────── */}
            <div>
                <h3 className="text-[0.6875rem] font-bold text-slate-500 dark:text-slate-400 mb-[1.5rem] uppercase tracking-[0.15em]">
                    1. Select Issue Category
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-[1rem]">
                    {CATEGORIES.map(cat => {
                        const Icon = cat.icon;
                        const isSelected = category === cat.id;
                        return (
                            <label key={cat.id} className="cursor-pointer group">
                                <input
                                    type="radio"
                                    name="category"
                                    className="hidden"
                                    checked={isSelected}
                                    onChange={() => { setCategory(cat.id); setErrors(p => ({ ...p, category: undefined })); }}
                                />
                                <div className={`flex flex-col items-center justify-center gap-[0.75rem] p-[1.5rem] rounded-[1.5rem] border transition-all aspect-square hover:bg-white/80 dark:hover:bg-white/10 hover:scale-[1.03] active:scale-95 hover:shadow-sm ${
                                    isSelected
                                        ? 'bg-white dark:bg-slate-700 border-[#1E2B58] dark:border-white shadow-md scale-[1.02] ring-1 ring-[#1E2B58]/20 dark:ring-white/20'
                                        : 'bg-white/40 dark:bg-slate-800/40 border-white/60 dark:border-white/5'
                                }`}>
                                    <Icon className={`w-[2rem] h-[2rem] ${isSelected ? 'text-[#1E2B58] dark:text-white' : 'text-slate-500 dark:text-slate-400'}`} strokeWidth={1.5} />
                                    <span className={`text-[0.625rem] font-bold uppercase tracking-wider ${isSelected ? 'text-[#1E2B58] dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
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
                <h3 className="text-[0.6875rem] font-bold text-slate-500 dark:text-slate-400 mb-[1rem] uppercase tracking-[0.15em]">
                    2. Incident Location
                </h3>
                <div className="relative">
                    <div className="absolute inset-y-0 left-[1.25rem] flex items-center pointer-events-none">
                        <MapPin className={`w-[1.25rem] h-[1.25rem] ${errors.location ? 'text-red-400' : 'text-slate-400'}`} />
                    </div>
                    <select
                        value={location}
                        onChange={e => { setLocation(e.target.value); setErrors(p => ({ ...p, location: undefined })); }}
                        className={`w-full h-[3.5rem] bg-white/40 dark:bg-white/5 border rounded-[1.5rem] pl-[3rem] pr-[3rem] appearance-none text-[#1E2B58] dark:text-white font-medium focus:ring-2 focus:border-[#1E2B58]/30 outline-none transition-all cursor-pointer shadow-sm ${
                            errors.location
                                ? 'border-red-400/60 focus:ring-red-400/20'
                                : 'border-white/50 dark:border-white/10 focus:ring-[#1E2B58]/10'
                        }`}
                    >
                        <option value="">Search or select location (e.g. Block A, Room 402)</option>
                        {LOCATIONS.map(group => (
                            <optgroup key={group.group} label={group.group}>
                                {group.options.map(opt => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </optgroup>
                        ))}
                    </select>
                    <div className="absolute inset-y-0 right-[1.25rem] flex items-center pointer-events-none">
                        <ChevronDown className="text-slate-400 w-[1.25rem] h-[1.25rem]" />
                    </div>
                </div>
                {errors.location && <p className="mt-2 text-xs font-bold text-red-500 dark:text-red-400 pl-1">{errors.location}</p>}
            </div>

            {/* 3. Description ───────────────────────────────────────────────── */}
            <div>
                <h3 className="text-[0.6875rem] font-bold text-slate-500 dark:text-slate-400 mb-[1rem] uppercase tracking-[0.15em]">
                    3. Issue Description
                </h3>
                <textarea
                    value={description}
                    onChange={e => { setDescription(e.target.value); setErrors(p => ({ ...p, description: undefined })); }}
                    className={`w-full h-[9rem] bg-white/40 dark:bg-white/5 border rounded-[1.5rem] p-[1.5rem] text-[#1E2B58] dark:text-white placeholder:text-slate-400 focus:ring-2 focus:border-[#1E2B58]/30 outline-none resize-none transition-all shadow-sm ${
                        errors.description
                            ? 'border-red-400/60 focus:ring-red-400/20'
                            : 'border-white/50 dark:border-white/10 focus:ring-[#1E2B58]/10'
                    }`}
                    placeholder="Please provide specific details about the issue..."
                />
                <div className="flex justify-between mt-1.5 px-1">
                    {errors.description
                        ? <p className="text-xs font-bold text-red-500 dark:text-red-400">{errors.description}</p>
                        : <span />
                    }
                    <span className={`text-[0.625rem] font-bold ${description.length < 10 ? 'text-slate-400' : 'text-emerald-500'}`}>
                        {description.length} / 500
                    </span>
                </div>
            </div>

            {/* 4. Evidence ──────────────────────────────────────────────────── */}
            <div>
                <h3 className="text-[0.6875rem] font-bold text-slate-500 dark:text-slate-400 mb-[1rem] uppercase tracking-[0.15em]">
                    4. Upload Evidence <span className="normal-case font-medium opacity-60">(optional, max 5 files)</span>
                </h3>

                {/* Hidden file input */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={e => addFiles(e.target.files)}
                />

                {/* Dropzone */}
                <div
                    onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`w-full h-[12rem] border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center gap-[0.75rem] transition-all cursor-pointer relative ${
                        dragOver
                            ? 'border-[#1E2B58] bg-[#1E2B58]/5 dark:border-sky-400 dark:bg-sky-400/5 scale-[1.01]'
                            : 'border-white/60 dark:border-slate-600 bg-white/40 dark:bg-white/5 hover:bg-white/50 dark:hover:bg-slate-800/50'
                    }`}
                >
                    <div className="w-[3rem] h-[3rem] bg-white dark:bg-slate-700/50 rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                        <Camera className="text-slate-500 dark:text-slate-400 w-[1.5rem] h-[1.5rem]" />
                    </div>
                    <div className="text-center">
                        <p className="text-[0.875rem] font-bold text-[#1E2B58] dark:text-white">
                            {files.length > 0 ? `${files.length} file${files.length > 1 ? 's' : ''} selected` : 'Drag and drop photos here'}
                        </p>
                        <p className="text-[0.625rem] text-slate-400 dark:text-slate-500 uppercase mt-[0.25rem] tracking-wider">
                            PNG, JPG up to 10MB · Click to browse
                        </p>
                    </div>

                    {/* Action buttons inside dropzone */}
                    <div
                        className="absolute bottom-[1rem] right-[1rem] flex gap-[0.5rem]"
                        onClick={e => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="p-[0.5rem] bg-white/40 dark:bg-white/10 rounded-xl hover:bg-white/60 dark:hover:bg-white/20 text-slate-600 dark:text-slate-300 transition-all hover:scale-110 active:scale-95"
                            title="Take Photo / Upload from Camera"
                        >
                            <Camera className="w-[1.25rem] h-[1.25rem]" />
                        </button>
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="p-[0.5rem] bg-white/40 dark:bg-white/10 rounded-xl hover:bg-white/60 dark:hover:bg-white/20 text-slate-600 dark:text-slate-300 transition-all hover:scale-110 active:scale-95"
                            title="Upload from Gallery"
                        >
                            <ImagePlus className="w-[1.25rem] h-[1.25rem]" />
                        </button>
                    </div>
                </div>

                {/* File previews */}
                {files.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                        {files.map((file, i) => (
                            <div key={i} className="relative group">
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt={file.name}
                                    className="w-16 h-16 rounded-xl object-cover border border-white/60 dark:border-white/10 shadow-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeFile(i)}
                                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-90 shadow-sm"
                                >
                                    <X className="w-2.5 h-2.5" />
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
                className="w-full bg-[#1E2B58] py-[1.25rem] rounded-[1.25rem] text-white font-bold flex items-center justify-center gap-[0.75rem] transition-all hover:bg-[#151f40] active:scale-[0.98] shadow-[0_10px_25px_-5px_rgba(30,43,88,0.4)] disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
            >
                {isSubmitting ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Submitting…
                    </>
                ) : (
                    <>
                        Submit Report
                        <ArrowRight className="w-[1.25rem] h-[1.25rem]" />
                    </>
                )}
            </button>
        </form>
    );
};
