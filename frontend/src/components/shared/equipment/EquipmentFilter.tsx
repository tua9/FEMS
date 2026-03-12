import { Check, ChevronDown, Search } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';

// ─── Types ────────────────────────────────────────────────────────────────────

interface DropdownOption { value: string; label: string }

interface EquipmentFilterProps {
    searchText: string;
    onSearchChange: (val: string) => void;
    typeFilter: string;
    onTypeChange: (val: string) => void;
    locationFilter: string;
    onLocationChange: (val: string) => void;
    onFilter: () => void;
}

// ─── Static options ───────────────────────────────────────────────────────────

const TYPES: DropdownOption[] = [
    { value: 'all-types',  label: 'All Types'  },
    { value: 'laptop',     label: 'Laptop'     },
    { value: 'projector',  label: 'Projector'  },
    { value: 'tablet',     label: 'Tablet'     },
    { value: 'monitor',    label: 'Monitor'    },
    { value: 'camera',     label: 'Camera'     },
    { value: 'audio',      label: 'Audio'      },
];

const LOCATIONS: DropdownOption[] = [
    { value: 'all-locations', label: 'All Locations'  },
    { value: 'gamma',         label: 'Gamma Building' },
    { value: 'alpha',         label: 'Alpha Building' },
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
    const [open, setOpen]             = useState(false);
    const [coords, setCoords]         = useState<{ top: number; left?: number; right?: number }>({ top: 0 });
    const triggerRef = useRef<HTMLButtonElement>(null);

    // Close on outside click
    useEffect(() => {
        if (!open) return;
        const handler = (e: MouseEvent) => {
            const target = e.target as Node;
            if (triggerRef.current && !triggerRef.current.contains(target)) {
                // also ignore clicks inside the portal panel (it has data-dd-panel)
                const panel = document.querySelector('[data-dd-panel]');
                if (!panel || !panel.contains(target)) setOpen(false);
            }
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
                    ? { top: r.bottom + 8, right: window.innerWidth - r.right }
                    : { top: r.bottom + 8, left: r.left }
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
                    ? { top: r.bottom + 8, right: window.innerWidth - r.right }
                    : { top: r.bottom + 8, left: r.left }
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
                    className={`w-full flex items-center justify-between gap-6 px-5 py-2.5 text-[0.875rem] font-bold whitespace-nowrap transition-colors ${
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
                className="flex items-center gap-2 bg-transparent text-[0.875rem] font-bold text-[#1E2B58] dark:text-white px-[0.5rem] py-2 cursor-pointer hover:opacity-70 transition-opacity select-none whitespace-nowrap"
            >
                <span>{selected.label}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
            </button>

            {typeof document !== 'undefined' && ReactDOM.createPortal(panel, document.body)}
        </div>
    );
};

// ─── EquipmentFilter ──────────────────────────────────────────────────────────

export const EquipmentFilter: React.FC<EquipmentFilterProps> = ({
    searchText, onSearchChange,
    typeFilter, onTypeChange,
    locationFilter, onLocationChange,
    onFilter,
}) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') onFilter();
    };

    return (
        <section className="dashboard-card rounded-[2rem] md:rounded-full px-[1rem] md:px-[1.5rem] py-[0.75rem] md:py-[0.5rem] flex flex-col md:flex-row flex-wrap items-stretch md:items-center gap-[1rem] mb-[2rem] md:mb-[3rem]">

            {/* Search */}
            <div className="flex-1 min-w-0 md:min-w-[18.75rem] flex items-center gap-[0.75rem] bg-white/20 dark:bg-slate-800/40 px-[1rem] py-[0.5rem] md:py-0 md:bg-transparent rounded-full border border-white/30 dark:border-slate-700/50 md:border-none focus-within:ring-2 focus-within:ring-[#1E2B58]/20 transition-all">
                <Search className="w-[1.25rem] h-[1.25rem] opacity-40 text-[#1E2B58] dark:text-white shrink-0" />
                <input
                    className="bg-transparent border-none focus:ring-0 w-full placeholder:text-[#1E2B58]/40 dark:placeholder:text-white/40 font-medium text-[#1E2B58] dark:text-white outline-none text-[0.875rem] md:text-[1rem]"
                    placeholder="Search devices (e.g. Laptop, Projector, Tablet...)"
                    type="text"
                    value={searchText}
                    onChange={e => onSearchChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                {searchText && (
                    <button
                        type="button"
                        onClick={() => onSearchChange('')}
                        className="text-[#1E2B58]/40 dark:text-white/40 hover:text-[#1E2B58] dark:hover:text-white transition-colors shrink-0 text-lg leading-none"
                    >
                        ×
                    </button>
                )}
            </div>

            {/* Dropdowns + Filter button */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-[0.5rem] md:gap-[0.25rem]">
                <div className="h-6 w-px bg-[#1E2B58]/10 dark:bg-white/10 hidden md:block mx-3" />

                {/* Type */}
                <CustomDropdown value={typeFilter} options={TYPES} onChange={onTypeChange} align="left" />

                <div className="h-6 w-px bg-[#1E2B58]/10 dark:bg-white/10 hidden md:block mx-3" />

                {/* Location — right-aligned panel avoids viewport overflow */}
                <CustomDropdown value={locationFilter} options={LOCATIONS} onChange={onLocationChange} align="right" />

                <div className="h-6 w-px bg-[#1E2B58]/10 dark:bg-white/10 hidden md:block mx-3" />

                <button
                    type="button"
                    onClick={onFilter}
                    className="bg-[#1E2B58] text-white px-[2rem] py-[0.6875rem] rounded-full font-bold text-[0.875rem] transition hover:scale-105 active:scale-95 hover:shadow-lg shadow-[#1E2B58]/20 whitespace-nowrap"
                >
                    Filter
                </button>
            </div>
        </section>
    );
};
