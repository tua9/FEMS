import React, { useState } from 'react';
import {
  CATEGORY_META,
  AssetCategory,
  Asset,
  MOCK_ASSETS,
  getAssetsByCategory,
} from '@/data/technician/mockEquipment';
import EquipmentSidebar from '@/components/technician/equipment/EquipmentSidebar';
import AssetGrid from '@/components/technician/equipment/AssetGrid';
import AssetPagination from '@/components/technician/equipment/AssetPagination';
import AssetDetailModal from '@/components/technician/equipment/AssetDetailModal';
import AssetEditModal from '@/components/technician/equipment/AssetEditModal';
import AddEquipmentModal from '@/components/technician/equipment/AddEquipmentModal';

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

  // ── Derived list ────────────────────────────────────────────────────────────
  const allForCategory =
    activeCategory === 'All Assets'
      ? assets
      : assets.filter((a) => a.category === activeCategory);

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
    <div className="pt-32 pb-16 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8">

        {/* Sidebar */}
        <EquipmentSidebar
          activeCategory={activeCategory}
          storagePercentage={STORAGE_PERCENTAGE}
          onCategorySelect={handleCategorySelect}
        />

        {/* Main content */}
        <div className="flex-1 space-y-8">
          {/* Page header */}
          <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-1">
              <h1 className="text-3xl font-extrabold text-[#232F58] dark:text-white tracking-tight">
                Asset Inventory
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                Manage and monitor technical equipment fleet
              </p>
            </div>
            <button
              onClick={() => setModal({ type: 'add' })}
              className="flex items-center justify-center gap-2 px-6 py-3.5 bg-[#232F58] text-white rounded-2xl text-sm font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-xl">add</span>
              Add New Device
            </button>
          </section>

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
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(15,23,42,0.45)', backdropFilter: 'blur(4px)' }}
          onClick={closeModal}
        >
          <div
            className="relative bg-white rounded-3xl shadow-2xl p-8 flex flex-col items-center gap-5 w-full max-w-sm mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-all"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>

            {/* Animated checkmark */}
            <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-200">
                <span className="material-symbols-outlined text-white text-3xl">check</span>
              </div>
            </div>

            {/* Text */}
            <div className="text-center space-y-1.5">
              <h3 className="text-xl font-extrabold text-[#1A2B56]">Device Added Successfully!</h3>
              <p className="text-sm text-slate-500">
                <span className="font-semibold text-slate-700">{modal.asset.name}</span> has been registered to the inventory.
              </p>
            </div>

            {/* Asset summary pill */}
            <div className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-[#1A2B56]/8 flex items-center justify-center flex-shrink-0">
                {modal.asset.imageUrl ? (
                  <img src={modal.asset.imageUrl} alt={modal.asset.name} className="w-10 h-10 rounded-xl object-cover" />
                ) : (
                  <span className="material-symbols-outlined text-[#1A2B56] text-xl">{modal.asset.icon}</span>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-extrabold text-[#1A2B56] truncate">{modal.asset.name}</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-wide">{modal.asset.serial} · {modal.asset.category}</p>
              </div>
              <span className="ml-auto shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-600">
                {modal.asset.status}
              </span>
            </div>

            {/* Action buttons */}
            <div className="w-full flex gap-3">
              <button
                onClick={closeModal}
                className="flex-1 py-3 rounded-2xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const asset = modal.asset;
                  closeModal();
                  setTimeout(() => setModal({ type: 'detail', asset }), 100);
                }}
                className="flex-1 py-3 rounded-2xl bg-[#1A2B56] text-white text-sm font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2"
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

