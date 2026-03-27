import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, LogOut, Loader2, CheckCircle2, Package } from 'lucide-react';
import { toast } from 'sonner';
import { getStudentName, getEquipmentName } from './borrowUtils';

const ReturnConfirmModal = ({ isOpen, onClose, request, onConfirm, submitting }) => {
  const [returnNote, setReturnNote] = useState('Return received and verified');
  const [returnChecklist, setReturnChecklist] = useState({ appearance: true, functioning: true, accessories: true });
  const [returnFiles, setReturnFiles] = useState([]);
  const [returnPreviews, setReturnPreviews] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      setReturnNote('Return received and verified');
      setReturnChecklist({ appearance: true, functioning: true, accessories: true });
      setReturnFiles([]);
      returnPreviews.forEach(url => URL.revokeObjectURL(url));
      setReturnPreviews([]);
    }
  }, [isOpen]);

  if (!isOpen || !request) return null;

  const isAllChecked = returnChecklist.appearance && returnChecklist.functioning && returnChecklist.accessories;

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    if (returnFiles.length + files.length > 2) {
      toast.error('You can upload up to 2 images only.');
      return;
    }

    const newFiles = [...returnFiles, ...files];
    setReturnFiles(newFiles);

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setReturnPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeFile = (index) => {
    const newFiles = [...returnFiles];
    newFiles.splice(index, 1);
    setReturnFiles(newFiles);

    const newPreviews = [...returnPreviews];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setReturnPreviews(newPreviews);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isAllChecked && returnFiles.length === 0) {
      toast.error('Please provide evidence images if any checklist item fails.');
      return;
    }
    onConfirm({
      checklist: returnChecklist,
      notes: returnNote.trim() || null,
      files: returnFiles,
    });
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4 overflow-y-auto"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="dashboard-card rounded-4xl p-8 w-full max-w-md shadow-2xl shadow-[#1E2B58]/20 relative animate-in fade-in zoom-in-95 duration-200 my-8">
        <button onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#1E2B58]/10 dark:hover:bg-white/10 transition">
          <X className="w-4 h-4 text-[#1E2B58]/60 dark:text-white/60" />
        </button>

        <div className="flex flex-col items-center text-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <LogOut className="w-7 h-7 text-slate-500 dark:text-slate-300" />
          </div>
          <div>
            <p className="text-[0.625rem] font-black uppercase tracking-widest text-[#1E2B58]/50 dark:text-white/40 mb-1">Return Confirmation</p>
            <h3 className="text-xl font-black text-[#1E2B58] dark:text-white">{getEquipmentName(request)}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Returned by {getStudentName(request)}
            </p>
          </div>
        </div>

        {/* Student return photos */}
        <div className="mb-4">
          <p className="text-[0.625rem] font-black uppercase tracking-widest text-[#1E2B58]/50 dark:text-white/40 mb-2">
            Photos submitted by student
          </p>
          {request.returnSubmission?.images?.length > 0 ? (
            <>
              <div className="grid grid-cols-3 gap-2">
                {request.returnSubmission.images.map((url, idx) => (
                  <a
                    key={idx}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative group aspect-video rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 shadow-sm block"
                  >
                    <img src={url} alt={`Return photo ${idx + 1}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-bold">View</span>
                    </div>
                  </a>
                ))}
              </div>
              {request.returnSubmission?.notes && (
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 italic">
                  "{request.returnSubmission.notes}"
                </p>
              )}
            </>
          ) : (
            <p className="text-xs text-slate-400 dark:text-slate-500 italic">No photos submitted.</p>
          )}
        </div>

        {/* Checklist */}
        <div className="bg-white/40 dark:bg-slate-800/40 rounded-[1.25rem] p-4 mb-4 space-y-2.5">
          <p className="text-[0.625rem] font-black uppercase tracking-widest text-[#1E2B58]/50 dark:text-white/40 mb-2">Condition checklist on return</p>
          {[
            { key: 'appearance',  label: 'Appearance is acceptable (no cracks/damage)' },
            { key: 'functioning', label: 'Functions properly' },
            { key: 'accessories', label: 'Accessories are complete' },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={returnChecklist[key]}
                onChange={e => setReturnChecklist(prev => ({ ...prev, [key]: e.target.checked }))}
                className="w-4 h-4 rounded accent-[#1E2B58] dark:accent-blue-500 cursor-pointer"
              />
              <span className="text-sm font-medium text-[#1E2B58]/80 dark:text-white/70">{label}</span>
            </label>
          ))}
        </div>

        {/* Conditional Image Upload */}
        {!isAllChecked && (
          <div className="mb-4 p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 animate-in fade-in slide-in-from-top-2">
            <label className="text-[0.625rem] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-2 block text-left">
              Evidence images <span className="text-red-500">*</span>
            </label>
            <p className="text-[10px] text-amber-600/80 dark:text-amber-400/80 mb-3">
              Please upload photos for any failed condition (max 2 images).
            </p>
            
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" multiple className="hidden" />

            <div className="grid grid-cols-2 gap-3">
              {returnPreviews.map((src, idx) => (
                <div key={idx} className="relative group aspect-video rounded-2xl overflow-hidden border border-amber-200 dark:border-amber-700 bg-white dark:bg-slate-900 shadow-sm">
                  <img src={src} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeFile(idx)} className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              
              {returnFiles.length < 2 && (
                <button type="button" onClick={() => fileInputRef.current?.click()} className="aspect-video rounded-2xl border-2 border-dashed border-amber-200 dark:border-amber-700 hover:border-amber-400 dark:hover:border-amber-500 hover:bg-white dark:hover:bg-white/5 transition-all flex flex-col items-center justify-center gap-2 group">
                  <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Package className="w-4 h-4 text-amber-500" />
                  </div>
                  <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest text-center px-2">Upload image</span>
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
            value={returnNote}
            onChange={e => setReturnNote(e.target.value)}
            className="w-full bg-white/40 dark:bg-slate-800/50 border border-white/40 dark:border-slate-700/50 rounded-[1rem] px-4 py-3 text-sm font-medium text-[#1E2B58] dark:text-white placeholder:text-[#1E2B58]/30 dark:placeholder:text-white/30 outline-none focus:ring-2 focus:ring-[#1E2B58]/20 transition-all resize-none"
          />
        </div>

        <div className="flex gap-3">
          <button onClick={onClose}
            className="flex-1 py-3.5 rounded-[1.25rem] font-bold text-sm border border-[#1E2B58]/20 dark:border-white/20 text-[#1E2B58]/70 dark:text-white/70 hover:bg-[#1E2B58]/5 dark:hover:bg-white/5 transition-all">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={submitting}
            className="flex-[2] py-3.5 rounded-[1.25rem] font-bold text-sm bg-[#1E2B58] text-white hover:bg-[#2A3B66] transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 disabled:opacity-60 active:scale-95">
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
            Confirm Return Received
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ReturnConfirmModal;
