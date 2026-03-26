import React from 'react';
import type { Ticket, TicketStatus } from '@/data/technician/mockTickets';
import { getPriorityStyle, getStatusDisplay } from '@/data/technician/mockTickets';

export type SharedTicketTableVariant = 'reporter' | 'assignee';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showingCount: number;
  totalCount: number;
  label?: string;
};

export type SharedTicketTableProps = {
  tickets: Ticket[];
  variant?: SharedTicketTableVariant;
  loading?: boolean;

  // Actions
  onView?: (id: string) => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onStartRepair?: (id: string) => void;
  onMarkResolved?: (id: string) => void;

  // Pagination (optional)
  pagination?: PaginationProps;

  // Row status lookup (controls enable/disable of action buttons)
  getRowStatus?: (t: Ticket) => TicketStatus;
};

const Avatar: React.FC<{ name: string; initials: string; src?: string }> = ({ name, initials, src }) => (
  <div className="flex items-center gap-3 min-w-0">
    {src ? (
      <img src={src} alt={initials} className="w-8 h-8 rounded-full border border-white object-cover shrink-0" />
    ) : (
      <div className="w-8 h-8 rounded-full bg-slate-200 border border-white flex items-center justify-center text-[10px] font-bold text-slate-700 shrink-0">
        {initials}
      </div>
    )}
    <span className="font-semibold text-slate-700 dark:text-slate-200 truncate">{name}</span>
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
      type="button"
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
          type="button"
          onClick={() => onReject?.(id)}
          className="px-4 py-2 rounded-xl border border-rose-200 text-rose-500 text-xs font-bold hover:bg-rose-50 transition-all"
        >
          Reject
        </button>
        <button
          type="button"
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
          type="button"
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
          type="button"
          onClick={() => onMarkResolved?.(id)}
          className="px-4 py-2 rounded-xl bg-[#232F58] text-white text-xs font-bold hover:opacity-90 shadow-sm transition-all"
        >
          Mark Resolved
        </button>
      </div>
    );
  }

  return <div className="flex justify-end">{viewBtn}</div>;
};

const TableSkeleton: React.FC<{ rows: number; cols: number }> = ({ rows, cols }) => (
  <tbody className="text-sm">
    {[...Array(rows)].map((_, i) => (
      <tr key={i} className="border-b border-white/5">
        {[...Array(cols)].map((__, j) => (
          <td key={j} className="px-5 py-6">
            <div className="h-4 bg-white/30 rounded-lg animate-pulse" />
          </td>
        ))}
      </tr>
    ))}
  </tbody>
);

const SharedTicketTable: React.FC<SharedTicketTableProps> = ({
  tickets,
  variant = 'reporter',
  loading,
  onView,
  onApprove,
  onReject,
  onStartRepair,
  onMarkResolved,
  pagination,
  getRowStatus,
}) => {
  const headers = ['Ticket ID', 'Report Subject', 'Room', variant === 'assignee' ? 'Technician Assigned' : 'Reporter', 'Priority', 'Status', 'Actions'];

  // NOTE: Parent must pass already-paged tickets when using this component.
  // This ensures consistent pagination handling and avoids double-slicing.
  // If pagination prop is provided, parent has already filtered the tickets array.
  const visibleTickets = tickets;

  return (
    <>
      <table className="w-full text-left table-fixed">
        <colgroup>
          <col style={{ width: '120px' }} />
          <col style={{ width: '180px' }} />
          <col style={{ width: '170px' }} />
          <col style={{ width: '200px' }} />
          <col style={{ width: '110px' }} />
          <col style={{ width: '140px' }} />
          <col style={{ width: '240px' }} />
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
              <th key={h} className={`px-5 py-4 ${i === headers.length - 1 ? 'text-right' : ''}`}>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-[#1A2B56] dark:text-blue-200 uppercase tracking-[0.15em]">
                  {h}
                </span>
              </th>
            ))}
          </tr>
        </thead>

        {loading ? (
          <TableSkeleton rows={3} cols={7} />
        ) : visibleTickets.length === 0 ? (
          <tbody>
            <tr>
              <td colSpan={7} className="px-6 py-14 text-center text-slate-400">
                <span className="material-symbols-outlined text-4xl mb-2 opacity-40 block">task_alt</span>
                <p className="text-sm font-semibold">No tickets found</p>
              </td>
            </tr>
          </tbody>
        ) : (
          <tbody className="text-sm">
            {visibleTickets.map((ticket, rowIdx) => {
              const status = getRowStatus ? getRowStatus(ticket) : ticket.status;
              const statusDisplay = getStatusDisplay(status);
              const person = variant === 'assignee' ? ticket.assignee : ticket.reporter;

              return (
                <tr
                  key={ticket.id}
                  className="hover:bg-white/30 dark:hover:bg-white/5 transition-colors"
                  style={{
                    borderBottom:
                      rowIdx < visibleTickets.length - 1
                        ? '1px solid rgba(26,43,86,0.06)'
                        : 'none',
                  }}
                >
                  <td className="px-5 py-6">
                    <span className="font-extrabold text-[#1A2B56] dark:text-blue-400 text-sm tracking-tight">
                      #{ticket.code || ticket.id.slice(-6).toUpperCase()}
                    </span>
                  </td>

                  <td className="px-5 py-6 min-w-0">
                    <div className="font-bold text-slate-900 dark:text-white truncate">{ticket.equipment}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-tight mt-0.5 truncate">
                      {ticket.equipmentType}
                    </div>
                  </td>

                  <td className="px-5 py-6 text-slate-600 dark:text-slate-300 font-medium truncate">{ticket.room}</td>

                  <td className="px-5 py-6">
                    {person ? (
                      <Avatar
                        name={person.name}
                        initials={person.initials}
                        src={'avatar' in person ? (person as { avatar?: string }).avatar : undefined}
                      />
                    ) : (
                      <span className="text-slate-400 text-xs">—</span>
                    )}
                  </td>

                  <td className="px-5 py-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${getPriorityStyle(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                  </td>

                  <td className="px-5 py-6">
                    <span
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider whitespace-nowrap"
                      style={{ background: statusDisplay.bgColor, color: statusDisplay.textColor }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: statusDisplay.dotColor }} />
                      {statusDisplay.label}
                    </span>
                  </td>

                  <td className="px-5 py-6 text-right">
                    <ActionButtons
                      id={ticket.id}
                      status={status}
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
        )}
      </table>

      {pagination && (
        <div className="p-8 border-t border-white/20 dark:border-white/5 flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
          <span>
            Showing {pagination.showingCount > 0 ? pagination.showingCount : 0} of {pagination.totalCount}{' '}
            {pagination.label ?? 'tickets'}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => pagination.onPageChange(Math.max(1, pagination.currentPage - 1))}
              disabled={pagination.currentPage === 1}
              className="w-10 h-10 rounded-xl flex items-center justify-center tech-pill dark:text-white shadow-sm disabled:opacity-50 transition-all"
            >
              <span className="material-symbols-outlined text-lg">chevron_left</span>
            </button>

            {(() => {
              // Generate page numbers intelligently with ellipsis
              const pages: (number | 'ellipsis')[] = [];
              const delta = 2;
              const left = pagination.currentPage - delta;
              const right = pagination.currentPage + delta;

              for (let i = 1; i <= pagination.totalPages; i++) {
                if (i === 1 || i === pagination.totalPages || (i >= left && i <= right)) {
                  pages.push(i);
                } else if (
                  (i === left - 1 && left - 1 > 1) ||
                  (i === right + 1 && right + 1 < pagination.totalPages)
                ) {
                  pages.push('ellipsis');
                }
              }

              return pages.map((page, idx) =>
                page === 'ellipsis' ? (
                  <span
                    key={`ellipsis-${idx}`}
                    className="w-10 h-10 flex items-center justify-center text-slate-400 text-sm font-semibold select-none"
                  >
                    ···
                  </span>
                ) : (
                  <button
                    key={page}
                    type="button"
                    onClick={() => pagination.onPageChange(page)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all shadow-sm ${
                      pagination.currentPage === page
                        ? 'bg-[#232F58] text-white shadow-md'
                        : 'tech-pill text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {page}
                  </button>
                )
              );
            })()}

            <button
              type="button"
              onClick={() => pagination.onPageChange(Math.min(pagination.totalPages, pagination.currentPage + 1))}
              disabled={pagination.currentPage === pagination.totalPages}
              className="w-10 h-10 rounded-xl flex items-center justify-center tech-pill dark:text-white shadow-sm disabled:opacity-50 transition-all"
            >
              <span className="material-symbols-outlined text-lg">chevron_right</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SharedTicketTable;