import { useTasks } from '@/hooks/technician/useTasks';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TicketViewModal from '@/features/technician/components/tickets/TicketViewModal';
import TicketApproveModal from '@/features/technician/components/tickets/TicketApproveModal';
import TicketRejectModal from '@/features/technician/components/tickets/TicketRejectModal';

// ── Convert Task → Ticket (shape expected by the shared modals) ───────────────
function taskToTicket(task) {
 return {
 id: task.id,
 equipment: task.equipment,
 equipmentType: 'Other',
 room: `${task.location.building}, ${task.location.room}`,
 reporter: {
 name: task.reportedBy.name,
 initials: task.reportedBy.name
 .split(' ')
 .slice(0, 2)
 .map((w) => w[0])
 .join('')
 .toUpperCase(),
 },
 priority: task.priority,
 // Normalize to the modal's expected status set (Pending/Approved/In Progress/Completed/Rejected)
 status: (task.status === 'Cancelled' ? 'Rejected' : (task.status)),
 createdAt: task.createdAt,
 };
}

// ── Priority pill styling (same) ───────────────────────────────
const getPriorityStyle = (priority) => {
 const map= {
 Urgent: 'bg-rose-100 text-rose-600',
 High: 'bg-rose-100 text-rose-600',
 Medium: 'bg-amber-100 text-amber-600',
 Low: 'bg-emerald-100 text-emerald-600',
 };
 return map[priority] ?? map.Medium;
};

const getPriorityLabel = (priority) =>
 priority === 'Medium' ? 'Med' : priority;

// ── Modal state type ──────────────────────────────────────────────────────────
const TaskQueue = () => {
 const navigate = useNavigate();
 const [currentPage, setCurrentPage] = useState(1);
 const [modal, setModal] = useState(null);
 const [selected, setSelected] = useState(null);
 const { tasks, loading } = useTasks({});

 const itemsPerPage = 3;
 const totalCount = tasks.length;
 const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage));
 const displayTasks= tasks.slice(
 (currentPage - 1) * itemsPerPage,
 currentPage * itemsPerPage,
 );

 const open = (kind, task) => { setSelected(task); setModal(kind); };
 const close = () => { setModal(null); setSelected(null); };

 const ticket = selected ? taskToTicket(selected) : null;

 return (
 <>
 <div className="dashboard-card rounded-3xl overflow-hidden">
 {/* ── Header ── */}
 <div className="px-8 py-6 border-b border-white/20 flex justify-between items-center">
 <h3 className="text-sm font-bold text-[#1A2B56] dark:text-white uppercase tracking-widest">
 Active Work Orders
 </h3>
 <button
 onClick={() => navigate('/technician/tasks')}
 className="text-xs font-bold text-[#1A2B56]/70 dark:text-slate-400 hover:text-[#1A2B56] dark:hover:text-white transition-all uppercase tracking-wider"
 >
 View All Tickets
 </button>
 </div>

 {/* ── Table ── */}
 <div className="overflow-x-auto">
 <table className="w-full text-left table-fixed">
 <colgroup>
 <col style={{ width: '12%' }} />
 <col style={{ width: '16%' }} />
 <col style={{ width: '17%' }} />
 <col style={{ width: '22%' }} />
 <col style={{ width: '10%' }} />
 <col style={{ width: '11%' }} />
 <col style={{ width: '12%' }} />
 </colgroup>
 <thead>
 <tr
 style={{
 background: 'rgba(26,43,86,0.06)',
 borderTop: '1px solid rgba(26,43,86,0.08)',
 borderBottom: '1px solid rgba(26,43,86,0.10)',
 }}
 >
 {[
 'Ticket ID', 'Report Subject', 'Location', 'Issue',
 'Priority', 'Status', 'Actions',
 ].map((label, i) => (
 <th key={label} className={`px-8 py-4 ${i === 6 ? 'text-right' : ''}`}>
 <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-[#1A2B56] dark:text-blue-200 uppercase tracking-[0.15em]">
 {label}
 </span>
 </th>
 ))}
 </tr>
 </thead>

 <tbody className="text-sm">
 {loading ? (
 [...Array(3)].map((_, i) => (
 <tr key={i} className="border-b border-white/5">
 {[...Array(7)].map((_, j) => (
 <td key={j} className="px-8 py-5">
 <div className="h-4 bg-white/30 rounded-lg animate-pulse" />
 </td>
 ))}
 </tr>
 )))
 : displayTasks.map((task, idx) => {
 const isLast = idx === displayTasks.length - 1;
 const isCompleted = task.status === 'Completed';

 const reportSubject =
 (task.equipment && task.equipment.trim())
 ? task.equipment
 : (task.location?.room?.trim() ? task.location.room : 'N/A');

 return (
 <tr
 key={task.id}
 className={`hover:bg-white/20 transition-colors ${!isLast ? 'border-b border-white/5' : ''}`}
 >
 {/* Ticket ID */}
 <td className="px-8 py-5">
 <span className="font-extrabold text-[#1A2B56] dark:text-blue-400 text-sm tracking-tight">
 #{task.id}
 </span>
 </td>

 {/* Report Subject */}
 <td className="px-8 py-5 max-w-0">
 <div className="font-bold text-slate-800 dark:text-white truncate">
 {reportSubject}
 </div>
 </td>

 {/* Location */}
 <td className="px-8 py-5 max-w-0">
 <div className="font-bold text-slate-800 dark:text-white truncate">{task.location.building}</div>
 <div className="text-[10px] text-slate-500 mt-0.5 truncate">
 {task.location.room}
 </div>
 </td>

 {/* Issue (description) */}
 <td className="px-8 py-5 max-w-0">
 <span className="block font-bold text-slate-600 dark:text-slate-300 truncate">
 {task.issue}
 </span>
 </td>

 {/* Priority */}
 <td className="px-8 py-5">
 <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${getPriorityStyle(task.priority)}`}>
 {getPriorityLabel(task.priority)}
 </span>
 </td>

 {/* Status */}
 <td className="px-8 py-5">
 {isCompleted ? (
 <span className="flex items-center gap-1.5 text-emerald-600 font-bold text-[10px]">
 <span className="w-1 h-1 rounded-full bg-emerald-500" /> COMPLETED
 </span>
 ) : (
 <span className="flex items-center gap-1.5 font-bold text-[10px]" style={{ color: '#b45309' }}>
 <span className="w-1 h-1 rounded-full" style={{ background: '#f59e0b' }} /> PENDING
 </span>
 )}
 </td>

 {/* Actions */}
 <td className="px-8 py-5 text-right">
 <div className="flex justify-end gap-3 pointer-events-auto">
 {/* View (always available) */}
 <button
 type="button"
 onClick={(e) => { e.preventDefault(); e.stopPropagation(); open('view', task); }}
 aria-label="View"
 title="View"
 className="w-11 h-11 rounded-2xl border border-slate-200/80 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-white/70 dark:hover:bg-slate-700 transition-all inline-flex items-center justify-center shadow-sm"
 >
 <span className="material-symbols-outlined text-[20px]">visibility</span>
 </button>

 {/* Reject */}
 <button
 type="button"
 onClick={(e) => { e.preventDefault(); e.stopPropagation(); open('reject', task); }}
 aria-label="Reject"
 title={task.status === 'Pending' ? 'Reject' : 'Reject (only for Pending)'}
 disabled={task.status !== 'Pending'}
 className={`w-11 h-11 rounded-2xl border transition-all inline-flex items-center justify-center shadow-sm \
${task.status === 'Pending'
 ? 'border-rose-200 text-rose-500 hover:bg-rose-50'
 : 'border-slate-200/60 text-slate-300 cursor-not-allowed opacity-60'
}`}
 >
 <span className="material-symbols-outlined text-[20px]">close</span>
 </button>

 {/* Approve */}
 <button
 type="button"
 onClick={(e) => { e.preventDefault(); e.stopPropagation(); open('approve', task); }}
 aria-label="Approve"
 title={task.status === 'Pending' ? 'Approve' : 'Approve (only for Pending)'}
 disabled={task.status !== 'Pending'}
 className={`w-11 h-11 rounded-2xl transition-all inline-flex items-center justify-center shadow-md \
${task.status === 'Pending'
 ? 'bg-[#232F58] text-white hover:opacity-90'
 : 'bg-slate-200/70 text-slate-400 cursor-not-allowed opacity-70'
}`}
 >
 <span className="material-symbols-outlined text-[20px]">check</span>
 </button>
 </div>
 </td>
 </tr>
 );
 })
 }
 </tbody>
 </table>
 </div>

 {/* ── Pagination ── */}
 <div className="px-8 py-5 bg-white/10 dark:bg-black/10 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
 <span>Showing {Math.min(itemsPerPage, displayTasks.length)} of {totalCount} Tickets</span>
 <div className="flex items-center gap-2">
 <button
 onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
 disabled={currentPage === 1}
 className="w-7 h-7 rounded-lg flex items-center justify-center bg-white/50 dark:bg-white/10 text-slate-400 hover:bg-white dark:hover:bg-white/20 transition-all shadow-sm disabled:opacity-30"
 >
 <span className="material-symbols-outlined text-sm">chevron_left</span>
 </button>
 {[...Array(Math.min(totalPages, 3))].map((_, i) => (
 <button
 key={i + 1}
 onClick={() => setCurrentPage(i + 1)}
 className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold transition-all shadow-sm ${
 currentPage === i + 1
 ? 'bg-[#1A2B56] text-white'
 : 'bg-white/50 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-white/20'
 }`}
 >
 {i + 1}
 </button>
 ))}
 <button
 onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
 disabled={currentPage === totalPages}
 className="w-7 h-7 rounded-lg flex items-center justify-center bg-white/50 dark:bg-white/10 text-slate-400 hover:bg-white dark:hover:bg-white/20 transition-all shadow-sm disabled:opacity-30"
 >
 <span className="material-symbols-outlined text-sm">chevron_right</span>
 </button>
 </div>
 </div>
 </div>

 {/* ── Shared Ticket modals (same / Pending tab) ── */}
 {ticket && modal === 'view' && (
 <TicketViewModal
 ticket={ticket}
 onClose={close}
 onApprove={() => { close(); open('approve', selected); }}
 onReject={() => { close(); open('reject', selected); }}
 />
 )}

 {ticket && modal === 'approve' && (
 <TicketApproveModal
 ticket={ticket}
 onClose={close}
 onConfirm={(_id) => {
 // TODO: call API
 close();
 }}
 />
 )}

 {ticket && modal === 'reject' && (
 <TicketRejectModal
 ticket={ticket}
 onClose={close}
 onConfirm={(_id) => {
 // TODO: call API
 close();
 }}
 />
 )}
 </>
 );
};

export default TaskQueue;
