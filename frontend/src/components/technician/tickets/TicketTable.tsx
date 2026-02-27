import React from 'react';
import {
  Ticket,
  TicketStatus,
  getPriorityStyle,
  getStatusDisplay,
} from '@/data/technician/mockTickets';

interface Props {
  tickets: Ticket[];
  activeStatus: TicketStatus;
  currentPage: number;
  itemsPerPage: number;
  onView?: (id: string) => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onStartRepair?: (id: string) => void;
  onMarkResolved?: (id: string) => void;
}

const Avatar: React.FC<{ name: string; initials: string; src?: string }> = ({
  name, initials, src,
}) => (
  <div className="flex items-center gap-3">
    {src ? (
      <img src={src} alt={initials} className="w-8 h-8 rounded-full border border-white object-cover" />
    ) : (
      <div className="w-8 h-8 rounded-full bg-slate-200 border border-white flex items-center justify-center text-[10px] font-bold text-slate-700 flex-shrink-0">
        {initials}
      </div>
    )}
    <span className="font-semibold text-slate-700">{name}</span>
  </div>
);

const ActionButtons: React.FC<{
  id: string;
  status: TicketStatus;
  onView?: (id: string) => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onStartRepair?: (id: string) => void;
  onMarkResolved?: (id: string) => void;
}> = ({ id, status, onView, onApprove, onReject, onStartRepair, onMarkResolved }) => {
  const viewBtn = (
    <button
      onClick={() => onView?.(id)}
      className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-white transition-all"
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

// Column header changes for "In Progress" tab (Technician Assigned instead of Reporter)
const HEADERS_DEFAULT = ['Ticket ID', 'Equipment', 'Room', 'Reporter', 'Priority', 'Status', 'Actions'];
const HEADERS_IN_PROGRESS = ['Ticket ID', 'Equipment', 'Room', 'Technician Assigned', 'Priority', 'Status', 'Actions'];

const TicketTable: React.FC<Props> = ({
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
    <table className="w-full text-left">
      <thead>
        <tr className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest border-b border-white/20">
          {headers.map((h, i) => (
            <th key={h} className={`px-8 py-6 ${i === headers.length - 1 ? 'text-right' : ''}`}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody className="text-sm divide-y divide-white/20">
        {paged.map((ticket) => {
          const statusDisplay = getStatusDisplay(ticket.status);
          const person = activeStatus === 'In Progress' ? ticket.assignee : ticket.reporter;

          return (
            <tr key={ticket.id} className="hover:bg-white/20 transition-colors">
              {/* Ticket ID */}
              <td className="px-8 py-6 font-bold text-[#232F58]">#{ticket.id}</td>

              {/* Equipment */}
              <td className="px-8 py-6">
                <div className="font-bold text-slate-900">{ticket.equipment}</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-tight">{ticket.equipmentType}</div>
              </td>

              {/* Room */}
              <td className="px-8 py-6 text-slate-600 font-medium">{ticket.room}</td>

              {/* Reporter / Assignee */}
              <td className="px-8 py-6">
                {person ? (
                  <Avatar name={person.name} initials={person.initials} src={'avatar' in person ? (person as { name: string; initials: string; avatar?: string }).avatar : undefined} />
                ) : (
                  <span className="text-slate-400 text-xs">—</span>
                )}
              </td>

              {/* Priority */}
              <td className="px-8 py-6">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getPriorityStyle(ticket.priority)}`}>
                  {ticket.priority}
                </span>
              </td>

              {/* Status */}
              <td className="px-8 py-6">
                <span className={`flex items-center gap-2 font-bold text-xs uppercase ${statusDisplay.color}`}>
                  <span className={`w-2 h-2 rounded-full ${statusDisplay.dot}`}></span>
                  {statusDisplay.label}
                </span>
              </td>

              {/* Actions */}
              <td className="px-8 py-6 text-right">
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
