import React, { useState, useEffect, useRef } from 'react';

// ── Types ─────────────────────────────────────────────────────────────────────
interface ManualHandoverItem {
  id: string;
  icon: string;
  name: string;
  serial: string;
}

const EQUIPMENT_CATALOG: ManualHandoverItem[] = [
  { id: 'e1',  icon: 'laptop_mac',        name: 'MacBook Pro M2',           serial: 'AP-MB-2024-099' },
  { id: 'e2',  icon: 'tablet_mac',        name: 'iPad Pro 12.9"',           serial: 'AP-IPD-2023-021' },
  { id: 'e3',  icon: 'camera',            name: 'Canon EOS R6',             serial: 'CN-R6-2022-014' },
  { id: 'e4',  icon: 'desktop_windows',   name: 'Dell OptiPlex 3090',       serial: 'DL-OP-2023-041' },
  { id: 'e5',  icon: 'monitor',           name: 'Dell 27" 4K Monitor',      serial: 'DL-MN-2023-099' },
  { id: 'e6',  icon: 'videocam',          name: 'Sony A7 IV Camera',        serial: 'SNY-A7-2023-015' },
  { id: 'e7',  icon: 'mic',              name: 'Wireless Mic Set',         serial: 'MIC-WL-2022-028' },
  { id: 'e8',  icon: 'router',            name: 'Cisco Catalyst Switch',    serial: 'CC-SW-2022-011' },
  { id: 'e9',  icon: 'stylus_note',       name: 'Wacom Cintiq 22',         serial: 'WC-CQ-2022-012' },
  { id: 'e10', icon: 'flight',            name: 'DJI Mavic 3 Drone',        serial: 'DJI-M3-2023-009' },
];

const DEPARTMENTS = [
  'Arts & Design', 'Media Studies', 'Computer Engineering', 'Interaction Design',
  'Communications', 'Business Admin', 'Journalism', 'Graphic Design',
];

const DURATION_OPTIONS = ['1 Hour', '2 Hours', '4 Hours', '1 Day', '2 Days', '3 Days', '5 Days', '7 Days', '14 Days'];

type Step = 1 | 2 | 3;

interface FormData {
  recipientName: string;
  recipientId: string;
  department: string;
  email: string;
  designation: string;
  duration: string;
  purpose: string;
  selectedItems: string[]; // item ids
  notes: string;
}

const DEFAULT_FORM: FormData = {
  recipientName: '',
  recipientId: '',
  department: '',
  email: '',
  designation: '',
  duration: '',
  purpose: '',
  selectedItems: [],
  notes: '',
};

interface Props {
  onClose: () => void;
  onSubmit: (data: FormData) => void;
}

// ── Step indicator ────────────────────────────────────────────────────────────
const StepDot: React.FC<{ step: number; current: Step; label: string }> = ({ step, current, label }) => {
  const done   = current > step;
  const active = current === step;
  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold transition-all ${
        done   ? 'bg-emerald-500 text-white' :
        active ? 'bg-[#1A2B56] text-white shadow-lg shadow-[#1A2B56]/30' :
                 'bg-slate-100 text-slate-400'
      }`}>
        {done
          ? <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
          : step}
      </div>
      <span className={`text-[10px] font-bold whitespace-nowrap ${active ? 'text-[#1A2B56]' : 'text-slate-400'}`}>{label}</span>
    </div>
  );
};

// ── Main modal ────────────────────────────────────────────────────────────────
const ManualHandoverModal: React.FC<Props> = ({ onClose, onSubmit }) => {
  const [step, setStep]   = useState<Step>(1);
  const [form, setForm]   = useState<FormData>(DEFAULT_FORM);
  const [eqSearch, setEqSearch] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [onClose]);

  const set = (field: keyof FormData, val: string) =>
    setForm((f) => ({ ...f, [field]: val }));

  const toggleItem = (id: string) =>
    setForm((f) => ({
      ...f,
      selectedItems: f.selectedItems.includes(id)
        ? f.selectedItems.filter((x) => x !== id)
        : [...f.selectedItems, id],
    }));

  const filteredEquipment = EQUIPMENT_CATALOG.filter((e) =>
    !eqSearch || e.name.toLowerCase().includes(eqSearch.toLowerCase()) || e.serial.toLowerCase().includes(eqSearch.toLowerCase())
  );

  const selectedEquipment = EQUIPMENT_CATALOG.filter((e) => form.selectedItems.includes(e.id));

  // Validation per step
  const step1Valid = form.recipientName.trim().length > 0 && form.recipientId.trim().length > 0 && form.department.length > 0;
  const step2Valid = form.selectedItems.length > 0 && form.duration.length > 0 && form.purpose.trim().length > 0;

  const handleSubmit = () => { onSubmit(form); };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 bg-black/30 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        ref={modalRef}
        className="glass-card animate-in fade-in zoom-in-95 duration-200 w-full max-w-2xl rounded-[2rem] shadow-2xl shadow-[#1E2B58]/20 overflow-hidden flex flex-col"
        style={{ maxHeight: '92vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Top colour bar ── */}
        <div className="h-1 w-full bg-gradient-to-r from-[#1E2B58] via-blue-500 to-[#1E2B58]" />

        {/* ── Header ── */}
        <div className="px-8 pt-6 pb-5 border-b border-black/8 dark:border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl bg-[#1E2B58] flex items-center justify-center shadow-lg shadow-[#1E2B58]/20">
              <span className="material-symbols-outlined text-white text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                handshake
              </span>
            </div>
            <div>
              <p className="text-[0.625rem] font-black uppercase tracking-widest text-[#1E2B58]/50 dark:text-white/40 mb-0.5">New Record</p>
              <h2 className="text-lg font-extrabold text-[#1E2B58] dark:text-white">Manual Handover</h2>
              <p className="text-xs text-slate-400 font-medium">Create a new equipment handover record</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#1E2B58]/50 hover:text-[#1E2B58] hover:bg-[#1E2B58]/8 dark:text-white/50 dark:hover:text-white dark:hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* ── Step indicator ── */}
        <div className="px-8 py-5 flex items-center gap-0 shrink-0 bg-black/3 dark:bg-white/3 border-b border-black/8 dark:border-white/10">
          <StepDot step={1} current={step} label="Recipient" />
          <div className={`flex-1 h-0.5 mx-2 rounded-full transition-all ${step > 1 ? 'bg-emerald-400' : 'bg-slate-200'}`} />
          <StepDot step={2} current={step} label="Equipment" />
          <div className={`flex-1 h-0.5 mx-2 rounded-full transition-all ${step > 2 ? 'bg-emerald-400' : 'bg-slate-200'}`} />
          <StepDot step={3} current={step} label="Review" />
        </div>

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto px-8 py-6">

          {/* ──────────── Step 1: Recipient ──────────── */}
          {step === 1 && (
            <div className="space-y-5">
              <p className="text-[0.625rem] font-black text-[#1E2B58]/50 dark:text-white/40 uppercase tracking-widest mb-4">Recipient Information</p>

              <div className="grid grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#1E2B58]/60 dark:text-white/50">Full Name <span className="text-red-400">*</span></label>
                  <input
                    value={form.recipientName}
                    onChange={(e) => set('recipientName', e.target.value)}
                    placeholder="e.g. Dr. Sarah Jenkins"
                    className="w-full rounded-2xl border border-white/40 bg-white/40 px-4 py-2.5 text-sm font-medium text-[#1E2B58] dark:text-white outline-none transition-all placeholder:text-[#1E2B58]/30 dark:placeholder:text-white/30 focus:ring-2 focus:ring-[#1E2B58]/25 dark:border-slate-700/50 dark:bg-slate-800/50"
                  />
                </div>
                {/* ID */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#1E2B58]/60 dark:text-white/50">User ID <span className="text-red-400">*</span></label>
                  <input
                    value={form.recipientId}
                    onChange={(e) => set('recipientId', e.target.value)}
                    placeholder="e.g. FAC-1029 or STU-4402"
                    className="w-full rounded-2xl border border-white/40 bg-white/40 px-4 py-2.5 text-sm font-medium text-[#1E2B58] dark:text-white outline-none transition-all placeholder:text-[#1E2B58]/30 dark:placeholder:text-white/30 focus:ring-2 focus:ring-[#1E2B58]/25 dark:border-slate-700/50 dark:bg-slate-800/50"
                  />
                </div>
              </div>

              {/* Department */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1E2B58]/60 dark:text-white/50">Department <span className="text-red-400">*</span></label>
                <div className="flex flex-wrap gap-2">
                  {DEPARTMENTS.map((d) => {
                    const active = form.department === d;
                    return (
                      <button
                        key={d}
                        onClick={() => set('department', d)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                          active
                            ? 'bg-[#1E2B56] text-white border-[#1E2B56] shadow-sm dark:bg-white dark:text-[#1E2B56] dark:border-white'
                            : 'border-[#1E2B58]/15 dark:border-white/15 text-[#1E2B58]/70 dark:text-white/70 hover:bg-[#1E2B58]/5 dark:hover:bg-white/5'
                        }`}
                      >
                        {d}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#1E2B58]/60 dark:text-white/50">Email</label>
                  <input
                    value={form.email}
                    onChange={(e) => set('email', e.target.value)}
                    placeholder="e.g. name@fpt.edu.vn"
                    type="email"
                    className="w-full rounded-2xl border border-white/40 bg-white/40 px-4 py-2.5 text-sm font-medium text-[#1E2B58] dark:text-white outline-none transition-all placeholder:text-[#1E2B58]/30 dark:placeholder:text-white/30 focus:ring-2 focus:ring-[#1E2B58]/25 dark:border-slate-700/50 dark:bg-slate-800/50"
                  />
                </div>
                {/* Designation */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#1E2B58]/60 dark:text-white/50">Designation</label>
                  <input
                    value={form.designation}
                    onChange={(e) => set('designation', e.target.value)}
                    placeholder="e.g. Senior Lecturer"
                    className="w-full rounded-2xl border border-white/40 bg-white/40 px-4 py-2.5 text-sm font-medium text-[#1E2B58] dark:text-white outline-none transition-all placeholder:text-[#1E2B58]/30 dark:placeholder:text-white/30 focus:ring-2 focus:ring-[#1E2B58]/25 dark:border-slate-700/50 dark:bg-slate-800/50"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ──────────── Step 2: Equipment ──────────── */}
          {step === 2 && (
            <div className="space-y-5">
              <p className="text-[0.625rem] font-black text-[#1E2B58]/50 dark:text-white/40 uppercase tracking-widest mb-4">Equipment & Details</p>

              {/* Equipment search + picker */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#1E2B58]/60 dark:text-white/50">Select Equipment <span className="text-red-400">*</span></label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#1E2B58]/40 dark:text-white/40 text-base">search</span>
                  <input
                    value={eqSearch}
                    onChange={(e) => setEqSearch(e.target.value)}
                    placeholder="Search by name or serial..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-white/40 bg-white/40 text-sm font-medium text-[#1E2B58] dark:text-white outline-none transition-all placeholder:text-[#1E2B58]/30 dark:placeholder:text-white/30 focus:ring-2 focus:ring-[#1E2B58]/25 dark:border-slate-700/50 dark:bg-slate-800/50"
                  />
                </div>
                <div
                  className="rounded-2xl overflow-y-auto bg-white/40 dark:bg-slate-800/40"
                  style={{ maxHeight: '220px' }}
                >
                  {filteredEquipment.map((eq) => {
                    const selected = form.selectedItems.includes(eq.id);
                    return (
                      <div
                        key={eq.id}
                        onClick={() => toggleItem(eq.id)}
                        className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-all border-b border-black/5 dark:border-white/5 last:border-0 ${
                          selected ? 'bg-[#1E2B56]/8 dark:bg-white/8' : 'hover:bg-[#1E2B58]/4 dark:hover:bg-white/4'
                        }`}
                      >
                        <span className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                          selected ? 'bg-[#1E2B56] border-[#1E2B56] dark:bg-white dark:border-white' : 'border-[#1E2B58]/25 dark:border-white/25'
                        }`}>
                          {selected && (
                            <span className={`material-symbols-outlined text-[11px] ${selected ? 'text-white dark:text-[#1E2B58]' : ''}`} style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                          )}
                        </span>
                        <div className="w-8 h-8 rounded-lg bg-[#1E2B56]/8 dark:bg-white/10 flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-[#1E2B56] dark:text-white text-lg">{eq.icon}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[#1E2B56] dark:text-white truncate">{eq.name}</p>
                          <p className="text-[11px] text-slate-400">SN: {eq.serial}</p>
                        </div>
                      </div>
                    );
                  })}
                  {filteredEquipment.length === 0 && (
                    <div className="py-8 text-center text-slate-400 text-sm">No equipment found</div>
                  )}
                </div>
                {form.selectedItems.length > 0 && (
                  <p className="text-[11px] font-bold text-[#1E2B56] dark:text-white">
                    {form.selectedItems.length} item{form.selectedItems.length > 1 ? 's' : ''} selected
                  </p>
                )}
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#1E2B58]/60 dark:text-white/50">Duration <span className="text-red-400">*</span></label>
                <div className="flex flex-wrap gap-2">
                  {DURATION_OPTIONS.map((d) => {
                    const active = form.duration === d;
                    return (
                      <button
                        key={d}
                        onClick={() => set('duration', d)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                          active
                            ? 'bg-[#1E2B56] text-white border-[#1E2B56] shadow-sm dark:bg-white dark:text-[#1E2B56] dark:border-white'
                            : 'border-[#1E2B58]/15 dark:border-white/15 text-[#1E2B58]/70 dark:text-white/70 hover:bg-[#1E2B58]/5 dark:hover:bg-white/5'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[12px]">schedule</span>
                        {d}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Purpose */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1E2B58]/60 dark:text-white/50">Purpose <span className="text-red-400">*</span></label>
                <textarea
                  value={form.purpose}
                  onChange={(e) => set('purpose', e.target.value)}
                  placeholder="Briefly describe the purpose for this handover..."
                  rows={3}
                  className="w-full rounded-2xl border border-white/40 bg-white/40 px-4 py-3 text-sm font-medium text-[#1E2B58] dark:text-white outline-none transition-all placeholder:text-[#1E2B58]/30 dark:placeholder:text-white/30 focus:ring-2 focus:ring-[#1E2B58]/25 dark:border-slate-700/50 dark:bg-slate-800/50 resize-none"
                />
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1E2B58]/60 dark:text-white/50">Additional Notes <span className="text-slate-300">(optional)</span></label>
                <textarea
                  value={form.notes}
                  onChange={(e) => set('notes', e.target.value)}
                  placeholder="Any special instructions or conditions..."
                  rows={2}
                  className="w-full rounded-2xl border border-white/40 bg-white/40 px-4 py-3 text-sm font-medium text-[#1E2B58] dark:text-white outline-none transition-all placeholder:text-[#1E2B58]/30 dark:placeholder:text-white/30 focus:ring-2 focus:ring-[#1E2B58]/25 dark:border-slate-700/50 dark:bg-slate-800/50 resize-none"
                />
              </div>
            </div>
          )}

          {/* ──────────── Step 3: Review ──────────── */}
          {step === 3 && (
            <div className="space-y-5">
              <p className="text-[0.625rem] font-black text-[#1E2B58]/50 dark:text-white/40 uppercase tracking-widest mb-4">Review & Confirm</p>

              {/* Recipient summary */}
              <div className="bg-white/40 dark:bg-slate-800/40 rounded-[1.25rem] p-5">
                <p className="text-[0.625rem] font-black text-[#1E2B58]/50 dark:text-white/40 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">person</span>
                  Recipient
                </p>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-[#1E2B58]/10 dark:bg-white/10 flex items-center justify-center text-[#1E2B58] dark:text-white font-extrabold text-sm shrink-0">
                    {form.recipientName.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase() || '?'}
                  </div>
                  <div>
                    <p className="font-bold text-[#1E2B58] dark:text-white text-sm">{form.recipientName}</p>
                    <p className="text-[11px] text-slate-400">{form.department} · {form.recipientId}</p>
                  </div>
                </div>
                {form.email && (
                  <div className="flex justify-between text-xs border-t border-black/8 dark:border-white/8 pt-2">
                    <span className="text-[#1E2B58]/50 dark:text-white/50">Email</span>
                    <span className="font-semibold text-[#1E2B58] dark:text-white">{form.email}</span>
                  </div>
                )}
                {form.designation && (
                  <div className="flex justify-between text-xs pt-1">
                    <span className="text-[#1E2B58]/50 dark:text-white/50">Designation</span>
                    <span className="font-semibold text-[#1E2B58] dark:text-white">{form.designation}</span>
                  </div>
                )}
              </div>

              {/* Equipment summary */}
              <div className="bg-white/40 dark:bg-slate-800/40 rounded-[1.25rem] p-5">
                <p className="text-[0.625rem] font-black text-[#1E2B58]/50 dark:text-white/40 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">inventory_2</span>
                  Equipment ({selectedEquipment.length} item{selectedEquipment.length > 1 ? 's' : ''})
                </p>
                <div className="space-y-2">
                  {selectedEquipment.map((eq) => (
                    <div key={eq.id} className="flex items-center gap-3 bg-white/50 dark:bg-slate-700/30 rounded-xl px-3 py-2">
                      <div className="w-8 h-8 rounded-lg bg-[#1E2B58]/8 dark:bg-white/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[#1E2B58] dark:text-white text-base">{eq.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-[#1E2B58] dark:text-white truncate">{eq.name}</p>
                        <p className="text-[10px] text-slate-400">SN: {eq.serial}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Details summary */}
              <div className="bg-white/40 dark:bg-slate-800/40 rounded-[1.25rem] p-5 space-y-2">
                <p className="text-[0.625rem] font-black text-[#1E2B58]/50 dark:text-white/40 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">info</span>
                  Details
                </p>
                <div className="flex justify-between text-xs">
                  <span className="text-[#1E2B58]/50 dark:text-white/50">Duration</span>
                  <span className="font-bold text-[#1E2B58] dark:text-white flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px]">schedule</span>
                    {form.duration}
                  </span>
                </div>
                <div className="flex justify-between text-xs pt-1">
                  <span className="text-[#1E2B58]/50 dark:text-white/50">Purpose</span>
                  <span className="font-semibold text-[#1E2B58] dark:text-white max-w-[60%] text-right leading-relaxed">{form.purpose}</span>
                </div>
                {form.notes && (
                  <div className="flex justify-between text-xs pt-1">
                    <span className="text-[#1E2B58]/50 dark:text-white/50">Notes</span>
                    <span className="font-semibold text-[#1E2B58] dark:text-white max-w-[60%] text-right leading-relaxed">{form.notes}</span>
                  </div>
                )}
              </div>

              {/* Warning notice */}
              <div className="flex items-start gap-3 bg-amber-500/8 dark:bg-amber-500/10 border border-amber-500/20 rounded-2xl px-4 py-3">
                <span className="material-symbols-outlined text-amber-500 text-lg shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
                  warning
                </span>
                <p className="text-xs text-amber-700 dark:text-amber-400 font-medium leading-relaxed">
                  This will create a new handover record and notify the recipient. Please verify all details before confirming.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="px-8 py-5 border-t border-black/8 dark:border-white/10 flex items-center justify-between shrink-0 bg-black/3 dark:bg-white/3">
          <button
            onClick={step === 1 ? onClose : () => setStep((s) => (s - 1) as Step)}
            className="px-5 py-2.5 rounded-[1.25rem] border border-[#1E2B58]/15 dark:border-white/15 text-sm font-bold text-[#1E2B58]/70 dark:text-white/70 hover:bg-[#1E2B58]/5 dark:hover:bg-white/5 transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-base">chevron_left</span>
            {step === 1 ? 'Cancel' : 'Back'}
          </button>

          <div className="flex items-center gap-2">
            {([1, 2, 3] as const).map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all ${
                  s === step ? 'w-6 bg-[#1E2B56] dark:bg-white' : s < step ? 'w-3 bg-emerald-400' : 'w-3 bg-[#1E2B58]/15 dark:bg-white/15'
                }`}
              />
            ))}
          </div>

          {step < 3 ? (
            <button
              onClick={() => setStep((s) => (s + 1) as Step)}
              disabled={step === 1 ? !step1Valid : !step2Valid}
              className="px-5 py-2.5 rounded-[1.25rem] bg-[#1E2B58] text-white text-sm font-bold shadow-lg shadow-[#1E2B58]/20 hover:bg-[#151f40] hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all active:scale-95 flex items-center gap-2"
            >
              Next
              <span className="material-symbols-outlined text-base">chevron_right</span>
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-5 py-2.5 rounded-[1.25rem] bg-emerald-500 text-white text-sm font-bold shadow-lg shadow-emerald-500/25 hover:bg-emerald-600 hover:scale-[1.02] transition-all active:scale-95 flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              Create Handover
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManualHandoverModal;


