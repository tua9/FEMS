import React, { useEffect, useMemo, useState } from 'react';
import CustomDropdown from '@/components/shared/CustomDropdown';
import RepairDetailModal from '@/components/admin/repairs/RepairDetailModal';
import Pagination from '@/components/shared/Pagination';
import { PageHeader } from '@/components/shared/PageHeader';
import { useEquipmentStore } from '@/stores/useEquipmentStore';
import { useReportStore } from '@/stores/useReportStore';

const OPEN_STATUSES = ['pending', 'approved', 'processing', 'rejected'];

const REPAIR_STATUS_OPTIONS = [
 { value: 'All', label: 'All statuses' },
 { value: 'Pending', label: 'Pending' },
 { value: 'Approved', label: 'Approved' },
 { value: 'In progress', label: 'In progress' },
 { value: 'Rejected', label: 'Rejected' },
];

function repairLabelForEquipment(equipment, reports) {
 const eid = equipment._id;
 const equipReports = reports.filter((r) => {
 if (r.type !== 'equipment') return false;
 const rid = r.equipment_id?._id || r.equipment_id;
 return String(rid) === String(eid);
 });
 const latestOpen = equipReports
 .filter((r) => OPEN_STATUSES.includes(r.status))
 .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
 if (latestOpen) {
 const map = {
 pending: 'Pending',
 approved: 'Approved',
 processing: 'In progress',
 rejected: 'Rejected',
 };
 return map[latestOpen.status] || latestOpen.status;
 }
 if (equipment.status === 'maintenance') return 'In progress';
 if (equipment.status === 'broken') return 'Pending';
 return 'Pending';
}

const RepairManagement = () => {
 const equipments = useEquipmentStore((s) => s.equipments);
 const fetchEquipments = useEquipmentStore((s) => s.fetchAll);
 const reports = useReportStore((s) => s.reports);
 const fetchReports = useReportStore((s) => s.fetchAllReports);
 const loadingEq = useEquipmentStore((s) => s.loading);
 const loadingRep = useReportStore((s) => s.loading);

 const [statusFilter, setStatusFilter] = useState('All');
 const [search, setSearch] = useState('');
 const [selected, setSelected] = useState(null);
 const [page, setPage] = useState(1);
 const perPage = 8;

 useEffect(() => {
 fetchEquipments();
 fetchReports();
 }, [fetchEquipments, fetchReports]);

 const repairRows = useMemo(() => {
 const list = Array.isArray(equipments) ? equipments : [];
 const rep = Array.isArray(reports) ? reports : [];
 const ids = new Set();

 list.forEach((e) => {
 if (e.status === 'broken' || e.status === 'maintenance') ids.add(String(e._id));
 });
 rep.forEach((r) => {
 if (r.type !== 'equipment') return;
 if (!OPEN_STATUSES.includes(r.status)) return;
 const rid = r.equipment_id?._id || r.equipment_id;
 if (rid) ids.add(String(rid));
 });

 return Array.from(ids)
 .map((id) => list.find((e) => String(e._id) === id))
 .filter(Boolean)
 .map((equipment) => ({
 equipment,
 statusLabel: repairLabelForEquipment(equipment, rep),
 updatedAt: (() => {
 const equipReports = rep.filter((r) => {
 if (r.type !== 'equipment') return false;
 const rid = r.equipment_id?._id || r.equipment_id;
 return String(rid) === String(equipment._id);
 });
 const latest = equipReports.sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))[0];
 return latest ? new Date(latest.updatedAt || latest.createdAt) : new Date(equipment.updatedAt || equipment.createdAt || 0);
 })(),
 }));
 }, [equipments, reports]);

 const filtered = useMemo(() => {
 const q = search.toLowerCase();
 return repairRows.filter((row) => {
 const { equipment, statusLabel } = row;
 const matchQ =
 !q ||
 equipment.name.toLowerCase().includes(q) ||
 (equipment.model || '').toLowerCase().includes(q) ||
 (equipment.code || '').toLowerCase().includes(q);
 const matchS = statusFilter === 'All' || statusLabel === statusFilter;
 return matchQ && matchS;
 });
 }, [repairRows, search, statusFilter]);

 useEffect(() => {
 setPage(1);
 }, [search, statusFilter]);

 const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
 const slice = filtered.slice((page - 1) * perPage, page * perPage);

 const loading = loadingEq || loadingRep;

 if (loading && (!equipments?.length && !reports?.length)) {
 return (
 <div className="flex items-center justify-center min-h-[60vh]">
 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1A2B56] dark:border-blue-400" />
 </div>
 );
 }

 return (
 <div className="max-w-7xl mx-auto px-6 pt-6 sm:pt-8 pb-16">
 <PageHeader
 title="Repair management"
 subtitle="Equipment under repair, broken assets, and open fault tickets."
 className="mb-8"
 />

 <div className="dashboard-card p-6 rounded-4xl mb-6 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
 <div className="relative flex-1 max-w-md">
 <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
 <input
 value={search}
 onChange={(e) => setSearch(e.target.value)}
 placeholder="Search by name, model, or code…"
 className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/60 dark:bg-slate-800/60 border border-white/80 dark:border-slate-600 text-sm font-medium outline-none focus:ring-2 focus:ring-[#1E2B58]/30 dark:text-white"
 />
 </div>
 <CustomDropdown
 value={statusFilter}
 options={REPAIR_STATUS_OPTIONS}
 onChange={setStatusFilter}
 align="right"
 />
 </div>

 <div className="dashboard-card rounded-4xl overflow-hidden">
 <div className="overflow-x-auto">
 <table className="w-full text-left min-w-[720px]">
 <thead>
 <tr className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-700">
 <th className="px-6 py-4">Equipment</th>
 <th className="px-6 py-4 hidden sm:table-cell">Model</th>
 <th className="px-6 py-4 hidden md:table-cell">Location</th>
 <th className="px-6 py-4">Repair status</th>
 <th className="px-6 py-4 hidden lg:table-cell">Updated</th>
 </tr>
 </thead>
 <tbody>
 {slice.length === 0 ? (
 <tr>
 <td colSpan={5} className="px-6 py-16 text-center text-sm text-slate-500 dark:text-slate-400">
 No devices match this filter.
 </td>
 </tr>
 ) : (
 slice.map(({ equipment, statusLabel, updatedAt }) => (
 <tr
 key={equipment._id}
 className="border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 cursor-pointer transition-colors"
 onClick={() => setSelected(equipment)}
 >
 <td className="px-6 py-4">
 <p className="font-semibold text-slate-800 dark:text-white">{equipment.name}</p>
 <p className="text-[10px] text-slate-500">{equipment.code || equipment._id.slice(-6).toUpperCase()}</p>
 </td>
 <td className="px-6 py-4 hidden sm:table-cell text-sm text-slate-600 dark:text-slate-300">{equipment.model || '—'}</td>
 <td className="px-6 py-4 hidden md:table-cell text-sm text-slate-600 dark:text-slate-300">{equipment.room_id?.name || '—'}</td>
 <td className="px-6 py-4">
 <span className="inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-amber-50 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200">
 {statusLabel}
 </span>
 </td>
 <td className="px-6 py-4 hidden lg:table-cell text-xs text-slate-500">
 {updatedAt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
 </td>
 </tr>
 ))
 )}
 </tbody>
 </table>
 </div>
 <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-slate-700">
 <p className="text-xs text-slate-500">
 Showing {filtered.length === 0 ? 0 : (page - 1) * perPage + 1}–{Math.min(page * perPage, filtered.length)} of {filtered.length}
 </p>
 <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
 </div>
 </div>

 <RepairDetailModal
 isOpen={!!selected}
 onClose={() => setSelected(null)}
 equipment={selected}
 reports={reports}
 />
 </div>
 );
};

export default RepairManagement;
