import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { technicianApi } from '@/services/technicianApi';
import EquipmentSidebar from '@/features/technician/components/equipment/EquipmentSidebar';
import AssetGrid from '@/features/technician/components/equipment/AssetGrid';
import AssetPagination from '@/features/technician/components/equipment/AssetPagination';
import AssetDetailModal from '@/features/technician/components/equipment/AssetDetailModal';
import AssetEditModal from '@/features/technician/components/equipment/AssetEditModal';
import AddEquipmentModal from '@/features/technician/components/equipment/AddEquipmentModal';
import QRCodeModal from '@/features/technician/components/equipment/QRCodeModal';
import RepairTable from '@/features/technician/components/equipment/RepairTable';
import { PageHeader } from '@/features/shared/components/PageHeader';

const ITEMS_PER_PAGE = 6;

// ── Status mapping: backend → UI ─────────────────────────────────────────────
const STATUS_MAP = {
  good:        { label: 'Operational', dot: 'bg-emerald-500', color: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-200', bg: 'bg-emerald-50' },
  in_use:      { label: 'In Use',      dot: 'bg-blue-500',    color: 'text-blue-600 dark:text-blue-400',    border: 'border-blue-200',    bg: 'bg-blue-50' },
  maintenance: { label: 'Maintenance', dot: 'bg-amber-500',   color: 'text-amber-600 dark:text-amber-400',   border: 'border-amber-200',   bg: 'bg-amber-50' },
  reserved:    { label: 'Reserved',    dot: 'bg-purple-500',  color: 'text-purple-600 dark:text-purple-400', border: 'border-purple-200',  bg: 'bg-purple-50' },
  broken:      { label: 'Faulty',      dot: 'bg-red-500',     color: 'text-red-600 dark:text-red-400',      border: 'border-red-200',     bg: 'bg-red-50' },
};

const CATEGORY_ICON = {
  Computing: 'laptop_mac', 'AV Display': 'monitor', Networking: 'router',
  Peripherals: 'print', Other: 'category',
};

// Map backend equipment to AssetCard format
const toAsset = (eq) => ({
  _id: eq._id,
  id:  eq._id,
  name: eq.name,
  serial: eq.code ?? eq._id?.slice(-8).toUpperCase(),
  category: eq.category ?? 'Other',
  status: STATUS_MAP[eq.status]?.label ?? 'Operational',
  _status: eq.status, // raw backend status
  icon: CATEGORY_ICON[eq.category] ?? 'category',
  imageUrl: eq.img ?? undefined,
  location: eq.room_id?.name ?? undefined,
  code: eq.code,
});

const STATUS_FILTERS = [
  { key: 'all',         label: 'Tất cả' },
  { key: 'good',        label: 'Sẵn sàng' },
  { key: 'in_use',      label: 'Đang mượn' },
  { key: 'maintenance', label: 'Bảo trì' },
  { key: 'broken',      label: 'Hỏng' },
];

const EquipmentInventory = () => {
  const [assets, setAssets] = useState([]);
  const [repairReports, setRepairReports] = useState([]);
  const [loadingAssets, setLoadingAssets] = useState(true);
  const [loadingRepairs, setLoadingRepairs] = useState(true);

  const [activeCategory, setActiveCategory] = useState('All Assets');
  const [activeStatus, setActiveStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [modal, setModal] = useState({ type: 'none' });

  // ── Fetch equipment ──────────────────────────────────────────────────────────
  const fetchEquipment = useCallback(async () => {
    setLoadingAssets(true);
    try {
      const data = await technicianApi.listEquipment();
      setAssets((Array.isArray(data) ? data : []).map(toAsset));
    } catch {
      toast.error('Không thể tải danh sách thiết bị');
    } finally {
      setLoadingAssets(false);
    }
  }, []);

  const fetchRepairs = useCallback(async () => {
    setLoadingRepairs(true);
    try {
      const data = await technicianApi.getEquipmentReports({ type: 'equipment' });
      setRepairReports(Array.isArray(data) ? data.filter((r) => r.equipment_id) : []);
    } catch {
      toast.error('Không thể tải danh sách sửa chữa');
    } finally {
      setLoadingRepairs(false);
    }
  }, []);

  useEffect(() => {
    fetchEquipment();
    fetchRepairs();
  }, [fetchEquipment, fetchRepairs]);

  // ── Derived list ─────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = assets;
    if (activeCategory !== 'All Assets') list = list.filter((a) => a.category === activeCategory);
    if (activeStatus !== 'all') list = list.filter((a) => a._status === activeStatus);
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        (a) => a.name.toLowerCase().includes(q) || a.serial.toLowerCase().includes(q) || (a.location ?? '').toLowerCase().includes(q),
      );
    }
    return list;
  }, [assets, activeCategory, activeStatus, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paged = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const handleAdd = async (body) => {
    try {
      const created = await technicianApi.createEquipment(body);
      const asset = toAsset(created);
      setAssets((prev) => [asset, ...prev]);
      setModal({ type: 'success', asset });
    } catch (err) {
      toast.error(err?.response?.data?.message ?? 'Không thể thêm thiết bị');
    }
  };

  const handleSave = async (updated) => {
    try {
      const res = await technicianApi.updateEquipment(updated._id, { name: updated.name, category: updated.category, status: updated._status });
      setAssets((prev) => prev.map((a) => (a._id === res._id ? toAsset(res) : a)));
      setModal({ type: 'none' });
      toast.success('Đã cập nhật thiết bị');
    } catch {
      toast.error('Không thể cập nhật thiết bị');
    }
  };

  const handleDelete = async (asset) => {
    if (!window.confirm(`Xoá thiết bị "${asset.name}"?`)) return;
    try {
      await technicianApi.deleteEquipment(asset._id);
      setAssets((prev) => prev.filter((a) => a._id !== asset._id));
      setModal({ type: 'none' });
      toast.success('Đã xoá thiết bị');
    } catch {
      toast.error('Không thể xoá thiết bị');
    }
  };

  const handleMarkBroken = async (asset) => {
    if (!window.confirm(`Đánh dấu thiết bị "${asset.name}" là hỏng?`)) return;
    try {
      await technicianApi.updateEquipment(asset._id, { status: 'broken' });
      setAssets((prev) => prev.map((a) => a._id === asset._id ? { ...a, _status: 'broken', status: 'Faulty' } : a));
      setModal({ type: 'none' });
      toast.success('Đã đánh dấu hỏng');
    } catch {
      toast.error('Không thể cập nhật trạng thái');
    }
  };

  const handleUpdateRepairStatus = async (id, payload) => {
    try {
      await technicianApi.updateTicket(id, payload);
      await fetchRepairs();
      toast.success('Cập nhật trạng thái thành công');
    } catch (err) {
      toast.error(err?.response?.data?.message ?? 'Không thể cập nhật');
    }
  };

  const closeModal = () => setModal({ type: 'none' });

  return (
    <div className="pt-6 sm:pt-8 pb-16 px-6 max-w-7xl mx-auto">
      <PageHeader title="Quản lý Thiết bị" subtitle="Quản lý và theo dõi thiết bị kỹ thuật" />

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <EquipmentSidebar
          activeCategory={activeCategory}
          storagePercentage={Math.round((assets.filter((a) => a._status === 'good' || a._status === 'in_use').length / Math.max(assets.length, 1)) * 100)}
          onCategorySelect={(cat) => { setActiveCategory(cat); setCurrentPage(1); }}
        />

        {/* Main */}
        <div className="flex-1 space-y-6">
          {/* Toolbar */}
          <div className="flex items-center gap-3 justify-end flex-wrap">
            <div className="relative flex-1 max-w-sm">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#232F58]/50 dark:text-slate-400 text-[20px] pointer-events-none">search</span>
              <input
                type="text" value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                placeholder="Tìm theo tên, mã, vị trí…"
                className="w-full pl-10 pr-9 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#232F58]/30 transition"
              />
              {searchQuery && (
                <button onClick={() => { setSearchQuery(''); setCurrentPage(1); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition">
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              )}
            </div>
            <button
              onClick={() => setModal({ type: 'add' })}
              className="flex items-center gap-2 px-6 py-3.5 bg-[#232F58] text-white rounded-2xl text-sm font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-xl">add</span>
              Thêm thiết bị
            </button>
          </div>

          {/* Status filter pills */}
          <div className="flex gap-2 flex-wrap">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => { setActiveStatus(f.key); setCurrentPage(1); }}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  activeStatus === f.key
                    ? 'bg-[#232F58] text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                {f.label}
                <span className="ml-1.5 opacity-70">
                  {f.key === 'all' ? assets.length : assets.filter((a) => a._status === f.key).length}
                </span>
              </button>
            ))}
          </div>

          {/* Grid */}
          {loadingAssets ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1A2B56]" />
            </div>
          ) : (
            <AssetGrid
              assets={paged}
              onAssetClick={(asset) => setModal({ type: 'detail', asset })}
              extraActions={(asset) => (
                <div className="flex gap-1 mt-2">
                  <button
                    title="QR Code" onClick={(e) => { e.stopPropagation(); setModal({ type: 'qr', asset }); }}
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 transition"
                  >
                    <span className="material-symbols-outlined text-base">qr_code</span>
                  </button>
                  <button
                    title="Chỉnh sửa" onClick={(e) => { e.stopPropagation(); setModal({ type: 'edit', asset }); }}
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 transition"
                  >
                    <span className="material-symbols-outlined text-base">edit</span>
                  </button>
                  <button
                    title="Đánh dấu hỏng" onClick={(e) => { e.stopPropagation(); handleMarkBroken(asset); }}
                    className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-500 hover:text-red-500 transition"
                  >
                    <span className="material-symbols-outlined text-base">build_circle</span>
                  </button>
                  <button
                    title="Xoá" onClick={(e) => { e.stopPropagation(); handleDelete(asset); }}
                    className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-500 hover:text-red-500 transition"
                  >
                    <span className="material-symbols-outlined text-base">delete</span>
                  </button>
                </div>
              )}
            />
          )}

          <AssetPagination
            currentPage={safePage} totalPages={totalPages}
            visibleCount={paged.length} totalCount={filtered.length}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {/* ── Repair Table ─────────────────────────────────────────────────────── */}
      <div className="mt-12 dashboard-card p-6 rounded-4xl">
        <RepairTable
          reports={repairReports}
          loading={loadingRepairs}
          onUpdateStatus={handleUpdateRepairStatus}
        />
      </div>

      {/* ── Modals ───────────────────────────────────────────────────────────── */}
      {modal.type === 'detail' && (
        <AssetDetailModal
          asset={modal.asset} onClose={closeModal}
          onEdit={(a) => setModal({ type: 'edit', asset: a })}
        />
      )}
      {modal.type === 'edit' && (
        <AssetEditModal asset={modal.asset} onClose={closeModal} onSave={handleSave} />
      )}
      {modal.type === 'qr' && (
        <QRCodeModal equipment={modal.asset} onClose={closeModal} />
      )}
      {modal.type === 'add' && (
        <AddEquipmentModal onClose={closeModal} onAdd={handleAdd} />
      )}

      {modal.type === 'success' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 bg-black/30 backdrop-blur-sm" onClick={closeModal}>
          <div className="relative dashboard-card rounded-4xl shadow-2xl p-8 flex flex-col items-center gap-5 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <button onClick={closeModal} className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-[#1E2B58]/50 hover:text-[#1E2B58] hover:bg-[#1E2B58]/8 transition">
              <span className="material-symbols-outlined text-lg">close</span>
            </button>

            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <div className="w-11 h-11 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <span className="material-symbols-outlined text-white text-2xl">check</span>
              </div>
            </div>

            <div className="text-center space-y-1">
              <p className="text-[0.625rem] font-black uppercase tracking-widest text-[#1E2B58]/50">Thành công</p>
              <h3 className="text-xl font-extrabold text-[#1E2B58] dark:text-white">Đã thêm thiết bị!</h3>
              <p className="text-sm text-slate-400">
                <span className="font-semibold text-[#1E2B58] dark:text-white">{modal.asset?.name}</span> đã được đăng ký.
              </p>
            </div>

            {/* QR Code preview */}
            {modal.asset?.code && (
              <div className="flex flex-col items-center gap-2">
                <p className="text-xs text-slate-500">Mã QR để báo hỏng nhanh:</p>
                <button
                  onClick={() => { const a = modal.asset; closeModal(); setTimeout(() => setModal({ type: 'qr', asset: a }), 100); }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-[#1E2B58]/20 hover:border-[#1E2B58]/40 hover:bg-[#1E2B58]/5 transition text-[#1E2B58] dark:text-white"
                >
                  <span className="material-symbols-outlined text-xl">qr_code</span>
                  <span className="text-sm font-bold">{modal.asset.code}</span>
                </button>
              </div>
            )}

            <div className="w-full flex gap-3">
              <button onClick={closeModal} className="flex-1 py-3 rounded-[1.25rem] border border-[#1E2B58]/15 text-sm font-bold text-[#1E2B58]/70 hover:bg-[#1E2B58]/5 transition">Đóng</button>
              <button
                onClick={() => { const a = modal.asset; closeModal(); setTimeout(() => setModal({ type: 'qr', asset: a }), 100); }}
                className="flex-1 py-3 rounded-[1.25rem] bg-[#1E2B58] text-white text-sm font-bold hover:bg-[#151f40] shadow-lg flex items-center justify-center gap-2 transition"
              >
                <span className="material-symbols-outlined text-base">qr_code</span>
                Xem QR
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EquipmentInventory;
