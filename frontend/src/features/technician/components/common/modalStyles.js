/**
 * Shared modal design tokens — unified across ALL modals in the entire app.
 * Reference design: glass-card overlay, rounded-[2rem], bg-black/30 backdrop-blur-sm.
 */

// ── Backdrop ──────────────────────────────────────────────────────────────────
export const MODAL_OVERLAY =
 'fixed inset-0 z-50 flex items-center justify-center px-4 py-6 bg-black/30 backdrop-blur-sm';

export const MODAL_OVERLAY_TOP =
 'fixed inset-0 z-[60] flex items-center justify-center px-4 py-6 bg-black/30 backdrop-blur-sm';

// ── Card ──────────────────────────────────────────────────────────────────────
export const MODAL_CARD =
 'relative w-full glass-card rounded-[2rem] shadow-2xl shadow-[#1E2B58]/20 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200';

// ── Internal layout ───────────────────────────────────────────────────────────
export const MODAL_HEADER = 'px-7 pt-7 pb-5 flex items-start justify-between';

export const MODAL_DIVIDER = 'mx-7 border-t border-black/8 dark:border-white/10';

export const MODAL_BODY = 'px-7 py-6 overflow-y-auto flex-1 space-y-5';

export const MODAL_FOOTER = 'px-7 py-5 border-t border-black/8 dark:border-white/10 flex gap-3 items-center';

// ── Buttons ───────────────────────────────────────────────────────────────────
export const CLOSE_BTN =
 'w-8 h-8 rounded-full flex items-center justify-center text-[#1E2B58]/50 hover:text-[#1E2B58] hover:bg-[#1E2B58]/8 dark:text-white/50 dark:hover:text-white dark:hover:bg-white/10 transition-colors shrink-0 ml-3';

export const BTN_PRIMARY =
 'flex-1 py-3 rounded-[1.25rem] bg-[#1E2B58] text-white text-sm font-bold hover:bg-[#151f40] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#1E2B58]/20';

export const BTN_SECONDARY =
 'flex-1 py-3 rounded-[1.25rem] border border-[#1E2B58]/15 dark:border-white/15 text-[#1E2B58]/70 dark:text-white/70 text-sm font-bold hover:bg-[#1E2B58]/5 dark:hover:bg-white/5 transition-all text-center';

export const BTN_DANGER =
 'flex-1 py-3 rounded-[1.25rem] bg-red-500 text-white text-sm font-bold hover:bg-red-600 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-500/20';

export const BTN_SUCCESS =
 'flex-1 py-3 rounded-[1.25rem] bg-emerald-500 text-white text-sm font-bold hover:bg-emerald-600 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20';

// ── Form inputs ───────────────────────────────────────────────────────────────
export const INPUT_CLASS =
 'w-full rounded-2xl border border-white/40 bg-white/40 px-4 py-3 text-sm font-medium text-[#1E2B58] outline-none transition-all placeholder:text-[#1E2B58]/30 focus:ring-2 focus:ring-[#1E2B58]/25 dark:border-slate-700/50 dark:bg-slate-800/50 dark:text-white dark:placeholder:text-white/30 dark:focus:ring-blue-500/30';

export const TEXTAREA_CLASS =
 'w-full resize-none rounded-2xl border border-white/40 bg-white/40 px-4 py-3 text-sm font-medium text-[#1E2B58] outline-none transition-all placeholder:text-[#1E2B58]/30 focus:ring-2 focus:ring-[#1E2B58]/25 dark:border-slate-700/50 dark:bg-slate-800/50 dark:text-white dark:placeholder:text-white/30 dark:focus:ring-blue-500/30';

// ── Info card (detail rows) ───────────────────────────────────────────────────
export const CHIP =
 'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold';

export const SECTION_LABEL =
 'text-[0.625rem] font-black uppercase tracking-widest text-[#1E2B58]/50 dark:text-white/40';

export const INFO_CARD =
 'bg-white/40 dark:bg-slate-800/40 rounded-[1.25rem] p-5 space-y-3';
