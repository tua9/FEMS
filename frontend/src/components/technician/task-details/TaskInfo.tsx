import { Task } from '@/types/technician.types';
import React from 'react';

interface TaskInfoProps {
  task: Task;
}

const TaskInfo: React.FC<TaskInfoProps> = ({ task }) => {
  return (
    <div className="space-y-6">
      {/* Description Section */}
      <div>
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">description</span>
          Issue Description
        </h3>
        <div className="bg-white/30 dark:bg-white/5 rounded-2xl p-6">
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {task.description}
          </p>
        </div>
      </div>

      {/* Location Details */}
      <div>
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">place</span>
          Location Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/30 dark:bg-white/5 rounded-2xl p-5">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">
              Building
            </p>
            <p className="text-lg font-bold text-navy-deep dark:text-white">
              {task.location.building}
            </p>
          </div>
          <div className="bg-white/30 dark:bg-white/5 rounded-2xl p-5">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">
              Room
            </p>
            <p className="text-lg font-bold text-navy-deep dark:text-white">
              {task.location.room}
            </p>
          </div>
          <div className="bg-white/30 dark:bg-white/5 rounded-2xl p-5">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">
              Floor
            </p>
            <p className="text-lg font-bold text-navy-deep dark:text-white">
              {task.location.floor}
            </p>
          </div>
        </div>
      </div>

      {/* Images Section */}
      {task.images && task.images.length > 0 && (
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">image</span>
            Attached Images ({task.images.length})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {task.images.map((image, index) => (
              <div
                key={index}
                className="aspect-square rounded-2xl overflow-hidden bg-white/30 dark:bg-white/5 hover:scale-105 transition-transform cursor-pointer"
              >
                <img
                  src={image}
                  alt={`Issue image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reporter Information */}
      <div>
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">account_circle</span>
          Reporter Information
        </h3>
        <div className="bg-white/30 dark:bg-white/5 rounded-2xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-navy-deep/10 dark:bg-navy-deep/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl text-navy-deep dark:text-white">
                person
              </span>
            </div>
            <div>
              <p className="text-lg font-bold text-navy-deep dark:text-white">
                {task.reportedBy.name}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {task.reportedBy.email}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Notes Section (if exists) */}
      {task.notes && (
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">note</span>
            Previous Notes
          </h3>
          <div className="bg-white/30 dark:bg-white/5 rounded-2xl p-6">
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
              {task.notes}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskInfo;
