import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, HandMetal, Loader2, CheckCircle2, Package } from 'lucide-react';
import { toast } from 'sonner';

const HandoverConfirmModal = ({ isOpen, onClose, request, onConfirm, onCancelRequest, submitting }) => {
  const [receiveNote, setReceiveNote] = useState('Confirm equipment receipt');
  const [receiveChecklist, setReceiveChecklist] = useState({ appearance: true, functioning: true, accessories: true });
  const [receiveFiles, setReceiveFiles] = useState([]);
  const [receivePreviews, setReceivePreviews] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      setReceiveNote('Confirm equipment receipt');
      setReceiveChecklist({ appearance: true, functioning: true, accessories: true });
      setReceiveFiles([]);
      receivePreviews.forEach(url => URL.revokeObjectURL(url));
      setReceivePreviews([]);
    }
  }, [isOpen]);

  if (!isOpen || !request) return null;

  const isAllChecked = receiveChecklist.appearance && receiveChecklist.functioning && receiveChecklist.accessories;

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    if (receiveFiles.length + files.length > 2) {
      toast.error('You can upload at most 2 photos.');
      return;
    }

    const newFiles = [...receiveFiles, ...files];
    setReceiveFiles(newFiles);

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setReceivePreviews(prev => [...prev, ...newPreviews]);
  };

  const removeFile = (index) => {
    const newFiles = [...receiveFiles];
    newFiles.splice(index, 1);
    setReceiveFiles(newFiles);

    const newPreviews = [...receivePreviews];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setReceivePreviews(newPreviews);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isAllChecked && receiveFiles.length === 0) {
      toast.error('Please provide photos if any checklist item is not met.');
      return;
    }
    onConfirm({
      checklist: receiveChecklist,
      notes: receiveNote.trim() || null,
      files: receiveFiles, 
    });
  };

  const handleCancelClick = () => {
    if (!isAllChecked && receiveFiles.length === 0) {
      toast.error('Please add photos documenting the issue before declining receipt.');
      return;
    }
    const confirmed = window.confirm('Are you sure you want to cancel receiving this equipment? Your borrow request will be cancelled.');
    if (confirmed) {
      onCancelRequest?.(request);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4 overflow-y-auto"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="dashboard-card rounded-4xl p-8 w-full max-w-md shadow-2xl shadow-[#1E2B58]/20 relative animate-in fade-in zoom-in-95 duration-200 my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#1E2B58]/10 dark:hover:bg-white/10 transition"
        >
          <X className="w-4 h-4 text-[#1E2B58]/60 dark:text-white/60" />
        </button>

        <div className="flex flex-col items-center text-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
            <HandMetal className="w-7 h-7" />
          </div>
          <div>
            <p className="text-[0.625rem] font-black uppercase tracking-widest text-[#1E2B58]/50 dark:text-white/40 mb-1">Confirm equipment receipt</p>
            <h3 className="text-xl font-black text-[#1E2B58] dark:text-white">{request.equipmentId?.name || 'Equipment'}</h3>
          </div>
        </div>

        {/* Checklist */}
        <div className="bg-white/40 dark:bg-slate-800/40 rounded-[1.25rem] p-4 mb-4 space-y-2.5">
          <p className="text-[0.625rem] font-black uppercase tracking-widest text-[#1E2B58]/50 dark:text-white/40 mb-2">Condition at handover</p>
          {[
            { key: 'appearance',  label: 'Good physical condition (no cracks or damage)' },
            { key: 'functioning', label: 'Functions normally' },
            { key: 'accessories', label: 'All accessories present' },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={receiveChecklist[key]}
                onChange={e => setReceiveChecklist(prev => ({ ...prev, [key]: e.target.checked }))}
                className="w-4 h-4 rounded accent-emerald-500 cursor-pointer"
              />
              <span className="text-sm font-medium text-[#1E2B58]/80 dark:text-white/70">{label}</span>
            </label>
          ))}
        </div>

        {/* Conditional Image Upload */}
        {!isAllChecked && (
          <div className="mb-4 p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 animate-in fade-in slide-in-from-top-2">
            <label className="text-[0.625rem] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-2 block text-left">
              Evidence photos <span className="text-red-500">*</span>
            </label>
            <p className="text-[10px] text-amber-600/80 dark:text-amber-400/80 mb-3">
              Photograph the condition that does not meet the checklist (up to 2 photos).
            </p>
            
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" multiple className="hidden" />

            <div className="grid grid-cols-2 gap-3">
              {receivePreviews.map((src, idx) => (
                <div key={idx} className="relative group aspect-video rounded-2xl overflow-hidden border border-amber-200 dark:border-amber-700 bg-white dark:bg-slate-900 shadow-sm">
                  <img src={src} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeFile(idx)} className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              
              {receiveFiles.length < 2 && (
                <button type="button" onClick={() => fileInputRef.current?.click()} className="aspect-video rounded-2xl border-2 border-dashed border-amber-200 dark:border-amber-700 hover:border-amber-400 dark:hover:border-amber-500 hover:bg-white dark:hover:bg-white/5 transition-all flex flex-col items-center justify-center gap-2 group">
                  <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Package className="w-4 h-4 text-amber-500" />
                  </div>
                  <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest text-center px-2">Upload photo</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Notes */}
        <div className="flex flex-col gap-2 mb-6">
          <label className="text-[0.625rem] font-black uppercase tracking-widest text-[#1E2B58]/50 dark:text-white/40">
            Notes
          </label>
          <textarea
            rows={2}
            value={receiveNote}
            onChange={e => setReceiveNote(e.target.value)}
            className="w-full bg-white/40 dark:bg-slate-800/50 border border-white/40 dark:border-slate-700/50 rounded-[1rem] px-4 py-3 text-sm font-medium text-[#1E2B58] dark:text-white placeholder:text-[#1E2B58]/30 dark:placeholder:text-white/30 outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all resize-none"
          />
        </div>

        {/* Actions - Changed to 3 buttons */}
        <div className="flex flex-col gap-2.5">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full py-3.5 rounded-[1.25rem] font-bold text-sm bg-emerald-500 text-white hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
            Confirm receipt
          </button>
          
          <div className="flex gap-2.5 mt-1">
            <button
              onClick={onClose}
              disabled={submitting}
              className="flex-1 py-3.5 rounded-[1.25rem] font-bold text-sm border border-[#1E2B58]/20 dark:border-white/20 text-[#1E2B58]/70 dark:text-white/70 hover:bg-[#1E2B58]/5 dark:hover:bg-white/5 transition-all"
            >
              Close
            </button>
            <button
              onClick={handleCancelClick}
              disabled={submitting}
              className="flex-1 py-3.5 rounded-[1.25rem] font-bold text-sm border border-red-200 dark:border-red-900/30 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all bg-white dark:bg-slate-800"
            >
              Decline receipt
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default HandoverConfirmModal;
