import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/shared/PageHeader';
import { useTasks } from '@/hooks/technician/useTasks';
import type { Task } from '@/types/technician.types';
import type { Ticket } from '@/data/technician/mockTickets';
import SharedTicketTable from '@/components/technician/tickets/SharedTicketTable';
import TicketViewModal from '@/components/technician/tickets/TicketViewModal';
import TicketApproveModal from '@/components/technician/tickets/TicketApproveModal';
import TicketRejectModal from '@/components/technician/tickets/TicketRejectModal';

// Convert Task → Ticket (shape expected by the shared modals/table)
function taskToTicket(task: Task): Ticket {
  const room = `${task.location.building}, ${task.location.room}`;
  const subject = task.equipment || task.location.room;

  return {
    id: task.id,
    // Ticket ID must come from Report.code (already returned by /api/technician/tasks)
    code: task.code,
    // Equipment column in UI becomes "Report subject"
    equipment: subject,
    // Sublabel under subject should show Report.type
    equipmentType: task.type || task.category || 'Other',
    room,
    reporter: {
      name: task.reportedBy.name,
      initials: task.reportedBy.name
        .split(' ')
        .slice(0, 2)
        .map((w) => w[0])
        .join('')
        .toUpperCase(),
    },
    priority: task.priority as Ticket['priority'],
    // Use DB status directly; SharedTicketTable expects TicketStatus string union
    status: (
      task.status === 'pending'
        ? 'Pending'
        : task.status === 'approved'
          ? 'Approved'
          : task.status === 'processing'
            ? 'In Progress'
            : task.status === 'fixed'
              ? 'Completed'
              : task.status === 'rejected'
                ? 'Rejected'
                : 'Rejected'
    ) as Ticket['status'],
    createdAt: task.createdAt,
  };
}

type ModalKind = 'view' | 'approve' | 'reject' | null;

const DashboardWorkOrders: React.FC = () => {
  const navigate = useNavigate();

  const [modal, setModal] = useState<ModalKind>(null);
  const [selected, setSelected] = useState<Task | null>(null);

  const { tasks, loading, updateTaskStatusOptimistic } = useTasks({});

  const ticketList: Ticket[] = useMemo(() => tasks.map(taskToTicket), [tasks]);

  const open = (kind: ModalKind, task: Task) => {
    setSelected(task);
    setModal(kind);
  };
  const close = () => {
    setModal(null);
    setSelected(null);
  };

  const ticket = selected ? taskToTicket(selected) : null;

  const handleUpdateStatus = async (task: Task, status: Task['status']) => {
    const reportId = task.reportId;
    if (!reportId) {
      // eslint-disable-next-line no-console
      console.error('Missing reportId for task', task);
      return;
    }

    try {
      await updateTaskStatusOptimistic(task.id, reportId, status);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Failed to update ticket status', e);
    }
  };

  // Helper: find the underlying Task for a ticket id
  const findTaskByTicketId = (id: string) => tasks.find((t) => t.id === id) || null;

  return (
    <div className="pt-6 sm:pt-8 pb-16 px-6 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between gap-4">
        <PageHeader title="Active Work Orders" subtitle="All active tickets assigned to technicians" className="items-start! text-left! mb-0!" />
        <button
          onClick={() => navigate('/technician/tasks')}
          className="text-xs font-bold text-[#1A2B56]/70 dark:text-slate-400 hover:text-[#1A2B56] dark:hover:text-white transition-all uppercase tracking-wider"
        >
          View Ticket Center
        </button>
      </div>

      <section className="dashboard-card rounded-3xl overflow-hidden">
        <div className="overflow-x-auto grow">
          <SharedTicketTable
            tickets={ticketList}
            loading={loading}
            variant="reporter"
            onView={(id) => {
              const t = findTaskByTicketId(id);
              if (t) open('view', t);
            }}
            onApprove={(id) => {
              const t = findTaskByTicketId(id);
              if (t) handleUpdateStatus(t, 'approved');
            }}
            onReject={(id) => {
              const t = findTaskByTicketId(id);
              if (t) handleUpdateStatus(t, 'rejected');
            }}
            onStartRepair={(id) => {
              const t = findTaskByTicketId(id);
              if (t) handleUpdateStatus(t, 'processing');
            }}
            onMarkResolved={(id) => {
              const t = findTaskByTicketId(id);
              if (t) handleUpdateStatus(t, 'fixed');
            }}
          />
        </div>
      </section>

      {ticket && modal === 'view' && (
        <TicketViewModal
          ticket={ticket}
          onClose={close}
          onApprove={() => {
            close();
            open('approve', selected!);
          }}
          onReject={() => {
            close();
            open('reject', selected!);
          }}
        />
      )}

      {ticket && modal === 'approve' && (
        <TicketApproveModal
          ticket={ticket}
          onClose={close}
          onConfirm={async () => {
            await handleUpdateStatus(selected!, 'approved');
            close();
          }}
        />
      )}

      {ticket && modal === 'reject' && (
        <TicketRejectModal
          ticket={ticket}
          onClose={close}
          onConfirm={async () => {
            await handleUpdateStatus(selected!, 'rejected');
            close();
          }}
        />
      )}
    </div>
  );
};

export default DashboardWorkOrders;
