import { useCallback, useMemo, useState } from 'react';
import type { Task } from '@/types/technician.types';
import type { Ticket } from '@/data/technician/mockTickets';

type ModalKind = 'view' | 'approve' | 'reject' | null;

/**
 * Converts a Task to Ticket shape for table/modal display
 */
export function taskToTicket(task: Task): Ticket {
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

interface UseTicketTableManagerProps {
  tasks: Task[];
  loading: boolean;
  onStatusUpdate: (task: Task, status: Task['status']) => Promise<void>;
  onActionSuccess?: () => void | Promise<void>; // ✅ ADD: Callback after successful action
}

/**
 * Manages modal state and callbacks for ticket table
 * Prevents UI flicker by properly managing modal lifecycle
 */
export const useTicketTableManager = ({
  tasks,
  loading,
  onStatusUpdate,
  onActionSuccess, // ✅ ADD: Extract callback
}: UseTicketTableManagerProps) => {
  const [modal, setModal] = useState<ModalKind>(null);
  const [selected, setSelected] = useState<Task | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Memoized ticket list
  const ticketList = useMemo(() => tasks.map(taskToTicket), [tasks]);

  // Current ticket (for modal display)
  const currentTicket = useMemo(() => (selected ? taskToTicket(selected) : null), [selected]);

  // Find task by ticket ID
  const findTaskByTicketId = useCallback(
    (id: string) => tasks.find((t) => t.id === id) || null,
    [tasks]
  );

  // Modal controls - prevent modal flicker by not auto-closing
  const openModal = useCallback((kind: ModalKind, task: Task) => {
    setSelected(task);
    setModal(kind);
  }, []);

  const closeModal = useCallback(() => {
    setModal(null);
    setSelected(null);
  }, []);

  // Action handlers with proper error handling
  const handleViewTicket = useCallback(
    (id: string) => {
      const task = findTaskByTicketId(id);
      if (task) openModal('view', task);
    },
    [findTaskByTicketId, openModal]
  );

  const handleApproveClick = useCallback(
    (id: string) => {
      const task = findTaskByTicketId(id);
      if (task) openModal('approve', task);
    },
    [findTaskByTicketId, openModal]
  );

  const handleRejectClick = useCallback(
    (id: string) => {
      const task = findTaskByTicketId(id);
      if (task) openModal('reject', task);
    },
    [findTaskByTicketId, openModal]
  );

  const handleStartRepair = useCallback(
    async (id: string) => {
      const task = findTaskByTicketId(id);
      if (!task) return;

      try {
        setIsUpdating(true);
        await onStatusUpdate(task, 'processing');
        // ✅ Call success callback after API succeeds
        await onActionSuccess?.();
      } catch (err) {
        console.error('Failed to start repair:', err);
      } finally {
        setIsUpdating(false);
      }
    },
    [findTaskByTicketId, onStatusUpdate, onActionSuccess]
  );

  const handleMarkResolved = useCallback(
    async (id: string) => {
      const task = findTaskByTicketId(id);
      if (!task) return;

      try {
        setIsUpdating(true);
        await onStatusUpdate(task, 'fixed');
        // ✅ Call success callback after API succeeds
        await onActionSuccess?.();
      } catch (err) {
        console.error('Failed to mark resolved:', err);
      } finally {
        setIsUpdating(false);
      }
    },
    [findTaskByTicketId, onStatusUpdate, onActionSuccess]
  );

  const handleConfirmApprove = useCallback(async () => {
    if (!selected) return;

    try {
      setIsUpdating(true);
      await onStatusUpdate(selected, 'approved');
      // ✅ Call success callback after API succeeds
      await onActionSuccess?.();
      closeModal();
    } catch (err) {
      console.error('Failed to approve:', err);
    } finally {
      setIsUpdating(false);
    }
  }, [selected, onStatusUpdate, onActionSuccess, closeModal]);

  const handleConfirmReject = useCallback(async () => {
    if (!selected) return;

    try {
      setIsUpdating(true);
      await onStatusUpdate(selected, 'rejected');
      // ✅ Call success callback after API succeeds
      await onActionSuccess?.();
      closeModal();
    } catch (err) {
      console.error('Failed to reject:', err);
    } finally {
      setIsUpdating(false);
    }
  }, [selected, onStatusUpdate, onActionSuccess, closeModal]);

  return {
    // State
    modal,
    selected,
    currentTicket,
    ticketList,
    isUpdating,
    loading,

    // Modal controls
    openModal,
    closeModal,

    // Table action callbacks
    onView: handleViewTicket,
    onApprove: handleApproveClick,
    onReject: handleRejectClick,
    onStartRepair: handleStartRepair,
    onMarkResolved: handleMarkResolved,

    // Modal action callbacks
    onConfirmApprove: handleConfirmApprove,
    onConfirmReject: handleConfirmReject,
  };
};
