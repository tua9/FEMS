import { useTasks } from '@/hooks/technician/useTasks';
import { MockTask } from '@/data/technician/mockTasks';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const getCategoryDisplay = (category: string, displayCategory?: string) => {
  const label = displayCategory ?? category;
  const map: Record<string, { icon: string; color: string }> = {
    'AV Device':  { icon: 'video_settings', color: 'text-blue-500'   },
    'HVAC':       { icon: 'ac_unit',        color: 'text-cyan-500'   },
    'IT Device':  { icon: 'computer',       color: 'text-indigo-500' },
    'Electrical': { icon: 'electric_bolt',  color: 'text-yellow-500' },
    'Plumbing':   { icon: 'water_drop',     color: 'text-blue-500'   },
    'Furniture':  { icon: 'chair',          color: 'text-purple-500' },
    'Safety':     { icon: 'warning',        color: 'text-orange-500' },
    'Other':      { icon: 'grid_view',      color: 'text-slate-400'  },
  };
  const style = map[label] ?? map['Other'];
  return { ...style, label };
};

const getPriorityStyle = (priority: string) => {
  const map: Record<string, string> = {
    Urgent: 'bg-rose-100 text-rose-600',
    High:   'bg-rose-100 text-rose-600',
    Medium: 'bg-amber-100 text-amber-600',
    Low:    'bg-emerald-100 text-emerald-600',
  };
  return map[priority] ?? map.Medium;
};

const getPriorityLabel = (priority: string) => {
  return priority === 'Medium' ? 'Med' : priority;
};

const TaskQueue: React.FC = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const { tasks, loading } = useTasks({});

  const itemsPerPage = 3;
  const totalCount = tasks.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage));
  const displayTasks: MockTask[] = tasks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  ) as MockTask[];

  return (
    <div className="glass-card rounded-3xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-8 py-6 border-b border-white/20 flex justify-between items-center">
        <h3 className="text-sm font-bold text-[#1A2B56] dark:text-white uppercase tracking-widest">
          Active Work Orders
        </h3>
        <button
          onClick={() => navigate('/technician/tasks')}
          className="text-xs font-bold text-[#1A2B56]/70 dark:text-slate-400 hover:text-[#1A2B56] dark:hover:text-white transition-all uppercase tracking-wider"
        >
          View All Tickets
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest border-b border-white/10">
              {['Ticket ID', 'Equipment & Location', 'Issue', 'Priority', 'Status', 'Actions'].map((h, i) => (
                <th key={h} className={`px-8 py-4 ${i === 5 ? 'text-right' : ''}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="text-sm">
            {loading ? (
              [...Array(3)].map((_, i) => (
                <tr key={i} className="border-b border-white/5">
                  {[...Array(6)].map((_, j) => (
                    <td key={j} className="px-8 py-5">
                      <div className="h-4 bg-white/30 rounded-lg animate-pulse"></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              displayTasks.map((task, idx) => {
                const cat = getCategoryDisplay(task.category, task.displayCategory);
                const isLast = idx === displayTasks.length - 1;
                return (
                  <tr
                    key={task.id}
                    className={`hover:bg-white/20 transition-colors ${!isLast ? 'border-b border-white/5' : ''}`}
                  >
                    {/* Ticket ID */}
                    <td className="px-8 py-5">
                      <span className={`font-bold italic ${task.status === 'Completed' ? 'text-[#1A2B56]/60' : 'text-[#1A2B56]'} dark:text-white`}>
                        #{task.id}
                      </span>
                    </td>

                    {/* Equipment & Location */}
                    <td className="px-8 py-5">
                      <div className="font-bold text-slate-800 dark:text-white">{task.title}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {task.location.building}, {task.location.room}
                      </div>
                    </td>

                    {/* Issue */}
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <span className={`material-symbols-outlined text-sm ${cat.color}`}>
                          {cat.icon}
                        </span>
                        <span className="font-bold text-slate-600 dark:text-slate-300">{cat.label}</span>
                      </div>
                    </td>

                    {/* Priority */}
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${getPriorityStyle(task.priority)}`}>
                        {getPriorityLabel(task.priority)}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-8 py-5">
                      {task.status === 'Completed' ? (
                        <span className="flex items-center gap-1.5 text-emerald-600 font-bold text-[10px]">
                          <span className="w-1 h-1 rounded-full bg-emerald-500"></span> COMPLETED
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-slate-400 font-bold text-[10px]">
                          <span className="w-1 h-1 rounded-full bg-slate-400"></span> PENDING
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-8 py-5 text-right">
                      {task.status === 'Completed' ? (
                        <button
                          onClick={() => navigate(`/technician/tasks/${task.id}`)}
                          className="px-4 py-2 rounded-xl bg-slate-200/50 text-slate-500 text-[10px] font-bold hover:bg-slate-200 transition-all"
                        >
                          Details
                        </button>
                      ) : (
                        <div className="flex justify-end gap-2">
                          <button className="px-4 py-2 rounded-xl border border-rose-200 text-rose-500 text-[10px] font-bold hover:bg-rose-50 transition-all">
                            Reject
                          </button>
                          <button className="px-4 py-2 rounded-xl bg-[#1A2B56] text-white text-[10px] font-bold hover:opacity-90 transition-all shadow-md shadow-[#1A2B56]/20">
                            Approve
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-8 py-5 bg-white/10 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        <span>Showing {Math.min(itemsPerPage, displayTasks.length)} of {totalCount} Tickets</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="w-7 h-7 rounded-lg flex items-center justify-center bg-white/50 text-slate-400 hover:bg-white transition-all shadow-sm disabled:opacity-30"
          >
            <span className="material-symbols-outlined text-sm">chevron_left</span>
          </button>
          {[...Array(Math.min(totalPages, 3))].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold transition-all shadow-sm ${
                currentPage === i + 1
                  ? 'bg-[#1A2B56] text-white'
                  : 'bg-white/50 text-slate-600 hover:bg-white'
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="w-7 h-7 rounded-lg flex items-center justify-center bg-white/50 text-slate-400 hover:bg-white transition-all shadow-sm disabled:opacity-30"
          >
            <span className="material-symbols-outlined text-sm">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskQueue;