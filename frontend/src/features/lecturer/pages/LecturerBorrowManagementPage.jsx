import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Laptop, Eye, Loader2, BookOpen, MapPin, Clock, CheckCircle2,
  LogOut, LogIn, ShieldCheck, AlertTriangle, RefreshCw, Users, HandMetal
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/useAuthStore';
import { scheduleService } from '@/services/scheduleService';
import { attendanceService } from '@/services/attendanceService';
import { borrowRequestService } from '@/services/borrowRequestService';
import { PageHeader } from '@/features/shared/components/PageHeader';
import { getTodayVN } from '@/utils/dateUtils';
import { uploadImages } from '@/utils/uploadHelper';

// Sub-components
import BorrowBadge from '../components/borrow/BorrowBadge';
import BorrowAvatar from '../components/borrow/BorrowAvatar';
import ApproveModal from '../components/borrow/ApproveModal';
import RejectModal from '../components/borrow/RejectModal';
import HandoverModal from '../components/borrow/HandoverModal';
import ReturnConfirmModal from '../components/borrow/ReturnConfirmModal';
import RequestDetailModal from '../components/borrow/RequestDetailModal';

// Utilities
import {
  fmtTime,
  fmtDateTime,
  getStudentName,
  getEquipmentName
} from '../components/borrow/borrowUtils';

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
  const [rejectingReq, setRejectingReq] = useState(null);
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
      const res = await scheduleService.getMySchedules(getTodayVN());
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

  const returningRequests = useMemo(() =>
    allRequests.filter(r =>
      r.status === 'returning' &&
      (!sessionRoomId || String(r.roomId?._id || r.roomId) === String(sessionRoomId))
    ),
    [allRequests, sessionRoomId]
  );

  // ── Helpers ───────────────────────────────────────────────────────────────
  // (Moved to borrowUtils.js)

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
  const confirmApprove = async (note) => {
    if (!approvingReq) return;
    setSubmitting(true);
    try {
      await borrowRequestService.approveBorrowRequest(approvingReq._id, note.trim() || undefined);
      toast.success(`Đã duyệt yêu cầu của ${getStudentName(approvingReq)}.`);
      setApprovingReq(null);
      await loadRequests();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Không thể duyệt yêu cầu.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Reject ────────────────────────────────────────────────────────────────
  const handleRejectSubmit = async (reason) => {
    if (!rejectingReq) return;
    setSubmitting(true);
    try {
      await borrowRequestService.rejectBorrowRequest(rejectingReq._id, reason.trim());
      toast.success(`Đã từ chối yêu cầu của ${getStudentName(rejectingReq)}.`);
      setRejectingReq(null);
      await loadRequests();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Không thể từ chối yêu cầu.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Handover ──────────────────────────────────────────────────────────────
  const confirmHandover = async (files) => {
    if (!handoverReq) return;
    setSubmitting(true);
    try {
      // 1. Upload images first
      const imageUrls = await uploadImages(files);

      // 2. Submit handover form
      const formData = {
        checklist: {
          appearance: true,
          functioning: true,
          accessories: true,
        },
        notes: handoverReq.note || '',
        images: imageUrls,
      };

      await borrowRequestService.submitHandoverForm(handoverReq._id, formData);
      toast.success(`Đã bàn giao "${getEquipmentName(handoverReq)}" cho ${getStudentName(handoverReq)}.`);
      
      setHandoverReq(null);
      await loadRequests();
    } catch (err) {
      console.error('Handover error:', err);
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
          <BorrowAvatar name={studentName} avatarUrl={req.borrowerId?.avatarUrl} />
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

        {/* ══ SECTION 5: Handing — Awaiting Return Confirmation ═══════════════ */}
        {activeSchedule && returningRequests.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center gap-3 mb-5 px-1">
              <div className="w-1.5 h-8 bg-emerald-500 rounded-full" />
              <h3 className="text-xl font-black text-[#1E2B58] dark:text-white">Chờ xác nhận trả</h3>
              <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-400/10 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-400/20">
                {returningRequests.length}
              </span>
            </div>

            <div className="dashboard-card rounded-4xl overflow-hidden border-2 border-emerald-500/20">
              <div className="divide-y divide-[#1E2B58]/5 dark:divide-white/5">
                {returningRequests.map(req =>
                  renderRequestRow(req, (
                    <button
                      onClick={() => setConfirmReturnReq(req)}
                      className="px-4 py-2 rounded-xl bg-emerald-500 text-white font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all active:scale-95 flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Xác nhận trả
                    </button>
                  ))
                )}
              </div>
            </div>
          </section>
        )}

        {/* ══ SECTION 6: Handed Over — Ongoing Usage ═══════════════════════════ */}
        {activeSchedule && handedOverRequests.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center gap-3 mb-5 px-1">
              <div className="w-1.5 h-8 bg-slate-400 rounded-full" />
              <h3 className="text-xl font-black text-[#1E2B58] dark:text-white">Đang sử dụng</h3>
              <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-white/10">
                {handedOverRequests.length}
              </span>
            </div>

            <div className="dashboard-card rounded-4xl overflow-hidden">
              <div className="divide-y divide-[#1E2B58]/5 dark:divide-white/5">
                {handedOverRequests.map(req =>
                  renderRequestRow(req, (
                    <span className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      Chưa trả
                    </span>
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

      <ApproveModal
        isOpen={!!approvingReq}
        onClose={() => setApprovingReq(null)}
        request={approvingReq}
        onConfirm={confirmApprove}
        submitting={submitting}
      />

      <RejectModal
        isOpen={!!rejectingReq}
        onClose={() => setRejectingReq(null)}
        request={rejectingReq}
        onConfirm={handleRejectSubmit}
        submitting={submitting}
      />

      <HandoverModal
        isOpen={!!handoverReq}
        onClose={() => setHandoverReq(null)}
        request={handoverReq}
        onConfirm={confirmHandover}
        submitting={submitting}
      />

      <ReturnConfirmModal
        isOpen={!!confirmReturnReq}
        onClose={() => setConfirmReturnReq(null)}
        request={confirmReturnReq}
        onConfirm={confirmReturn}
        submitting={submitting}
      />

      <RequestDetailModal
        isOpen={!!viewDetailReq}
        onClose={() => setViewDetailReq(null)}
        request={viewDetailReq}
      />
    </div>
  );
};

export default LecturerBorrowManagementPage;
