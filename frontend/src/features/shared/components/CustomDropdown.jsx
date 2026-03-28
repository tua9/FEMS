import { Check, ChevronDown } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';

// ─── Types ────────────────────────────────────────────────────────────────────

// ─── CustomDropdown — portal-based, immune to parent overflow:hidden ──────────

const CustomDropdown = ({
 value, options, onChange,
 align = 'left',
 className = '',
 triggerClassName,
 fullWidth = false,
 placeholder,
}) => {
 const [open, setOpen] = useState(false);
 const [coords, setCoords] = useState({ top: 0 });
 const triggerRef = useRef(null);

 // Close on outside click
 useEffect(() => {
 if (!open) return;
 const handler = (e) => {
 const panel = document.querySelector('[data-dd-panel]');
 if (
 triggerRef.current && !triggerRef.current.contains(e.target) &&
 panel && !panel.contains(e.target)
 ) {
 setOpen(false);
 }
 };
 document.addEventListener('mousedown', handler);
 return () => document.removeEventListener('mousedown', handler);
 }, [open]);

 // Recalc position on resize/scroll
 useEffect(() => {
   if (!open) return;
   const recalc = () => {
     if (!triggerRef.current) return;
     const r = triggerRef.current.getBoundingClientRect();
     setCoords(
       align === 'right'
         ? {
             top: r.bottom + 8,
             right: window.innerWidth - r.right,
             left: 'auto',
             width: fullWidth ? r.width : undefined
           }
         : {
             top: r.bottom + 8,
             left: r.left,
             right: 'auto',
             width: fullWidth ? r.width : undefined
           }
     );
   };

   window.addEventListener('resize', recalc);
   window.addEventListener('scroll', recalc, true); // Use capture to catch scroll in parents
   return () => {
     window.removeEventListener('resize', recalc);
     window.removeEventListener('scroll', recalc, true);
   };
 }, [open, align, fullWidth]);

  const handleToggle = () => {
    if (!open && triggerRef.current) {
      const r = triggerRef.current.getBoundingClientRect();
      setCoords(
        align === 'right'
          ? {
              top: r.bottom + 8,
              right: window.innerWidth - r.right,
              left: 'auto',
              width: fullWidth ? r.width : undefined
            }
          : {
              top: r.bottom + 8,
              left: r.left,
              right: 'auto',
              width: fullWidth ? r.width : undefined
            }
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
 top: coords.top,
 left: coords.left,
 right: coords.right,
 width: coords.width,
 zIndex: 9999,
 }}
 className="glass-card !rounded-[1.25rem] py-2 min-w-[10rem] shadow-xl shadow-[#1E2B58]/10 dark:shadow-black/30"
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
 className={triggerClassName || "flex items-center gap-2 bg-transparent text-[0.875rem] font-bold text-[#1E2B58] dark:text-white px-4 py-2.5 h-[2.5rem] cursor-pointer hover:opacity-70 transition-opacity select-none whitespace-nowrap"}
 >
 <span className={triggerClassName ? "truncate block" : ""}>{selected?.label || placeholder || "Select..."}</span>
 <ChevronDown className={`w-4 h-4 shrink-0 transition-transform duration-200 ${triggerClassName ? 'text-slate-400' : 'text-slate-400'} ${open ? 'rotate-180' : ''}`} />
 </button>

 {typeof document !== 'undefined' && ReactDOM.createPortal(panel, document.body)}
 </div>
 );
};

export default CustomDropdown;
