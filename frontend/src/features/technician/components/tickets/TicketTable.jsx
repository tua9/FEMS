import React from 'react';
import {
 getStatusDisplay,
} from '@/mocks/technician/mockTickets';

const Avatar = ({
 name, initials, src,
}) => (
 <div className="flex items-center gap-3">
 {src ? (
 <img src={src} alt={initials} className="w-8 h-8 rounded-full border border-white object-cover" />
 ) : (
 <div className="w-8 h-8 rounded-full bg-slate-200 border border-white flex items-center justify-center text-[10px] font-bold text-slate-700 shrink-0">
 {initials}
 </div>
 )}
 <span className="font-semibold text-slate-700">{name}</span>
 </div>
);

const ActionButtons = ({ id, status, onView, onApprove, onReject, onStartRepair, onMarkResolved }) => {
 const viewBtn = ( <button
 onClick={() => onView?.(id)}
 className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-white dark:hover:bg-slate-700 transition-all"
 >
 View
 </button>
 );

 if (status === 'Pending') {
 return (
 <div className="flex justify-end gap-2">
 {viewBtn}
 <button
 onClick={() => onReject?.(id)}
 className="px-4 py-2 rounded-xl border border-rose-200 text-rose-500 text-xs font-bold hover:bg-rose-50 transition-all"
 >
 Reject
 </button>
 <button
 onClick={() => onApprove?.(id)}
 className="px-4 py-2 rounded-xl bg-[#232F58] text-white text-xs font-bold hover:opacity-90 shadow-sm transition-all"
 >
 Approve
 </button>
 </div>
 );
 }

 if (status === 'Approved') {
 return (
 <div className="flex justify-end gap-2">
 {viewBtn}
 <button
 onClick={() => onStartRepair?.(id)}
 className="px-4 py-2 rounded-xl bg-[#232F58] text-white text-xs font-bold hover:opacity-90 shadow-sm transition-all"
 >
 Start Repair
 </button>
 </div>
 );
 }

 if (status === 'In Progress') {
 return (
 <div className="flex justify-end gap-2">
 {viewBtn}
 <button
 onClick={() => onMarkResolved?.(id)}
 className="px-4 py-2 rounded-xl bg-[#232F58] text-white text-xs font-bold hover:opacity-90 shadow-sm transition-all"
 >
 Mark Resolved
 </button>
 </div>
 );
 }

 // Rejected / Completed — view only
 return <div className="flex justify-end">{viewBtn}</div>;
};

// Column header changes for "In Progress" tab
const HEADERS_DEFAULT = ['Ticket ID', 'Equipment', 'Room', 'Reporter', 'Status', 'Actions'];
// In Progress: show assigned technician under a header named "Reporter" per request
const HEADERS_IN_PROGRESS = ['Ticket ID', 'Equipment', 'Room', 'Reporter', 'Status', 'Actions'];

const TicketTable = ({
 tickets,
 activeStatus,
 currentPage,
 itemsPerPage,
 onView,
 onApprove,
 onReject,
 onStartRepair,
 onMarkResolved,
}) => {
 const headers = activeStatus === 'In Progress' ? HEADERS_IN_PROGRESS : HEADERS_DEFAULT;
 const paged = tickets.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

 if (paged.length === 0) {
 return (
 <div className="flex flex-col items-center justify-center py-24 text-slate-400">
 <span className="material-symbols-outlined text-5xl mb-3 opacity-40">task_alt</span>
 <p className="text-sm font-semibold">No tickets found</p>
 </div>
 );
 }

 return (
 <table className="w-full text-left table-fixed">
 <colgroup>
 <col style={{ width: '120px' }} /> {/* Ticket ID */}
 <col style={{ width: '220px' }} /> {/* Equipment */}
 <col style={{ width: '170px' }} /> {/* Room */}
 <col style={{ width: '200px' }} /> {/* Reporter / Assignee */}
 <col style={{ width: '140px' }} /> {/* Status */}
 <col style={{ width: '240px' }} /> {/* Actions */}
 </colgroup>
 <thead>
 <tr
 style={{
 background: 'rgba(26,43,86,0.06)',
 borderTop: '1px solid rgba(26,43,86,0.08)',
 borderBottom: '1px solid rgba(26,43,86,0.10)',
 }}
 >
 {headers.map((h, i) => (
 <th
 key={h}
 className={`px-5 py-4 ${i === headers.length - 1 ? 'text-right' : ''}`}
 >
 <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-[#1A2B56] dark:text-blue-200 uppercase tracking-[0.15em]">
 {h}
 </span>
 </th>
 ))}
 </tr>
 </thead>
 <tbody className="text-sm">
 {paged.map((ticket, rowIdx) => {
 const statusDisplay = getStatusDisplay(ticket.status);
 const person = activeStatus === 'In Progress' ? ticket.reporter : ticket.reporter;

 return (
 <tr
 key={ticket.id}
 className="hover:bg-white/30 dark:hover:bg-white/5 transition-colors"
 style={{
 borderBottom: rowIdx < paged.length - 1
 ? '1px solid rgba(26,43,86,0.06)'
 : 'none',
 }}
 >
 {/* Ticket ID */}
 <td className="px-5 py-6">
 <span className="font-extrabold text-[#1A2B56] dark:text-blue-400 text-sm tracking-tight">
 #{ticket.code || ticket.id.slice(-6).toUpperCase()}
 </span>
 </td>

 {/* Equipment */}
 <td className="px-5 py-6">
 <div className="font-bold text-slate-900 dark:text-white truncate">{ticket.equipment}</div>
 <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-tight mt-0.5 truncate">{ticket.equipmentType}</div>
 </td>

 {/* Room */}
 <td className="px-5 py-6 text-slate-600 dark:text-slate-300 font-medium truncate">{ticket.room}</td>

 {/* Reporter */}
 <td className="px-5 py-6">
 {person ? (
 <Avatar name={person.name} initials={person.initials} src={'avatar' in person ? person.avatar : undefined} />
 ) : (
 <span className="text-slate-400 text-xs">—</span>
 )}
 </td>

 {/* Status — badge style */}
 <td className="px-5 py-6">
 <span
 className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider whitespace-nowrap"
 style={{ background: statusDisplay.bgColor, color: statusDisplay.textColor }}
 >
 <span
 className="w-1.5 h-1.5 rounded-full shrink-0"
 style={{ background: statusDisplay.dotColor }}
 ></span>
 {statusDisplay.label}
 </span>
 </td>

 {/* Actions */}
 <td className="px-5 py-6 text-right">
 <ActionButtons
 id={ticket.id}
 status={ticket.status}
 onView={onView}
 onApprove={onApprove}
 onReject={onReject}
 onStartRepair={onStartRepair}
 onMarkResolved={onMarkResolved}
 />
 </td>
 </tr>
 );
 })}
 </tbody>
 </table>
 );
};

export default TicketTable;
