import { technicianApi } from '@/services/api/technicianApi';
import type { Task } from '@/types/technician.types';
import { useEffect, useState } from 'react';

export const useTasks = (filters?: { status?: string; priority?: string }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await technicianApi.getTasks(filters);
      setTasks(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch tasks';
      setError(message);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [filters?.status, filters?.priority]);

  return { tasks, loading, error, refetch: fetchTasks };
};