import React, { useState } from 'react';
import { createPortal } from 'react-dom';

// ── Handover Form (Lecturer fills checklist + images before student confirms) ──
const HandoverFormPanel = ({ onSubmit, onCancel, loading }) => {
  const [checklist, setChecklist] = useState({ appearance: false, functioning: false, accessories: false });
  const [notes, setNotes] = useState('');
  const [images, setImages] = useState(['']);

  const toggleCheck = (key) => setChecklist(prev => ({ ...prev, [key]: !prev[key] }));

  const updateImage = (idx, val) => setImages(prev => prev.map((v, i) => i === idx ? val : v));
  const addImageField = () => setImages(prev => [...prev, '']);
  const removeImageField = (idx) => setImages(prev => prev.filter((_, i) => i !== idx));

  const validImages = images.filter(v => v.trim());

  const handleSubmit = () => {
    if (validImages.length === 0) return;
    onSubmit({ checklist, notes: notes.trim() || null, images: validImages });
  };

  return (
    <div className="space-y-5">
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Form bàn giao thiết bị</p>

      {/* Checklist */}
      <div className="p-5 rounded-2xl bg-white/40 dark:bg-slate-900/30 border-2 border-white dark:border-slate-700 space-y-3">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Kiểm tra thiết bị</p>
        {[
          { key: 'appearance',  label: 'Ngoại hình tốt (không xước, vỡ)' },
          { key: 'functioning', label: 'Hoạt động bình thường' },
          { key: 'accessories', label: 'Đầy đủ phụ kiện' },
        ].map(({ key, label }) => (
          <label key={key} className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={checklist[key]}
              onChange={() => toggleCheck(key)}
              className="w-4 h-4 rounded accent-[#1A2B56] cursor-pointer"
            />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
              {label}
            </span>
          </label>
        ))}
      </div>

      {/* Notes */}
      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Ghi chú</label>
        <textarea
          rows={2}
          placeholder="Ghi chú thêm về tình trạng thiết bị khi bàn giao..."
          value={notes}
          onChange={e => setNotes(e.target.value)}
          className="w-full bg-white/40 dark:bg-slate-800/50 border border-white/40 dark:border-slate-700/50 rounded-xl px-4 py-2.5 text-sm text-slate-700 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-[#1A2B56]/20 resize-none"
        />
      </div>

      {/* Images (URLs) */}
      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          Ảnh bàn giao <span className="text-red-500">*</span>
        </label>
        {images.map((val, idx) => (
          <div key={idx} className="flex gap-2">
            <input
              type="url"
              placeholder="URL ảnh (e.g. https://...)"
              value={val}
              onChange={e => updateImage(idx, e.target.value)}
              className="flex-1 bg-white/40 dark:bg-slate-800/50 border border-white/40 dark:border-slate-700/50 rounded-xl px-3 py-2 text-sm text-slate-700 dark:text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-[#1A2B56]/20"
            />
            {images.length > 1 && (
              <button
                onClick={() => removeImageField(idx)}
                className="w-8 h-8 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">remove</span>
              </button>
            )}
          </div>
        ))}
        <button
          onClick={addImageField}
          className="self-start text-[10px] font-black uppercase tracking-widest text-[#1A2B56]/60 dark:text-blue-400/60 hover:text-[#1A2B56] dark:hover:text-blue-400 flex items-center gap-1 transition-colors"
        >
          <span className="material-symbols-outlined text-[14px]">add</span> Thêm ảnh
        </button>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={onCancel}
          className="flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          Hủy
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading || validImages.length === 0}
          className="flex-[2] py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-[#1A2B56] text-white hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading
            ? <span className="material-symbols-outlined text-[16px] animate-spin">sync</span>
            : <span className="material-symbols-outlined text-[16px]">upload</span>
          }
          Gửi form bàn giao
        </button>
      </div>
    </div>
  );
};

// ── Main Modal ─────────────────────────────────────────────────────────────────
const BorrowingDetailModal = ({
  isOpen,
  record,
  onClose,
  onApprove,
  onHandover,   // (id, formData) — lecturer submits handover form
  onReject,
  onReturn,     // (id) — lecturer confirms return from 'returning' state
  onAlert,
}) => {
  const [showHandoverForm, setShowHandoverForm] = useState(false);
  const [handoverLoading, setHandoverLoading] = useState(false);

  if (!isOpen || !record) return null;

  const getStatusStyle = (status) => {
    switch (status) {
      case 'pending':    return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200/50';
      case 'approved':   return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200/50';
      case 'handed_over':return 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 border-indigo-200/50';
      case 'returning':  return 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 border-violet-200/50';
      case 'overdue':    return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200/50';
      case 'returned':   return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200/50';
      case 'rejected':   return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-200/50';
      case 'cancelled':  return 'bg-slate-200 dark:bg-slate-800/50 text-slate-800 dark:text-slate-200 border-slate-300/50';
      default:           return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200/50';
    }
  };

  const isOverdue = record.status === 'overdue' || (record.status === 'handed_over' && new Date(record.expectedReturnDate) < new Date());
  const displayStatus = isOverdue ? 'overdue' : record.status;

  const isInfrastructure = record.type === 'infrastructure';
  const entity = isInfrastructure ? record.roomId : record.equipmentId;
  const entityName = entity?.name || 'Unknown';
  const entitySub = isInfrastructure ? entity?.type : entity?.category;
  const entityIcon = isInfrastructure ? 'meeting_room' : 'devices';

  // handoverInfo is set by lecturer; student hasn't confirmed yet
  const hasHandoverForm = !!record.handoverInfo?.submittedAt;
  // returnRequest is set by student; lecturer hasn't confirmed yet
  const hasReturnRequest = !!record.returnRequest?.submittedAt;

  const handleHandoverSubmit = async (formData) => {
    setHandoverLoading(true);
    try {
      await onHandover?.(record._id, formData);
      setShowHandoverForm(false);
      onClose();
    } finally {
      setHandoverLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6 bg-black/30 backdrop-blur-sm">
      <style dangerouslySetInnerHTML={{
        __html: `.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}`
      }} />
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-2xl dashboard-card rounded-4xl shadow-2xl shadow-[#1E2B58]/20 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="px-10 pt-8 pb-6 relative border-b border-black/8 dark:border-white/10">
          <button
            onClick={onClose}
            className="absolute top-6 right-8 w-8 h-8 flex items-center justify-center text-[#1E2B58]/50 hover:text-[#1E2B58] hover:bg-[#1E2B58]/8 dark:text-white/50 dark:hover:text-white dark:hover:bg-white/10 rounded-full transition-colors z-20"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-3">
              <span className={`px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 shadow-sm ${getStatusStyle(displayStatus)}`}>
                {displayStatus}
              </span>
              <span className="px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 shadow-sm bg-blue-50/50 dark:bg-blue-900/10 text-[#1A2B56] dark:text-blue-400 border-blue-100 dark:border-blue-900/30">
                {record.type}
              </span>
            </div>
            <h3 className="text-2xl font-black text-[#1E2B58] dark:text-white tracking-tight">Borrowing Specifications</h3>
            <p className="text-[0.625rem] font-black text-[#1E2B58]/50 dark:text-white/40 uppercase tracking-widest mt-1">Request ID: {record._id}</p>
          </div>
        </div>

        <div className="p-10 pt-0 overflow-y-auto no-scrollbar space-y-8 relative z-10">

          {/* Borrower & Entity Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="p-6 rounded-3xl bg-white/40 dark:bg-slate-900/30 border-2 border-white dark:border-slate-700 shadow-sm space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Borrower Details</h4>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#1A2B56] text-white flex items-center justify-center font-bold text-lg">
                  {(typeof record.borrowerId === 'object' ? record.borrowerId?.displayName : 'U')?.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="font-black text-slate-800 dark:text-white leading-tight truncate">
                    {typeof record.borrowerId === 'object' ? record.borrowerId?.displayName : 'Unknown'}
                  </p>
                  <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                    {typeof record.borrowerId === 'object' ? record.borrowerId?.email : 'No email'}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white/40 dark:bg-slate-900/30 border-2 border-white dark:border-slate-700 shadow-sm space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{isInfrastructure ? 'Infrastructure' : 'Equipment'} Details</h4>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-[#1A2B56] dark:text-blue-400 flex items-center justify-center border-2 border-blue-100 dark:border-blue-900/30">
                  <span className="material-symbols-outlined text-2xl">{entityIcon}</span>
                </div>
                <div className="min-w-0">
                  <p className="font-black text-slate-800 dark:text-white leading-tight truncate">{entityName}</p>
                  <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                    {isInfrastructure ? 'Type: ' : 'Category: '}{entitySub || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Note / Purpose */}
          {record.note && (
            <div className="p-8 rounded-[32px] bg-slate-50/50 dark:bg-slate-900/20 border-2 border-slate-100 dark:border-slate-800">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Purpose/Note</h4>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-relaxed italic">"{record.note}"</p>
            </div>
          )}

          {/* Cancellation / Rejection Reason */}
          {(record.status === 'cancelled' || record.status === 'rejected') && record.decisionNote && (
            <div className="p-8 rounded-[32px] bg-red-50/50 dark:bg-red-900/10 border-2 border-red-100 dark:border-red-900/30">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500 mb-4">
                {record.status === 'cancelled' ? 'Cancellation Reason' : 'Rejection Reason'}
              </h4>
              <p className="text-sm font-bold text-red-700 dark:text-red-400 leading-relaxed italic">"{record.decisionNote}"</p>
            </div>
          )}

          {/* Handover info panel — shown when lecturer has submitted form */}
          {hasHandoverForm && (
            <div className="p-6 rounded-[32px] bg-blue-50/50 dark:bg-blue-900/10 border-2 border-blue-100 dark:border-blue-900/30 space-y-3">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">Form bàn giao (đã gửi)</h4>
              <div className="flex flex-wrap gap-3 text-xs font-bold">
                {[
                  { key: 'appearance',  label: 'Ngoại hình' },
                  { key: 'functioning', label: 'Hoạt động' },
                  { key: 'accessories', label: 'Phụ kiện' },
                ].map(({ key, label }) => (
                  <span key={key} className={`px-3 py-1 rounded-full border ${record.handoverInfo.checklist?.[key] ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/30' : 'bg-red-50 text-red-500 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30'}`}>
                    {record.handoverInfo.checklist?.[key] ? '✓' : '✗'} {label}
                  </span>
                ))}
              </div>
              {record.handoverInfo.notes && (
                <p className="text-xs text-slate-600 dark:text-slate-400 italic">"{record.handoverInfo.notes}"</p>
              )}
              {record.handoverInfo.images?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {record.handoverInfo.images.map((url, i) => (
                    <a key={i} href={url} target="_blank" rel="noreferrer" className="text-[10px] font-bold text-blue-600 dark:text-blue-400 underline">Ảnh {i + 1}</a>
                  ))}
                </div>
              )}
              {record.status === 'approved' && !record.studentConfirmedAt && (
                <p className="text-[10px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400">
                  ⏳ Chờ sinh viên xác nhận nhận hàng
                </p>
              )}
            </div>
          )}

          {/* Return request info panel — shown when student has submitted return form */}
          {hasReturnRequest && (
            <div className="p-6 rounded-[32px] bg-violet-50/50 dark:bg-violet-900/10 border-2 border-violet-100 dark:border-violet-900/30 space-y-3">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-600 dark:text-violet-400">Yêu cầu trả (từ sinh viên)</h4>
              <div className="flex flex-wrap gap-3 text-xs font-bold">
                {[
                  { key: 'appearance',  label: 'Ngoại hình' },
                  { key: 'functioning', label: 'Hoạt động' },
                  { key: 'accessories', label: 'Phụ kiện' },
                ].map(({ key, label }) => (
                  <span key={key} className={`px-3 py-1 rounded-full border ${record.returnRequest.checklist?.[key] ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/30' : 'bg-red-50 text-red-500 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30'}`}>
                    {record.returnRequest.checklist?.[key] ? '✓' : '✗'} {label}
                  </span>
                ))}
              </div>
              {record.returnRequest.notes && (
                <p className="text-xs text-slate-600 dark:text-slate-400 italic">"{record.returnRequest.notes}"</p>
              )}
              {record.returnRequest.images?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {record.returnRequest.images.map((url, i) => (
                    <a key={i} href={url} target="_blank" rel="noreferrer" className="text-[10px] font-bold text-violet-600 dark:text-violet-400 underline">Ảnh {i + 1}</a>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Inline handover form */}
          {showHandoverForm && (
            <HandoverFormPanel
              onSubmit={handleHandoverSubmit}
              onCancel={() => setShowHandoverForm(false)}
              loading={handoverLoading}
            />
          )}

          {/* Schedule & Timing */}
          <div className="p-8 rounded-4xl bg-slate-50/50 dark:bg-slate-900/20 border-2 border-slate-100 dark:border-slate-800">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Scheduled Due Date</p>
                <span className={`text-xl font-black ${isOverdue ? 'text-red-500' : 'text-[#1A2B56] dark:text-white'}`}>
                  {new Date(record.expectedReturnDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right hidden md:block">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Borrow Date</p>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    {new Date(record.borrowDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400 border-2 border-slate-100 dark:border-slate-700 transform rotate-12">
                  <span className="material-symbols-outlined">schedule</span>
                </div>
              </div>
            </div>
          </div>

          {/* Audit Info */}
          {(record.approvedBy || record.createdAt) && (
            <div>
              <h4 className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-400 mb-6 flex items-center gap-3">
                <span className="w-8 h-0.5 bg-slate-200 dark:bg-slate-700" />
                Audit Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {record.createdAt && (
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900/40 border-2 border-slate-100 dark:border-slate-800">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-500 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[18px]">history</span>
                    </div>
                    <div className="text-[10px]">
                      <p className="font-bold text-slate-500 uppercase tracking-widest">Requested On</p>
                      <p className="font-black text-slate-800 dark:text-white mt-0.5">{new Date(record.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                )}
                {record.approvedBy && (
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900/40 border-2 border-slate-100 dark:border-slate-800">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[18px]">verified_user</span>
                    </div>
                    <div className="text-[10px]">
                      <p className="font-bold text-slate-500 uppercase tracking-widest">Handled By</p>
                      <p className="font-black text-slate-800 dark:text-white mt-0.5 truncate">
                        {typeof record.approvedBy === 'object' ? record.approvedBy?.displayName : 'Staff'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Overdue warning */}
          {isOverdue && (
            <div className="p-6 rounded-4xl bg-red-50/50 dark:bg-red-900/10 border-2 border-red-200 dark:border-red-900/30 flex gap-4">
              <span className="material-symbols-outlined text-red-500">warning</span>
              <div>
                <p className="text-sm font-bold text-red-700 dark:text-red-400">Compliance Warning</p>
                <p className="text-xs text-red-600/80 dark:text-red-400/80 mt-1 leading-relaxed italic">
                  This unit has exceeded its return window. The student must be notified immediately.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer / Actions */}
        <div className="px-8 py-5 border-t border-black/8 dark:border-white/10 bg-black/3 dark:bg-white/3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-3 flex-wrap">

            {/* pending → approve / reject */}
            {record.status === 'pending' && (
              <>
                <button
                  onClick={() => { onApprove?.(record._id); onClose(); }}
                  className="w-11 h-11 bg-slate-50 dark:bg-slate-900/10 border-2 border-slate-100 dark:border-slate-800/30 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:border-emerald-100 dark:hover:border-emerald-800/30 rounded-xl transition-all shadow-sm flex items-center justify-center"
                  title="Approve"
                >
                  <span className="material-symbols-outlined text-xl">check_circle</span>
                </button>
                <button
                  onClick={() => { onReject?.(record._id); onClose(); }}
                  className="px-6 py-2.5 bg-slate-50 dark:bg-slate-900/10 border-2 border-slate-100 dark:border-slate-800/30 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-100 dark:hover:border-red-800/30 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all shadow-sm flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-lg">cancel</span>
                  Reject
                </button>
              </>
            )}

            {/* approved (no handoverInfo yet) → open handover form */}
            {record.status === 'approved' && !hasHandoverForm && !showHandoverForm && (
              <button
                onClick={() => setShowHandoverForm(true)}
                className="px-8 py-3 bg-[#1A2B56] text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-blue-900/20 active:scale-95 flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">assignment</span>
                Điền form bàn giao
              </button>
            )}

            {/* approved with handoverForm — waiting for student, show info only */}
            {record.status === 'approved' && hasHandoverForm && (
              <span className="px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-2 border-amber-100 dark:border-amber-900/30 flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">hourglass_top</span>
                Chờ sinh viên xác nhận
              </span>
            )}

            {/* returning → confirm return */}
            {record.status === 'returning' && (
              <button
                onClick={() => { onReturn?.(record._id); onClose(); }}
                className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-emerald-900/20 active:scale-95 flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">task_alt</span>
                Xác nhận thiết bị đã trả
              </button>
            )}

            {/* overdue alert */}
            {isOverdue && (
              <button
                onClick={() => { onAlert?.(record._id); onClose(); }}
                className="w-11 h-11 bg-slate-50 dark:bg-slate-900/10 border-2 border-slate-100 dark:border-slate-800/30 text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 hover:border-amber-100 dark:hover:border-amber-800/30 rounded-xl transition-all shadow-sm flex items-center justify-center"
                title="Send Alert"
              >
                <span className="material-symbols-outlined text-xl">notifications_active</span>
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-6 py-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold text-[10px] uppercase tracking-widest transition-colors"
          >
            Dismiss View
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default BorrowingDetailModal;
