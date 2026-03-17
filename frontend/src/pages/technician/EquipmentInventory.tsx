import React, { useState, useMemo } from 'react';
import {
  MOCK_ASSETS,
} from '@/data/technician/mockEquipment';
import type { AssetCategory, Asset } from '@/data/technician/mockEquipment';
import EquipmentSidebar from '@/components/technician/equipment/EquipmentSidebar';
import AssetGrid from '@/components/technician/equipment/AssetGrid';
import AssetPagination from '@/components/technician/equipment/AssetPagination';
import AssetDetailModal from '@/components/technician/equipment/AssetDetailModal';
import AssetEditModal from '@/components/technician/equipment/AssetEditModal';
import AddEquipmentModal from '@/components/technician/equipment/AddEquipmentModal';
import { PageHeader } from '@/components/shared/PageHeader';

const ITEMS_PER_PAGE = 6;
const STORAGE_PERCENTAGE = 92;

type ModalState =
  | { type: 'none' }
  | { type: 'detail'; asset: Asset }
  | { type: 'edit';   asset: Asset }
  | { type: 'add' }
  | { type: 'success'; asset: Asset };

const EquipmentInventory: React.FC = () => {
  const [assets, setAssets]                 = useState<Asset[]>([...MOCK_ASSETS]);
  const [activeCategory, setActiveCategory] = useState<AssetCategory>('All Assets');
  const [currentPage, setCurrentPage]       = useState(1);
  const [modal, setModal]                   = useState<ModalState>({ type: 'none' });
  const [searchQuery, setSearchQuery]       = useState('');

  // ── Derived list ────────────────────────────────────────────────────────────
  const allForCategory = useMemo(() => {
    const byCategory =
      activeCategory === 'All Assets'
        ? assets
        : assets.filter((a) => a.category === activeCategory);
    if (!searchQuery.trim()) return byCategory;
    const q = searchQuery.trim().toLowerCase();
    return byCategory.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.id.toLowerCase().includes(q) ||
        a.serial.toLowerCase().includes(q) ||
        (a.location ?? '').toLowerCase().includes(q),
    );
  }, [assets, activeCategory, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(allForCategory.length / ITEMS_PER_PAGE));
  const safePage   = Math.min(currentPage, totalPages);
  const paged      = allForCategory.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE,
  );

  const totalCount =
    activeCategory === 'All Assets'
      ? assets.length
      : allForCategory.length;

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const handleCategorySelect = (cat: AssetCategory) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  const handleAssetClick = (asset: Asset) =>
    setModal({ type: 'detail', asset });

  const handleEditOpen = (asset: Asset) =>
    setModal({ type: 'edit', asset });

  const handleSave = (updated: Asset) => {
    setAssets((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    setModal({ type: 'none' });
  };

  const handleAdd = (newAsset: Asset) => {
    setAssets((prev) => [newAsset, ...prev]);
    setActiveCategory('All Assets');
    setCurrentPage(1);
    setModal({ type: 'success', asset: newAsset });
  };

  const closeModal = () => setModal({ type: 'none' });

  return (
    <div className="pt-6 sm:pt-8 pb-16 px-6 max-w-7xl mx-auto">

      {/* Page header — centered */}
      <PageHeader
        title="Asset Inventory"
        subtitle="Manage and monitor technical equipment fleet"
      />

      <div className="flex flex-col md:flex-row gap-8">

        {/* Sidebar */}
        <EquipmentSidebar
          activeCategory={activeCategory}
          storagePercentage={STORAGE_PERCENTAGE}
          onCategorySelect={handleCategorySelect}
        />

        {/* Main content */}
        <div className="flex-1 space-y-8">
          {/* Toolbar: search + add */}
          <div className="flex items-center gap-3 justify-end">
            {/* Search bar */}
            <div className="relative flex-1 max-w-sm">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#232F58]/50 dark:text-slate-400 text-[20px] pointer-events-none">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                placeholder="Search by name, ID, serial, location…"
                className="w-full pl-10 pr-9 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#232F58]/30 dark:focus:ring-blue-500/40 transition"
              />
              {searchQuery && (
                <button
                  onClick={() => { setSearchQuery(''); setCurrentPage(1); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                  aria-label="Clear search"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              )}
            </div>

            {/* Add button */}
            <button
              onClick={() => setModal({ type: 'add' })}
              className="flex items-center justify-center gap-2 px-6 py-3.5 bg-[#232F58] text-white rounded-2xl text-sm font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-xl">add</span>
              Add New Device
            </button>
          </div>

          {/* Asset grid */}
          <AssetGrid assets={paged} onAssetClick={handleAssetClick} />

          {/* Pagination */}
          <AssetPagination
            currentPage={safePage}
            totalPages={totalPages}
            visibleCount={paged.length}
            totalCount={totalCount}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {/* ── Modals ─────────────────────────────────────────────────────────── */}
      {modal.type === 'detail' && (
        <AssetDetailModal
          asset={modal.asset}
          onClose={closeModal}
          onEdit={handleEditOpen}
        />
      )}

      {modal.type === 'edit' && (
        <AssetEditModal
          asset={modal.asset}
          onClose={closeModal}
          onSave={handleSave}
        />
      )}

      {modal.type === 'add' && (
        <AddEquipmentModal
          onClose={closeModal}
          onAdd={handleAdd}
        />
      )}

      {modal.type === 'success' && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 bg-black/30 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            className="relative dashboard-card rounded-4xl shadow-2xl shadow-[#1E2B58]/20 p-8 flex flex-col items-center gap-5 w-full max-w-sm animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-[#1E2B58]/50 hover:text-[#1E2B58] hover:bg-[#1E2B58]/8 dark:text-white/50 dark:hover:text-white dark:hover:bg-white/10 transition-colors"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>

            {/* Animated checkmark */}
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <div className="w-11 h-11 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <span className="material-symbols-outlined text-white text-2xl">check</span>
              </div>
            </div>

            {/* Text */}
            <div className="text-center space-y-1">
              <p className="text-[0.625rem] font-black uppercase tracking-widest text-[#1E2B58]/50 dark:text-white/40">Success</p>
              <h3 className="text-xl font-extrabold text-[#1E2B58] dark:text-white">Device Added!</h3>
              <p className="text-sm text-slate-400">
                <span className="font-semibold text-[#1E2B58] dark:text-white">{modal.asset.name}</span> has been registered.
              </p>
            </div>

            {/* Asset summary pill */}
            <div className="w-full flex items-center gap-3 px-4 py-3 rounded-[1.25rem] bg-white/40 dark:bg-slate-800/40">
              <div className="w-10 h-10 rounded-xl bg-[#1E2B58]/8 dark:bg-white/10 flex items-center justify-center shrink-0">
                {modal.asset.imageUrl ? (
                  <img src={modal.asset.imageUrl} alt={modal.asset.name} className="w-10 h-10 rounded-xl object-cover" />
                ) : (
                  <span className="material-symbols-outlined text-[#1E2B58] dark:text-white text-xl">{modal.asset.icon}</span>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-extrabold text-[#1E2B58] dark:text-white truncate">{modal.asset.name}</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-wide">{modal.asset.serial} · {modal.asset.category}</p>
              </div>
              <span className="ml-auto shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                {modal.asset.status}
              </span>
            </div>

            {/* Action buttons */}
            <div className="w-full flex gap-3">
              <button
                onClick={closeModal}
                className="flex-1 py-3 rounded-[1.25rem] border border-[#1E2B58]/15 dark:border-white/15 text-sm font-bold text-[#1E2B58]/70 dark:text-white/70 hover:bg-[#1E2B58]/5 dark:hover:bg-white/5 transition-all"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const asset = modal.asset;
                  closeModal();
                  setTimeout(() => setModal({ type: 'detail', asset }), 100);
                }}
                className="flex-1 py-3 rounded-[1.25rem] bg-[#1E2B58] text-white text-sm font-bold hover:bg-[#151f40] hover:scale-[1.02] active:scale-95 shadow-lg shadow-[#1E2B58]/20 transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-base">visibility</span>
                View Device
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EquipmentInventory;

