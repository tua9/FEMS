import { useTasks } from '@/hooks/technician/useTasks';
import { MockTask } from '@/data/technician/mockTasks';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TicketDetailModal from './TicketDetailModal';
import ConfirmRejectModal  from '@/components/technician/common/ConfirmRejectModal';
import ConfirmApproveModal from '@/components/technician/common/ConfirmApproveModal';

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
  const [currentPage,   setCurrentPage]   = useState(1);
  const [selectedTask,  setSelectedTask]  = useState<MockTask | null>(null);
  const [rejectTarget,  setRejectTarget]  = useState<MockTask | null>(null);
  const [approveTarget, setApproveTarget] = useState<MockTask | null>(null);
  const { tasks, loading } = useTasks({});

  const itemsPerPage = 3;
  const totalCount = tasks.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage));
  const displayTasks: MockTask[] = tasks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  ) as MockTask[];

  return (
    <>
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
        <table className="w-full text-left table-fixed">
          <colgroup>
            <col style={{ width: '13%' }} />  {/* Ticket ID */}
            <col style={{ width: '26%' }} />  {/* Equipment & Location */}
            <col style={{ width: '17%' }} />  {/* Issue */}
            <col style={{ width: '10%' }} />  {/* Priority */}
            <col style={{ width: '12%' }} />  {/* Status */}
            <col style={{ width: '22%' }} />  {/* Actions */}
          </colgroup>
          <thead>
            <tr
              style={{
                background: 'rgba(26,43,86,0.06)',
                borderTop: '1px solid rgba(26,43,86,0.08)',
                borderBottom: '1px solid rgba(26,43,86,0.10)',
              }}
            >
              {[
                { label: 'Ticket ID',            align: '' },
                { label: 'Equipment & Location', align: '' },
                { label: 'Issue',                align: '' },
                { label: 'Priority',             align: '' },
                { label: 'Status',               align: '' },
                { label: 'Actions',              align: 'text-right' },
              ].map(({ label, align }) => (
                <th key={label} className={`px-8 py-4 ${align}`}>
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-[#1A2B56] dark:text-blue-200 uppercase tracking-[0.15em]">
                    {label}
                  </span>
                </th>
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
                      <span className="font-extrabold text-[#1A2B56] dark:text-blue-400 text-sm tracking-tight">
                        #{task.id}
                      </span>
                    </td>

                    {/* Equipment & Location */}
                    <td className="px-8 py-5 max-w-0">
                      <div className="font-bold text-slate-800 dark:text-white truncate">{task.title}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5 truncate">
                        {task.location.building}, {task.location.room}
                      </div>
                    </td>

                    {/* Issue */}
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <span className={`material-symbols-outlined text-sm flex-shrink-0 ${cat.color}`}>
                          {cat.icon}
                        </span>
                        <span className="font-bold text-slate-600 dark:text-slate-300 truncate">{cat.label}</span>
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
                        <span className="flex items-center gap-1.5 font-bold text-[10px]" style={{ color: '#b45309' }}>
                          <span className="w-1 h-1 rounded-full" style={{ background: '#f59e0b' }}></span> PENDING
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-8 py-5 text-right">
                      {task.status === 'Completed' ? (
                        <button
                          onClick={() => setSelectedTask(task)}
                          className="px-4 py-2 rounded-xl bg-slate-200/50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 text-[10px] font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                        >
                          Details
                        </button>
                      ) : (
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setSelectedTask(task)}
                            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-[10px] font-bold hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
                          >
                            Details
                          </button>
                          <button
                            onClick={() => setRejectTarget(task)}
                            className="px-4 py-2 rounded-xl border border-rose-200 text-rose-500 text-[10px] font-bold hover:bg-rose-50 transition-all"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => setApproveTarget(task)}
                            className="px-4 py-2 rounded-xl bg-[#1A2B56] text-white text-[10px] font-bold hover:opacity-90 transition-all shadow-md shadow-[#1A2B56]/20"
                          >
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
      <div className="px-8 py-5 bg-white/10 dark:bg-black/10 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        <span>Showing {Math.min(itemsPerPage, displayTasks.length)} of {totalCount} Tickets</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="w-7 h-7 rounded-lg flex items-center justify-center bg-white/50 dark:bg-white/10 text-slate-400 hover:bg-white dark:hover:bg-white/20 transition-all shadow-sm disabled:opacity-30"
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
                  : 'bg-white/50 dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-white/20'
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="w-7 h-7 rounded-lg flex items-center justify-center bg-white/50 dark:bg-white/10 text-slate-400 hover:bg-white dark:hover:bg-white/20 transition-all shadow-sm disabled:opacity-30"
          >
            <span className="material-symbols-outlined text-sm">chevron_right</span>
          </button>
        </div>
      </div>
    </div>

    {/* Ticket detail modal */}
    {selectedTask && (
      <TicketDetailModal
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
      />
    )}

    {/* Reject confirmation modal */}
    {rejectTarget && (
      <ConfirmRejectModal
        ticketId={rejectTarget.id}
        ticketTitle={rejectTarget.title}
        imageUrl={rejectTarget.imageUrl}
        onCancel={() => setRejectTarget(null)}
        onConfirm={(_reason) => {
          // TODO: call API with reason
          setRejectTarget(null);
        }}
      />
    )}

    {/* Approve confirmation modal */}
    {approveTarget && (
      <ConfirmApproveModal
        task={approveTarget}
        onCancel={() => setApproveTarget(null)}
        onConfirm={() => {
          // TODO: call API to approve
          setApproveTarget(null);
        }}
      />
    )}
    </>
  );
};

export default TaskQueue;