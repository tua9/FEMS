import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
  Loader2, BookOpen, MapPin, Clock, CheckCircle2, X, AlertTriangle,
  Laptop, Monitor, LogIn, LogOut, Package, RefreshCw, Eye,
  Users, ShieldCheck, HandMetal,
} from 'lucide-react';
import { toast } from 'sonner';
import { scheduleService } from '@/services/scheduleService';
import { attendanceService } from '@/services/attendanceService';
import { borrowRequestService } from '@/services/borrowRequestService';
import { useAuthStore } from '@/stores/useAuthStore';
import { PageHeader } from '@/features/shared/components/PageHeader';

// ─── Shared sub-components ────────────────────────────────────────────────────

const RequestStatusBadge = ({ status }) => {
  const cfg = {
    pending:     { label: 'Chờ duyệt',    cls: 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-900/30' },
    approved:    { label: 'Đã duyệt',     cls: 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/30' },
    handed_over: { label: 'Đã bàn giao',  cls: 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/30' },
    returned:    { label: 'Đã hoàn trả',  cls: 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700' },
    rejected:    { label: 'Từ chối',      cls: 'bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30' },
    cancelled:   { label: 'Đã huỷ',       cls: 'bg-slate-50 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-500 dark:border-slate-700' },
  };
  const c = cfg[status] || { label: status, cls: 'bg-slate-100 text-slate-600 border-slate-200' };
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${c.cls}`}>
      {c.label}
    </span>
  );
};

const StudentAvatar = ({ name, avatarUrl, size = 'md' }) => {
  const initials = (name || 'U').slice(0, 2).toUpperCase();
  const sz = size === 'sm' ? 'w-8 h-8 text-xs' : 'w-10 h-10 text-sm';
  return (
    <div className={`${sz} rounded-full bg-[#1E2B58] dark:bg-slate-700 flex items-center justify-center text-white font-black shrink-0 overflow-hidden`}>
      {avatarUrl
        ? <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
        : <span>{initials}</span>
      }
    </div>
  );
};

const QUICK_REJECT_REASONS = [
  'Thiết bị không có sẵn',
  'Không phù hợp mục đích sử dụng',
  'Yêu cầu thiếu thông tin',
  'Thời gian không hợp lệ',
];

// ─── Main Page ────────────────────────────────────────────────────────────────

const LecturerBorrowManagementPage = () => {
  const { user } = useAuthStore();

  // ── Schedule ──────────────────────────────────────────────────────────────
  const [schedules, setSchedules] = useState([]);
  const [scheduleLoading, setScheduleLoading] = useState(true);

  // ── Check-in status ───────────────────────────────────────────────────────
  const [checkInStatus, setCheckInStatus] = useState(null); // { checkedIn: bool, checkInTime }
  const [checkInLoading, setCheckInLoading] = useState(false);
  const [checkingIn, setCheckingIn] = useState(false);

  // ── Borrow requests ───────────────────────────────────────────────────────
  const [allRequests, setAllRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(false);

  // ── Modal state ───────────────────────────────────────────────────────────
  const [approvingReq, setApprovingReq] = useState(null);
  const [approveNote, setApproveNote] = useState('');
  const [rejectingReq, setRejectingReq] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectError, setRejectError] = useState('');
  const [handoverReq, setHandoverReq] = useState(null);
  const [confirmReturnReq, setConfirmReturnReq] = useState(null);
  const [viewDetailReq, setViewDetailReq] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // ── Derived: active (ongoing) teaching schedule ───────────────────────────
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

  const isCheckedIn = checkInStatus?.checkedIn === true;

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

  // ── Load check-in status when schedule is known ───────────────────────────
  useEffect(() => {
    if (!activeSchedule?._id) { setCheckInStatus(null); return; }
    let cancelled = false;
    const load = async () => {
      setCheckInLoading(true);
      try {
        const res = await attendanceService.getMyCheckInStatus(activeSchedule._id);
        if (!cancelled) setCheckInStatus(res);
      } catch {
        if (!cancelled) setCheckInStatus({ checkedIn: false });
      } finally {
        if (!cancelled) setCheckInLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [activeSchedule]);

  // ── Load all pending requests ─────────────────────────────────────────────
  const loadRequests = useCallback(async () => {
    setRequestsLoading(true);
    try {
      const res = await borrowRequestService.getAllBorrowRequests();
      setAllRequests(Array.isArray(res) ? res : res.data || []);
    } catch {
      setAllRequests([]);
    } finally {
      setRequestsLoading(false);
    }
  }, []);

  useEffect(() => { loadRequests(); }, [loadRequests]);

  // ── Filter requests relevant to current session ───────────────────────────
  const sessionRoomId = activeSchedule?.roomId?._id || activeSchedule?.roomId;

  const pendingRequests = useMemo(() =>
    allRequests.filter(r =>
      r.status === 'pending' &&
      // filter to current session room if we know it
      (!sessionRoomId || String(r.roomId?._id || r.roomId) === String(sessionRoomId))
    ),
    [allRequests, sessionRoomId]
  );

  const approvedRequests = useMemo(() =>
    allRequests.filter(r =>
      r.status === 'approved' &&
      (!sessionRoomId || String(r.roomId?._id || r.roomId) === String(sessionRoomId))
    ),
    [allRequests, sessionRoomId]
  );

  const handedOverRequests = useMemo(() =>
    allRequests.filter(r =>
      r.status === 'handed_over' &&
      (!sessionRoomId || String(r.roomId?._id || r.roomId) === String(sessionRoomId))
    ),
    [allRequests, sessionRoomId]
  );

  // ── Helpers ───────────────────────────────────────────────────────────────
  const fmtTime = d => d ? new Date(d).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '—';
  const fmtDateTime = d => d
    ? new Date(d).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
    : '—';

  const getStudentName = r =>
    r.borrowerId?.displayName || r.borrowerId?.username || 'Sinh viên';
  const getEquipmentName = r =>
    r.equipmentId?.name || r.roomId?.name || 'Thiết bị';

  // ── Check-in ──────────────────────────────────────────────────────────────
  const handleCheckIn = async () => {
    if (!activeSchedule?._id) return;
    setCheckingIn(true);
    try {
      await attendanceService.checkIn(activeSchedule._id);
      toast.success('Đã điểm danh vào buổi dạy thành công!');
      // Reload check-in status
      const res = await attendanceService.getMyCheckInStatus(activeSchedule._id);
      setCheckInStatus(res);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Không thể điểm danh.');
    } finally {
      setCheckingIn(false);
    }
  };

  const handleCheckOut = async () => {
    if (!activeSchedule?._id) return;
    setCheckingIn(true);
    try {
      await attendanceService.checkOut(activeSchedule._id);
      toast.success('Đã kết thúc buổi dạy.');
      const res = await attendanceService.getMyCheckInStatus(activeSchedule._id);
      setCheckInStatus(res);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Không thể kết thúc buổi dạy.');
    } finally {
      setCheckingIn(false);
    }
  };

  // ── Approve ───────────────────────────────────────────────────────────────
  const confirmApprove = async () => {
    if (!approvingReq) return;
    setSubmitting(true);
    try {
      await borrowRequestService.approveBorrowRequest(approvingReq._id, approveNote.trim() || undefined);
      toast.success(`Đã duyệt yêu cầu của ${getStudentName(approvingReq)}.`);
      setApprovingReq(null);
      setApproveNote('');
      await loadRequests();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Không thể duyệt yêu cầu.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Reject ────────────────────────────────────────────────────────────────
  const handleRejectSubmit = async (e) => {
    e.preventDefault();
    if (!rejectingReq) return;
    if (!rejectReason.trim()) { setRejectError('Vui lòng nhập lý do từ chối.'); return; }
    setSubmitting(true);
    try {
      await borrowRequestService.rejectBorrowRequest(rejectingReq._id, rejectReason.trim());
      toast.success(`Đã từ chối yêu cầu của ${getStudentName(rejectingReq)}.`);
      setRejectingReq(null);
      setRejectReason('');
      setRejectError('');
      await loadRequests();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Không thể từ chối yêu cầu.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Handover ──────────────────────────────────────────────────────────────
  const confirmHandover = async () => {
    if (!handoverReq) return;
    setSubmitting(true);
    try {
      await borrowRequestService.handoverBorrowRequest(handoverReq._id);
      toast.success(`Đã bàn giao "${getEquipmentName(handoverReq)}" cho ${getStudentName(handoverReq)}.`);
      setHandoverReq(null);
      await loadRequests();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Không thể xác nhận bàn giao.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Confirm Return ────────────────────────────────────────────────────────
  const confirmReturn = async () => {
    if (!confirmReturnReq) return;
    setSubmitting(true);
    try {
      await borrowRequestService.returnBorrowRequest(confirmReturnReq._id);
      toast.success(`Đã xác nhận hoàn trả "${getEquipmentName(confirmReturnReq)}".`);
      setConfirmReturnReq(null);
      await loadRequests();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Không thể xác nhận hoàn trả.');
    } finally {
      setSubmitting(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────

  const renderRequestRow = (req, actions) => {
    const studentName = getStudentName(req);
    const eqName = getEquipmentName(req);
    return (
      <div
        key={req._id}
        className="flex flex-col sm:flex-row sm:items-center gap-4 py-4 px-5 border-b border-[#1E2B58]/5 dark:border-white/5 last:border-0"
      >
        {/* Student */}
        <div className="flex items-center gap-3 sm:w-48 shrink-0">
          <StudentAvatar name={studentName} avatarUrl={req.borrowerId?.avatarUrl} />
          <div className="min-w-0">
            <p className="font-black text-[#1E2B58] dark:text-white text-sm truncate">{studentName}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {String(req.borrowerId?._id || 'ID').slice(-8).toUpperCase()}
            </p>
          </div>
        </div>

        {/* Equipment */}
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 overflow-hidden">
            {req.equipmentId?.img
              ? <img src={req.equipmentId.img} alt="" className="w-full h-full object-cover" />
              : <Laptop className="w-4 h-4 text-slate-400" />
            }
          </div>
          <div className="min-w-0">
            <p className="font-bold text-[#1E2B58] dark:text-white text-sm truncate">{eqName}</p>
            {req.note && (
              <p className="text-[10px] text-slate-400 truncate">"{req.note}"</p>
            )}
          </div>
        </div>

        {/* Time */}
        <div className="shrink-0">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gửi lúc</p>
          <p className="text-xs font-bold text-[#1E2B58]/70 dark:text-white/60">{fmtDateTime(req.createdAt)}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {actions}
          <button
            onClick={() => setViewDetailReq(req)}
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-[#1E2B58] dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      <main className="mx-auto flex w-full max-w-[90vw] flex-1 flex-col px-4 pt-6 sm:pt-24 pb-10 sm:px-6 xl:max-w-7xl">

        <PageHeader
          title="Quản lý Mượn Thiết Bị"
          subtitle="Duyệt yêu cầu, bàn giao thiết bị và xác nhận hoàn trả trong buổi dạy."
        />

        {/* ══ SECTION 1: Teaching Session + Check-in ══════════════════════════ */}
        <section className="mb-8">
          {scheduleLoading ? (
            <div className="dashboard-card rounded-4xl p-8 flex items-center gap-4">
              <Loader2 className="w-5 h-5 animate-spin text-[#1E2B58]/30 dark:text-white/20" />
              <span className="text-sm text-[#1E2B58]/50 dark:text-white/40">Đang tải lịch dạy...</span>
            </div>
          ) : !activeSchedule ? (
            <div className="dashboard-card rounded-4xl p-12 flex flex-col items-center justify-center text-center gap-4">
              <BookOpen className="w-12 h-12 text-[#1E2B58]/15 dark:text-white/15" />
              <div>
                <p className="font-black text-[#1E2B58]/50 dark:text-white/40">Không có buổi dạy nào hôm nay</p>
                <p className="text-xs text-[#1E2B58]/30 dark:text-white/30 mt-1">
                  Tính năng quản lý mượn thiết bị chỉ khả dụng trong buổi dạy được lên lịch.
                </p>
              </div>
            </div>
          ) : (
            <div className="dashboard-card rounded-4xl p-6 sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-6">
                {/* Session info */}
                <div className="flex items-start gap-5 flex-1">
                  <div className="w-14 h-14 rounded-3xl bg-[#1E2B58]/8 dark:bg-white/5 flex items-center justify-center shrink-0">
                    <BookOpen className="w-7 h-7 text-[#1E2B58] dark:text-white" />
                  </div>
                  <div>
                    <p className="text-[0.625rem] font-black uppercase tracking-widest text-[#1E2B58]/50 dark:text-white/40 mb-1">
                      Buổi dạy hôm nay
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
                        <span className="text-xs font-bold text-slate-400">
                          Tiết {activeSchedule.slotId.name || activeSchedule.slotId.code}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Check-in controls */}
                <div className="flex flex-col items-end gap-3 shrink-0">
                  {/* Session status badge */}
                  <span className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border ${
                    isSessionOngoing
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/30'
                      : 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-900/30'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isSessionOngoing ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                    {isSessionOngoing ? 'Đang diễn ra' : 'Sắp diễn ra'}
                  </span>

                  {/* Check-in button */}
                  {checkInLoading ? (
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Đang kiểm tra...
                    </div>
                  ) : isCheckedIn ? (
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-2 text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-900/30">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Đã điểm danh
                        {checkInStatus?.checkInTime && ` lúc ${fmtTime(checkInStatus.checkInTime)}`}
                      </span>
                      {isSessionOngoing && (
                        <button
                          onClick={handleCheckOut}
                          disabled={checkingIn}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95 disabled:opacity-60"
                        >
                          {checkingIn ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <LogOut className="w-3.5 h-3.5" />}
                          Kết thúc
                        </button>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={handleCheckIn}
                      disabled={checkingIn || !isSessionOngoing}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 disabled:opacity-60 ${
                        isSessionOngoing
                          ? 'bg-[#1E2B58] text-white hover:bg-[#2A3B66] shadow-lg shadow-blue-900/20'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      {checkingIn ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <LogIn className="w-3.5 h-3.5" />}
                      {isSessionOngoing ? 'Điểm danh' : 'Chưa đến giờ'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* ══ SECTION 2: Borrow Unlock Status ═════════════════════════════════ */}
        {activeSchedule && (
          <section className="mb-8">
            <div className={`rounded-3xl p-5 flex items-start gap-4 border ${
              isCheckedIn
                ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/10 dark:border-emerald-900/20'
                : 'bg-amber-50 border-amber-200 dark:bg-amber-900/10 dark:border-amber-900/20'
            }`}>
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                isCheckedIn
                  ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                  : 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
              }`}>
                {isCheckedIn
                  ? <ShieldCheck className="w-5 h-5" />
                  : <AlertTriangle className="w-5 h-5" />
                }
              </div>
              <div>
                <p className={`font-black text-sm ${isCheckedIn ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'}`}>
                  {isCheckedIn
                    ? 'Cho phép mượn thiết bị đã được kích hoạt'
                    : 'Sinh viên chưa thể mượn thiết bị'}
                </p>
                <p className={`text-xs mt-0.5 ${isCheckedIn ? 'text-emerald-600/70 dark:text-emerald-400/60' : 'text-amber-600/70 dark:text-amber-400/60'}`}>
                  {isCheckedIn
                    ? 'Bạn đã điểm danh. Sinh viên trong phòng có thể gửi yêu cầu mượn thiết bị.'
                    : 'Bạn cần điểm danh trước khi sinh viên có thể gửi yêu cầu mượn thiết bị.'}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* ══ SECTION 3: Pending Requests ══════════════════════════════════════ */}
        {activeSchedule && (
          <section className="mb-8">
            <div className="flex items-center gap-3 mb-5 px-1">
              <div className="w-1.5 h-8 bg-amber-400 dark:bg-amber-500 rounded-full" />
              <h3 className="text-xl font-black text-[#1E2B58] dark:text-white">Yêu cầu chờ duyệt</h3>
              {!requestsLoading && (
                <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-400/10 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-400/20">
                  {pendingRequests.length}
                </span>
              )}
              <button
                onClick={loadRequests}
                className="ml-auto flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[#1E2B58]/40 dark:text-white/30 hover:text-[#1E2B58] dark:hover:text-white transition-colors"
              >
                <RefreshCw className="w-3 h-3" /> Làm mới
              </button>
            </div>

            <div className="dashboard-card rounded-4xl overflow-hidden">
              {requestsLoading ? (
                <div className="flex justify-center py-16">
                  <Loader2 className="w-7 h-7 animate-spin text-[#1E2B58]/20 dark:text-white/20" />
                </div>
              ) : pendingRequests.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3 text-center px-8">
                  <Users className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                  <p className="text-sm font-bold text-slate-400 dark:text-slate-500">
                    Không có yêu cầu mượn nào đang chờ duyệt.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-[#1E2B58]/5 dark:divide-white/5">
                  {pendingRequests.map(req =>
                    renderRequestRow(req, (
                      <>
                        <button
                          onClick={() => setRejectingReq(req)}
                          className="px-4 py-2 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 font-black text-[10px] uppercase tracking-widest hover:bg-red-100 dark:hover:bg-red-900/30 transition-all active:scale-95 border border-red-100 dark:border-red-900/30"
                        >
                          Từ chối
                        </button>
                        <button
                          onClick={() => setApprovingReq(req)}
                          className="px-4 py-2 rounded-xl bg-emerald-500 text-white font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all active:scale-95 shadow-md shadow-emerald-500/20"
                        >
                          Duyệt
                        </button>
                      </>
                    ))
                  )}
                </div>
              )}
            </div>
          </section>
        )}

        {/* ══ SECTION 4: Approved — Awaiting Handover ══════════════════════════ */}
        {activeSchedule && approvedRequests.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center gap-3 mb-5 px-1">
              <div className="w-1.5 h-8 bg-blue-500 rounded-full" />
              <h3 className="text-xl font-black text-[#1E2B58] dark:text-white">Chờ bàn giao</h3>
              <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-400/10 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-400/20">
                {approvedRequests.length}
              </span>
            </div>

            <div className="dashboard-card rounded-4xl overflow-hidden">
              <div className="divide-y divide-[#1E2B58]/5 dark:divide-white/5">
                {approvedRequests.map(req =>
                  renderRequestRow(req, (
                    <button
                      onClick={() => setHandoverReq(req)}
                      className="px-4 py-2 rounded-xl bg-[#1E2B58] dark:bg-blue-700 text-white font-black text-[10px] uppercase tracking-widest hover:bg-[#2A3B66] dark:hover:bg-blue-600 transition-all active:scale-95 shadow-md shadow-blue-900/20 flex items-center gap-1.5"
                    >
                      <HandMetal className="w-3.5 h-3.5" /> Bàn giao
                    </button>
                  ))
                )}
              </div>
            </div>
          </section>
        )}

        {/* ══ SECTION 5: Handed Over — Awaiting Return Confirmation ════════════ */}
        {activeSchedule && handedOverRequests.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center gap-3 mb-5 px-1">
              <div className="w-1.5 h-8 bg-emerald-500 rounded-full" />
              <h3 className="text-xl font-black text-[#1E2B58] dark:text-white">Đang được mượn</h3>
              <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-400/10 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-400/20">
                {handedOverRequests.length}
              </span>
            </div>

            <div className="dashboard-card rounded-4xl overflow-hidden">
              <div className="divide-y divide-[#1E2B58]/5 dark:divide-white/5">
                {handedOverRequests.map(req =>
                  renderRequestRow(req, (
                    <button
                      onClick={() => setConfirmReturnReq(req)}
                      className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-[#1E2B58] dark:text-white font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95 flex items-center gap-1.5 border border-slate-200 dark:border-slate-700"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Xác nhận trả
                    </button>
                  ))
                )}
              </div>
            </div>
          </section>
        )}

      </main>

      {/* ══════════════════════════════════════════════════════════════════════
          MODALS
      ══════════════════════════════════════════════════════════════════════ */}

      {/* ── Approve Confirmation Modal ───────────────────────────────────────── */}
      {approvingReq && createPortal(
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4"
          onClick={e => { if (e.target === e.currentTarget) { setApprovingReq(null); setApproveNote(''); } }}
        >
          <div className="dashboard-card rounded-4xl p-8 w-full max-w-md shadow-2xl shadow-[#1E2B58]/20 relative animate-in fade-in zoom-in-95 duration-200">
            <button onClick={() => setApprovingReq(null)}
              className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#1E2B58]/10 dark:hover:bg-white/10 transition">
              <X className="w-4 h-4 text-[#1E2B58]/60 dark:text-white/60" />
            </button>

            <div className="flex flex-col items-center text-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7 text-emerald-500" />
              </div>
              <div>
                <p className="text-[0.625rem] font-black uppercase tracking-widest text-[#1E2B58]/50 dark:text-white/40 mb-1">Xác nhận duyệt</p>
                <h3 className="text-xl font-black text-[#1E2B58] dark:text-white">Duyệt yêu cầu này?</h3>
              </div>
            </div>

            <div className="bg-white/40 dark:bg-slate-800/40 rounded-[1.25rem] p-4 mb-6 space-y-2 text-sm">
              {[
                ['Sinh viên', getStudentName(approvingReq)],
                ['Thiết bị', getEquipmentName(approvingReq)],
                ['Lý do', approvingReq.note || '—'],
                ['Gửi lúc', fmtDateTime(approvingReq.createdAt)],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4">
                  <span className="text-[#1E2B58]/60 dark:text-white/50 font-medium shrink-0">{label}</span>
                  <span className="font-bold text-[#1E2B58] dark:text-white text-right">{value}</span>
                </div>
              ))}
            </div>

            <div className="mb-5">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#1E2B58]/50 dark:text-white/40 mb-2 block">
                Tin nhắn gửi sinh viên <span className="normal-case font-medium opacity-70">(tùy chọn)</span>
              </label>
              <textarea
                value={approveNote}
                onChange={e => setApproveNote(e.target.value)}
                placeholder="VD: Vui lòng đến phòng B203 để nhận thiết bị sau tiết 2..."
                rows={3}
                className="w-full rounded-[1rem] border border-[#1E2B58]/10 dark:border-white/10 bg-white/60 dark:bg-white/5 px-4 py-3 text-sm font-medium text-[#1E2B58] dark:text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-emerald-400/30 resize-none transition-all"
              />
            </div>

            <div className="flex gap-3">
              <button onClick={() => { setApprovingReq(null); setApproveNote(''); }}
                className="flex-1 py-3.5 rounded-[1.25rem] font-bold text-sm border border-[#1E2B58]/20 dark:border-white/20 text-[#1E2B58]/70 dark:text-white/70 hover:bg-[#1E2B58]/5 dark:hover:bg-white/5 transition-all">
                Hủy
              </button>
              <button onClick={confirmApprove} disabled={submitting}
                className="flex-[2] py-3.5 rounded-[1.25rem] font-bold text-sm bg-emerald-500 text-white hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 disabled:opacity-60 active:scale-95">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                Xác nhận duyệt
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ── Reject Modal ─────────────────────────────────────────────────────── */}
      {rejectingReq && createPortal(
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4"
          onClick={e => { if (e.target === e.currentTarget) setRejectingReq(null); }}
        >
          <div className="dashboard-card rounded-4xl p-8 w-full max-w-md shadow-2xl shadow-[#1E2B58]/20 relative animate-in fade-in zoom-in-95 duration-200">
            <button onClick={() => setRejectingReq(null)}
              className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#1E2B58]/10 dark:hover:bg-white/10 transition">
              <X className="w-4 h-4 text-[#1E2B58]/60 dark:text-white/60" />
            </button>

            <div className="flex flex-col items-center text-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center">
                <AlertTriangle className="w-7 h-7 text-red-500" />
              </div>
              <div>
                <p className="text-[0.625rem] font-black uppercase tracking-widest text-[#1E2B58]/50 dark:text-white/40 mb-1">Từ chối yêu cầu</p>
                <h3 className="text-xl font-black text-[#1E2B58] dark:text-white">{getStudentName(rejectingReq)}</h3>
                <p className="text-xs text-[#1E2B58]/50 dark:text-white/40 mt-0.5">{getEquipmentName(rejectingReq)}</p>
              </div>
            </div>

            <form onSubmit={handleRejectSubmit} className="flex flex-col gap-4">
              {/* Quick reasons */}
              <div>
                <p className="text-[0.625rem] font-black uppercase tracking-widest text-[#1E2B58]/50 dark:text-white/40 mb-2">
                  Lý do nhanh
                </p>
                <div className="flex flex-wrap gap-2">
                  {QUICK_REJECT_REASONS.map(r => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRejectReason(r)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all hover:scale-105 active:scale-95 ${
                        rejectReason === r
                          ? 'bg-red-500 text-white shadow-md shadow-red-500/20'
                          : 'bg-white/40 dark:bg-slate-800/40 text-[#1E2B58] dark:text-white border border-[#1E2B58]/10 dark:border-white/10 hover:bg-white/60 dark:hover:bg-slate-700/50'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reason textarea */}
              <div className="flex flex-col gap-2">
                <label className="text-[0.625rem] font-black uppercase tracking-widest text-[#1E2B58]/50 dark:text-white/40">
                  Lý do từ chối <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Giải thích lý do từ chối yêu cầu này..."
                  value={rejectReason}
                  onChange={e => { setRejectReason(e.target.value); setRejectError(''); }}
                  className="w-full bg-white/40 dark:bg-slate-800/50 border border-white/40 dark:border-slate-700/50 rounded-[1rem] px-4 py-3 text-sm font-medium text-[#1E2B58] dark:text-white placeholder:text-[#1E2B58]/30 dark:placeholder:text-white/30 outline-none focus:ring-2 focus:ring-red-400/30 transition-all resize-none"
                />
                {rejectError && <p className="text-xs font-bold text-red-500">{rejectError}</p>}
              </div>

              <div className="flex gap-3 mt-1">
                <button type="button" onClick={() => setRejectingReq(null)}
                  className="flex-1 py-3.5 rounded-[1.25rem] font-bold text-sm border border-[#1E2B58]/20 dark:border-white/20 text-[#1E2B58]/70 dark:text-white/70 hover:bg-[#1E2B58]/5 dark:hover:bg-white/5 transition-all">
                  Hủy
                </button>
                <button type="submit" disabled={submitting}
                  className="flex-[2] py-3.5 rounded-[1.25rem] font-bold text-sm bg-red-500 text-white hover:bg-red-600 transition-all shadow-lg shadow-red-500/20 flex items-center justify-center gap-2 disabled:opacity-60 active:scale-95">
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                  Từ chối yêu cầu
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* ── Handover Confirmation Modal ──────────────────────────────────────── */}
      {handoverReq && createPortal(
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4"
          onClick={e => { if (e.target === e.currentTarget) setHandoverReq(null); }}
        >
          <div className="dashboard-card rounded-4xl p-8 w-full max-w-md shadow-2xl shadow-[#1E2B58]/20 relative animate-in fade-in zoom-in-95 duration-200">
            <button onClick={() => setHandoverReq(null)}
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
                ['Thiết bị', getEquipmentName(handoverReq)],
                ['Trao cho', getStudentName(handoverReq)],
                ['Lý do', handoverReq.note || '—'],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4">
                  <span className="text-[#1E2B58]/60 dark:text-white/50 font-medium shrink-0">{label}</span>
                  <span className="font-bold text-[#1E2B58] dark:text-white text-right">{value}</span>
                </div>
              ))}
            </div>

            {/* Image upload placeholder */}
            <div className="p-3 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex items-center gap-3 mb-5 opacity-50">
              <span className="material-symbols-outlined text-2xl text-slate-400">cloud_upload</span>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Ảnh bàn giao thiết bị</p>
                <p className="text-[10px] text-slate-400">Tính năng đang phát triển</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setHandoverReq(null)}
                className="flex-1 py-3.5 rounded-[1.25rem] font-bold text-sm border border-[#1E2B58]/20 dark:border-white/20 text-[#1E2B58]/70 dark:text-white/70 hover:bg-[#1E2B58]/5 dark:hover:bg-white/5 transition-all">
                Hủy
              </button>
              <button onClick={confirmHandover} disabled={submitting}
                className="flex-[2] py-3.5 rounded-[1.25rem] font-bold text-sm bg-[#1E2B58] text-white hover:bg-[#2A3B66] transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 disabled:opacity-60 active:scale-95">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                Xác nhận bàn giao
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ── Confirm Return Modal ─────────────────────────────────────────────── */}
      {confirmReturnReq && createPortal(
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4"
          onClick={e => { if (e.target === e.currentTarget) setConfirmReturnReq(null); }}
        >
          <div className="dashboard-card rounded-4xl p-8 w-full max-w-md shadow-2xl shadow-[#1E2B58]/20 relative animate-in fade-in zoom-in-95 duration-200">
            <button onClick={() => setConfirmReturnReq(null)}
              className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#1E2B58]/10 dark:hover:bg-white/10 transition">
              <X className="w-4 h-4 text-[#1E2B58]/60 dark:text-white/60" />
            </button>

            <div className="flex flex-col items-center text-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <LogOut className="w-7 h-7 text-slate-500 dark:text-slate-300" />
              </div>
              <div>
                <p className="text-[0.625rem] font-black uppercase tracking-widest text-[#1E2B58]/50 dark:text-white/40 mb-1">Xác nhận hoàn trả</p>
                <h3 className="text-xl font-black text-[#1E2B58] dark:text-white">{getEquipmentName(confirmReturnReq)}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Trả bởi {getStudentName(confirmReturnReq)}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 mb-5">
              <p className="text-xs font-bold text-amber-600 dark:text-amber-400">
                Hãy kiểm tra tình trạng thiết bị trước khi xác nhận. Nếu có hư hỏng, hãy báo cáo thay vì xác nhận.
              </p>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setConfirmReturnReq(null)}
                className="flex-1 py-3.5 rounded-[1.25rem] font-bold text-sm border border-[#1E2B58]/20 dark:border-white/20 text-[#1E2B58]/70 dark:text-white/70 hover:bg-[#1E2B58]/5 dark:hover:bg-white/5 transition-all">
                Hủy
              </button>
              <button onClick={confirmReturn} disabled={submitting}
                className="flex-[2] py-3.5 rounded-[1.25rem] font-bold text-sm bg-[#1E2B58] text-white hover:bg-[#2A3B66] transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 disabled:opacity-60 active:scale-95">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                Xác nhận đã nhận lại
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ── View Request Detail Modal ────────────────────────────────────────── */}
      {viewDetailReq && createPortal(
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4"
          onClick={e => { if (e.target === e.currentTarget) setViewDetailReq(null); }}
        >
          <div className="dashboard-card rounded-4xl p-8 w-full max-w-md shadow-2xl shadow-[#1E2B58]/20 relative animate-in fade-in zoom-in-95 duration-200">
            <button onClick={() => setViewDetailReq(null)}
              className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#1E2B58]/10 dark:hover:bg-white/10 transition">
              <X className="w-4 h-4 text-[#1E2B58]/60 dark:text-white/60" />
            </button>

            <p className="text-[0.625rem] font-black uppercase tracking-widest text-[#1E2B58]/50 dark:text-white/40 mb-5">
              Chi tiết yêu cầu #{String(viewDetailReq._id).slice(-6).toUpperCase()}
            </p>

            <div className="space-y-0">
              {[
                ['Sinh viên', getStudentName(viewDetailReq)],
                ['Thiết bị', getEquipmentName(viewDetailReq)],
                ['Trạng thái', <RequestStatusBadge key="s" status={viewDetailReq.status} />],
                ['Lý do', viewDetailReq.note || '—'],
                ['Gửi lúc', fmtDateTime(viewDetailReq.createdAt)],
                ['Phản hồi', viewDetailReq.decisionNote || '—'],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between items-center gap-4 py-2.5 border-b border-[#1E2B58]/5 dark:border-white/5 last:border-0">
                  <span className="text-[#1E2B58]/60 dark:text-white/50 font-medium text-sm shrink-0">{label}</span>
                  <span className="font-bold text-[#1E2B58] dark:text-white text-right text-sm">{value}</span>
                </div>
              ))}
            </div>

            <button onClick={() => setViewDetailReq(null)}
              className="mt-6 w-full py-3 rounded-[1.25rem] font-bold text-sm bg-[#1E2B58] text-white hover:bg-[#2A3B66] transition-all active:scale-95">
              Đóng
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default LecturerBorrowManagementPage;
