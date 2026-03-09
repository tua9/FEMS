import React, { useState, useEffect } from 'react';
import type { FulfillmentRequest } from '@/data/technician/mockHandover';

type Phase = 'confirm' | 'success';

interface Props {
  req: FulfillmentRequest;
  onClose: () => void;
  onConfirm: (id: string) => void;
}

const ConfirmHandoverModal: React.FC<Props> = ({ req, onClose, onConfirm }) => {
  const [phase, setPhase] = useState<Phase>('confirm');
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape' && phase !== 'success') onClose(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [onClose, phase]);

  const handleConfirm = () => {
    setChecking(true);
    // Simulate brief processing
    setTimeout(() => {
      setChecking(false);
      setPhase('success');
      onConfirm(req.id);
    }, 900);
  };

  const initials = req.recipient.name
    .split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => { if (e.target === e.currentTarget && phase !== 'success') onClose(); }}
    >
      <div
        className="w-full max-w-md tech-dropdown rounded-3xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Colour bar ── */}
        <div className={`h-1.5 w-full transition-all duration-500 ${phase === 'success'
          ? 'bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-400'
          : 'bg-gradient-to-r from-[#1A2B56] via-blue-500 to-[#1A2B56]'
          }`} />

        {/* ───── CONFIRM PHASE ───── */}
        {phase === 'confirm' && (
          <div className="p-8">
            {/* Title */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[#1A2B56] flex items-center justify-center shadow-lg shadow-[#1A2B56]/25 flex-shrink-0">
                <span className="material-symbols-outlined text-white text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  verified_user
                </span>
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-[#1A2B56] dark:text-white">Confirm Physical Handover</h3>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5">Reference: {req.id}</p>
              </div>
            </div>

            {/* Recipient card */}
            <div className="bg-slate-50 dark:bg-white/5 rounded-2xl p-4 mb-4 border border-slate-100 dark:border-white/10">
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-3">Recipient</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1A2B56]/10 flex items-center justify-center text-[#1A2B56] font-extrabold text-sm border-2 border-white shadow-sm flex-shrink-0">
                  {initials}
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white text-sm">{req.recipient.name}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{req.recipient.department} · {req.recipient.designation}</p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500">ID: {req.recipient.userId}</p>
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="bg-slate-50 dark:bg-white/5 rounded-2xl p-4 mb-6 border border-slate-100 dark:border-white/10">
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-3">
                Items to Hand Over ({req.items.length})
              </p>
              <div className="space-y-2">
                {req.items.map((item) => (
                  <div key={item.serial} className="flex items-center gap-3 bg-white rounded-xl px-3 py-2.5 border border-slate-100">
                    <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-slate-500 text-base">{item.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800 truncate">{item.name}</p>
                      <p className="text-[10px] text-slate-400">SN: {item.serial}</p>
                    </div>
                    <span className="material-symbols-outlined text-emerald-500 text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                      check_circle
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Warning */}
            <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3 mb-6">
              <span className="material-symbols-outlined text-amber-500 text-base flex-shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
                info
              </span>
              <p className="text-xs text-amber-700 leading-relaxed font-medium">
                By confirming, you acknowledge that all items have been physically handed to the recipient and both parties have signed the handover document.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-2xl border border-slate-200 dark:border-white/10 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={checking}
                className="flex-1 py-3 rounded-2xl bg-[#1A2B56] text-white text-sm font-bold shadow-lg shadow-[#1A2B56]/25 hover:bg-[#14203f] disabled:opacity-60 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                {checking ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                    Confirm Handover
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ───── SUCCESS PHASE ───── */}
        {phase === 'success' && (
          <div className="p-10 flex flex-col items-center text-center">
            {/* Animated check */}
            <div className="w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center shadow-2xl shadow-emerald-500/40 mb-5 animate-bounce-once">
              <span
                className="material-symbols-outlined text-white text-5xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                check_circle
              </span>
            </div>

            <h3 className="text-xl font-extrabold text-[#1A2B56] mb-2">Handover Complete!</h3>
            <p className="text-sm text-slate-500 mb-1">Successfully handed over to</p>
            <p className="text-base font-bold text-slate-800 mb-1">{req.recipient.name}</p>
            <p className="text-xs text-slate-400 mb-6">{req.recipient.department} · {req.id}</p>

            {/* Items confirmation list */}
            <div className="w-full bg-emerald-50 border border-emerald-100 rounded-2xl p-4 mb-6 text-left">
              <p className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-widest mb-2">
                {req.items.length} Item{req.items.length > 1 ? 's' : ''} Handed Over
              </p>
              {req.items.map((item) => (
                <div key={item.serial} className="flex items-center gap-2 py-1.5 border-b border-emerald-100 last:border-0">
                  <span className="material-symbols-outlined text-emerald-500 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  <span className="text-xs font-semibold text-slate-700">{item.name}</span>
                  <span className="text-[10px] text-slate-400 ml-auto">SN: {item.serial}</span>
                </div>
              ))}
            </div>

            <p className="text-xs text-slate-400 mb-6">
              A record has been added to the handover history log.
            </p>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-2xl bg-[#1A2B56] text-white text-sm font-bold shadow-lg shadow-[#1A2B56]/25 hover:bg-[#14203f] transition-all active:scale-95"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfirmHandoverModal;


