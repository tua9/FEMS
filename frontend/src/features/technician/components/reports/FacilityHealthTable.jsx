import React, { useMemo } from 'react';
import {

 getCriticalityStyle,
 getTrendIcon,
} from '@/mocks/technician/mockReports';
import { technicianApi } from '@/services/technicianApi';

// ── Single table row ──────────────────────────────────────────────────────────
const FacilityRow = ({ row, isLast }) => {
 const crit = getCriticalityStyle(row.criticality);
 const trend = getTrendIcon(row.trend);

 return (
 <tr
 className={`hover:bg-white/30 transition-colors ${!isLast ? 'border-b border-white/10' : ''
 }`}
 >
 {/* Asset type */}
 <td className="px-8 py-6">
 <div className="font-bold text-slate-900 dark:text-white">{row.assetType}</div>
 <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">{row.unitLabel}</div>
 </td>

 {/* Operational status progress bar */}
 <td className="px-8 py-6">
 <div className="flex items-center gap-2">
 <div className="flex-1 h-1.5 w-48 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
 <div
 className={`h-full ${row.barColor} rounded-full transition-all duration-500`}
 style={{ width: `${row.operationalPct}%` }}
 />
 </div>
 <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{row.operationalPct}%</span>
 </div>
 </td>

 {/* Criticality badge */}
 <td className="px-8 py-6">
 <span className={`px-3 py-1 ${crit.pill} text-[10px] font-bold rounded-full uppercase`}>
 {crit.text}
 </span>
 </td>

 {/* MTBF */}
 <td className="px-8 py-6 font-semibold text-slate-600 dark:text-slate-300">{row.mtbf}</td>

 {/* Trend icon */}
 <td className="px-8 py-6 text-right">
 <span className={`material-symbols-outlined ${trend.color}`}>{trend.icon}</span>
 </td>
 </tr>
 );
};

const criticalityFromPct = (pct) => {
 if (pct < 85) return 'High';
 if (pct < 95) return 'Medium';
 return 'Normal';
};

// ── Section component ─────────────────────────────────────────────────────────
const FacilityHealthTable = () => {
 const { items, loading } = useEquipmentForFacilityHealth();

 const rows = useMemo(() => {
 // Group by category
 const byCat = new Map();

 for (const e of items) {
 const cat = String(e?.category || 'Other');
 const entry = byCat.get(cat) || { total: 0, good: 0 };
 entry.total += 1;
 if (String(e?.status).toLowerCase() === 'good') entry.good += 1;
 byCat.set(cat, entry);
 }

 const list = Array.from(byCat.entries())
 .map(([cat, v]) => {
 const pct = v.total > 0 ? Math.round((v.good / v.total) * 100) : 0;
 return {
 assetType: cat,
 unitLabel: `${v.total} Units`,
 operationalPct: pct,
 barColor: pct >= 95 ? 'bg-emerald-500' : pct >= 90 ? 'bg-blue-500' : 'bg-amber-400',
 criticality: criticalityFromPct(pct),
 // not available in DB; keep a neutral placeholder string
 mtbf: '—',
 trend: 'flat',
 };
 })
 .sort((a, b) => b.operationalPct - a.operationalPct)
 .slice(0, 3);

 // Keep UI stable: always 3 rows
 while (list.length < 3) {
 list.push({
 assetType: '—',
 unitLabel: '0 Units',
 operationalPct: 0,
 barColor: 'bg-slate-200',
 criticality: 'Normal',
 mtbf: '—',
 trend: 'flat',
 });
 }

 return list;
 }, [items]);

 return (
 <section className="dashboard-card rounded-3xl overflow-hidden">
 {/* Header */}
 <div className="p-8 border-b border-white/30 flex justify-between items-center">
 <h3 className="text-lg font-bold text-[#232F58] dark:text-white flex items-center gap-2">
 <span className="material-symbols-outlined text-[#232F58] dark:text-blue-400">analytics</span>
 Facility Health Overview
 </h3>
 </div>

 {/* Table */}
 <div className="overflow-x-auto">
 <table className="w-full text-left">
 <thead>
 <tr className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.15em] border-b border-white/20">
 {['Asset Type', 'Operational Status', 'Criticality', 'MTBF (Avg)', 'Trend'].map((h, i) => (
 <th key={h} className={`px-8 py-5 ${i === 4 ? 'text-right' : ''}`}>
 {h}
 </th>
 ))}
 </tr>
 </thead>
 <tbody className="text-sm">
 {loading
 ? [...Array(3)].map((_, i) => (
 <tr key={i} className="border-b border-white/10">
 {[...Array(5)].map((_, j) => (
 <td key={j} className="px-8 py-6">
 <div className="h-4 bg-white/30 rounded-lg animate-pulse" />
 </td>
 ))}
 </tr>
 ))
 : rows.map((row, i) => (
 <FacilityRow
 key={`${row.assetType}-${i}`}
 row={row}
 isLast={i === rows.length - 1}
 />
 ))}
 </tbody>
 </table>
 </div>
 </section>
 );
};

export default FacilityHealthTable;

// ── Local hook (kept nearby to avoid adding more files) ──────────────────────
function useEquipmentForFacilityHealth() {
 const [items, setItems] = React.useState([]);
 const [loading, setLoading] = React.useState(true);

 React.useEffect(() => {
 let mounted = true;
 (async () => {
 try {
 setLoading(true);
 // reuse existing public endpoint /api/equipments
 const { data } = await technicianApiRawGetEquipments();
 if (!mounted) return;
 setItems(Array.isArray(data) ? data : []);
 } finally {
 if (!mounted) return;
 setLoading(false);
 }
 })();
 return () => { mounted = false; };
 }, []);

 return { items, loading };
}

async function technicianApiRawGetEquipments() {
 // We intentionally reuse the app axios instance to keep auth/cookies consistent.
 const api = (await import('@/lib/axios')).default;
 return api.get('/equipments');
}
