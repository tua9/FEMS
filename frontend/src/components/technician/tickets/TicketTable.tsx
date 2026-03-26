import React from 'react';
import type { Ticket, TicketStatus } from '@/data/technician/mockTickets';
import SharedTicketTable from '@/components/technician/tickets/SharedTicketTable';

interface Props {
  tickets: Ticket[];
  activeStatus: TicketStatus;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalCount: number;
  onView?: (id: string) => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onStartRepair?: (id: string) => void;
  onMarkResolved?: (id: string) => void;
  onPageChange?: (page: number) => void;
}

const TicketTable: React.FC<Props> = ({
  tickets,
  currentPage,
  totalPages,
  itemsPerPage,
  totalCount,
  onView,
  onApprove,
  onReject,
  onStartRepair,
  onMarkResolved,
  onPageChange,
}) => {
  // Parent passes the already-filtered list; this component only paginates.
  const safePage = Math.min(currentPage, totalPages);

  const paged = tickets.slice((safePage - 1) * itemsPerPage, safePage * itemsPerPage);

  return (
    <SharedTicketTable
      tickets={paged}
      variant="reporter"
      onView={onView}
      onApprove={onApprove}
      onReject={onReject}
      onStartRepair={onStartRepair}
      onMarkResolved={onMarkResolved}
      pagination={
        onPageChange
          ? {
              currentPage: safePage,
              totalPages,
              onPageChange,
              showingCount: paged.length,
              totalCount,
              label: 'work orders',
            }
          : undefined
      }
    />
  );
};

export default TicketTable;
