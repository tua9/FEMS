import { Check, ChevronDown, Search, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';

// ─── Types ────────────────────────────────────────────────────────────────────

interface DropdownOption { value: string; label: string }

interface RoomFilterProps {
    building: string;
    onBuildingChange: (value: string) => void;
    floor: string;
    onFloorChange: (value: string) => void;
    status: string;
    onStatusChange: (value: string) => void;
    onSearch: () => void;
    onReset: () => void;
    resultCount: number;
    totalCount: number;
}

// ─── Static options ───────────────────────────────────────────────────────────

const BUILDINGS: DropdownOption[] = [
    { value: 'all-buildings', label: 'All Buildings'  },
    { value: 'gamma',         label: 'Gamma Building' },
    { value: 'alpha',         label: 'Alpha Building' },
];

const FLOORS: DropdownOption[] = [
    { value: 'all-floors', label: 'All Floors' },
    { value: '1st',        label: '1st Floor'  },
    { value: '4th',        label: '4th Floor'  },
];

const STATUSES: DropdownOption[] = [
    { value: 'all-status',  label: 'Device Status: All' },
    { value: 'operational', label: 'Fully Operational'  },
    { value: 'maintenance', label: 'Needs Attention'    },
];

// ─── Custom Dropdown — portal-based, immune to parent overflow:hidden ─────────

interface CustomDropdownProps {
    value: string;
    options: DropdownOption[];
    onChange: (v: string) => void;
    /** 'left' = panel left-aligns with trigger; 'right' = panel right-aligns with trigger */
    align?: 'left' | 'right';
    className?: string;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
    value, options, onChange,
    align = 'left',
    className = '',
}) => {
    const [open, setOpen]     = useState(false);
    const [coords, setCoords] = useState<{ top: number; left?: number; right?: number }>({ top: 0 });
    const triggerRef = useRef<HTMLButtonElement>(null);

    // Close on outside click
    useEffect(() => {
        if (!open) return;
        const handler = (e: MouseEvent) => {
            const target = e.target as Node;
            if (triggerRef.current && triggerRef.current.contains(target)) return;
            const panel = document.querySelector('[data-dd-panel]');
            if (!panel || !panel.contains(target)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [open]);

    // Recalculate position on scroll/resize
    useEffect(() => {
        if (!open) return;
        const recalc = () => {
            if (!triggerRef.current) return;
            const r = triggerRef.current.getBoundingClientRect();
            setCoords(
                align === 'right'
                    ? { top: r.bottom + 6, right: window.innerWidth - r.right }
                    : { top: r.bottom + 6, left: r.left }
            );
        };
        recalc();
        window.addEventListener('scroll', recalc, true);
        window.addEventListener('resize', recalc);
        return () => {
            window.removeEventListener('scroll', recalc, true);
            window.removeEventListener('resize', recalc);
        };
    }, [open, align]);

    const handleToggle = () => {
        if (!open && triggerRef.current) {
            const r = triggerRef.current.getBoundingClientRect();
            setCoords(
                align === 'right'
                    ? { top: r.bottom + 6, right: window.innerWidth - r.right }
                    : { top: r.bottom + 6, left: r.left }
            );
        }
        setOpen(p => !p);
    };

    const selected = options.find(o => o.value === value) ?? options[0];

    const panel = open ? (
        <div
            data-dd-panel=""
            style={{
                position: 'fixed',
                top:   coords.top,
                left:  coords.left,
                right: coords.right,
                zIndex: 9999,
            }}
            className="bg-white dark:bg-slate-900 border border-[#1E2B58]/[0.07] dark:border-white/10 rounded-2xl shadow-2xl shadow-[#1E2B58]/15 dark:shadow-black/30 py-2 min-w-max"
        >
            {options.map(opt => (
                <button
                    key={opt.value}
                    type="button"
                    onMouseDown={e => e.stopPropagation()}
                    onClick={() => { onChange(opt.value); setOpen(false); }}
                    className={`w-full flex items-center justify-between gap-6 px-5 py-2.5 text-sm font-bold whitespace-nowrap transition-colors ${
                        opt.value === value
                            ? 'bg-[#1E2B58]/[0.06] text-[#1E2B58] dark:bg-white/10 dark:text-white'
                            : 'text-[#1E2B58]/75 dark:text-white/75 hover:bg-[#1E2B58]/[0.04] dark:hover:bg-white/[0.04]'
                    }`}
                >
                    {opt.label}
                    {opt.value === value
                        ? <Check className="w-3.5 h-3.5 shrink-0 text-[#1E2B58] dark:text-white" />
                        : <span className="w-3.5 h-3.5 shrink-0" />
                    }
                </button>
            ))}
        </div>
    ) : null;

    return (
        <div className={`inline-flex ${className}`}>
            <button
                ref={triggerRef}
                type="button"
                onClick={handleToggle}
                className="w-full flex items-center justify-between gap-3 bg-transparent text-sm font-bold text-[#1E2B58] dark:text-white px-3 md:px-4 h-[2.625rem] md:py-3 cursor-pointer hover:opacity-70 transition-opacity select-none whitespace-nowrap"
            >
                <span>{selected.label}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
            </button>

            {typeof document !== 'undefined' && ReactDOM.createPortal(panel, document.body)}
        </div>
    );
};

// ─── RoomFilter ───────────────────────────────────────────────────────────────

export const RoomFilter: React.FC<RoomFilterProps> = ({
    building, onBuildingChange,
    floor,    onFloorChange,
    status,   onStatusChange,
    onSearch, onReset,
    resultCount, totalCount,
}) => {
    const isFiltered =
        building !== 'all-buildings' ||
        floor    !== 'all-floors'    ||
        status   !== 'all-status';

    return (
        <div className="mb-8 md:mb-12">
            <div className="dashboard-card rounded-3xl! p-2 md:p-3 flex flex-col md:flex-row flex-wrap gap-2 md:gap-0 items-stretch md:items-center">

                {/* Building */}
                <div className="flex-1 min-w-0">
                    <CustomDropdown value={building} options={BUILDINGS} onChange={onBuildingChange} align="left" className="w-full" />
                </div>

                <div className="h-6 w-px bg-[#1E2B58]/10 dark:bg-white/10 hidden md:block self-center mx-1" />

                {/* Floor */}
                <div className="flex-1 min-w-0">
                    <CustomDropdown value={floor} options={FLOORS} onChange={onFloorChange} align="left" className="w-full" />
                </div>

                <div className="h-6 w-px bg-[#1E2B58]/10 dark:bg-white/10 hidden md:block self-center mx-1" />

                {/* Status — right-aligned panel avoids viewport overflow */}
                <div className="flex-1 min-w-0">
                    <CustomDropdown value={status} options={STATUSES} onChange={onStatusChange} align="right" className="w-full" />
                </div>

                {/* Actions */}
                <div className="flex gap-2 md:ml-3 shrink-0">
                    {isFiltered && (
                        <button
                            type="button"
                            onClick={onReset}
                            className="bg-transparent border border-[#1E2B58]/20 dark:border-white/20 text-[#1E2B58]/70 dark:text-white/70 px-4 py-3 rounded-xl md:rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#1E2B58]/10 dark:hover:bg-white/10 transition-all"
                        >
                            <X className="w-4 h-4" />
                            <span className="hidden sm:inline">Clear</span>
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={onSearch}
                        className="bg-[#1E2B58] text-white px-6 md:px-8 py-3 rounded-xl md:rounded-2xl font-bold text-[0.875rem] flex items-center justify-center gap-2 md:gap-3 hover:bg-[#1E2B58]/90 hover:scale-[1.02] active:scale-95 transition-all shadow-md shadow-[#1E2B58]/20 whitespace-nowrap"
                    >
                        <Search className="w-4 h-4" />
                        Search
                    </button>
                </div>
            </div>

            {/* Result summary */}
            {isFiltered && (
                <p className="mt-3 px-2 text-[0.75rem] font-semibold text-[#1E2B58]/60 dark:text-white/50">
                    Showing{' '}
                    <span className="font-black text-[#1E2B58] dark:text-white">{resultCount}</span>
                    {' '}of {totalCount} rooms
                </p>
            )}
        </div>
    );
};
