import { technicianApi } from '@/services/api/technicianApi';
import { MOCK_TASKS } from '@/data/technician/mockTasks';
import { Task } from '@/types/technician.types';
import { useEffect, useState } from 'react';

export const useTasks = (filters?: { status?: string; priority?: string }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingMock, setUsingMock] = useState(false);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      setUsingMock(false);
      const data = await technicianApi.getTasks(filters);
      setTasks(data);
    } catch (err) {
      // API unavailable or returned bad data — fall back to mock data silently
      const message = err instanceof Error ? err.message : 'Failed to fetch tasks';
      setError(message);
      setTasks(MOCK_TASKS as Task[]);
      setUsingMock(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [filters?.status, filters?.priority]);

  return { tasks, loading, error, usingMock, refetch: fetchTasks };
};