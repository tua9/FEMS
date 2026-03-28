import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { createPortal } from 'react-dom';
import { technicianApi } from '@/services/technicianApi';
// Use admin modals for parity
import AddEquipmentModal from '@/features/admin/components/equipment/AddEquipmentModal';
import EquipmentQRCodeModal from '@/features/admin/components/equipment/EquipmentQRCodeModal';
import DeleteConfirmationModal from '@/features/admin/components/common/DeleteConfirmationModal';
import EquipmentSuccessModal from '@/features/technician/components/equipment/EquipmentSuccessModal';
import RepairTable from '@/features/technician/components/equipment/RepairTable';
import { PageHeader } from '@/features/shared/components/PageHeader';

// ── Status config ─────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  available:   { label: 'AVAILABLE',    badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', dot: 'bg-emerald-500' },
  maintenance: { label: 'MAINTENANCE',  badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',       dot: 'bg-amber-500' },
  broken:      { label: 'BROKEN',       badge: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',               dot: 'bg-red-500' },
  good:        { label: 'AVAILABLE',    badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', dot: 'bg-emerald-500' },
};

const STATUS_FILTERS = [
  { key: 'all',         label: 'All' },
  { key: 'available',   label: 'Available' },
  { key: 'maintenance', label: 'Maintenance' },
  { key: 'broken',      label: 'Broken' },
];

// ── Confirm Delete Modal ──────────────────────────────────────────────────────
const ConfirmDeleteModal = ({ equipment, onConfirm, onClose, loading }) =>
  createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="dashboard-card rounded-4xl shadow-2xl w-full max-w-sm p-7 flex flex-col gap-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <span className="material-symbols-outlined text-3xl text-red-500">delete_forever</span>
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-[#1A2B56] dark:text-white">Delete Equipment</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Are you sure you want to delete{' '}
              <span className="font-bold text-[#1A2B56] dark:text-white">{equipment?.name}</span>?
              <br />
              This action cannot be undone.
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-[1.25rem] border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-3 rounded-[1.25rem] bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading
              ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              : <span className="material-symbols-outlined text-base">delete</span>
            }
            Delete
          </button>
        </div>
      </div>
    </div>,
    document.body
  );

// ── Confirm Mark Broken Modal ─────────────────────────────────────────────────
const ConfirmMarkBrokenModal = ({ equipment, onConfirm, onClose, loading }) =>
  createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="dashboard-card rounded-4xl shadow-2xl w-full max-w-sm p-7 flex flex-col gap-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <span className="material-symbols-outlined text-3xl text-red-500">build_circle</span>
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-[#1A2B56] dark:text-white">Mark as Broken</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Mark{' '}
              <span className="font-bold text-[#1A2B56] dark:text-white">{equipment?.name}</span>{' '}
              as broken? This will create a repair request and the equipment will be taken out of service.
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-[1.25rem] border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-3 rounded-[1.25rem] bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading
              ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              : <span className="material-symbols-outlined text-base">build_circle</span>
            }
            Confirm
          </button>
        </div>
      </div>
    </div>,
    document.body
  );

// ── Equipment Row ─────────────────────────────────────────────────────────────
const EquipmentRow = React.memo(({ eq, onQR, onEdit, onDelete, onMarkBroken }) => {
  const cfg  = STATUS_CONFIG[eq.status] ?? STATUS_CONFIG.available;
  const room = eq.roomId?.name ?? eq.roomId ?? '—';

  return (
    <tr className="border-b border-slate-100 dark:border-slate-800/60 hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
      {/* Equipment */}
      <td className="py-3.5 pl-5 pr-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0 overflow-hidden">
            {eq.img
              ? <img src={eq.img} alt={eq.name} className="w-full h-full object-cover" />
              : <span className="material-symbols-outlined text-lg text-slate-400">devices</span>
            }
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-sm text-slate-800 dark:text-slate-200 truncate">{eq.name}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Code: {eq.code ?? '—'}</div>
          </div>
        </div>
      </td>

      {/* Category */}
      <td className="py-3.5 pr-4 text-xs text-slate-600 dark:text-slate-400">{eq.category ?? '—'}</td>

      {/* Location */}
      <td className="py-3.5 pr-4 text-xs text-slate-600 dark:text-slate-400">{room}</td>

      {/* Status */}
      <td className="py-3.5 pr-4">
        <span className={`inline-flex items-center gap-1.5 text-[10px] font-black px-2.5 py-1 rounded-full ${cfg.badge}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
          {cfg.label}
        </span>
      </td>

      {/* Actions */}
      <td className="py-3.5 pr-5">
        <div className="flex items-center gap-0.5">
          <button
            title="View QR Code"
            onClick={() => onQR(eq)}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition"
          >
            <span className="material-symbols-outlined text-[18px]">qr_code</span>
          </button>
          <button
            title="Edit"
            onClick={() => onEdit(eq)}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition"
          >
            <span className="material-symbols-outlined text-[18px]">edit</span>
          </button>
          {eq.status !== 'broken' && (
            <button
              title="Mark as Broken"
              onClick={() => onMarkBroken(eq)}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500 transition"
            >
              <span className="material-symbols-outlined text-[18px]">build_circle</span>
            </button>
          )}
          <button
            title="Delete"
            onClick={() => onDelete(eq)}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500 transition"
          >
            <span className="material-symbols-outlined text-[18px]">delete</span>
          </button>
        </div>
      </td>
    </tr>
  );
});

// ── Main Page ─────────────────────────────────────────────────────────────────
const EquipmentInventory = () => {
  const [equipment,     setEquipment]     = useState([]);
  const [repairReports, setRepairReports] = useState([]);
  const [loadingEq,     setLoadingEq]     = useState(true);
  const [loadingRepair, setLoadingRepair] = useState(true);

  // Equipment filters
  const [statusFilter,  setStatusFilter]  = useState('all');
  const [searchQuery,   setSearchQuery]   = useState('');

  // Repair section: controlled filter + highlight
  const [repairFilter,     setRepairFilter]     = useState('all');
  const [highlightedRepId, setHighlightedRepId] = useState(null);

  // Modal state
  const [modal,        setModal]        = useState({ type: 'none' });
  const [actionTarget, setActionTarget] = useState(null);
  const [actioning,    setActioning]    = useState(false);

  // Ref for scroll-to-repair
  const repairSectionRef = useRef(null);

  // ── Data loaders ────────────────────────────────────────────────────────────
  const loadEquipment = useCallback(async () => {
    setLoadingEq(true);
    try {
      const data = await technicianApi.listEquipment();
      setEquipment(Array.isArray(data) ? data : []);
    } catch {
      toast.error('Failed to load equipment list');
    } finally {
      setLoadingEq(false);
    }
  }, []);

  const loadRepairs = useCallback(async () => {
    setLoadingRepair(true);
    try {
      const data = await technicianApi.getEquipmentReports({ type: 'equipment' });
      setRepairReports(Array.isArray(data) ? data.filter((r) => r.equipment_id) : []);
    } catch {
      toast.error('Failed to load repair requests');
    } finally {
      setLoadingRepair(false);
    }
  }, []);

  useEffect(() => {
    loadEquipment();
    loadRepairs();
  }, [loadEquipment, loadRepairs]);

  // ── Filtered equipment list ──────────────────────────────────────────────────
  const filteredEquipment = useMemo(() => {
    let list = equipment;
    if (statusFilter !== 'all') list = list.filter((e) => e.status === statusFilter);
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        (e) =>
          e.name?.toLowerCase().includes(q) ||
          e.code?.toLowerCase().includes(q) ||
          e.category?.toLowerCase().includes(q) ||
          e.roomId?.name?.toLowerCase().includes(q),
      );
    }
    return list;
  }, [equipment, statusFilter, searchQuery]);

  // ── Count per status ─────────────────────────────────────────────────────────
  const countByStatus = useMemo(() => {
    const counts = { available: 0, maintenance: 0, broken: 0 };
    equipment.forEach((e) => {
      const k = e.status === 'good' ? 'available' : e.status;
      if (k in counts) counts[k]++;
    });
    return counts;
  }, [equipment]);

  // ── Scroll + highlight helper ────────────────────────────────────────────────
  const focusRepairRecord = useCallback((reportId) => {
    // 1. Ensure the filter shows the record
    setRepairFilter('all');
    // 2. Set highlight
    setHighlightedRepId(reportId);
    // 3. Scroll to repair section
    setTimeout(() => {
      repairSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
    // 4. Clear highlight after 3.5s
    setTimeout(() => setHighlightedRepId(null), 3500);
  }, []);

  // ── Action handlers ──────────────────────────────────────────────────────────
  const handleAdd = async (body) => {
    // NOTE: errors are intentionally re-thrown so the modal can show them inline
    const res = await technicianApi.createEquipment(body);
    const created = res.equipment ?? res;
    setEquipment((prev) => [created, ...prev]);
    setModal({ type: 'none' });
    // Open success modal with QR
    setTimeout(() => setModal({ type: 'addSuccess', equipment: created }), 50);
  };

  const handleSave = async (updated) => {
    try {
      const res = await technicianApi.updateEquipment(updated._id, {
        name:        updated.name,
        category:    updated.category,
        status:      updated.status,
        description: updated.description,
        roomId:      updated.roomId?._id ?? updated.roomId,
      });
      const saved = res.equipment ?? res;
      setEquipment((prev) => prev.map((e) => (e._id === saved._id ? saved : e)));
      setModal({ type: 'none' });
      toast.success('Equipment updated');
    } catch {
      toast.error('Failed to update equipment');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!actionTarget) return;
    setActioning(true);
    try {
      await technicianApi.deleteEquipment(actionTarget._id);
      setEquipment((prev) => prev.filter((e) => e._id !== actionTarget._id));
      setModal({ type: 'none' });
      setActionTarget(null);
      toast.success('Equipment deleted');
    } catch {
      toast.error('Failed to delete equipment');
    } finally {
      setActioning(false);
    }
  };

  const handleMarkBrokenConfirm = async () => {
    if (!actionTarget) return;
    setActioning(true);
    try {
      const res = await technicianApi.markEquipmentBroken(actionTarget._id);
      // Update equipment row status
      const updatedEq = res.equipment ?? { ...actionTarget, status: 'broken' };
      setEquipment((prev) => prev.map((e) => (e._id === updatedEq._id ? updatedEq : e)));
      // Prepend new repair report
      const newReport = res.report;
      if (newReport) {
        setRepairReports((prev) => [newReport, ...prev]);
        setModal({ type: 'none' });
        setActionTarget(null);
        toast.success(`"${actionTarget.name}" marked as broken — repair request created`);
        focusRepairRecord(newReport._id);
      } else {
        setModal({ type: 'none' });
        setActionTarget(null);
        toast.success(`"${actionTarget.name}" marked as broken`);
      }
    } catch (err) {
      const status = err?.response?.status;
      if (status === 409) {
        // Equipment already has an open repair — navigate to existing record
        const existingReport = err?.response?.data?.existingReport;
        setModal({ type: 'none' });
        setActionTarget(null);
        toast.info('Equipment already has an open repair request — scrolling to it');
        if (existingReport) {
          // Ensure equipment is shown as broken
          setEquipment((prev) =>
            prev.map((e) => (e._id === actionTarget._id ? { ...e, status: 'broken' } : e)),
          );
          // Make sure it's in repair list
          setRepairReports((prev) => {
            const already = prev.find((r) => r._id === existingReport._id);
            return already ? prev : [existingReport, ...prev];
          });
          focusRepairRecord(existingReport._id);
        }
      } else {
        toast.error(err?.response?.data?.message ?? 'Failed to mark equipment as broken');
      }
    } finally {
      setActioning(false);
    }
  };

  const handleUpdateRepairStatus = async (id, payload) => {
    try {
      await technicianApi.updateTicket(id, payload);
      await loadRepairs();
      // If fixed → equipment may need status update too
      if (payload.status === 'fixed') await loadEquipment();
      toast.success('Repair status updated');
    } catch (err) {
      toast.error(err?.response?.data?.message ?? 'Failed to update status');
    }
  };

  const closeModal = () => { setModal({ type: 'none' }); setActionTarget(null); };

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="pt-6 sm:pt-8 pb-20 px-4 sm:px-6 max-w-7xl mx-auto">
      <PageHeader
        title="Equipment Management"
        subtitle="Manage, monitor, and report equipment issues"
      />

      {/* ── Equipment Section ─────────────────────────────────────────────── */}
      <div className="dashboard-card rounded-4xl overflow-hidden mb-8">
        {/* Toolbar */}
        <div className="px-6 pt-6 pb-4 flex flex-wrap items-center gap-3 border-b border-slate-100 dark:border-slate-800">
          {/* Status filter tabs */}
          <div className="flex gap-2 flex-wrap flex-1">
            {STATUS_FILTERS.map((f) => {
              const count = f.key === 'all' ? equipment.length : (countByStatus[f.key] ?? 0);
              return (
                <button
                  key={f.key}
                  onClick={() => setStatusFilter(f.key)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                    statusFilter === f.key
                      ? 'bg-[#1A2B56] text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  {f.label}
                  <span className="ml-1.5 opacity-70">{count}</span>
                </button>
              );
            })}
          </div>

          {/* Search */}
          <div className="relative w-56">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px] pointer-events-none">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search equipment…"
              className="w-full pl-9 pr-8 py-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1A2B56]/20 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </div>

          {/* Add button */}
          <button
            onClick={() => setModal({ type: 'add' })}
            className="flex items-center gap-2 px-6 py-3 bg-[#1A2B56] text-white rounded-2xl font-semibold text-sm shadow-[0_10px_20px_rgba(26,43,86,0.3)] hover:opacity-90 transition-all border border-white/10 shrink-0"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Add Equipment
          </button>
        </div>

        {/* Table */}
        {loadingEq ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-9 w-9 border-b-2 border-[#1A2B56]" />
          </div>
        ) : filteredEquipment.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <span className="material-symbols-outlined text-5xl mb-3 block">inventory_2</span>
            <p className="text-sm font-medium">No equipment found</p>
            <p className="text-xs mt-1">Try changing the filter or search term</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  {['Equipment', 'Category', 'Location', 'Status', 'Actions'].map((h) => (
                    <th
                      key={h}
                      className={`text-left text-[10px] font-black uppercase tracking-widest text-slate-400 py-3 pr-4 ${h === 'Equipment' ? 'pl-5' : ''} ${h === 'Actions' ? 'pr-5' : ''}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredEquipment.map((eq) => (
                  <EquipmentRow
                    key={eq._id}
                    eq={eq}
                    onQR={(e)        => setModal({ type: 'qr',   asset: e })}
                    onEdit={(e)      => setModal({ type: 'edit', asset: e })}
                    onDelete={(e)    => { setActionTarget(e); setModal({ type: 'delete' }); }}
                    onMarkBroken={(e)=> { setActionTarget(e); setModal({ type: 'markBroken' }); }}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Repair Requests Section ───────────────────────────────────────── */}
      <div ref={repairSectionRef} className="dashboard-card rounded-4xl p-6">
        <RepairTable
          reports={repairReports}
          loading={loadingRepair}
          onUpdateStatus={handleUpdateRepairStatus}
          statusFilter={repairFilter}
          onStatusFilterChange={setRepairFilter}
          highlightedId={highlightedRepId}
        />
      </div>

      {/* ── Modals ────────────────────────────────────────────────────────── */}
      <AddEquipmentModal
        isOpen={modal.type === 'edit'}
        onClose={closeModal}
        equipment={modal.asset}
        onEquipmentUpdated={() => { loadEquipment(); loadRepairs(); }}
        onCreated={(created) => {
          // In case the admin modal ever calls onCreated during edit (shouldn't), keep behavior safe
          closeModal();
          setTimeout(() => setModal({ type: 'addSuccess', equipment: created }), 50);
        }}
      />

      {/* Admin-style QR modal */}
      <EquipmentQRCodeModal
        isOpen={modal.type === 'qr'}
        equipment={modal.asset}
        onClose={closeModal}
      />

      {/* Admin-style Add modal (create-only in technician flow) */}
      <AddEquipmentModal
        isOpen={modal.type === 'add'}
        onClose={closeModal}
        equipment={null}
        onEquipmentUpdated={() => { loadEquipment(); loadRepairs(); }}
        onCreated={(created) => {
          closeModal();
          // Keep technician success flow (QR + success state)
          setTimeout(() => setModal({ type: 'addSuccess', equipment: created }), 50);
        }}
      />

      {modal.type === 'addSuccess' && modal.equipment && (
        <EquipmentSuccessModal equipment={modal.equipment} onClose={closeModal} />
      )}

      {/* Admin-style Delete confirmation */}
      <DeleteConfirmationModal
        isOpen={modal.type === 'delete' && !!actionTarget}
        title="Decommission Equipment"
        message="Are you sure you want to remove this equipment?"
        itemName={actionTarget?.name}
        onClose={closeModal}
        onConfirm={handleDeleteConfirm}
      />

      {modal.type === 'markBroken' && actionTarget && (
        <ConfirmMarkBrokenModal
          equipment={actionTarget}
          onClose={closeModal}
          onConfirm={handleMarkBrokenConfirm}
          loading={actioning}
        />
      )}
    </div>
  );
};

export default EquipmentInventory;
