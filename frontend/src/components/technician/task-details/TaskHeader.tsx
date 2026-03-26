import type { Task } from '@/types/technician.types';
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface TaskHeaderProps {
  task: Task;
}

const TaskHeader: React.FC<TaskHeaderProps> = ({ task }) => {
  const navigate = useNavigate();

  const getPriorityColor = (priority: string) => {
    const colors = {
      Urgent: 'text-red-500 bg-red-500/10 border-red-500/30',
      High: 'text-orange-500 bg-orange-500/10 border-orange-500/30',
      Medium: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30',
      Low: 'text-green-500 bg-green-500/10 border-green-500/30',
    };
    return colors[priority as keyof typeof colors] || colors.Medium;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'Pending': 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30',
      'In Progress': 'text-purple-500 bg-purple-500/10 border-purple-500/30',
      'Completed': 'text-green-500 bg-green-500/10 border-green-500/30',
      'Cancelled': 'text-red-500 bg-red-500/10 border-red-500/30',
    };
    return colors[status as keyof typeof colors] || colors.Pending;
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      Electrical: 'electric_bolt',
      Plumbing: 'water_drop',
      Maintenance: 'handyman',
      Furniture: 'chair',
      Safety: 'warning',
      Other: 'grid_view',
    };
    return icons[category as keyof typeof icons] || icons.Other;
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-navy-deep dark:hover:text-white transition-colors group"
      >
        <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">
          arrow_back
        </span>
        <span className="text-sm font-bold">Back to Tasks</span>
      </button>

      {/* Header Content */}
      <div className="glass-main rounded-4xl p-8 shadow-2xl">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-navy-deep/10 dark:bg-navy-deep/20 flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-3xl text-navy-deep dark:text-white">
                {getCategoryIcon(task.category)}
              </span>
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-navy-deep dark:text-white mb-2 tracking-tight">
                {task.title}
              </h1>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                  Task ID: #{task.code || task.id.slice(-6).toUpperCase()}
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                  {task.category}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className={`px-4 py-2 rounded-xl text-xs font-bold border ${getPriorityColor(task.priority)}`}>
              {task.priority} Priority
            </span>
            <span className={`px-4 py-2 rounded-xl text-xs font-bold border ${getStatusColor(task.status)}`}>
              {task.status}
            </span>
          </div>
        </div>

        {/* Meta Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-white/20 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/30 dark:bg-white/5 flex items-center justify-center">
              <span className="material-symbols-outlined text-lg text-navy-deep dark:text-white">
                location_on
              </span>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                Location
              </p>
              <p className="text-sm font-bold text-navy-deep dark:text-white">
                {task.location.building} - {task.location.room}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/30 dark:bg-white/5 flex items-center justify-center">
              <span className="material-symbols-outlined text-lg text-navy-deep dark:text-white">
                person
              </span>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                Reported By
              </p>
              <p className="text-sm font-bold text-navy-deep dark:text-white">
                {task.reportedBy.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/30 dark:bg-white/5 flex items-center justify-center">
              <span className="material-symbols-outlined text-lg text-navy-deep dark:text-white">
                schedule
              </span>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                Reported On
              </p>
              <p className="text-sm font-bold text-navy-deep dark:text-white">
                {new Date(task.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskHeader;
