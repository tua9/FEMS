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
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        ref={modalRef}
        className="w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        style={{
          background: 'rgba(255,255,255,0.98)',
          border: '1px solid rgba(255,255,255,0.5)',
          maxHeight: '92vh',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Top colour bar ── */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#1A2B56] via-blue-500 to-[#1A2B56]" />

        {/* ── Header ── */}
        <div className="px-8 pt-6 pb-5 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl bg-[#1A2B56] flex items-center justify-center shadow-lg shadow-[#1A2B56]/20">
              <span className="material-symbols-outlined text-white text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                handshake
              </span>
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-[#1A2B56]">Manual Handover</h2>
              <p className="text-xs text-slate-400 font-medium">Create a new equipment handover record</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* ── Step indicator ── */}
        <div className="px-8 py-5 flex items-center gap-0 flex-shrink-0 bg-slate-50/60">
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
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Recipient Information</p>

              <div className="grid grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500">Full Name <span className="text-red-400">*</span></label>
                  <input
                    value={form.recipientName}
                    onChange={(e) => set('recipientName', e.target.value)}
                    placeholder="e.g. Dr. Sarah Jenkins"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1A2B56]/20 focus:border-[#1A2B56]/40 transition"
                  />
                </div>
                {/* ID */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500">User ID <span className="text-red-400">*</span></label>
                  <input
                    value={form.recipientId}
                    onChange={(e) => set('recipientId', e.target.value)}
                    placeholder="e.g. FAC-1029 or STU-4402"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1A2B56]/20 focus:border-[#1A2B56]/40 transition"
                  />
                </div>
              </div>

              {/* Department */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500">Department <span className="text-red-400">*</span></label>
                <div className="flex flex-wrap gap-2">
                  {DEPARTMENTS.map((d) => {
                    const active = form.department === d;
                    return (
                      <button
                        key={d}
                        onClick={() => set('department', d)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                          active
                            ? 'bg-[#1A2B56] text-white border-[#1A2B56] shadow-sm'
                            : 'border-slate-200 text-slate-600 hover:border-[#1A2B56]/40 hover:bg-slate-50'
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
                  <label className="text-xs font-bold text-slate-500">Email</label>
                  <input
                    value={form.email}
                    onChange={(e) => set('email', e.target.value)}
                    placeholder="e.g. name@fpt.edu.vn"
                    type="email"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1A2B56]/20 focus:border-[#1A2B56]/40 transition"
                  />
                </div>
                {/* Designation */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500">Designation</label>
                  <input
                    value={form.designation}
                    onChange={(e) => set('designation', e.target.value)}
                    placeholder="e.g. Senior Lecturer"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1A2B56]/20 focus:border-[#1A2B56]/40 transition"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ──────────── Step 2: Equipment ──────────── */}
          {step === 2 && (
            <div className="space-y-5">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Equipment & Details</p>

              {/* Equipment search + picker */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500">Select Equipment <span className="text-red-400">*</span></label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base">search</span>
                  <input
                    value={eqSearch}
                    onChange={(e) => setEqSearch(e.target.value)}
                    placeholder="Search by name or serial..."
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1A2B56]/20 focus:border-[#1A2B56]/40 transition"
                  />
                </div>
                <div
                  className="border border-slate-200 rounded-2xl overflow-y-auto"
                  style={{ maxHeight: '220px' }}
                >
                  {filteredEquipment.map((eq) => {
                    const selected = form.selectedItems.includes(eq.id);
                    return (
                      <div
                        key={eq.id}
                        onClick={() => toggleItem(eq.id)}
                        className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-all border-b border-slate-100 last:border-0 ${
                          selected ? 'bg-[#1A2B56]/5' : 'hover:bg-slate-50'
                        }`}
                      >
                        <span className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                          selected ? 'bg-[#1A2B56] border-[#1A2B56]' : 'border-slate-300'
                        }`}>
                          {selected && (
                            <span className="material-symbols-outlined text-white text-[11px]" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                          )}
                        </span>
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                          <span className="material-symbols-outlined text-slate-500 text-lg">{eq.icon}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-800 truncate">{eq.name}</p>
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
                  <p className="text-[11px] font-bold text-[#1A2B56]">
                    {form.selectedItems.length} item{form.selectedItems.length > 1 ? 's' : ''} selected
                  </p>
                )}
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500">Duration <span className="text-red-400">*</span></label>
                <div className="flex flex-wrap gap-2">
                  {DURATION_OPTIONS.map((d) => {
                    const active = form.duration === d;
                    return (
                      <button
                        key={d}
                        onClick={() => set('duration', d)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                          active
                            ? 'bg-[#1A2B56] text-white border-[#1A2B56] shadow-sm'
                            : 'border-slate-200 text-slate-600 hover:border-[#1A2B56]/40 hover:bg-slate-50'
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
                <label className="text-xs font-bold text-slate-500">Purpose <span className="text-red-400">*</span></label>
                <textarea
                  value={form.purpose}
                  onChange={(e) => set('purpose', e.target.value)}
                  placeholder="Briefly describe the purpose for this handover..."
                  rows={3}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1A2B56]/20 focus:border-[#1A2B56]/40 transition resize-none"
                />
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500">Additional Notes <span className="text-slate-300">(optional)</span></label>
                <textarea
                  value={form.notes}
                  onChange={(e) => set('notes', e.target.value)}
                  placeholder="Any special instructions or conditions..."
                  rows={2}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1A2B56]/20 focus:border-[#1A2B56]/40 transition resize-none"
                />
              </div>
            </div>
          )}

          {/* ──────────── Step 3: Review ──────────── */}
          {step === 3 && (
            <div className="space-y-5">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Review & Confirm</p>

              {/* Recipient summary */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">person</span>
                  Recipient
                </p>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-[#1A2B56]/10 flex items-center justify-center text-[#1A2B56] font-extrabold text-sm flex-shrink-0">
                    {form.recipientName.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase() || '?'}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{form.recipientName}</p>
                    <p className="text-[11px] text-slate-500">{form.department} · {form.recipientId}</p>
                  </div>
                </div>
                {form.email && (
                  <div className="flex justify-between text-xs border-t border-slate-200 pt-2">
                    <span className="text-slate-400">Email</span>
                    <span className="font-semibold text-slate-700">{form.email}</span>
                  </div>
                )}
                {form.designation && (
                  <div className="flex justify-between text-xs pt-1">
                    <span className="text-slate-400">Designation</span>
                    <span className="font-semibold text-slate-700">{form.designation}</span>
                  </div>
                )}
              </div>

              {/* Equipment summary */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">inventory_2</span>
                  Equipment ({selectedEquipment.length} item{selectedEquipment.length > 1 ? 's' : ''})
                </p>
                <div className="space-y-2">
                  {selectedEquipment.map((eq) => (
                    <div key={eq.id} className="flex items-center gap-3 bg-white rounded-xl px-3 py-2 border border-slate-100">
                      <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                        <span className="material-symbols-outlined text-slate-500 text-base">{eq.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-800 truncate">{eq.name}</p>
                        <p className="text-[10px] text-slate-400">SN: {eq.serial}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Details summary */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-2">
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">info</span>
                  Details
                </p>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Duration</span>
                  <span className="font-bold text-slate-700 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px]">schedule</span>
                    {form.duration}
                  </span>
                </div>
                <div className="flex justify-between text-xs pt-1">
                  <span className="text-slate-400">Purpose</span>
                  <span className="font-semibold text-slate-700 max-w-[60%] text-right leading-relaxed">{form.purpose}</span>
                </div>
                {form.notes && (
                  <div className="flex justify-between text-xs pt-1">
                    <span className="text-slate-400">Notes</span>
                    <span className="font-semibold text-slate-700 max-w-[60%] text-right leading-relaxed">{form.notes}</span>
                  </div>
                )}
              </div>

              {/* Warning notice */}
              <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3">
                <span className="material-symbols-outlined text-amber-500 text-lg flex-shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
                  warning
                </span>
                <p className="text-xs text-amber-700 font-medium leading-relaxed">
                  This will create a new handover record and notify the recipient. Please verify all details before confirming.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="px-8 py-5 border-t border-slate-100 flex items-center justify-between flex-shrink-0 bg-slate-50/40">
          <button
            onClick={step === 1 ? onClose : () => setStep((s) => (s - 1) as Step)}
            className="px-5 py-2.5 rounded-2xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-white hover:border-slate-300 transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-base">chevron_left</span>
            {step === 1 ? 'Cancel' : 'Back'}
          </button>

          <div className="flex items-center gap-2">
            {([1, 2, 3] as const).map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all ${
                  s === step ? 'w-6 bg-[#1A2B56]' : s < step ? 'w-3 bg-emerald-400' : 'w-3 bg-slate-200'
                }`}
              />
            ))}
          </div>

          {step < 3 ? (
            <button
              onClick={() => setStep((s) => (s + 1) as Step)}
              disabled={step === 1 ? !step1Valid : !step2Valid}
              className="px-5 py-2.5 rounded-2xl bg-[#1A2B56] text-white text-sm font-bold shadow-lg shadow-[#1A2B56]/20 hover:bg-[#14203f] disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95 flex items-center gap-2"
            >
              Next
              <span className="material-symbols-outlined text-base">chevron_right</span>
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-5 py-2.5 rounded-2xl bg-emerald-500 text-white text-sm font-bold shadow-lg shadow-emerald-500/25 hover:bg-emerald-600 transition-all active:scale-95 flex items-center gap-2"
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
