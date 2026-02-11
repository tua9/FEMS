
import React, { useState } from 'react';
import { PENDING_REQUESTS } from './constants';
import { RequestStatus } from './types';

const getEquipmentIcon = (equipmentName: string): string => {
  const name = equipmentName.toLowerCase();
  if (name.includes('macbook') || name.includes('laptop')) return 'laptop_mac';
  if (name.includes('ipad') || name.includes('tablet')) return 'tablet_mac';
  if (name.includes('projector')) return 'videocam';
  if (name.includes('camera') || name.includes('dslr')) return 'camera';
  if (name.includes('monitor')) return 'desktop_windows';
  if (name.includes('arduino') || name.includes('robotics')) return 'psychology';
  return 'devices';
};

const BorrowApproval: React.FC = () => {
  const [requests, setRequests] = useState(PENDING_REQUESTS);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const handleExport = () => {
    const rows = filteredRequests.map(r => ({
      id: r.id,
      studentName: r.studentName,
      studentId: r.studentId,
      equipmentName: r.equipmentName,
      assetId: r.assetId,
      period: r.period,
      category: r.category,
      status: r.status,
    }));

    if (rows.length === 0) {
      alert('No rows to export');
      return;
    }

    const csvHeader = Object.keys(rows[0] || {}).join(',') + "\n";
    const csvBody = rows.map(r => Object.values(r).map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const csv = csvHeader + csvBody;

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'borrow_requests.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleAction = (id: string, newStatus: RequestStatus) => {
    setRequests(prev => prev.filter(r => r.id !== id));
    alert(`Request ${id} has been ${newStatus.toLowerCase()}`);
  };

  return (
    <div className="pt-32 pb-10 px-6 max-w-[1400px] mx-auto animate-in fade-in duration-500">
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#1E2B58] dark:text-white tracking-tight">
            Student Request <span className="opacity-50 font-light">/</span> <span className="text-slate-600">Approval Center</span>
          </h2>
          <p className="mt-4 text-slate-500 max-w-2xl text-lg leading-relaxed">
            Review pending equipment and facility borrow requests. All approvals are logged for academic compliance.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="glass-card px-8 py-5 rounded-3xl flex flex-col items-center justify-center min-w-[150px]">
            <span className="text-4xl font-black text-[#1E2B58] dark:text-white">{requests.length}</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-50 mt-1">Pending</span>
          </div>
        </div>
      </header>

      <div className="glass-card rounded-3xl overflow-hidden shadow-xl">
        {/* Search / Filters / Export */}
        <div className="p-6 border-b border-white/10 flex flex-col md:flex-row items-center gap-4">
          <div className="flex-1 w-full">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by student name, ID or asset..."
                className="w-full pl-12 pr-4 py-3 rounded-full bg-white/60 dark:bg-slate-900/40 border-none outline-none text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 rounded-full bg-white/40 dark:bg-slate-800/40 text-sm border-none outline-none"
            >
              <option value="All">All</option>
              <option value="Academic Project">Academic Project</option>
              <option value="Lab Session">Lab Session</option>
              <option value="External Event">External Event</option>
            </select>

            <button
              type="button"
              onClick={() => {/* placeholder for more advanced filters */ }}
              className="px-4 py-2 rounded-full bg-white/80 dark:bg-slate-800/60 text-sm border border-white/20"
            >
              Filters
            </button>

            <button
              type="button"
              onClick={handleExport}
              className="px-5 py-2 rounded-full bg-[#1E2B58] text-white shadow-md hover:bg-[#162042] transition-colors"
            >
              Export Log
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-white/20 dark:bg-white/5 border-b border-white/40 dark:border-white/5">
                <th className="px-8 py-7 text-left text-[11px] font-black uppercase tracking-[0.25em] text-[#1E2B58]/60">Student Info</th>
                <th className="px-8 py-7 text-left text-[11px] font-black uppercase tracking-[0.25em] text-[#1E2B58]/60">Equipment</th>
                <th className="px-8 py-7 text-left text-[11px] font-black uppercase tracking-[0.25em] text-[#1E2B58]/60">Period</th>
                <th className="px-8 py-7 text-right text-[11px] font-black uppercase tracking-[0.25em] text-[#1E2B58]/60">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/20">
              {requests
                .filter(r => {
                  const q = search.trim().toLowerCase();
                  if (categoryFilter !== 'All' && r.category !== categoryFilter) return false;
                  if (!q) return true;
                  return (
                    r.studentName.toLowerCase().includes(q) ||
                    r.studentId.toLowerCase().includes(q) ||
                    r.equipmentName.toLowerCase().includes(q) ||
                    r.assetId.toLowerCase().includes(q)
                  );
                })
                .map((req) => (
                  <tr key={req.id} className="hover:bg-white/10 transition-all">
                    <td className="px-8 py-8">
                      <div className="flex items-center gap-4">
                        <img src={req.studentAvatar} alt={req.studentName} className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-sm" />
                        <div>
                          <p className="font-bold text-[#1E2B58] dark:text-white">{req.studentName}</p>
                          <p className="text-[11px] text-slate-500 font-bold uppercase">ID: {req.studentId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-8">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#1E2B58]/10 dark:bg-white/10 flex items-center justify-center text-[#1E2B58] dark:text-white">
                          <span className="material-symbols-outlined text-xl">{getEquipmentIcon(req.equipmentName)}</span>
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 dark:text-slate-200">{req.equipmentName}</p>
                          <p className="text-xs text-slate-500">Asset: {req.assetId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-8">
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{req.period}</p>
                      <p className="text-[10px] text-[#1E2B58] dark:text-accent-blue font-black uppercase mt-1 tracking-wider">{req.category}</p>
                    </td>
                    <td className="px-8 py-8 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => handleAction(req.id, RequestStatus.REJECTED)}
                          className="px-5 py-3 rounded-xl border border-[#1E2B58]/20 hover:bg-red-50 hover:text-red-600 transition-all text-xs font-bold text-[#1E2B58] dark:text-white"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleAction(req.id, RequestStatus.APPROVED)}
                          className="bg-[#1E2B58] dark:bg-[#1E2B58] hover:bg-[#162042] text-white px-7 py-3 rounded-full text-xs font-bold transition-all shadow-md hover:shadow-lg"
                        >
                          Approve
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {requests.length === 0 && (
            <div className="p-20 text-center text-slate-400 font-bold uppercase tracking-widest">
              No pending requests
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BorrowApproval;
