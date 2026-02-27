import React, { useState } from 'react';
import { MOCK_FULFILLMENTS, FulfillmentRequest } from '@/data/technician/mockHandover';

// ── Left list item ────────────────────────────────────────────────────────────
interface ListItemProps {
  req: FulfillmentRequest;
  isSelected: boolean;
  onClick: () => void;
}

const FulfillmentListItem: React.FC<ListItemProps> = ({ req, isSelected, onClick }) => (
  <div
    onClick={onClick}
    className={`p-4 rounded-2xl cursor-pointer transition-all ${
      isSelected
        ? 'bg-white border-2 border-[#1A2B56] shadow-sm'
        : 'bg-white/50 border border-slate-200 hover:border-[#1A2B56]/50'
    }`}
  >
    <div className="flex justify-between items-start mb-2">
      <span
        className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider ${
          isSelected
            ? 'bg-blue-100 text-blue-600'
            : 'bg-slate-100 text-slate-500'
        }`}
      >
        {req.id}
      </span>
      <span className="text-[10px] text-slate-400 font-bold">{req.time}</span>
    </div>
    <h4 className="text-sm font-bold text-slate-900">{req.borrowerName}</h4>
    <p className="text-xs text-slate-500 mb-3">{req.borrowerRole}</p>
    <div className="flex items-center gap-2">
      <span className="material-symbols-outlined text-slate-400 text-sm">inventory_2</span>
      <span className="text-xs font-semibold text-slate-600">{req.itemCount} Items Approved</span>
    </div>
  </div>
);

// ── Right detail panel ────────────────────────────────────────────────────────
const FulfillmentDetail: React.FC<{ req: FulfillmentRequest }> = ({ req }) => (
  <div
    className="rounded-3xl border border-white/50 shadow-2xl overflow-hidden"
    style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(24px)' }}
  >
    {/* Header */}
    <div className="p-8 border-b border-slate-200/50 bg-white/50">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#1A2B56] flex items-center justify-center text-white shadow-lg">
            <span className="material-symbols-outlined text-3xl">handshake</span>
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-[#1A2B56]">Handover Fulfillment</h2>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
              Reference: {req.id}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Status</p>
          <span className="inline-flex items-center gap-1.5 text-blue-600 font-bold text-sm">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            Ready for Distribution
          </span>
        </div>
      </div>
    </div>

    {/* Body */}
    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* Left column */}
      <div className="space-y-6">
        {/* Recipient info */}
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-3">
            Recipient Information
          </label>
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-[#1A2B56]/10 flex items-center justify-center text-[#1A2B56] font-extrabold text-sm border-2 border-white">
                {req.recipient.name
                  .split(' ')
                  .slice(0, 2)
                  .map((w) => w[0])
                  .join('')
                  .toUpperCase()}
              </div>
              <div>
                <h4 className="font-bold text-slate-900">{req.recipient.name}</h4>
                <p className="text-xs text-slate-500">ID: {req.recipient.userId}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Department</span>
                <span className="font-bold text-slate-700">{req.recipient.department}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Designation</span>
                <span className="font-bold text-slate-700">{req.recipient.designation}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Equipment items */}
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-3">
            Equipment Items
          </label>
          <div className="space-y-3">
            {req.items.map((item) => (
              <div
                key={item.serial}
                className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center">
                    <span className="material-symbols-outlined text-slate-500 text-xl">{item.icon}</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{item.name}</p>
                    <p className="text-[10px] text-slate-500">SN: {item.serial}</p>
                  </div>
                </div>
                <button className="bg-slate-100 hover:bg-[#1A2B56] hover:text-white px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all">
                  INSPECT
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right column — signatures */}
      <div className="space-y-6">
        {/* Technician signature */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Technician Signature
            </label>
            <button className="text-[10px] font-bold text-[#1A2B56] hover:underline">Clear Pad</button>
          </div>
          <div
            className="h-40 bg-white border border-slate-200 rounded-2xl flex items-center justify-center relative overflow-hidden"
            style={{
              backgroundImage: 'radial-gradient(rgba(0,0,0,0.05) 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          >
            <span className="material-symbols-outlined absolute text-slate-200 text-6xl select-none">draw</span>
            <p className="text-[10px] text-slate-300 font-medium relative z-10">Marcus Thorne</p>
          </div>
        </div>

        {/* Recipient signature */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Recipient Signature
            </label>
            <button className="text-[10px] font-bold text-[#1A2B56] hover:underline">Clear Pad</button>
          </div>
          <div
            className="h-40 bg-white border border-slate-200 rounded-2xl flex items-center justify-center relative overflow-hidden"
            style={{
              backgroundImage: 'radial-gradient(rgba(0,0,0,0.05) 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          >
            <p className="text-[10px] text-slate-300 font-medium italic">Waiting for recipient to sign...</p>
          </div>
        </div>

        {/* Confirm button */}
        <div className="pt-4">
          <button className="w-full bg-[#1A2B56] hover:bg-slate-900 text-white py-4 rounded-2xl flex items-center justify-center gap-3 font-extrabold text-sm shadow-2xl shadow-[#1A2B56]/30 transition-all active:scale-95 group">
            Confirm Physical Handover
            <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">
              verified_user
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
);

// ── Tab component ─────────────────────────────────────────────────────────────
const HandoverTab: React.FC = () => {
  const [selectedId, setSelectedId] = useState(MOCK_FULFILLMENTS[0].id);
  const selected = MOCK_FULFILLMENTS.find((r) => r.id === selectedId) ?? MOCK_FULFILLMENTS[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left list */}
      <div
        className="lg:col-span-4 rounded-3xl border border-white/50 shadow-xl overflow-hidden flex flex-col h-[700px]"
        style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(24px)' }}
      >
        <div className="p-6 border-b border-slate-200/50">
          <h3 className="text-lg font-bold text-[#1A2B56] flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-500">pending_actions</span>
            Approved for Pickup
          </h3>
          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-1">
            Select a request to fulfill
          </p>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {MOCK_FULFILLMENTS.map((req) => (
            <FulfillmentListItem
              key={req.id}
              req={req}
              isSelected={req.id === selectedId}
              onClick={() => setSelectedId(req.id)}
            />
          ))}
        </div>
      </div>

      {/* Right detail */}
      <div className="lg:col-span-8">
        <FulfillmentDetail req={selected} />
      </div>
    </div>
  );
};

export default HandoverTab;
