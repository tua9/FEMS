import { technicianApi } from '@/services/api/technicianApi';
import { UpdateTaskPayload } from '@/types/technician.types';
import { useState } from 'react';

export const useTaskUpdate = (taskId: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateTask = async (payload: UpdateTaskPayload) => {
    try {
      setLoading(true);
      setError(null);
      const updatedTask = await technicianApi.updateTask(taskId, payload);
      return updatedTask;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update task';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateTask, loading, error };
};