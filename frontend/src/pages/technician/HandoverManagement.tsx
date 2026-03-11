import React, { useState, useEffect } from 'react';
import { HandoverTab as HandoverTabType } from '@/data/technician/mockHandover';
import HandoverTabBar from '@/components/technician/handover/HandoverTabBar';
import RequestsTab from '@/components/technician/handover/RequestsTab';
import HandoverTab from '@/components/technician/handover/HandoverTab';
import CollectTab from '@/components/technician/handover/CollectTab';
import HistoryTab from '@/components/technician/handover/HistoryTab';
import ManualHandoverModal from '@/components/technician/handover/ManualHandoverModal';
import { PageHeader } from '@/components/shared/PageHeader';

// ── Per-tab description ───────────────────────────────────────────────────────
const TAB_SUBTITLE: Record<HandoverTabType, string> = {
  Requests: 'Review and process incoming equipment requests from staff and students.',
  Handover: 'Fulfill approved equipment requests and document physical distribution.',
  Collect:  'Track active loans and manage equipment returns for students and faculty.',
  History:  'A complete audit trail of all equipment transactions, including handovers, returns, and rejected items.',
};

// ── Main page ─────────────────────────────────────────────────────────────────
const HandoverManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<HandoverTabType>('Requests');
  const [showManualModal, setShowManualModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Auto-dismiss toast after 3.5 s
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  const handleManualSubmit = (data: { recipientName: string; selectedItems: string[] }) => {
    setShowManualModal(false);
    setToast(`Handover created for ${data.recipientName} · ${data.selectedItems.length} item${data.selectedItems.length > 1 ? 's' : ''}`);
  };

  return (
    <div className="pt-6 sm:pt-8 pb-16 px-6 max-w-7xl mx-auto">

      {/* ── Page Header ── */}
      <PageHeader
        title="Handover Management"
        subtitle={TAB_SUBTITLE[activeTab]}
      />

      {/* ── Tab bar — always centered, always same position ── */}
      <HandoverTabBar active={activeTab} onChange={setActiveTab} />

      {/* ── Action bar — only visible on Handover tab ── */}
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          maxHeight: activeTab === 'Handover' ? '80px' : '0px',
          opacity:   activeTab === 'Handover' ? 1 : 0,
        }}
      >
        <div className="flex items-center justify-between px-1 pt-1 pb-5">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm font-medium">
            <span className="material-symbols-outlined text-slate-400 text-base">swap_horiz</span>
            Pending fulfillments ready to process
          </div>
          <button
            onClick={() => setShowManualModal(true)}
            className="bg-[#1A2B56] hover:bg-[#14203f] text-white px-5 py-2.5 rounded-2xl flex items-center gap-2 font-bold text-sm shadow-lg shadow-[#1A2B56]/20 transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-base">add_circle</span>
            Manual Handover
          </button>
        </div>
      </div>

      {/* ── Tab content ── */}
      <div>
        {activeTab === 'Requests' && <RequestsTab />}
        {activeTab === 'Handover' && <HandoverTab />}
        {activeTab === 'Collect'  && <CollectTab />}
        {activeTab === 'History'  && <HistoryTab />}
      </div>

      {/* ── Manual Handover modal ── */}
      {showManualModal && (
        <ManualHandoverModal
          onClose={() => setShowManualModal(false)}
          onSubmit={handleManualSubmit}
        />
      )}

      {/* ── Success toast ── */}
      {toast && (
        <div
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl shadow-emerald-500/20 text-sm font-semibold text-white"
          style={{
            background: 'linear-gradient(135deg, #1A2B56 0%, #233d8f 100%)',
            border: '1px solid rgba(255,255,255,0.15)',
            backdropFilter: 'blur(10px)',
            animation: 'slideUpFade 0.3s ease-out',
          }}
        >
          <span
            className="material-symbols-outlined text-emerald-400 text-xl flex-shrink-0"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            check_circle
          </span>
          {toast}
          <button onClick={() => setToast(null)} className="ml-2 text-white/60 hover:text-white transition-colors">
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default HandoverManagement;
