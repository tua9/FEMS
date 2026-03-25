import { technicianApi } from '@/services/technicianApi';
import { useState } from 'react';

export const useTaskUpdate = (taskId) => {
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState(null);

 const updateTask = async (payload) => {
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
