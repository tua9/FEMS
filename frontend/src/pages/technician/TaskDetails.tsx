import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import StatusUpdate from '@/components/technician/task-details/StatusUpdate';
import TaskActions from '@/components/technician/task-details/TaskActions';
import TaskHeader from '@/components/technician/task-details/TaskHeader';
import TaskInfo from '@/components/technician/task-details/TaskInfo';
import { technicianApi } from '@/services/api/technicianApi';
import { Task } from '@/types/technician.types';

const TaskDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTask = async () => {
      if (!id) return;
      try {
        const data = await technicianApi.getTaskById(id);
        setTask(data);
      } catch (error) {
        console.error('Failed to fetch task:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-12 text-center">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-navy-deep border-t-transparent"></div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-12 text-center">
        <p className="text-slate-600 dark:text-slate-400">Task not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 space-y-8">
      <TaskHeader task={task} />

      <section className="glass-main rounded-4xl p-6 md:p-10 shadow-2xl space-y-8">
        <TaskInfo task={task} />
        
        <StatusUpdate task={task} onUpdate={setTask} />
        
        <TaskActions task={task} onUpdate={setTask} />
      </section>
    </div>
  );
};

export default TaskDetails;