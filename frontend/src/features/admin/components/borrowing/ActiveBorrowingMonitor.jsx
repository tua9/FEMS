import React, { useEffect, useState, useCallback } from 'react';
import { useAdminStore } from '@/stores/useAdminStore';
import CustomDropdown from '@/features/shared/components/CustomDropdown';

// Maps borrow request status → display status
const REQUEST_STATUS_MAP = {
  pending: { label: 'Pending Approval', color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' },
  approved: { label: 'Approved', color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
  handed_over: { label: 'In Use', color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' },
  overdue: { label: 'Overdue', color: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' },
  returned: { label: 'Returning', color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' },
};

const EQUIP_STATUS_MAP = {
  good: { label: 'Available', color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' },
  broken: { label: 'Broken', color: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' },
  maintenance: { label: 'Maintenance', color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' },
};

function getEquipStatus(eq, reqStatus) {
  if (reqStatus === 'handed_over') return { label: 'In Use', color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' };
  if (reqStatus === 'approved') return { label: 'Locked', color: 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400' };
  if (eq?.status === 'broken') return EQUIP_STATUS_MAP.broken;
  if (eq?.status === 'maintenance') return EQUIP_STATUS_MAP.maintenance;
  return EQUIP_STATUS_MAP.good;
}

function TimeRemaining({ slotRange, currentTimeMinutes }) {
  const [remaining, setRemaining] = useState('');

  useEffect(() => {
    const calc = () => {
      const now = new Date();
      const vnNow = new Date(now.getTime() + 7 * 60 * 60 * 1000);
      const cur = vnNow.getUTCHours() * 60 + vnNow.getUTCMinutes();
      const diff = slotRange.end - cur;
      if (diff <= 0) { setRemaining('Ended'); return; }
      const h = Math.floor(diff / 60);
      const m = diff % 60;
      setRemaining(h > 0 ? `${h}h ${m.toString().padStart(2, '0')}m` : `${m}m`);
    };
    calc();
    const id = setInterval(calc, 60000);
    return () => clearInterval(id);
  }, [slotRange]);

  return <span>{remaining}</span>;
}

const ActiveBorrowingMonitor = () => {
  const { activeBorrowing, fetchActiveBorrowing } = useAdminStore();

  const [roomFilter, setRoomFilter] = useState('All');
  const [courseFilter, setCourseFilter] = useState('All');
  const [lecturerFilter, setLecturerFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const load = useCallback(() => fetchActiveBorrowing(), [fetchActiveBorrowing]);

  useEffect(() => {
    load();
    // Refresh every 2 minutes
    const id = setInterval(load, 120000);
    return () => clearInterval(id);
  }, [load]);

  if (!activeBorrowing) {
    return (
      <div className="dashboard-card p-8 rounded-4xl flex items-center justify-center min-h-[120px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1A2B56] dark:border-blue-400" />
      </div>
    );
  }

  const { active, sessions = [], currentSlot, slotRange, currentTimeMinutes } = activeBorrowing;

  // Flatten all equipment rows across sessions
  const allRows = sessions.flatMap((session) =>
    session.equipment.map((eq) => ({ ...eq, session }))
  );

  // Build filter option lists
  const rooms = ['All', ...new Set(sessions.map((s) => s.room?.name).filter(Boolean))];
  const courses = ['All', ...new Set(sessions.map((s) => s.course).filter(Boolean))];
  const lecturers = ['All', ...new Set(sessions.map((s) => s.lecturer?.displayName || s.lecturer?.username).filter(Boolean))];
  const statuses = ['All', 'Pending Approval', 'Approved', 'In Use', 'Returning'];

  const filteredRows = allRows.filter((row) => {
    const roomName = row.session.room?.name || '';
    const course = row.session.course || '';
    const lecturer = row.session.lecturer?.displayName || row.session.lecturer?.username || '';
    const reqStatusLabel = REQUEST_STATUS_MAP[row.requestStatus]?.label || '';

    if (roomFilter !== 'All' && roomName !== roomFilter) return false;
    if (courseFilter !== 'All' && course !== courseFilter) return false;
    if (lecturerFilter !== 'All' && lecturer !== lecturerFilter) return false;
    if (statusFilter !== 'All' && reqStatusLabel !== statusFilter) return false;
    return true;
  });

  const slotLabel = currentSlot
    ? `${currentSlot.name || `Slot ${currentSlot.order}`}`
    : '';

  return (
    <div className="dashboard-card p-8 rounded-4xl transition-all duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h4 className="font-extrabold text-[#1A2B56] dark:text-white text-lg">
            Active Borrowing Monitor
          </h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            {active
              ? <>Real-time — <span className="font-semibold text-emerald-500">{slotLabel} in progress</span> · {sessions.length} session(s) · {allRows.length} equipment</>
              : <span className="text-slate-400">No active slot right now</span>}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${active ? 'bg-emerald-400 animate-pulse' : 'bg-slate-300'}`} />
          <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
            {active ? 'Live' : 'Idle'}
          </span>
          <button
            onClick={load}
            className="ml-2 p-1.5 rounded-lg text-slate-400 hover:text-[#1A2B56] hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            title="Refresh"
          >
            <span className="material-symbols-outlined text-[18px]">refresh</span>
          </button>
        </div>
      </div>

      {/* Filter bar */}
      {active && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <div className="dashboard-card rounded-2xl flex items-center p-0.5">
            <CustomDropdown value={roomFilter} options={rooms.map(r => ({ value: r, label: r === 'All' ? 'All Rooms' : r }))} onChange={setRoomFilter} align="left" />
            <div className="h-4 w-px bg-slate-200 dark:bg-slate-600 mx-0.5" />
            <CustomDropdown value={courseFilter} options={courses.map(c => ({ value: c, label: c === 'All' ? 'All Courses' : c }))} onChange={setCourseFilter} align="left" />
            <div className="h-4 w-px bg-slate-200 dark:bg-slate-600 mx-0.5" />
            <CustomDropdown value={lecturerFilter} options={lecturers.map(l => ({ value: l, label: l === 'All' ? 'All Lecturers' : l }))} onChange={setLecturerFilter} align="left" />
            <div className="h-4 w-px bg-slate-200 dark:bg-slate-600 mx-0.5" />
            <CustomDropdown value={statusFilter} options={statuses.map(s => ({ value: s, label: s === 'All' ? 'All Status' : s }))} onChange={setStatusFilter} align="right" />
            <div className="h-4 w-px bg-slate-200 dark:bg-slate-600 mx-0.5" />
            <button
              onClick={() => { setRoomFilter('All'); setCourseFilter('All'); setLecturerFilter('All'); setStatusFilter('All'); }}
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              title="Reset filters"
            >
              <span className="material-symbols-outlined text-[16px]">filter_alt_off</span>
            </button>
          </div>
        </div>
      )}

      {/* No active slot */}
      {!active && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-600 mb-3">schedule</span>
          <p className="text-sm font-semibold text-slate-400 dark:text-slate-500">No active class slot right now</p>
          <p className="text-[11px] text-slate-300 dark:text-slate-600 mt-1">
            Slots: 07:00–09:15 · 09:30–11:45 · 12:30–14:45 · 15:00–17:15
          </p>
        </div>
      )}

      {/* Active but no data */}
      {active && filteredRows.length === 0 && (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <span className="material-symbols-outlined text-3xl text-slate-300 dark:text-slate-600 mb-2">inventory_2</span>
          <p className="text-sm font-semibold text-slate-400 dark:text-slate-500">No active borrowing</p>
        </div>
      )}

      {/* Table */}
      {active && filteredRows.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-y-2 min-w-[720px]">
            <thead>
              <tr className="text-slate-500 dark:text-slate-400">
                {['Session', 'Room', 'Lecturer', 'Equipment', 'Status', 'Borrowed By', 'Time Remaining', 'Request Status'].map((h) => (
                  <th key={h} className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.15em]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row, idx) => {
                const { session, equipment, requestStatus, borrowedBy, requestId } = row;
                const eqStatus = getEquipStatus(equipment, requestStatus);
                const reqDisplay = REQUEST_STATUS_MAP[requestStatus] || { label: requestStatus, color: 'bg-slate-100 text-slate-500' };
                const borrowerName = requestStatus === 'handed_over'
                  ? (borrowedBy?.displayName || borrowedBy?.username || '—')
                  : '—';
                const rowBg = "bg-white/50 dark:bg-slate-800/40 backdrop-blur-sm";

                return (
                  <tr key={`${requestId}-${idx}`} className="group">
                    <td className={`p-3 rounded-l-lg text-xs font-semibold text-slate-700 dark:text-white ${rowBg}`}>
                      <div className="truncate max-w-[120px]">{session.course || '—'}</div>
                      <div className="text-[10px] text-slate-400 font-normal truncate">
                        {session.class?.code || session.class?.name || ''}
                      </div>
                    </td>
                    <td className={`p-3 text-xs font-medium text-slate-600 dark:text-slate-300 ${rowBg}`}>
                      {session.room?.name || '—'}
                    </td>
                    <td className={`p-3 text-xs text-slate-600 dark:text-slate-300 ${rowBg}`}>
                      <div className="truncate max-w-[100px]">
                        {session.lecturer?.displayName || session.lecturer?.username || '—'}
                      </div>
                    </td>
                    <td className={`p-3 ${rowBg}`}>
                      <p className="text-xs font-semibold text-slate-800 dark:text-white truncate max-w-[100px]">
                        {equipment?.name || '—'}
                      </p>
                      <p className="text-[10px] text-[#1A2B56] dark:text-blue-400 font-black uppercase tracking-wider mt-0.5">
                        {equipment?.code || ''}
                      </p>
                    </td>
                    <td className={`p-3 ${rowBg}`}>
                      <span className={`px-2 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide inline-flex items-center ${eqStatus.color}`}>
                        {eqStatus.label}
                      </span>
                    </td>
                    <td className={`p-3 text-xs text-slate-600 dark:text-slate-300 ${rowBg}`}>
                      {requestStatus === 'handed_over' ? (
                        <div className="flex items-center gap-1.5">
                          <div className="w-6 h-6 rounded-full bg-[#1A2B56] text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                            {borrowerName.charAt(0)}
                          </div>
                          <span className="truncate max-w-[80px] text-xs">{borrowerName}</span>
                        </div>
                      ) : (
                        <span className="text-slate-300 dark:text-slate-600">—</span>
                      )}
                    </td>
                    <td className={`p-3 text-xs font-medium text-slate-600 dark:text-slate-300 ${rowBg}`}>
                      {slotRange
                        ? <TimeRemaining slotRange={slotRange} currentTimeMinutes={currentTimeMinutes} />
                        : '—'}
                    </td>
                    <td className={`p-3 rounded-r-lg ${rowBg}`}>
                      <span className={`px-2 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide inline-flex items-center whitespace-nowrap ${reqDisplay.color}`}>
                        {reqDisplay.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ActiveBorrowingMonitor;
