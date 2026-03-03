/**
 * Shared modal design tokens — unified across all modals in the technician portal.
 * Inspired by: clean white card on soft blue-gray backdrop, minimal flat design.
 */

export const MODAL_OVERLAY =
  'fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#C8D6E8]/70 backdrop-blur-sm';

export const MODAL_OVERLAY_TOP =
  'fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 bg-[#C8D6E8]/70 backdrop-blur-sm';

export const MODAL_CARD =
  'relative w-full bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col';

export const MODAL_HEADER = 'px-7 pt-7 pb-5 flex items-start justify-between';

export const MODAL_DIVIDER = 'mx-7 border-t border-slate-100';

export const MODAL_BODY = 'px-7 py-6 overflow-y-auto flex-1 space-y-5';

export const MODAL_FOOTER = 'px-7 py-5 border-t border-slate-100 flex gap-3 items-center';

export const CLOSE_BTN =
  'w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors shrink-0 ml-3';

export const BTN_PRIMARY =
  'flex-1 py-3 rounded-xl bg-[#1A2B56] text-white text-sm font-bold hover:bg-[#14203f] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-sm';

export const BTN_SECONDARY =
  'flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors text-center';

export const BTN_DANGER =
  'flex-1 py-3 rounded-xl bg-rose-500 text-white text-sm font-bold hover:bg-rose-600 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-sm';

export const CHIP =
  'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-slate-100 text-slate-600';

export const SECTION_LABEL =
  'text-[10px] font-bold text-slate-400 uppercase tracking-widest';

export const INFO_CARD =
  'bg-slate-50 rounded-xl p-4 border border-slate-100';

export const INPUT_CLASS =
  'w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 font-medium outline-none focus:bg-white focus:border-[#1A2B56] focus:ring-2 focus:ring-[#1A2B56]/10 transition placeholder:text-slate-300';

export const TEXTAREA_CLASS =
  'w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 font-medium outline-none focus:bg-white focus:border-[#1A2B56] focus:ring-2 focus:ring-[#1A2B56]/10 transition resize-none placeholder:text-slate-300';
