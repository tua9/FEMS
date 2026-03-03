import React, { useState } from 'react';
import { MockTask } from '@/data/technician/mockTasks';
import ConfirmRejectModal from '@/components/technician/common/ConfirmRejectModal';
import ConfirmApproveModal from '@/components/technician/common/ConfirmApproveModal';
import {
  MODAL_OVERLAY, MODAL_CARD, CLOSE_BTN,
  BTN_PRIMARY, SECTION_LABEL, INFO_CARD, CHIP,
} from '@/components/technician/common/modalStyles';

// ── Helpers ───────────────────────────────────────────────────────────────────
const getCategoryMeta = (label: string) => {
  const map: Record<string, { icon: string; color: string; bg: string }> = {
    'AV Device':  { icon: 'video_settings', color: 'text-blue-600',   bg: 'bg-blue-50'   },
    'HVAC':       { icon: 'ac_unit',        color: 'text-cyan-600',   bg: 'bg-cyan-50'   },
    'IT Device':  { icon: 'computer',       color: 'text-indigo-600', bg: 'bg-indigo-50' },
    'Electrical': { icon: 'electric_bolt',  color: 'text-yellow-600', bg: 'bg-yellow-50' },
    'Plumbing':   { icon: 'water_drop',     color: 'text-blue-600',   bg: 'bg-blue-50'   },
    'Furniture':  { icon: 'chair',          color: 'text-purple-600', bg: 'bg-purple-50' },
    'Safety':     { icon: 'warning',        color: 'text-orange-600', bg: 'bg-orange-50' },
    'Other':      { icon: 'grid_view',      color: 'text-slate-500',  bg: 'bg-slate-50'  },
  };
  return map[label] ?? map['Other'];
};

const getPriorityStyle = (priority: string) => {
  const map: Record<string, { pill: string; dot: string }> = {
    Urgent: { pill: 'bg-rose-100 text-rose-600',       dot: 'bg-rose-500'        },
    High:   { pill: 'bg-rose-100 text-rose-600',       dot: 'bg-rose-400'        },
    Medium: { pill: 'bg-amber-100 text-amber-700',     dot: 'bg-amber-400'       },
    Low:    { pill: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-400'     },
  };
  return map[priority] ?? map.Medium;
};

const getStatusStyle = (status: string) => {
  const map: Record<string, { pill: string; dot: string; label: string }> = {
    Completed:    { pill: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500',           label: 'Completed'   },
    'In Progress':{ pill: 'bg-blue-100 text-blue-700',       dot: 'bg-blue-500 animate-pulse', label: 'In Progress' },
    Pending:      { pill: 'bg-slate-100 text-slate-600',     dot: 'bg-slate-400',              label: 'Pending'     },
    Cancelled:    { pill: 'bg-rose-100 text-rose-600',       dot: 'bg-rose-400',               label: 'Cancelled'   },
  };
  return map[status] ?? map.Pending;
};

const formatDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric',
    });
  } catch { return iso; }
};

// ── Sub-component ─────────────────────────────────────────────────────────────
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
  onClose: () => void;
}

const TicketDetailModal: React.FC<Props> = ({ task, onClose }) => {
  const cat      = getCategoryMeta(task.displayCategory ?? task.category);
  const priority = getPriorityStyle(task.priority);
  const status   = getStatusStyle(task.status);

  const [showReject,  setShowReject]  = useState(false);
  const [showApprove, setShowApprove] = useState(false);

  const initials = task.reportedBy.name
    .split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();

  const canAct = task.status !== 'Completed' && task.status !== 'Cancelled';

  return (
    <>
      <div className={MODAL_OVERLAY} onClick={onClose}>
        <div
          className={`${MODAL_CARD} max-w-lg`}
          style={{ maxHeight: '92vh' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* ── Header ── */}
          <div className="px-7 pt-7 pb-5 flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${cat.bg} flex items-center justify-center shrink-0`}>
                <span className={`material-symbols-outlined text-2xl ${cat.color}`}>{cat.icon}</span>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                  Ticket #{task.id}
                </p>
                <h2 className="text-base font-extrabold text-[#1A2B56] leading-tight">{task.title}</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {task.location.building} · {task.location.room}
                </p>
              </div>
            </div>
            <button onClick={onClose} className={CLOSE_BTN}>
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>

          {/* ── Chips row ── */}
          <div className="px-7 pb-5 flex flex-wrap gap-2">
            <span className={`${CHIP} ${status.pill}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
              {status.label}
            </span>
            <span className={`${CHIP} ${priority.pill}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${priority.dot}`} />
              {task.priority} Priority
            </span>
            <span className={`${CHIP} bg-slate-100 text-slate-600`}>
              <span className={`material-symbols-outlined text-[12px] ${cat.color}`}>{cat.icon}</span>
              {task.displayCategory ?? task.category}
            </span>
          </div>

          <div className="mx-7 border-t border-slate-100" />

          {/* ── Equipment Image ── */}
          {task.imageUrl && (
            <div className="px-7 pt-5">
              <div className="relative w-full h-44 rounded-2xl overflow-hidden bg-slate-100">
                <img
                  src={task.imageUrl}
                  alt={task.title}
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                  <span className={`material-symbols-outlined text-[13px] ${cat.color}`}>{cat.icon}</span>
                  <span className="text-[10px] font-bold text-white/90 uppercase tracking-wider drop-shadow">
                    {task.displayCategory ?? task.category}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ── Scrollable body ── */}
          <div className="px-7 py-6 overflow-y-auto flex-1 space-y-5">

            {/* Meta info */}
            <div className={`${INFO_CARD}`}>
              <InfoRow icon="location_on"  label="Building" value={task.location.building} />
              <InfoRow icon="meeting_room" label="Room"     value={task.location.room} />
              <InfoRow icon="layers"       label="Floor"    value={`Floor ${task.location.floor}`} />
              <InfoRow icon="schedule"     label="Reported" value={formatDate(task.createdAt)} />
            </div>

            {/* Description */}
            {task.description && (
              <div className="space-y-2">
                <p className={SECTION_LABEL}>Description</p>
                <div className={INFO_CARD}>
                  <p className="text-sm text-slate-700 leading-relaxed">{task.description}</p>
                </div>
              </div>
            )}

            {/* Reported by */}
            <div className="space-y-2">
              <p className={SECTION_LABEL}>Reported By</p>
              <div className={`${INFO_CARD} flex items-center gap-3`}>
                <div className="w-9 h-9 rounded-full bg-[#1A2B56]/10 flex items-center justify-center text-[#1A2B56] font-extrabold text-xs shrink-0">
                  {initials}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{task.reportedBy.name}</p>
                  {task.reportedBy.email && (
                    <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[11px]">mail</span>
                      {task.reportedBy.email}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Notes */}
            {task.notes && (
              <div className="space-y-2">
                <p className={SECTION_LABEL}>Notes</p>
                <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3.5">
                  <p className="text-sm text-slate-700 leading-relaxed">{task.notes}</p>
                </div>
              </div>
            )}

            {/* Timestamps */}
            <div className={INFO_CARD}>
              <InfoRow icon="add_circle" label="Created" value={formatDate(task.createdAt)} />
              <InfoRow icon="update"     label="Updated" value={formatDate(task.updatedAt)} />
            </div>
          </div>

          {/* ── Footer ── */}
          <div className="px-7 py-5 border-t border-slate-100 flex gap-3">
            {canAct ? (
              <>
                <button
                  type="button"
                  onClick={() => setShowReject(true)}
                  className="flex-1 py-3 rounded-xl border border-rose-200 text-rose-500 text-sm font-semibold hover:bg-rose-50 transition-colors"
                >
                  Reject
                </button>
                <button
                  type="button"
                  onClick={() => setShowApprove(true)}
                  className={BTN_PRIMARY}
                >
                  <span className="material-symbols-outlined text-base">check_circle</span>
                  Approve
                </button>
              </>
            ) : (
              <button type="button" onClick={onClose} className={BTN_PRIMARY}>
                Close
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Reject confirmation */}
      {showReject && (
        <ConfirmRejectModal
          ticketId={task.id}
          ticketTitle={task.title}
          imageUrl={task.imageUrl}
          onCancel={() => setShowReject(false)}
          onConfirm={(_reason) => { setShowReject(false); onClose(); }}
        />
      )}

      {/* Approve confirmation */}
      {showApprove && (
        <ConfirmApproveModal
          task={task}
          onCancel={() => setShowApprove(false)}
          onConfirm={() => { setShowApprove(false); onClose(); }}
        />
      )}
    </>
  );
};

export default TicketDetailModal;
