import React from 'react';
import {
 MODAL_OVERLAY, MODAL_CARD, CLOSE_BTN,
 BTN_PRIMARY, SECTION_LABEL, CHIP,
} from '@/features/technician/components/common/modalStyles';
import ModalPortal from '@/features/technician/components/common/ModalPortal';

// ── Unified record shape ──────────────────────────────────────────────────────
// ── Section wrapper ───────────────────────────────────────────────────────────
const Section = ({ title, icon, children }) => (
 <div>
 <div className="flex items-center gap-2 mb-3">
 <span className="material-symbols-outlined text-slate-400 text-base">{icon}</span>
 <p className={SECTION_LABEL}>{title}</p>
 </div>
 {children}
 </div>
);

const HandoverDetailModal = ({ record, onClose }) => (
 <ModalPortal>
 <div className={MODAL_OVERLAY} onClick={onClose}>
 <div
 className={`${MODAL_CARD} max-w-xl`}
 style={{ maxHeight: '90vh' }}
 onClick={(e) => e.stopPropagation()}
 >
 {/* ── Header ── */}
 <div className="px-7 pt-7 pb-5 flex items-start justify-between">
 <div className="flex items-center gap-4">
 <div
 className={`w-14 h-14 rounded-xl flex items-center justify-center font-extrabold text-lg shrink-0 ${
 record.person.avatarBg ?? 'bg-[#1E2B58]/10'
 } ${record.person.avatarColor ?? 'text-[#1E2B58]'}`}
 >
 {record.person.initials}
 </div>
 <div>
 <h2 className="text-base font-extrabold text-[#1E2B58] dark:text-white leading-tight">{record.person.name}</h2>
 <p className="text-xs text-[#1E2B58]/50 dark:text-white/40 font-medium mt-0.5">{record.person.sub}</p>
 {record.person.email && (
 <p className="text-[10px] text-[#1E2B58]/40 dark:text-white/30 mt-0.5 flex items-center gap-1">
 <span className="material-symbols-outlined text-[12px]">mail</span>
 {record.person.email}
 </p>
 )}
 </div>
 </div>
 <div className="flex items-center gap-3">
 {record.badge && (
 <span className={`${CHIP} ${record.badge.className}`}>{record.badge.label}</span>
 )}
 <button onClick={onClose} className={CLOSE_BTN} aria-label="Close">
 <span className="material-symbols-outlined text-lg">close</span>
 </button>
 </div>
 </div>

 {/* Reference ID chip */}
 <div className="px-7 pb-4">
 <span className={`${CHIP} bg-[#1E2B58]/8 dark:bg-white/8 text-[#1E2B58]/60 dark:text-white/40 font-mono`}>{record.id}</span>
 </div>

 <div className="mx-7 border-t border-black/8 dark:border-white/10" />

 {/* ── Scrollable body ── */}
 <div className="px-7 py-6 overflow-y-auto flex-1 space-y-6">

 {/* Meta grid */}
 {record.meta.length > 0 && (
 <Section title="Details" icon="info">
 <div className="grid grid-cols-2 gap-3">
 {record.meta.map((m) => (
 <div key={m.label} className="bg-white/40 dark:bg-slate-800/40 rounded-[1rem] p-3.5">
 <p className="text-[9px] font-black uppercase tracking-widest text-[#1E2B58]/40 dark:text-white/40 mb-1 flex items-center gap-1">
 {m.icon && <span className="material-symbols-outlined text-[11px]">{m.icon}</span>}
 {m.label}
 </p>
 <p className="text-sm font-bold text-[#1E2B58] dark:text-white leading-tight">{m.value}</p>
 </div>
 ))}
 </div>
 </Section>
 )}

 {/* Equipment items */}
 {record.items && record.items.length > 0 && (
 <Section title={`Equipment Items (${record.items.length})`} icon="inventory_2">
 <div className="space-y-2">
 {record.items.map((item, i) => (
 <div key={i} className="flex items-center gap-3 p-3.5 rounded-[1rem] bg-white/40 dark:bg-slate-800/40 border border-black/5 dark:border-white/8">
 <div className="w-10 h-10 rounded-xl bg-[#1E2B58]/8 dark:bg-white/8 flex items-center justify-center shrink-0">
 <span className="material-symbols-outlined text-[#1E2B58]/70 dark:text-white/60 text-xl">{item.icon}</span>
 </div>
 <div className="flex-1 min-w-0">
 <p className="text-sm font-bold text-[#1E2B58] dark:text-white truncate">{item.name}</p>
 <p className="text-[10px] text-[#1E2B58]/40 dark:text-white/30 font-mono">SN: {item.serial}</p>
 </div>
 {item.condition && (
 <span className={`${CHIP} bg-white/60 dark:bg-white/8 border border-black/8 dark:border-white/10 text-[#1E2B58]/60 dark:text-white/50 shrink-0`}>
 {item.condition}
 </span>
 )}
 </div>
 ))}
 </div>
 </Section>
 )}

 {/* Timeline */}
 {record.timeline && record.timeline.length > 0 && (
 <Section title="Activity Timeline" icon="timeline">
 <div className="relative pl-5">
 <div className="absolute left-2 top-2 bottom-2 w-px bg-black/8 dark:bg-white/10" />
 <div className="space-y-5">
 {record.timeline.map((ev, i) => (
 <div key={i} className="relative flex items-start gap-3">
 <div
 className={`absolute -left-3 w-3 h-3 rounded-full border-2 border-white dark:border-slate-900 mt-0.5 shrink-0 ${
 ev.done ? 'bg-[#1E2B58]' : 'bg-slate-200 dark:bg-slate-700'
 }`}
 />
 <div className="pl-2">
 <p className={`text-xs font-bold ${ev.done ? 'text-[#1E2B58] dark:text-white' : 'text-[#1E2B58]/40 dark:text-white/30'}`}>{ev.label}</p>
 {ev.sub && <p className="text-[10px] text-[#1E2B58]/40 dark:text-white/30 mt-0.5">{ev.sub}</p>}
 <p className="text-[10px] text-[#1E2B58]/30 dark:text-white/20 font-mono mt-0.5">{ev.date}</p>
 </div>
 </div>
 ))}
 </div>
 </div>
 </Section>
 )}

 {/* Notes */}
 {record.notes && (
 <Section title="Notes" icon="sticky_note_2">
 <div className="bg-amber-500/8 border border-amber-500/20 rounded-[1rem] p-4">
 <p className="text-sm text-[#1E2B58] dark:text-white/80 leading-relaxed">{record.notes}</p>
 </div>
 </Section>
 )}
 </div>

 {/* ── Footer ── */}
 <div className="px-7 py-5 border-t border-black/8 dark:border-white/10">
 <button onClick={onClose} className={BTN_PRIMARY}>
 Close
 </button>
 </div>
 </div>
 </div>
 </ModalPortal>
);

export default HandoverDetailModal;
