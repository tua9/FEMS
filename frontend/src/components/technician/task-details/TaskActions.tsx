import { technicianApi } from '@/services/api/technicianApi';
import { Task } from '@/types/technician.types';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface TaskActionsProps {
  task: Task;
  onUpdate: (task: Task) => void;
}

const TaskActions: React.FC<TaskActionsProps> = ({ task, onUpdate }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<string | null>(null);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [completionNotes, setCompletionNotes] = useState('');

  const handleAcceptTask = async () => {
    try {
      setLoading('accept');
      const updatedTask = await technicianApi.acceptTask(task.id);
      onUpdate(updatedTask);
      alert('Task accepted successfully!');
    } catch (error) {
      console.error('Failed to accept task:', error);
      alert('Failed to accept task. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  const handleCompleteTask = async () => {
    if (!completionNotes.trim()) {
      alert('Please add completion notes before marking as complete.');
      return;
    }

    try {
      setLoading('complete');
      const updatedTask = await technicianApi.completeTask(task.id, completionNotes);
      onUpdate(updatedTask);
      setShowCompleteModal(false);
      setCompletionNotes('');
      alert('Task completed successfully!');
    } catch (error) {
      console.error('Failed to complete task:', error);
      alert('Failed to complete task. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  const canAccept = task.status === 'Pending' && !task.assignedTo;
  const canComplete = task.status === 'In Progress';

  return (
    <>
      <div className="space-y-6">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">settings</span>
          Quick Actions
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Accept Task Button */}
          {canAccept && (
            <button
              onClick={handleAcceptTask}
              disabled={loading === 'accept'}
              className="bg-gradient-to-br from-green-500 to-green-600 text-white px-8 py-5 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading === 'accept' ? (
                <>
                  <span className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></span>
                  Accepting...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-lg">task_alt</span>
                  Accept Task
                </>
              )}
            </button>
          )}

          {/* Complete Task Button */}
          {canComplete && (
            <button
              onClick={() => setShowCompleteModal(true)}
              className="bg-gradient-to-br from-blue-500 to-blue-600 text-white px-8 py-5 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl transition-all"
            >
              <span className="material-symbols-outlined text-lg">check_circle</span>
              Mark as Complete
            </button>
          )}

          {/* View Location Button */}
          <button
            onClick={() => alert('Map feature coming soon!')}
            className="bg-white/30 dark:bg-white/5 border border-white/50 dark:border-white/10 px-8 py-5 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-3 shadow-xl hover:bg-white/50 dark:hover:bg-white/10 transition-all text-navy-deep dark:text-white"
          >
            <span className="material-symbols-outlined text-lg">map</span>
            View Location
          </button>

          {/* Contact Reporter Button */}
          <button
            onClick={() => window.location.href = `mailto:${task.reportedBy.email}`}
            className="bg-white/30 dark:bg-white/5 border border-white/50 dark:border-white/10 px-8 py-5 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-3 shadow-xl hover:bg-white/50 dark:hover:bg-white/10 transition-all text-navy-deep dark:text-white"
          >
            <span className="material-symbols-outlined text-lg">email</span>
            Contact Reporter
          </button>
        </div>

        {/* Task History Button */}
        <button
          onClick={() => alert('Task history feature coming soon!')}
          className="w-full bg-white/20 dark:bg-white/5 border border-white/30 dark:border-white/10 px-8 py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-3 hover:bg-white/30 dark:hover:bg-white/10 transition-all text-navy-deep dark:text-white"
        >
          <span className="material-symbols-outlined text-lg">history</span>
          View Task History
        </button>
      </div>

      {/* Complete Task Modal */}
      {showCompleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="glass-main rounded-4xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-extrabold text-navy-deep dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-3xl">check_circle</span>
                Complete Task
              </h3>
              <button
                onClick={() => setShowCompleteModal(false)}
                className="w-10 h-10 rounded-xl bg-white/30 dark:bg-white/5 flex items-center justify-center hover:bg-white/50 dark:hover:bg-white/10 transition-all"
              >
                <span className="material-symbols-outlined text-slate-600 dark:text-slate-400">close</span>
              </button>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
              Please provide completion notes describing what was done to resolve this issue.
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">
                  Completion Notes *
                </label>
                <textarea
                  value={completionNotes}
                  onChange={(e) => setCompletionNotes(e.target.value)}
                  placeholder="Describe the work completed, parts used, etc..."
                  rows={5}
                  className="w-full bg-white/30 dark:bg-white/5 border border-white/50 dark:border-white/10 rounded-2xl px-5 py-4 text-sm font-medium outline-none focus:ring-2 focus:ring-navy-deep transition-all resize-none"
                  required
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowCompleteModal(false)}
                  className="flex-1 bg-white/30 dark:bg-white/5 border border-white/50 dark:border-white/10 px-6 py-4 rounded-2xl font-bold text-sm text-navy-deep dark:text-white hover:bg-white/50 dark:hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCompleteTask}
                  disabled={loading === 'complete' || !completionNotes.trim()}
                  className="flex-1 btn-navy-gradient text-white px-6 py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                >
                  {loading === 'complete' ? (
                    <>
                      <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                      Completing...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-lg">done</span>
                      Complete
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TaskActions;
