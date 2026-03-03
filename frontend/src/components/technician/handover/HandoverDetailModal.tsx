import React from 'react';
import { HandoverItem, TimelineEvent } from '@/data/technician/mockHandover';
import {
  MODAL_OVERLAY, MODAL_CARD, CLOSE_BTN,
  BTN_PRIMARY, SECTION_LABEL, INFO_CARD, CHIP,
} from '@/components/technician/common/modalStyles';

// ── Unified record shape ──────────────────────────────────────────────────────
export interface HandoverDetailRecord {
  id: string;
  title: string;
  badge?: { label: string; className: string };
  person: {
    name: string;
    sub: string;
    initials: string;
    avatarBg?: string;
    avatarColor?: string;
    email?: string;
  };
  meta: { label: string; value: string; icon?: string }[];
  items?: HandoverItem[];
  timeline?: TimelineEvent[];
  notes?: string;
}

interface Props {
  record: HandoverDetailRecord;
  onClose: () => void;
}

// ── Section wrapper ───────────────────────────────────────────────────────────
const Section: React.FC<{ title: string; icon: string; children: React.ReactNode }> = ({ title, icon, children }) => (
  <div>
    <div className="flex items-center gap-2 mb-3">
      <span className="material-symbols-outlined text-slate-400 text-base">{icon}</span>
      <p className={SECTION_LABEL}>{title}</p>
    </div>
    {children}
  </div>
);

const HandoverDetailModal: React.FC<Props> = ({ record, onClose }) => (
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
              record.person.avatarBg ?? 'bg-[#1A2B56]/10'
            } ${record.person.avatarColor ?? 'text-[#1A2B56]'}`}
          >
            {record.person.initials}
          </div>
          <div>
            <h2 className="text-base font-extrabold text-[#1A2B56] leading-tight">{record.person.name}</h2>
            <p className="text-xs text-slate-500 mt-0.5">{record.person.sub}</p>
            {record.person.email && (
              <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
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
          <button onClick={onClose} className={CLOSE_BTN}>
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>
      </div>

      {/* Reference ID chip */}
      <div className="px-7 pb-4">
        <span className={`${CHIP} bg-slate-100 text-slate-500 font-mono`}>{record.id}</span>
      </div>

      <div className="mx-7 border-t border-slate-100" />

      {/* ── Scrollable body ── */}
      <div className="px-7 py-6 overflow-y-auto flex-1 space-y-6">

        {/* Meta grid */}
        {record.meta.length > 0 && (
          <Section title="Details" icon="info">
            <div className="grid grid-cols-2 gap-3">
              {record.meta.map((m) => (
                <div key={m.label} className={INFO_CARD}>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                    {m.icon && <span className="material-symbols-outlined text-[11px]">{m.icon}</span>}
                    {m.label}
                  </p>
                  <p className="text-sm font-bold text-slate-800 leading-tight">{m.value}</p>
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
                <div key={i} className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-slate-500 text-xl">{item.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">{item.name}</p>
                    <p className="text-[10px] text-slate-500 font-mono">SN: {item.serial}</p>
                  </div>
                  {item.condition && (
                    <span className={`${CHIP} bg-white border border-slate-200 text-slate-500 shrink-0`}>
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
              <div className="absolute left-2 top-2 bottom-2 w-px bg-slate-200" />
              <div className="space-y-5">
                {record.timeline.map((ev, i) => (
                  <div key={i} className="relative flex items-start gap-3">
                    <div
                      className={`absolute -left-3 w-3 h-3 rounded-full border-2 border-white mt-0.5 shrink-0 ${
                        ev.done ? 'bg-[#1A2B56]' : 'bg-slate-200'
                      }`}
                    />
                    <div className="pl-2">
                      <p className={`text-xs font-bold ${ev.done ? 'text-slate-800' : 'text-slate-400'}`}>{ev.label}</p>
                      {ev.sub && <p className="text-[10px] text-slate-400 mt-0.5">{ev.sub}</p>}
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">{ev.date}</p>
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
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-sm text-slate-700 leading-relaxed">{record.notes}</p>
            </div>
          </Section>
        )}
      </div>

      {/* ── Footer ── */}
      <div className="px-7 py-5 border-t border-slate-100">
        <button onClick={onClose} className={BTN_PRIMARY}>
          Close
        </button>
      </div>
    </div>
  </div>
);

export default HandoverDetailModal;
