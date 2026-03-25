import { technicianApi } from '@/services/technicianApi';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
 MODAL_OVERLAY, MODAL_CARD, CLOSE_BTN,
 BTN_PRIMARY, BTN_SECONDARY, SECTION_LABEL, TEXTAREA_CLASS,
} from '@/features/technician/components/common/modalStyles';

const TaskActions = ({ task, onUpdate }) => {
 const navigate = useNavigate();
 const [loading, setLoading] = useState(null);
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
 Mark
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
 <div className={MODAL_OVERLAY} onClick={() => setShowCompleteModal(false)}>
 <div
 className={`${MODAL_CARD} max-w-md`}
 onClick={(e) => e.stopPropagation()}
 >
 {/* Header */}
 <div className="px-7 pt-7 pb-5 flex items-start justify-between">
 <div className="flex items-center gap-4">
 <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
 <span className="material-symbols-outlined text-emerald-500 text-2xl">check_circle</span>
 </div>
 <div>
 <h3 className="text-base font-extrabold text-[#1A2B56] leading-tight">Complete Task</h3>
 <p className="text-xs text-slate-500 mt-0.5">Provide notes before marking as complete.</p>
 </div>
 </div>
 <button onClick={() => setShowCompleteModal(false)} className={CLOSE_BTN}>
 <span className="material-symbols-outlined text-lg">close</span>
 </button>
 </div>

 <div className="mx-7 border-t border-slate-100" />

 {/* Body */}
 <div className="px-7 py-6 space-y-4">
 <div className="space-y-2">
 <label className={`${SECTION_LABEL} flex items-center gap-1`}>
 Completion Notes <span className="text-rose-400 normal-case">*</span>
 </label>
 <textarea
 value={completionNotes}
 onChange={(e) => setCompletionNotes(e.target.value)}
 placeholder="Describe the work completed, parts used, etc..."
 rows={5}
 className={TEXTAREA_CLASS}
 required
 />
 </div>
 </div>

 {/* Footer */}
 <div className="px-7 py-5 border-t border-slate-100 flex gap-3">
 <button
 type="button"
 onClick={() => setShowCompleteModal(false)}
 className={BTN_SECONDARY}
 >
 Cancel
 </button>
 <button
 type="button"
 onClick={handleCompleteTask}
 disabled={loading === 'complete' || !completionNotes.trim()}
 className={`${BTN_PRIMARY} disabled:opacity-50 disabled:cursor-not-allowed`}
 >
 {loading === 'complete' ? (
 <>
 <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
 Completing...
 </>
 ) : (
 <>
 <span className="material-symbols-outlined text-base">done</span>
 Complete Task
 </>
 )}
 </button>
 </div>
 </div>
 </div>
 )}
 </>
 );
};

export default TaskActions;
