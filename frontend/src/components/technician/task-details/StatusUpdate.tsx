import { useTaskUpdate } from '@/hooks/technician/useTaskUpdate';
import type { Task } from '@/types/technician.types';
import React, { useState } from 'react';

interface StatusUpdateProps {
  task: Task;
  onUpdate: (task: Task) => void;
}

const StatusUpdate: React.FC<StatusUpdateProps> = ({ task, onUpdate }) => {
  const [selectedStatus, setSelectedStatus] = useState<Task['status']>(task.status);
  const [notes, setNotes] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const { updateTask, loading, error } = useTaskUpdate(task.id);

  const statusOptions: Array<{ value: Task['status']; icon: string; color: string }> = [
    { value: 'pending', icon: 'pending_actions', color: 'text-yellow-500 bg-yellow-500/10 hover:bg-yellow-500/20' },
    { value: 'processing', icon: 'autorenew', color: 'text-purple-500 bg-purple-500/10 hover:bg-purple-500/20' },
    { value: 'fixed', icon: 'check_circle', color: 'text-green-500 bg-green-500/10 hover:bg-green-500/20' },
    { value: 'cancelled', icon: 'cancel', color: 'text-red-500 bg-red-500/10 hover:bg-red-500/20' },
  ];

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages(prev => [...prev, ...files]);

    // Create previews
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const updatedTask = await updateTask({
        status: selectedStatus !== task.status ? selectedStatus : undefined,
        notes: notes.trim() || undefined,
        images: images.length > 0 ? images : undefined,
      });

      onUpdate(updatedTask);
      
      // Reset form
      setNotes('');
      setImages([]);
      setImagePreviews([]);

      // Show success message (you can add a toast notification here)
      alert('Task updated successfully!');
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">update</span>
          Update Task Status
        </h3>
        {error && (
          <span className="text-xs text-red-500 font-semibold">{error}</span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Status Selection */}
        <div>
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block">
            Select Status
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {statusOptions.map((status) => (
              <button
                key={status.value}
                type="button"
                onClick={() => setSelectedStatus(status.value)}
                className={`p-4 rounded-2xl border-2 transition-all ${
                  selectedStatus === status.value
                    ? `${status.color} border-current font-bold`
                    : 'bg-white/20 dark:bg-white/5 border-transparent hover:bg-white/30 dark:hover:bg-white/10'
                }`}
              >
                <span className="material-symbols-outlined text-2xl mb-2 block">
                  {status.icon}
                </span>
                <span className="text-xs font-bold text-navy-deep dark:text-white">
                  {status.value}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Notes Section */}
        <div>
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">note_add</span>
            Add Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any notes about the progress or completion of this task..."
            rows={4}
            className="w-full bg-white/30 dark:bg-white/5 border border-white/50 dark:border-white/10 rounded-2xl px-5 py-4 text-sm font-medium outline-none focus:ring-2 focus:ring-navy-deep transition-all resize-none"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">add_photo_alternate</span>
            Add Images (Optional)
          </label>
          
          <div className="space-y-4">
            {/* Upload Button */}
            <label className="w-full border-2 border-dashed border-white/30 dark:border-white/10 rounded-2xl p-8 cursor-pointer hover:border-navy-deep dark:hover:border-white/30 transition-all flex flex-col items-center justify-center gap-3">
              <span className="material-symbols-outlined text-4xl text-slate-400">
                cloud_upload
              </span>
              <span className="text-sm font-bold text-slate-600 dark:text-slate-400">
                Click to upload images
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-500">
                PNG, JPG up to 10MB
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageSelect}
                className="hidden"
              />
            </label>

            {/* Image Previews */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full aspect-square object-cover rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-navy-gradient text-white px-10 py-5 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-3 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            {loading ? (
              <>
                <span className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></span>
                Updating...
              </>
            ) : (
              <>
                Update Task
                <span className="material-symbols-outlined text-lg">send</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StatusUpdate;
