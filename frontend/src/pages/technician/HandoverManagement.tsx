import React, { useState } from 'react';
import { HandoverTab as HandoverTabType } from '@/data/technician/mockHandover';
import HandoverTabBar from '@/components/technician/handover/HandoverTabBar';
import RequestsTab from '@/components/technician/handover/RequestsTab';
import HandoverTab from '@/components/technician/handover/HandoverTab';
import CollectTab from '@/components/technician/handover/CollectTab';
import HistoryTab from '@/components/technician/handover/HistoryTab';

// ── Per-tab page header ────────────────────────────────────────────────────────
const HEADER: Record<
  HandoverTabType,
  { title: string; subtitle: string; centered: boolean; action?: React.ReactNode }
> = {
  Requests: {
    title: 'Handover Management',
    subtitle: 'Review and process incoming equipment requests from staff and students.',
    centered: true,
  },
  Handover: {
    title: 'Handover Management',
    subtitle: 'Fulfill approved equipment requests and document physical distribution.',
    centered: false,
    action: (
      <button className="bg-[#1A2B56] hover:bg-slate-900 text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-bold text-sm shadow-xl shadow-[#1A2B56]/20 transition-all active:scale-95">
        <span className="material-symbols-outlined text-lg">add_circle</span>
        Manual Handover
      </button>
    ),
  },
  Collect: {
    title: 'Handover Management',
    subtitle: 'Track active loans and manage equipment returns for students and faculty.',
    centered: true,
  },
  History: {
    title: 'Handover — Audit & History Log',
    subtitle:
      'A complete audit trail of all equipment transactions, including handovers, returns, and rejected items.',
    centered: true,
  },
};

// ── Main page ─────────────────────────────────────────────────────────────────
const HandoverManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<HandoverTabType>('Requests');
  const hdr = HEADER[activeTab];

  return (
    <div className="pt-32 pb-16 px-6 max-w-7xl mx-auto">
      {/* Page header */}
      {hdr.centered ? (
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#1A2B56] mb-3">{hdr.title}</h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-sm md:text-base font-medium">{hdr.subtitle}</p>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#1A2B56] mb-3">{hdr.title}</h1>
            <p className="text-slate-600 text-sm md:text-base font-medium">{hdr.subtitle}</p>
          </div>
          {hdr.action}
        </div>
      )}

      {/* Tab switcher */}
      <HandoverTabBar active={activeTab} onChange={setActiveTab} />

      {/* Tab content */}
      {activeTab === 'Requests' && <RequestsTab />}
      {activeTab === 'Handover' && <HandoverTab />}
      {activeTab === 'Collect'  && <CollectTab />}
      {activeTab === 'History'  && <HistoryTab />}
    </div>
  );
};

export default HandoverManagement;
