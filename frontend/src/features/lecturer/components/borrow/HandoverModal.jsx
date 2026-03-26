import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, HandMetal, Loader2, Package, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { getStudentName, getEquipmentName } from './borrowUtils';

const HandoverModal = ({ isOpen, onClose, request, onConfirm, submitting }) => {
  const [handoverFiles, setHandoverFiles] = useState([]);
  const [handoverPreviews, setHandoverPreviews] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      setHandoverFiles([]);
      // Revoke all previews
      handoverPreviews.forEach(url => URL.revokeObjectURL(url));
      setHandoverPreviews([]);
    }
  }, [isOpen]);

  if (!isOpen || !request) return null;

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    if (handoverFiles.length + files.length > 2) {
      toast.error('Chỉ được tải lên tối đa 2 ảnh.');
      return;
    }

    const newFiles = [...handoverFiles, ...files];
    setHandoverFiles(newFiles);

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setHandoverPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeFile = (index) => {
    const newFiles = [...handoverFiles];
    newFiles.splice(index, 1);
    setHandoverFiles(newFiles);

    const newPreviews = [...handoverPreviews];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setHandoverPreviews(newPreviews);
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="dashboard-card rounded-4xl p-8 w-full max-md shadow-2xl shadow-[#1E2B58]/20 relative animate-in fade-in zoom-in-95 duration-200">
        <button onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#1E2B58]/10 dark:hover:bg-white/10 transition">
          <X className="w-4 h-4 text-[#1E2B58]/60 dark:text-white/60" />
        </button>

        <div className="flex flex-col items-center text-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-blue-500/10 flex items-center justify-center">
            <HandMetal className="w-7 h-7 text-blue-500" />
          </div>
          <div>
            <p className="text-[0.625rem] font-black uppercase tracking-widest text-[#1E2B58]/50 dark:text-white/40 mb-1">Xác nhận bàn giao</p>
            <h3 className="text-xl font-black text-[#1E2B58] dark:text-white">Bàn giao thiết bị?</h3>
          </div>
        </div>

        <div className="bg-white/40 dark:bg-slate-800/40 rounded-[1.25rem] p-4 mb-6 space-y-2 text-sm">
          {[
            ['Thiết bị', getEquipmentName(request)],
            ['Trao cho', getStudentName(request)],
            ['Lý do', request.note || '—'],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between gap-4">
              <span className="text-[#1E2B58]/60 dark:text-white/50 font-medium shrink-0">{label}</span>
              <span className="font-bold text-[#1E2B58] dark:text-white text-right">{value}</span>
            </div>
          ))}
        </div>

        <div className="mb-5">
          <label className="text-[10px] font-black uppercase tracking-widest text-[#1E2B58]/50 dark:text-white/40 mb-2 block">
            Ảnh bàn giao thiết bị <span className="text-red-500">*</span>
          </label>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            multiple
            className="hidden"
          />

          <div className="grid grid-cols-2 gap-3">
            {handoverPreviews.map((src, idx) => (
              <div key={idx} className="relative group aspect-video rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                <img src={src} alt="" className="w-full h-full object-cover" />
                <button
                  onClick={() => removeFile(idx)}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            
            {handoverFiles.length < 2 && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="aspect-video rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-[#1E2B58]/30 dark:hover:border-white/30 hover:bg-slate-50 dark:hover:bg-white/5 transition-all flex flex-col items-center justify-center gap-2 group"
              >
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Package className="w-5 h-5 text-slate-400" />
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tải ảnh lên</span>
              </button>
            )}
          </div>
          <p className="text-[10px] text-slate-400 mt-2 italic">* Chụp lại tình trạng thiết bị khi bàn giao.</p>
        </div>

        <div className="flex gap-3">
          <button onClick={onClose}
            className="flex-1 py-3.5 rounded-[1.25rem] font-bold text-sm border border-[#1E2B58]/20 dark:border-white/20 text-[#1E2B58]/70 dark:text-white/70 hover:bg-[#1E2B58]/5 dark:hover:bg-white/5 transition-all">
            Hủy
          </button>
          <button 
            onClick={() => onConfirm(handoverFiles)} 
            disabled={submitting || handoverFiles.length === 0}
            className="flex-[2] py-3.5 rounded-[1.25rem] font-bold text-sm bg-[#1E2B58] text-white hover:bg-[#2A3B66] transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 disabled:opacity-60 active:scale-95"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
            Xác nhận bàn giao
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default HandoverModal;
