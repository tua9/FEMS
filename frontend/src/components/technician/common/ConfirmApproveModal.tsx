import React from 'react';
import { MockTask } from '@/data/technician/mockTasks';
import {
  MODAL_OVERLAY_TOP, MODAL_CARD, CLOSE_BTN,
  BTN_PRIMARY, BTN_SECONDARY,
  SECTION_LABEL, INFO_CARD, CHIP,
} from '@/components/technician/common/modalStyles';

// ── Helpers ───────────────────────────────────────────────────────────────────
const getPriorityStyle = (priority: string) => {
  const map: Record<string, { pill: string; dot: string }> = {
    Urgent: { pill: 'bg-rose-100 text-rose-600',       dot: 'bg-rose-500'    },
    High:   { pill: 'bg-rose-100 text-rose-600',       dot: 'bg-rose-400'    },
    Medium: { pill: 'bg-amber-100 text-amber-700',     dot: 'bg-amber-400'   },
    Low:    { pill: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-400' },
  };
  return map[priority] ?? map.Medium;
};

const getCategoryMeta = (label: string) => {
  const map: Record<string, { icon: string; color: string }> = {
    'AV Device':  { icon: 'video_settings', color: 'text-blue-600'   },
    'HVAC':       { icon: 'ac_unit',        color: 'text-cyan-600'   },
    'IT Device':  { icon: 'computer',       color: 'text-indigo-600' },
    'Electrical': { icon: 'electric_bolt',  color: 'text-yellow-600' },
    'Plumbing':   { icon: 'water_drop',     color: 'text-blue-600'   },
    'Furniture':  { icon: 'chair',          color: 'text-purple-600' },
    'Safety':     { icon: 'warning',        color: 'text-orange-600' },
    'Other':      { icon: 'grid_view',      color: 'text-slate-500'  },
  };
  return map[label] ?? map['Other'];
};

const InfoRow: React.FC<{ icon: string; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0">
    <div className="flex items-center gap-2 text-slate-500">
      <span className="material-symbols-outlined text-[15px]">{icon}</span>
      <span className="text-xs font-medium">{label}</span>
    </div>
    <span className="text-xs font-semibold text-slate-800">{value}</span>
  </div>
);

// ── Main Modal ────────────────────────────────────────────────────────────────
interface Props {
  task: MockTask;
  onCancel: () => void;
  onConfirm: () => void;
}

const ConfirmApproveModal: React.FC<Props> = ({ task, onCancel, onConfirm }) => {
  const priority = getPriorityStyle(task.priority);
  const cat      = getCategoryMeta(task.displayCategory ?? task.category);

  const initials = task.reportedBy.name
    .split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();

  return (
    <div className={MODAL_OVERLAY_TOP} onClick={onCancel}>
      <div
        className={`${MODAL_CARD} max-w-md`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="px-7 pt-7 pb-5 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-emerald-500 text-2xl">check_circle</span>
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#1A2B56] leading-tight">Approve Ticket?</h2>
              <p className="text-xs text-slate-500 mt-0.5">Review the details before confirming.</p>
            </div>
          </div>
          <button onClick={onCancel} className={CLOSE_BTN}>
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* ── Ticket chips ── */}
        <div className="px-7 pb-5 flex flex-wrap gap-2">
          <span className={`${CHIP} bg-slate-100 text-slate-600`}>
            TICKET: #{task.id}
          </span>
          <span className={`${CHIP} bg-slate-100 text-slate-600`}>
            <span className={`material-symbols-outlined text-[12px] ${cat.color}`}>{cat.icon}</span>
            {task.displayCategory ?? task.category}
          </span>
        </div>

        <div className="mx-7 border-t border-slate-100" />

        {/* ── Body ── */}
        <div className="px-7 py-6 space-y-5">
          {/* Summary card */}
          <div>
            <p className={`${SECTION_LABEL} mb-2`}>Ticket Summary</p>
            <div className={INFO_CARD}>
              {/* Equipment image */}
              {task.imageUrl && (
                <div className="relative w-full h-32 rounded-xl overflow-hidden mb-3 bg-slate-100">
                  <img
                    src={task.imageUrl}
                    alt={task.title}
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
                </div>
              )}
              <div className="flex items-start gap-3 mb-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900 leading-snug">{task.title}</p>
                </div>
                <span className={`${CHIP} ${priority.pill} shrink-0`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${priority.dot}`} />
                  {task.priority}
                </span>
              </div>
              <InfoRow icon="location_on" label="Location" value={`${task.location.building}, ${task.location.room}`} />
              <InfoRow icon="layers"      label="Floor"    value={`Floor ${task.location.floor}`} />
            </div>
          </div>

          {/* Reported by */}
          <div>
            <p className={`${SECTION_LABEL} mb-2`}>Reported By</p>
            <div className={`${INFO_CARD} flex items-center gap-3`}>
              <div className="w-9 h-9 rounded-full bg-[#1A2B56]/10 flex items-center justify-center text-[#1A2B56] font-extrabold text-xs shrink-0">
                {initials}
              </div>
              <p className="text-sm font-semibold text-slate-900">{task.reportedBy.name}</p>
            </div>
          </div>

          {/* Notice */}
          <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3.5">
            <span className="material-symbols-outlined text-emerald-500 text-base mt-0.5 shrink-0">info</span>
            <p className="text-xs text-emerald-700 leading-relaxed">
              Approving this ticket will assign it for fulfillment. The requester will be notified automatically.
            </p>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="px-7 py-5 border-t border-slate-100 flex gap-3">
          <button type="button" onClick={onCancel} className={BTN_SECONDARY}>
            Cancel
          </button>
          <button type="button" onClick={onConfirm} className={BTN_PRIMARY}>
            <span className="material-symbols-outlined text-base">check_circle</span>
            Confirm Approve
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmApproveModal;
