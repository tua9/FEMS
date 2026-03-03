import React, { useState } from 'react';
import {
  AssetCategory,
  Asset,
  MOCK_ASSETS,
} from '@/data/technician/mockEquipment';
import EquipmentSidebar from '@/components/technician/equipment/EquipmentSidebar';
import AssetGrid from '@/components/technician/equipment/AssetGrid';
import AssetPagination from '@/components/technician/equipment/AssetPagination';
import AssetDetailModal from '@/components/technician/equipment/AssetDetailModal';
import AssetEditModal from '@/components/technician/equipment/AssetEditModal';
import AddEquipmentModal from '@/components/technician/equipment/AddEquipmentModal';
import AddEquipmentSuccessModal from '@/components/technician/equipment/AddEquipmentSuccessModal';

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
        <AddEquipmentSuccessModal
          asset={modal.asset}
          onClose={closeModal}
          onView={(asset) => {
            closeModal();
            setTimeout(() => setModal({ type: 'detail', asset }), 100);
          }}
        />
      )}
    </div>
  );
};

export default EquipmentInventory;

