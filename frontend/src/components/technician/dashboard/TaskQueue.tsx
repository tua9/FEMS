import { useTasks } from '@/hooks/technician/useTasks';
import type { Task } from '@/types/technician.types';
import type { Ticket } from '@/data/technician/mockTickets';
import React, { useMemo, useState, useEffect } from 'react';
import TicketViewModal from '@/components/technician/tickets/TicketViewModal';
import TicketApproveModal from '@/components/technician/tickets/TicketApproveModal';
import TicketRejectModal from '@/components/technician/tickets/TicketRejectModal';
import SharedTicketTable from '@/components/technician/tickets/SharedTicketTable';

function taskToTicket(task: Task): Ticket {
  const room = `${task.location.building}, ${task.location.room}`;
  const subject = task.equipment || task.location.room;

  return {
    id: task.id,
    code: task.code,
    equipment: subject,
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

const ITEMS_PER_PAGE = 3;

const TaskQueue: React.FC = () => {
  const [modal, setModal] = useState<ModalKind>(null);
  const [selected, setSelected] = useState<Task | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const filters = useMemo(() => ({}), []);
  const { tasks, loading, updateTaskStatusOptimistic } = useTasks(filters);

  const totalPages = useMemo(() => Math.ceil(tasks.length / ITEMS_PER_PAGE), [tasks.length]);
  const startIdx = useMemo(() => (currentPage - 1) * ITEMS_PER_PAGE, [currentPage]);
  const paginatedTasks = useMemo(() => tasks.slice(startIdx, startIdx + ITEMS_PER_PAGE), [tasks, startIdx]);
  const paginatedTickets = useMemo(() => paginatedTasks.map(taskToTicket), [paginatedTasks]);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

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
      console.error('Missing reportId for task', task);
      return;
    }

    try {
      await updateTaskStatusOptimistic(task.id, reportId, status);
      close();
    } catch (e) {
      console.error('Failed to update ticket status', e);
    }
  };

  const findTaskByTicketId = (id: string) => tasks.find((t) => t.id === id) || null;

  return (
    <>
      <div className="dashboard-card rounded-3xl overflow-hidden">
        <div className="px-8 py-6 border-b border-white/20 flex justify-between items-center">
          <h3 className="text-sm font-bold text-[#1A2B56] dark:text-white uppercase tracking-widest">
            Active Work Orders
          </h3>
        </div>

        <div className="overflow-x-auto grow">
          <SharedTicketTable
            tickets={paginatedTickets}
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
            pagination={{
              currentPage,
              totalPages,
              onPageChange: setCurrentPage,
              showingCount: paginatedTickets.length,
              totalCount: tasks.length,
              label: 'work orders',
            }}
          />
        </div>
      </div>

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
    </>
  );
};

export default TaskQueue;
