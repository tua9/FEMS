import { technicianApi } from '@/services/api/technicianApi';
import type { Task } from '@/types/technician.types';
import { useCallback, useEffect, useRef, useState } from 'react';

export const useTasks = (filters?: { status?: string; priority?: string }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const fetchAbortRef = useRef<AbortController | null>(null);

  const fetchTasks = useCallback(async () => {
    // Cancel previous fetch if still pending
    if (fetchAbortRef.current) {
      fetchAbortRef.current.abort();
    }

    const controller = new AbortController();
    fetchAbortRef.current = controller;

    try {
      setLoading(true);
      setError(null);
      const data = await technicianApi.getTasks(filters);
      
      // Only update if this request wasn't cancelled
      if (!controller.signal.aborted) {
        setTasks(data);
      }
      return data;
    } catch (err) {
      // Ignore abort errors
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }

      const message = err instanceof Error ? err.message : 'Failed to fetch tasks';
      setError(message);
      setTasks([]);
      throw err;
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, [filters]);

  // Fetch on mount and when filters change
  useEffect(() => {
    fetchTasks();

    // Cleanup
    return () => {
      if (fetchAbortRef.current) {
        fetchAbortRef.current.abort();
      }
    };
  }, [filters]); // Only depend on filters, not fetchTasks

  const updateTaskStatusOptimistic = useCallback(
    async (taskId: string, reportId: string, status: Task['status']) => {
      try {
        setIsUpdating(true);

        // Capture current state before mutation
        setTasks((prev) => {
          const before = prev;

          // Update UI immediately (optimistic update)
          const updated = prev.map((t) => 
            t.id === taskId ? { ...t, status, updatedAt: new Date().toISOString() } : t
          );
          
          // Make API call in the background
          (async () => {
            try {
              const task = before.find((t) => t.id === taskId);
              const mongoReportId = task?.reportId || reportId;
              if (!mongoReportId) throw new Error('Missing reportId');

              await technicianApi.updateTicketStatus(mongoReportId, status as any);
              // Keep the optimistic update - no refetch needed
            } catch (err) {
              // Rollback on error to previous state
              setTasks(before);
              throw err;
            }
          })();

          return updated;
        });
      } finally {
        setIsUpdating(false);
      }
    },
    []
  );

  return { tasks, loading, error, isUpdating, refetch: fetchTasks, updateTaskStatusOptimistic };
};