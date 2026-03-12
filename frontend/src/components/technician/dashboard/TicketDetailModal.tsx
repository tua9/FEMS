import React, { useState } from 'react';
import type { MockTask } from '@/data/technician/mockTasks';
import ConfirmRejectModal from '@/components/technician/common/ConfirmRejectModal';

// ── Helpers ───────────────────────────────────────────────────────────────────
const getCategoryMeta = (label: string) => {
  const map: Record<string, { icon: string; color: string }> = {
    'AV Device':  { icon: 'video_settings', color: 'text-blue-500'   },
    'HVAC':       { icon: 'ac_unit',        color: 'text-cyan-500'   },
    'IT Device':  { icon: 'computer',       color: 'text-indigo-500' },
    'Electrical': { icon: 'electric_bolt',  color: 'text-yellow-500' },
    'Plumbing':   { icon: 'water_drop',     color: 'text-blue-500'   },
    'Furniture':  { icon: 'chair',          color: 'text-purple-500' },
    'Safety':     { icon: 'warning',        color: 'text-orange-500' },
    'Other':      { icon: 'grid_view',      color: 'text-slate-400'  },
  };
  return map[label] ?? map['Other'];
};

const formatDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric',
    });
  } catch { return iso; }
};

// ── Main Modal ────────────────────────────────────────────────────────────────
interface Props {
  task: MockTask;
  onClose: () => void;
}

const TicketDetailModal: React.FC<Props> = ({ task, onClose }) => {
  const cat      = getCategoryMeta(task.displayCategory ?? task.category);
  const canAct   = task.status !== 'Completed' && task.status !== 'Cancelled';
  const [note,        setNote]        = useState('');
  const [showReject,  setShowReject]  = useState(false);

  const handleApprove = () => {
    // TODO: call API with note
    onClose();
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      >
        <div
          className="relative w-full max-w-sm bg-white dark:bg-[#1a2340] rounded-3xl shadow-2xl shadow-[#1A2B56]/20 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* ── Header ── */}
          <div className="px-7 pt-7 pb-5 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              {/* Circular category icon */}
              <div className="w-10 h-10 rounded-full bg-[#1A2B56] flex items-center justify-center shrink-0 shadow-md shadow-[#1A2B56]/30">
                <span
                  className="material-symbols-outlined text-white text-[18px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {cat.icon}
                </span>
              </div>
              <div>
                <h2 className="text-base font-extrabold text-[#1A2B56] dark:text-white leading-tight">
                  {task.title}
                </h2>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                  #{task.id}
                </p>
              </div>
            </div>
            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-white/10 dark:hover:text-white transition-all ml-2 shrink-0"
              aria-label="Close"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          {/* ── Body ── */}
          <div className="px-7 pb-6 space-y-4">

            {/* Confirm info box */}
            <div className="flex items-start gap-3 px-4 py-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10">
              <span
                className="material-symbols-outlined text-[#1A2B56] dark:text-blue-300 text-[20px] shrink-0 mt-0.5"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                info
              </span>
              <div className="space-y-2.5 w-full">
                <div>
                  <p className="text-sm font-bold text-[#1A2B56] dark:text-white leading-snug">
                    Confirm approval
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    You are approving the repair request for{' '}
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      {task.title}
                    </span>{' '}
                    in{' '}
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      {task.location.building}, {task.location.room}
                    </span>.
                  </p>
                </div>

                {/* Compact detail rows inside the info box */}
                <div className="border-t border-slate-200/70 dark:border-white/10 pt-2.5 grid grid-cols-2 gap-x-4 gap-y-1.5">
                  {[
                    { icon: 'location_on',  label: 'Building', value: task.location.building },
                    { icon: 'meeting_room', label: 'Room',     value: task.location.room },
                    { icon: 'layers',       label: 'Floor',    value: `Floor ${task.location.floor}` },
                    { icon: 'schedule',     label: 'Reported', value: formatDate(task.createdAt) },
                  ].map(({ icon, label, value }) => (
                    <div key={label} className="flex items-center gap-1.5 min-w-0">
                      <span className={`material-symbols-outlined text-[13px] shrink-0 ${cat.color}`}>
                        {icon}
                      </span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 shrink-0">{label}</span>
                      <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-200 truncate ml-auto">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Note field */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Note <span className="normal-case font-semibold">(optional)</span>
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add approval notes or instructions for the technician..."
                rows={3}
                className="w-full resize-none rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-3 text-sm text-[#1A2B56] dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-[#1A2B56]/20 dark:focus:ring-blue-500/20 transition-all"
              />
            </div>
          </div>

          {/* ── Footer ── */}
          <div className="px-7 py-5 border-t border-slate-100 dark:border-white/8 flex gap-3">
            {canAct ? (
              <>
                {/* Reject — ghost rose pill */}
                <button
                  type="button"
                  onClick={() => setShowReject(true)}
                  className="flex-1 py-3 rounded-full border border-rose-200 dark:border-rose-500/30 text-sm font-bold text-rose-500 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all"
                >
                  Reject
                </button>
                {/* Approve — solid navy pill */}
                <button
                  type="button"
                  onClick={handleApprove}
                  className="flex-2 py-3 rounded-full bg-[#1A2B56] text-white text-sm font-bold hover:bg-[#151f40] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#1A2B56]/25"
                >
                  <span
                    className="material-symbols-outlined text-[17px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </span>
                  Approve
                </button>
              </>
            ) : (
              /* Completed / Cancelled — close only */
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-full bg-[#1A2B56] text-white text-sm font-bold hover:bg-[#151f40] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#1A2B56]/25"
              >
                Close
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Reject confirmation (stacked z-60) */}
      {showReject && (
        <ConfirmRejectModal
          ticketId={task.id}
          ticketTitle={task.title}
          imageUrl={task.imageUrl}
          onCancel={() => setShowReject(false)}
          onConfirm={(_reason) => { setShowReject(false); onClose(); }}
        />
      )}
    </>
  );
};

export default TicketDetailModal;
