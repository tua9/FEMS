import React from 'react';
import {
  getFacilityRows,
  type FacilityRow as FacilityRowData,
  type DateRangeDays,
  getCriticalityStyle,
  getTrendIcon,
} from '@/data/technician/mockReports';

interface Props { dateRangeDays: DateRangeDays }

// ── Single table row ──────────────────────────────────────────────────────────
const FacilityRow: React.FC<{ row: FacilityRowData; isLast: boolean }> = ({ row, isLast }) => {
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

// ── Section component ─────────────────────────────────────────────────────────
const FacilityHealthTable: React.FC<Props> = ({ dateRangeDays }) => {
  const rows = getFacilityRows(dateRangeDays);

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
            {rows.map((row, i) => (
              <FacilityRow
                key={row.assetType}
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


