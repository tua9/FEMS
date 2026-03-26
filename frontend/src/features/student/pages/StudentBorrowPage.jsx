import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
  Loader2, BookOpen, MapPin, Clock, LogOut, Package, CheckCircle2,
  AlertTriangle, X, Plus, Eye, Lock, Unlock, Laptop,
} from 'lucide-react';
import { toast } from 'sonner';
import { scheduleService } from '@/services/scheduleService';
import { equipmentService } from '@/services/equipmentService';
import { borrowRequestService } from '@/services/borrowRequestService';
import { useAuthStore } from '@/stores/useAuthStore';
import { PageHeader } from '@/features/shared/components/PageHeader';

// ─── Shared sub-components ────────────────────────────────────────────────────

const RequestStatusBadge = ({ status }) => {
  const cfg = {
    pending:     { label: 'Đang chờ duyệt', cls: 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-900/30' },
    approved:    { label: 'Đã được duyệt',  cls: 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/30' },
    handed_over: { label: 'Đang sử dụng',   cls: 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/30' },
    returned:    { label: 'Đã hoàn trả',    cls: 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700' },
    rejected:    { label: 'Bị từ chối',     cls: 'bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30' },
    cancelled:   { label: 'Đã huỷ',         cls: 'bg-slate-50 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-500 dark:border-slate-700' },
  };
  const c = cfg[status] || { label: status, cls: 'bg-slate-100 text-slate-600 border-slate-200' };
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${c.cls}`}>
      {c.label}
    </span>
  );
};

const AvailabilityLabel = ({ equipmentStatus, isOccupiedByOther }) => {
  if (equipmentStatus === 'broken')
    return <span className="flex items-center gap-1 text-xs font-bold text-red-500"><AlertTriangle className="w-3 h-3" />Hỏng</span>;
  if (equipmentStatus === 'maintenance')
    return <span className="flex items-center gap-1 text-xs font-bold text-orange-500"><AlertTriangle className="w-3 h-3" />Bảo trì</span>;
  if (isOccupiedByOther)
    return <span className="flex items-center gap-1 text-xs font-bold text-amber-500"><Lock className="w-3 h-3" />Đang được mượn</span>;
  return <span className="flex items-center gap-1 text-xs font-bold text-emerald-500"><Unlock className="w-3 h-3" />Có thể mượn</span>;
};

// ─── Main Page ────────────────────────────────────────────────────────────────

const StudentBorrowPage = () => {
  const { user } = useAuthStore();

  // ── Schedule ──────────────────────────────────────────────────────────────
  const [schedules, setSchedules] = useState([]);
  const [scheduleLoading, setScheduleLoading] = useState(true);

  // ── Room equipment ────────────────────────────────────────────────────────
  const [roomEquipment, setRoomEquipment] = useState([]);
  const [equipmentLoading, setEquipmentLoading] = useState(false);

  // ── My requests ───────────────────────────────────────────────────────────
  const [myRequests, setMyRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(false);

  // ── Modal state ───────────────────────────────────────────────────────────
  const [borrowTarget, setBorrowTarget] = useState(null);   // equipment item
  const [borrowNote, setBorrowNote] = useState('');
  const [returnTarget, setReturnTarget] = useState(null);   // borrow request
  const [returnNote, setReturnNote] = useState('');
  const [returnConfirmed, setReturnConfirmed] = useState(false);
  const [viewRequest, setViewRequest] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // ── Derived: active schedule ──────────────────────────────────────────────
  const activeSchedule = useMemo(() => {
    if (!schedules.length) return null;
    const now = new Date();
    return (
      schedules.find(s => new Date(s.startAt) <= now && new Date(s.endAt) >= now) ||
      schedules.find(s => new Date(s.startAt) > now) ||
      schedules[0]
    );
  }, [schedules]);

  const isSessionOngoing = useMemo(() => {
    if (!activeSchedule) return false;
    const now = new Date();
    return new Date(activeSchedule.startAt) <= now && new Date(activeSchedule.endAt) >= now;
  }, [activeSchedule]);

  // ── Load schedules ────────────────────────────────────────────────────────
  const loadSchedules = useCallback(async () => {
    setScheduleLoading(true);
    try {
      const today = new Date().toISOString().slice(0, 10);
      const res = await scheduleService.getMySchedules(today);
      setSchedules(Array.isArray(res) ? res : []);
    } catch {
      setSchedules([]);
    } finally {
      setScheduleLoading(false);
    }
  }, []);

  useEffect(() => { loadSchedules(); }, [loadSchedules]);

  // ── Load room equipment when session is known ─────────────────────────────
  useEffect(() => {
    const roomId = activeSchedule?.roomId?._id || activeSchedule?.roomId;
    if (!roomId) { setRoomEquipment([]); return; }
    let cancelled = false;
    const load = async () => {
      setEquipmentLoading(true);
      try {
        const res = await equipmentService.getInventory({ roomId, limit: 50 });
        if (!cancelled) setRoomEquipment(res.items || []);
      } catch {
        if (!cancelled) setRoomEquipment([]);
      } finally {
        if (!cancelled) setEquipmentLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [activeSchedule]);

  // ── Load my requests ──────────────────────────────────────────────────────
  const loadMyRequests = useCallback(async () => {
    setRequestsLoading(true);
    try {
      const res = await borrowRequestService.getMyBorrowRequests();
      setMyRequests(Array.isArray(res) ? res : res.data || []);
    } catch {
      setMyRequests([]);
    } finally {
      setRequestsLoading(false);
    }
  }, []);

  useEffect(() => { loadMyRequests(); }, [loadMyRequests]);

  // ── Derived maps ──────────────────────────────────────────────────────────
  // My active request keyed by equipmentId
  const myActiveByEqId = useMemo(() => {
    const map = {};
    myRequests.forEach(r => {
      if (['pending', 'approved', 'handed_over'].includes(r.status)) {
        const id = String(r.equipmentId?._id || r.equipmentId);
        map[id] = r;
      }
    });
    return map;
  }, [myRequests]);

  // Set of equipmentIds occupied by *any* request (to show "Đang được mượn" for others)
  // Note: for full accuracy the backend should return this — currently derived from own requests only
  const occupiedByMeIds = useMemo(() => new Set(Object.keys(myActiveByEqId)), [myActiveByEqId]);

  const activeRequests = useMemo(
    () => myRequests.filter(r => ['pending', 'approved', 'handed_over'].includes(r.status)),
    [myRequests]
  );

  // ── Helpers ───────────────────────────────────────────────────────────────
  const fmtTime = d => d ? new Date(d).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '—';
  const fmtDateTime = d => d
    ? new Date(d).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
    : '—';

  // ── Borrow submit ─────────────────────────────────────────────────────────
  const handleBorrowSubmit = async () => {
    if (!borrowTarget) return;
    if (!borrowNote.trim()) { toast.error('Vui lòng nhập lý do mượn thiết bị.'); return; }
    const roomId = activeSchedule?.roomId?._id || activeSchedule?.roomId;
    setSubmitting(true);
    try {
      await borrowRequestService.createBorrowRequest({
        equipmentId: borrowTarget._id,
        roomId: roomId || undefined,
        note: borrowNote.trim(),
        type: 'equipment',
        borrowDate: new Date().toISOString(),
        expectedReturnDate: activeSchedule?.endAt || new Date(Date.now() + 4 * 3600 * 1000).toISOString(),
      });
      toast.success(`Đã gửi yêu cầu mượn "${borrowTarget.name}"!`);
      setBorrowTarget(null);
      setBorrowNote('');
      await loadMyRequests();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Không thể gửi yêu cầu mượn.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Return submit ─────────────────────────────────────────────────────────
  const handleReturnSubmit = async () => {
    if (!returnTarget) return;
    if (!returnConfirmed) { toast.error('Vui lòng xác nhận tình trạng thiết bị trước khi hoàn trả.'); return; }
    setSubmitting(true);
    try {
      await borrowRequestService.returnBorrowRequest(returnTarget._id);
      toast.success('Đã gửi yêu cầu hoàn trả thiết bị thành công.');
      setReturnTarget(null);
      setReturnNote('');
      setReturnConfirmed(false);
      await loadMyRequests();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Không thể gửi yêu cầu hoàn trả.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Cancel request ────────────────────────────────────────────────────────
  const handleCancelRequest = async (req) => {
    try {
      await borrowRequestService.cancelBorrowRequest(req._id, 'Sinh viên tự hủy');
      toast.success('Đã hủy yêu cầu mượn thiết bị.');
      await loadMyRequests();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Không thể hủy yêu cầu.');
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="w-full">
      <main className="mx-auto flex w-full max-w-[90vw] flex-1 flex-col px-4 pt-6 sm:pt-24 pb-10 sm:px-6 xl:max-w-7xl">

        <PageHeader
          title="Mượn Thiết Bị"
          subtitle="Xem và yêu cầu mượn thiết bị trong phòng học hiện tại của bạn."
        />

        {/* ══ SECTION 1: Session Info ══════════════════════════════════════════ */}
        <section className="mb-8">
          {scheduleLoading ? (
            <div className="dashboard-card rounded-4xl p-8 flex items-center gap-4">
              <Loader2 className="w-5 h-5 animate-spin text-[#1E2B58]/30 dark:text-white/20" />
              <span className="text-sm text-[#1E2B58]/50 dark:text-white/40">Đang tải lịch học...</span>
            </div>
          ) : !activeSchedule ? (
            <div className="dashboard-card rounded-4xl p-12 flex flex-col items-center justify-center text-center gap-4">
              <BookOpen className="w-12 h-12 text-[#1E2B58]/15 dark:text-white/15" />
              <div>
                <p className="font-black text-[#1E2B58]/50 dark:text-white/40">Không có buổi học nào hôm nay</p>
                <p className="text-xs text-[#1E2B58]/30 dark:text-white/30 mt-1">
                  Việc mượn thiết bị chỉ khả dụng trong buổi học được lên lịch.
                </p>
              </div>
            </div>
          ) : (
            <div className="dashboard-card rounded-4xl p-6 sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                {/* Session details */}
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 rounded-3xl bg-[#1E2B58]/8 dark:bg-white/5 flex items-center justify-center shrink-0">
                    <BookOpen className="w-7 h-7 text-[#1E2B58] dark:text-white" />
                  </div>
                  <div>
                    <p className="text-[0.625rem] font-black uppercase tracking-widest text-[#1E2B58]/50 dark:text-white/40 mb-1">
                      Buổi học hôm nay
                    </p>
                    <h2 className="text-xl font-black text-[#1E2B58] dark:text-white leading-tight">
                      {activeSchedule.title}
                    </h2>
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 mt-2">
                      <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        {activeSchedule.roomId?.name || 'N/A'}
                      </span>
                      <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400">
                        <Clock className="w-3.5 h-3.5 shrink-0" />
                        {fmtTime(activeSchedule.startAt)} – {fmtTime(activeSchedule.endAt)}
                      </span>
                      {activeSchedule.slotId && (
                        <span className="text-xs font-bold text-slate-400 dark:text-slate-500">
                          Tiết {activeSchedule.slotId.name || activeSchedule.slotId.code}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Status badge */}
                <span className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border shrink-0 ${
                  isSessionOngoing
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/30'
                    : 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-900/30'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isSessionOngoing ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                  {isSessionOngoing ? 'Đang diễn ra' : 'Sắp diễn ra'}
                </span>
              </div>

              {/* Warning banner if session not yet started */}
              {!isSessionOngoing && (
                <div className="mt-5 p-3 rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-xs font-bold text-amber-600 dark:text-amber-400">
                    Chức năng mượn thiết bị chỉ hoạt động trong giờ học. Vui lòng chờ đến khi buổi học bắt đầu.
                  </p>
                </div>
              )}
            </div>
          )}
        </section>

        {/* ══ SECTION 2: Equipment in Room ════════════════════════════════════ */}
        {activeSchedule && (
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-6 px-1">
              <div className="w-1.5 h-8 bg-[#1E2B58] dark:bg-blue-500 rounded-full" />
              <h3 className="text-xl font-black text-[#1E2B58] dark:text-white">
                Thiết bị trong phòng
              </h3>
              <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-400/10 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-400/20">
                {roomEquipment.length} THIẾT BỊ
              </span>
            </div>

            {equipmentLoading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-[#1E2B58]/20 dark:text-white/20" />
              </div>
            ) : roomEquipment.length === 0 ? (
              <div className="dashboard-card rounded-4xl p-10 flex flex-col items-center justify-center text-center gap-3">
                <Package className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                <p className="text-sm font-bold text-slate-400 dark:text-slate-500">
                  Phòng này chưa có thiết bị nào được đăng ký.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {roomEquipment.map(item => {
                  const eqId = String(item._id);
                  const myReq = myActiveByEqId[eqId];
                  const isDeviceLocked = item.status === 'broken' || item.status === 'maintenance';

                  return (
                    <div
                      key={eqId}
                      className="dashboard-card rounded-[2rem] p-6 flex flex-col gap-4 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#1E2B58]/5"
                    >
                      {/* Header */}
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center shrink-0">
                          {item.img
                            ? <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                            : <Laptop className="w-5 h-5 text-slate-400" />
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-black text-[#1E2B58] dark:text-white truncate text-sm">
                            {item.name}
                          </p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">
                            {item.code || '#' + eqId.slice(-6).toUpperCase()}
                          </p>
                        </div>
                      </div>

                      {/* Category + availability row */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/30 truncate max-w-[50%]">
                          {item.category || 'Thiết bị'}
                        </span>
                        {/* If I have the active request, show my own status; else show device availability */}
                        {myReq
                          ? <RequestStatusBadge status={myReq.status} />
                          : <AvailabilityLabel equipmentStatus={item.status} isOccupiedByOther={false} />
                        }
                      </div>

                      {/* Action area */}
                      {isDeviceLocked ? (
                        <button
                          disabled
                          className="w-full py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 font-black text-xs uppercase tracking-widest cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          <Lock className="w-3.5 h-3.5" /> Không khả dụng
                        </button>
                      ) : myReq ? (
                        // I have an active request for this equipment
                        <div className="flex flex-col gap-2">
                          {myReq.status === 'handed_over' && (
                            <button
                              onClick={() => { setReturnTarget(myReq); setReturnConfirmed(false); setReturnNote(''); }}
                              className="w-full py-2.5 rounded-2xl bg-[#1E2B58] dark:bg-blue-700 text-white font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#2A3B66] dark:hover:bg-blue-600 transition-all active:scale-95 shadow-md shadow-blue-900/20"
                            >
                              <LogOut className="w-3.5 h-3.5" /> Trả thiết bị
                            </button>
                          )}
                          {myReq.status === 'approved' && (
                            <div className="w-full py-2.5 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 border border-blue-100 dark:border-blue-900/30">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Chờ giảng viên bàn giao
                            </div>
                          )}
                          {myReq.status === 'pending' && (
                            <button
                              onClick={() => handleCancelRequest(myReq)}
                              className="w-full py-2.5 rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all active:scale-95 border border-red-100 dark:border-red-900/30"
                            >
                              <X className="w-3.5 h-3.5" /> Hủy yêu cầu
                            </button>
                          )}
                          <button
                            onClick={() => setViewRequest(myReq)}
                            className="w-full py-2 text-[10px] font-black uppercase tracking-widest text-[#1E2B58]/40 dark:text-white/30 hover:text-[#1E2B58] dark:hover:text-white flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <Eye className="w-3 h-3" /> Xem chi tiết yêu cầu
                          </button>
                        </div>
                      ) : (
                        // No active request — show "Request Borrow" button
                        <button
                          onClick={() => {
                            if (!isSessionOngoing) {
                              toast.warning('Buổi học chưa bắt đầu. Vui lòng chờ đến giờ học.');
                              return;
                            }
                            setBorrowTarget(item);
                            setBorrowNote('');
                          }}
                          disabled={!isSessionOngoing}
                          className={`w-full py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 ${
                            isSessionOngoing
                              ? 'bg-[#1E2B58] dark:bg-blue-700 text-white hover:bg-[#2A3B66] dark:hover:bg-blue-600 shadow-md shadow-blue-900/20'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                          }`}
                        >
                          <Plus className="w-3.5 h-3.5" /> Yêu cầu mượn
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* ══ SECTION 3: My Active Requests ═══════════════════════════════════ */}
        {(requestsLoading || activeRequests.length > 0) && (
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-6 px-1">
              <div className="w-1.5 h-8 bg-amber-400 dark:bg-amber-500 rounded-full" />
              <h3 className="text-xl font-black text-[#1E2B58] dark:text-white">Yêu cầu của tôi</h3>
              {!requestsLoading && (
                <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-400/10 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-400/20">
                  {activeRequests.length}
                </span>
              )}
            </div>

            {requestsLoading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="w-6 h-6 animate-spin text-[#1E2B58]/20 dark:text-white/20" />
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {activeRequests.map(req => {
                  const eqName = req.equipmentId?.name || 'Thiết bị';
                  const eqImg = req.equipmentId?.img;
                  return (
                    <div
                      key={req._id}
                      className="dashboard-card rounded-3xl p-5 flex items-center gap-4 flex-wrap group"
                    >
                      <div className="w-11 h-11 rounded-2xl bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center shrink-0">
                        {eqImg
                          ? <img src={eqImg} alt="" className="w-full h-full object-cover" />
                          : <Laptop className="w-4.5 h-4.5 text-slate-400" />
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-black text-[#1E2B58] dark:text-white text-sm truncate">{eqName}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                          Gửi lúc {fmtDateTime(req.createdAt)}
                        </p>
                        {req.note && (
                          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 truncate">"{req.note}"</p>
                        )}
                        {req.decisionNote && (
                          <p className="text-xs text-red-400 dark:text-red-400/80 mt-0.5 italic">
                            Phản hồi: "{req.decisionNote}"
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <RequestStatusBadge status={req.status} />
                        {req.status === 'handed_over' && (
                          <button
                            onClick={() => { setReturnTarget(req); setReturnConfirmed(false); setReturnNote(''); }}
                            className="px-4 py-2 rounded-xl bg-[#1E2B58] dark:bg-blue-700 text-white font-black text-[10px] uppercase tracking-widest hover:bg-[#2A3B66] transition-all active:scale-95 shadow-md shadow-blue-900/20"
                          >
                            Trả thiết bị
                          </button>
                        )}
                        {req.status === 'pending' && (
                          <button
                            onClick={() => handleCancelRequest(req)}
                            className="px-4 py-2 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 font-black text-[10px] uppercase tracking-widest hover:bg-red-100 transition-all active:scale-95 border border-red-100 dark:border-red-900/30"
                          >
                            Hủy
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

      </main>

      {/* ══════════════════════════════════════════════════════════════════════
          MODALS
      ══════════════════════════════════════════════════════════════════════ */}

      {/* ── Borrow Request Modal ─────────────────────────────────────────────── */}
      {borrowTarget && createPortal(
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4"
          onClick={e => { if (e.target === e.currentTarget) setBorrowTarget(null); }}
        >
          <div className="dashboard-card rounded-4xl p-8 w-full max-w-md shadow-2xl shadow-[#1E2B58]/20 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setBorrowTarget(null)}
              className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#1E2B58]/10 dark:hover:bg-white/10 transition"
            >
              <X className="w-4 h-4 text-[#1E2B58]/60 dark:text-white/60" />
            </button>

            {/* Equipment preview */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center shrink-0">
                {borrowTarget.img
                  ? <img src={borrowTarget.img} alt="" className="w-full h-full object-cover" />
                  : <Laptop className="w-6 h-6 text-slate-400" />
                }
              </div>
              <div>
                <p className="text-[0.625rem] font-black uppercase tracking-widest text-[#1E2B58]/50 dark:text-white/40 mb-0.5">
                  Yêu cầu mượn thiết bị
                </p>
                <h3 className="text-lg font-black text-[#1E2B58] dark:text-white leading-tight">
                  {borrowTarget.name}
                </h3>
              </div>
            </div>

            {/* Session summary */}
            <div className="bg-white/40 dark:bg-slate-800/40 rounded-[1.25rem] p-4 mb-5 space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-[#1E2B58]/60 dark:text-white/50 font-medium shrink-0">Phòng</span>
                <span className="font-bold text-[#1E2B58] dark:text-white text-right">
                  {activeSchedule?.roomId?.name || '—'}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-[#1E2B58]/60 dark:text-white/50 font-medium shrink-0">Buổi học</span>
                <span className="font-bold text-[#1E2B58] dark:text-white text-right truncate max-w-[65%]">
                  {activeSchedule?.title}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-[#1E2B58]/60 dark:text-white/50 font-medium shrink-0">Thời gian</span>
                <span className="font-bold text-[#1E2B58] dark:text-white">
                  {fmtTime(activeSchedule?.startAt)} – {fmtTime(activeSchedule?.endAt)}
                </span>
              </div>
            </div>

            {/* Purpose textarea */}
            <div className="flex flex-col gap-2 mb-6">
              <label className="text-[0.625rem] font-black uppercase tracking-widest text-[#1E2B58]/50 dark:text-white/40">
                Lý do mượn <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                placeholder="Mô tả mục đích sử dụng thiết bị..."
                value={borrowNote}
                onChange={e => setBorrowNote(e.target.value)}
                className="w-full bg-white/40 dark:bg-slate-800/50 border border-white/40 dark:border-slate-700/50 rounded-[1rem] px-4 py-3 text-sm font-medium text-[#1E2B58] dark:text-white placeholder:text-[#1E2B58]/30 dark:placeholder:text-white/30 outline-none focus:ring-2 focus:ring-[#1E2B58]/20 dark:focus:ring-white/10 transition-all resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setBorrowTarget(null)}
                className="flex-1 py-3.5 rounded-[1.25rem] font-bold text-sm border border-[#1E2B58]/20 dark:border-white/20 text-[#1E2B58]/70 dark:text-white/70 hover:bg-[#1E2B58]/5 dark:hover:bg-white/5 transition-all"
              >
                Hủy
              </button>
              <button
                onClick={handleBorrowSubmit}
                disabled={submitting}
                className="flex-[2] py-3.5 rounded-[1.25rem] font-bold text-sm bg-[#1E2B58] text-white hover:bg-[#2A3B66] transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 disabled:opacity-60 active:scale-95"
              >
                {submitting
                  ? <Loader2 className="w-4 h-4 animate-spin" />
                  : <Plus className="w-4 h-4" />
                }
                Gửi yêu cầu
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ── Return Modal ─────────────────────────────────────────────────────── */}
      {returnTarget && createPortal(
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4"
          onClick={e => { if (e.target === e.currentTarget) setReturnTarget(null); }}
        >
          <div className="dashboard-card rounded-4xl p-8 w-full max-w-md shadow-2xl shadow-[#1E2B58]/20 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setReturnTarget(null)}
              className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#1E2B58]/10 dark:hover:bg-white/10 transition"
            >
              <X className="w-4 h-4 text-[#1E2B58]/60 dark:text-white/60" />
            </button>

            <div className="flex flex-col items-center text-center gap-3 mb-6">
              <div className="w-14 h-14 rounded-full bg-blue-500/10 flex items-center justify-center">
                <LogOut className="w-7 h-7 text-blue-500" />
              </div>
              <div>
                <p className="text-[0.625rem] font-black uppercase tracking-widest text-[#1E2B58]/50 dark:text-white/40 mb-0.5">
                  Hoàn trả thiết bị
                </p>
                <h3 className="text-xl font-black text-[#1E2B58] dark:text-white">
                  {returnTarget.equipmentId?.name || 'Thiết bị'}
                </h3>
              </div>
            </div>

            {/* Condition note */}
            <div className="flex flex-col gap-2 mb-4">
              <label className="text-[0.625rem] font-black uppercase tracking-widest text-[#1E2B58]/50 dark:text-white/40">
                Ghi chú tình trạng
              </label>
              <textarea
                rows={3}
                placeholder="Mô tả tình trạng thiết bị khi trả (xước, thiếu phụ kiện, v.v.)..."
                value={returnNote}
                onChange={e => setReturnNote(e.target.value)}
                className="w-full bg-white/40 dark:bg-slate-800/50 border border-white/40 dark:border-slate-700/50 rounded-[1rem] px-4 py-3 text-sm font-medium text-[#1E2B58] dark:text-white placeholder:text-[#1E2B58]/30 dark:placeholder:text-white/30 outline-none focus:ring-2 focus:ring-[#1E2B58]/20 dark:focus:ring-white/10 transition-all resize-none"
              />
            </div>

            {/* Image upload placeholder (TODO: backend multipart support required) */}
            <div className="p-4 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center gap-2 text-center mb-5 opacity-50 cursor-not-allowed">
              <span className="material-symbols-outlined text-3xl text-slate-400">cloud_upload</span>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Ảnh thiết bị khi trả</p>
              <p className="text-[10px] text-slate-400">Tính năng đang phát triển</p>
            </div>

            {/* Confirmation checkbox */}
            <label className="flex items-start gap-3 mb-6 cursor-pointer group">
              <input
                type="checkbox"
                checked={returnConfirmed}
                onChange={e => setReturnConfirmed(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-slate-300 accent-[#1E2B58] cursor-pointer"
              />
              <span className="text-sm font-medium text-[#1E2B58]/80 dark:text-white/70 leading-snug group-hover:text-[#1E2B58] dark:group-hover:text-white transition-colors">
                Tôi xác nhận rằng thiết bị đang được hoàn trả đúng tình trạng và đầy đủ phụ kiện như khi nhận.
              </span>
            </label>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setReturnTarget(null)}
                className="flex-1 py-3.5 rounded-[1.25rem] font-bold text-sm border border-[#1E2B58]/20 dark:border-white/20 text-[#1E2B58]/70 dark:text-white/70 hover:bg-[#1E2B58]/5 dark:hover:bg-white/5 transition-all"
              >
                Hủy
              </button>
              <button
                onClick={handleReturnSubmit}
                disabled={submitting || !returnConfirmed}
                className="flex-[2] py-3.5 rounded-[1.25rem] font-bold text-sm bg-[#1E2B58] text-white hover:bg-[#2A3B66] transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
              >
                {submitting
                  ? <Loader2 className="w-4 h-4 animate-spin" />
                  : <CheckCircle2 className="w-4 h-4" />
                }
                Xác nhận hoàn trả
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ── View Request Detail Modal ────────────────────────────────────────── */}
      {viewRequest && createPortal(
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4"
          onClick={e => { if (e.target === e.currentTarget) setViewRequest(null); }}
        >
          <div className="dashboard-card rounded-4xl p-8 w-full max-w-md shadow-2xl shadow-[#1E2B58]/20 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setViewRequest(null)}
              className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#1E2B58]/10 dark:hover:bg-white/10 transition"
            >
              <X className="w-4 h-4 text-[#1E2B58]/60 dark:text-white/60" />
            </button>

            <p className="text-[0.625rem] font-black uppercase tracking-widest text-[#1E2B58]/50 dark:text-white/40 mb-5">
              Chi tiết yêu cầu #{String(viewRequest._id).slice(-6).toUpperCase()}
            </p>

            <div className="space-y-3 text-sm">
              {[
                ['Thiết bị', viewRequest.equipmentId?.name || '—'],
                ['Trạng thái', <RequestStatusBadge key="s" status={viewRequest.status} />],
                ['Lý do', viewRequest.note || '—'],
                ['Gửi lúc', fmtDateTime(viewRequest.createdAt)],
                ['Phản hồi', viewRequest.decisionNote || 'Chưa có phản hồi'],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between items-center gap-4 py-2 border-b border-[#1E2B58]/5 dark:border-white/5 last:border-0">
                  <span className="text-[#1E2B58]/60 dark:text-white/50 font-medium shrink-0">{label}</span>
                  <span className="font-bold text-[#1E2B58] dark:text-white text-right">{value}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setViewRequest(null)}
              className="mt-6 w-full py-3 rounded-[1.25rem] font-bold text-sm bg-[#1E2B58] text-white hover:bg-[#2A3B66] transition-all active:scale-95"
            >
              Đóng
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default StudentBorrowPage;
