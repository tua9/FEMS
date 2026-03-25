import { technicianApi } from '@/services/api/technicianApi';
import { useEffect, useState } from 'react';

export const useTasks = (filters) => {
 const [tasks, setTasks] = useState([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState(null);

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
