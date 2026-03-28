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
import { getTodayVN, getSlotTimeStatus } from '@/utils/dateUtils';
import { uploadImages } from '@/utils/uploadHelper';

// Sub-components
import BorrowBadge from '../components/borrow/BorrowBadge';
import BorrowAvatar from '../components/borrow/BorrowAvatar';
import ApproveModal from '../components/borrow/ApproveModal';
import RejectModal from '../components/borrow/RejectModal';
import ReturnConfirmModal from '../components/borrow/ReturnConfirmModal';
import RequestDetailModal from '../components/borrow/RequestDetailModal';
import RemindModal from '../components/borrow/RemindModal';
import BorrowRequestRow from '../components/borrow/BorrowRequestRow';
import ConfirmModal from '@/features/shared/components/ConfirmModal';

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
  const [confirmReturnReq, setConfirmReturnReq] = useState(null);
  const [remindReq, setRemindReq] = useState(null);
  const [viewDetailReq, setViewDetailReq] = useState(null);
  const [showEndSessionModal, setShowEndSessionModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [nowTick, setNowTick] = useState(Date.now());

  // ── Derived: active (ongoing) teaching schedule ───────────────────────────
  const activeSchedule = useMemo(() => {
    if (!schedules.length) return null;
    
    // 1. Ongoing: current time is within [startAt, endAt] AND not completed
    const ongoing = schedules.find(s => 
      s.status !== 'completed' && 
      getSlotTimeStatus(s.startAt, s.endAt) === 'ongoing'
    );
    if (ongoing) return ongoing;
    
    // 2. Upcoming: starts in the future AND not completed
    const upcoming = schedules.find(s => 
      s.status !== 'completed' && 
      getSlotTimeStatus(s.startAt, s.endAt) === 'upcoming'
    );
    if (upcoming) return upcoming;

    // 3. Fallback: Recently ended session of today (so lecturer can still checkout)
    const recentlyEnded = [...schedules]
      .filter(s => getSlotTimeStatus(s.startAt, s.endAt) === 'ended')
      .sort((a,b) => new Date(b.endAt) - new Date(a.endAt))[0];

    return recentlyEnded || null;
  }, [schedules, nowTick]);

  const isSessionOngoing = useMemo(() => {
    if (!activeSchedule) return false;
    if (activeSchedule.status === 'completed') return false;
    return getSlotTimeStatus(activeSchedule.startAt, activeSchedule.endAt) === 'ongoing';
  }, [activeSchedule, nowTick]);

  // ── Tick ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const id = setInterval(() => setNowTick(Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);

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

  const returningRequests = useMemo(() => {
    const uid = user?._id ? String(user._id) : null;
    return allRequests.filter(r => {
      if (r.status !== 'returning') return false;
      const isCurrentSession = !sessionRoomId || String(r.roomId?._id || r.roomId) === String(sessionRoomId);
      const isMyHandover = uid && String(r.handedOverBy?._id || r.handedOverBy) === uid;
      const isMyApprove = uid && String(r.approvedBy?._id || r.approvedBy) === uid;
      return isCurrentSession || isMyHandover || isMyApprove;
    });
  }, [allRequests, sessionRoomId, user]);

  const unreturnedRequests = useMemo(() => {
    if (!user?._id) return [];
    const uid = String(user._id);
    return allRequests.filter(r => {
      if (r.status !== 'unreturned') return false;
      const aId = r.approvedBy ? String(r.approvedBy._id || r.approvedBy) : null;
      const hId = r.handedOverBy ? String(r.handedOverBy._id || r.handedOverBy) : null;
      return aId === uid || hId === uid;
    });
  }, [allRequests, user]);

  // ── Helpers ───────────────────────────────────────────────────────────────
  // (Moved to borrowUtils.js)

  // ── Check-in ──────────────────────────────────────────────────────────────
  const handleCheckIn = async () => {
    if (!activeSchedule?._id) return;
    setCheckingIn(true);
    try {
      await attendanceService.checkIn(activeSchedule._id);
      toast.success('Check-in recorded successfully.');
      // Reload check-in status
      const res = await attendanceService.getMyCheckInStatus(activeSchedule._id);
      setCheckInStatus(res);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not check in.');
    } finally {
      setCheckingIn(false);
    }
  };

  const handleCheckOut = async () => {
    if (!activeSchedule?._id) return;
    setCheckingIn(true);
    try {
      await attendanceService.checkOut(activeSchedule._id);
      toast.success('Session ended.');
      const res = await attendanceService.getMyCheckInStatus(activeSchedule._id);
      setCheckInStatus(res);
      await loadSchedules(); // Reload to get updated schedule status
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not end the session.');
    } finally {
      setCheckingIn(false);
      setShowEndSessionModal(false);
    }
  };

  // ── Approve ───────────────────────────────────────────────────────────────
  const confirmApprove = async (note) => {
    if (!approvingReq) return;
    setSubmitting(true);
    try {
      await borrowRequestService.approveBorrowRequest(approvingReq._id, note.trim() || undefined);
      toast.success(`${getStudentName(approvingReq)}'s request has been approved.`);
      setApprovingReq(null);
      await loadRequests();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not approve the request.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Remind ────────────────────────────────────────────────────────────────
  const handleSendReminder = async (note) => {
    if (!remindReq) return;
    setSubmitting(true);
    try {
      await borrowRequestService.remindBorrowRequest(remindReq._id, note);
      toast.success(`Reminder sent to ${getStudentName(remindReq)}.`);
      setRemindReq(null);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not send reminder.');
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
      toast.success(`${getStudentName(rejectingReq)}'s request has been rejected.`);
      setRejectingReq(null);
      await loadRequests();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not reject the request.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Confirm Return ────────────────────────────────────────────────────────
  const confirmReturn = async (formData) => {
    if (!confirmReturnReq) return;
    setSubmitting(true);
    try {
      let imageUrls = [];
      if (formData.files && formData.files.length > 0) {
        imageUrls = await uploadImages(formData.files);
      }

      await borrowRequestService.returnBorrowRequest(confirmReturnReq._id, {
        checklist: formData.checklist,
        notes: formData.notes,
        images: imageUrls,
      });
      toast.success(`Return confirmed for "${getEquipmentName(confirmReturnReq)}".`);
      setConfirmReturnReq(null);
      await loadRequests();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not confirm return.');
    } finally {
      setSubmitting(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────


  return (
    <div className="w-full">
      <main className="mx-auto flex w-full max-w-[90vw] flex-1 flex-col px-4 pt-6 sm:pt-24 pb-10 sm:px-6 xl:max-w-7xl">

        <PageHeader
          title="Equipment borrow management"
          subtitle="Approve requests, hand over equipment, and confirm returns during your teaching session."
        />

        {/* ══ SECTION 1: Teaching Session + Check-in ══════════════════════════ */}
        <section className="mb-8">
          {scheduleLoading ? (
            <div className="dashboard-card rounded-4xl p-8 flex items-center gap-4">
              <Loader2 className="w-5 h-5 animate-spin text-[#1E2B58]/30 dark:text-white/20" />
              <span className="text-sm text-[#1E2B58]/50 dark:text-white/40">Loading today&apos;s schedule…</span>
            </div>
          ) : !activeSchedule ? (
            <div className="dashboard-card rounded-4xl p-12 flex flex-col items-center justify-center text-center gap-4">
              <BookOpen className="w-12 h-12 text-[#1E2B58]/15 dark:text-white/15" />
              <div>
                <p className="font-black text-[#1E2B58]/50 dark:text-white/40">No teaching sessions scheduled today</p>
                <p className="text-xs text-[#1E2B58]/30 dark:text-white/30 mt-1">
                  Borrow management is only available during a scheduled class session.
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
                      Today&apos;s teaching session
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
                        {activeSchedule.slotId?.startTime || fmtTime(activeSchedule.startAt)} – {activeSchedule.slotId?.endTime || fmtTime(activeSchedule.endAt)}
                      </span>
                      {activeSchedule.slotId && (
                        <span className="text-xs font-bold text-slate-400">
                          Slot {activeSchedule.slotId.name || activeSchedule.slotId.code}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Check-in controls */}
                <div className="flex flex-col items-end gap-3 shrink-0">
                  {/* Session status badge */}
                  <span className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border ${
                    (activeSchedule.status === 'completed' || getSlotTimeStatus(activeSchedule.startAt, activeSchedule.endAt) === 'ended')
                      ? 'bg-slate-50 text-slate-500 border-slate-200 dark:bg-slate-900/40 dark:text-slate-400 dark:border-slate-800'
                      : isSessionOngoing
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/30'
                        : 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-900/30'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      (activeSchedule.status === 'completed' || getSlotTimeStatus(activeSchedule.startAt, activeSchedule.endAt) === 'ended') ? 'bg-slate-400' :
                      isSessionOngoing ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                    }`} />
                    {(activeSchedule.status === 'completed' || getSlotTimeStatus(activeSchedule.startAt, activeSchedule.endAt) === 'ended') ? 'Completed' : isSessionOngoing ? 'Ongoing' : 'Upcoming'}
                  </span>

                  {/* Check-in button */}
                  {checkInLoading ? (
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Checking…
                    </div>
                  ) : isCheckedIn ? (
                    <div className="flex items-center gap-3">
                      <span className={`flex items-center gap-2 text-xs font-black px-3 py-1.5 rounded-xl border ${
                        (activeSchedule.status === 'completed' || getSlotTimeStatus(activeSchedule.startAt, activeSchedule.endAt) === 'ended')
                          ? 'text-slate-500 bg-slate-50 border-slate-200 dark:bg-slate-900/40 dark:text-slate-400 dark:border-slate-800'
                          : 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-900/30'
                      }`}>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Checked in
                        {checkInStatus?.checkInTime && ` at ${fmtTime(checkInStatus.checkInTime)}`}
                      </span>
                      {activeSchedule.status !== 'completed' && (
                        <button
                          onClick={() => setShowEndSessionModal(true)}
                          disabled={checkingIn}
                          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 disabled:opacity-60 ${
                            getSlotTimeStatus(activeSchedule.startAt, activeSchedule.endAt) === 'ended'
                              ? 'bg-red-500 text-white shadow-lg shadow-red-500/20 hover:bg-red-600'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                          }`}
                        >
                          {checkingIn ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <LogOut className="w-3.5 h-3.5" />}
                          End
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
                      {isSessionOngoing ? 'Check in' : 'Not yet time'}
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
              (activeSchedule.status !== 'completed' && new Date(activeSchedule.endAt) < new Date() && isCheckedIn)
                ? 'bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-900/20 animate-pulse'
                : isCheckedIn
                  ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/10 dark:border-emerald-900/20'
                  : 'bg-amber-50 border-amber-200 dark:bg-amber-900/10 dark:border-amber-900/20'
            }`}>
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                (activeSchedule.status !== 'completed' && new Date(activeSchedule.endAt) < new Date() && isCheckedIn)
                  ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                  : isCheckedIn
                    ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                    : 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
              }`}>
                {(activeSchedule.status !== 'completed' && new Date(activeSchedule.endAt) < new Date() && isCheckedIn)
                  ? <AlertTriangle className="w-5 h-5" />
                  : isCheckedIn
                    ? <ShieldCheck className="w-5 h-5" />
                    : <AlertTriangle className="w-5 h-5" />
                }
              </div>
              <div>
                <p className={`font-black text-sm ${
                  (activeSchedule.status !== 'completed' && getSlotTimeStatus(activeSchedule.startAt, activeSchedule.endAt) === 'ended' && isCheckedIn)
                    ? 'text-red-700 dark:text-red-400'
                    : activeSchedule.status === 'completed' || getSlotTimeStatus(activeSchedule.startAt, activeSchedule.endAt) === 'ended'
                      ? 'text-slate-600 dark:text-slate-300'
                      : isCheckedIn ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'
                }`}>
                  {activeSchedule.status !== 'completed' && getSlotTimeStatus(activeSchedule.startAt, activeSchedule.endAt) === 'ended' && isCheckedIn
                    ? 'ACTION REQUIRED: End Session'
                    : activeSchedule.status === 'completed' || getSlotTimeStatus(activeSchedule.startAt, activeSchedule.endAt) === 'ended'
                      ? 'Session has ended'
                      : isCheckedIn
                        ? 'Equipment borrowing is enabled'
                        : 'Students cannot borrow equipment yet'}
                </p>
                <p className={`text-xs mt-0.5 ${
                  (activeSchedule.status !== 'completed' && getSlotTimeStatus(activeSchedule.startAt, activeSchedule.endAt) === 'ended' && isCheckedIn)
                    ? 'text-red-600/70 dark:text-red-400/60'
                    : activeSchedule.status === 'completed' || getSlotTimeStatus(activeSchedule.startAt, activeSchedule.endAt) === 'ended'
                      ? 'text-slate-500 dark:text-slate-400'
                      : isCheckedIn ? 'text-emerald-600/70 dark:text-emerald-400/60' : 'text-amber-600/70 dark:text-amber-400/60'
                }`}>
                  {activeSchedule.status !== 'completed' && getSlotTimeStatus(activeSchedule.startAt, activeSchedule.endAt) === 'ended' && isCheckedIn
                    ? 'The scheduled time for this slot has passed. Please click "End Session" to complete your check-out.'
                    : activeSchedule.status === 'completed' || getSlotTimeStatus(activeSchedule.startAt, activeSchedule.endAt) === 'ended'
                      ? 'Students can no longer submit borrow requests for this session.'
                      : isCheckedIn
                        ? 'You are checked in. Students in this room can now submit borrow requests.'
                        : 'You must check in before students can submit borrow requests.'}
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
              <h3 className="text-xl font-black text-[#1E2B58] dark:text-white">Pending approval</h3>
              {!requestsLoading && (
                <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-400/10 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-400/20">
                  {pendingRequests.length}
                </span>
              )}
              <button
                onClick={loadRequests}
                className="ml-auto flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[#1E2B58]/40 dark:text-white/30 hover:text-[#1E2B58] dark:hover:text-white transition-colors"
              >
                <RefreshCw className="w-3 h-3" /> Refresh
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
                    No borrow requests are pending approval.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-[#1E2B58]/5 dark:divide-white/5">
                  {pendingRequests.map(req => (
                    <BorrowRequestRow
                      key={req._id}
                      req={req}
                      onViewDetail={setViewDetailReq}
                      actions={
                        <>
                          <button
                            onClick={() => setRejectingReq(req)}
                            className="px-4 py-2 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 font-black text-[10px] uppercase tracking-widest hover:bg-red-100 dark:hover:bg-red-900/30 transition-all active:scale-95 border border-red-100 dark:border-red-900/30"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => setApprovingReq(req)}
                            className="px-4 py-2 rounded-xl bg-emerald-500 text-white font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all active:scale-95 shadow-md shadow-emerald-500/20"
                          >
                            Approve
                          </button>
                        </>
                      }
                    />
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* ══ SECTION 4: Approved — Awaiting Student Handover Confirm ══════════ */}
        {activeSchedule && approvedRequests.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center gap-3 mb-5 px-1">
              <div className="w-1.5 h-8 bg-blue-500 rounded-full" />
              <h3 className="text-xl font-black text-[#1E2B58] dark:text-white">Awaiting student confirmation</h3>
              <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-400/10 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-400/20">
                {approvedRequests.length}
              </span>
            </div>

            <div className="dashboard-card rounded-4xl overflow-hidden">
              <div className="divide-y divide-[#1E2B58]/5 dark:divide-white/5">
                {approvedRequests.map(req => (
                  <BorrowRequestRow
                    key={req._id}
                    req={req}
                    onViewDetail={setViewDetailReq}
                    actions={
                      <span className="px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest border border-blue-100 dark:border-blue-900/30">
                        Awaiting Confirmation
                      </span>
                    }
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ══ SECTION 5: Handing — Awaiting Return Confirmation ═══════════════ */}
        {returningRequests.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center gap-3 mb-5 px-1">
              <div className="w-1.5 h-8 bg-emerald-500 rounded-full" />
              <h3 className="text-xl font-black text-[#1E2B58] dark:text-white">Awaiting return confirmation</h3>
              <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-400/10 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-400/20">
                {returningRequests.length}
              </span>
            </div>

            <div className="dashboard-card rounded-4xl overflow-hidden border-2 border-emerald-500/20">
              <div className="divide-y divide-[#1E2B58]/5 dark:divide-white/5">
                {returningRequests.map(req => (
                  <BorrowRequestRow
                    key={req._id}
                    req={req}
                    onViewDetail={setViewDetailReq}
                    actions={
                      <button
                        onClick={() => setConfirmReturnReq(req)}
                        className="px-4 py-2 rounded-xl bg-emerald-500 text-white font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all active:scale-95 flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Confirm Return
                      </button>
                    }
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ══ SECTION 6: Handed Over — Ongoing Usage ═══════════════════════════ */}
        {activeSchedule && handedOverRequests.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center gap-3 mb-5 px-1">
              <div className="w-1.5 h-8 bg-slate-400 rounded-full" />
              <h3 className="text-xl font-black text-[#1E2B58] dark:text-white">In use</h3>
              <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-white/10">
                {handedOverRequests.length}
              </span>
            </div>

            <div className="dashboard-card rounded-4xl overflow-hidden">
              <div className="divide-y divide-[#1E2B58]/5 dark:divide-white/5">
                {handedOverRequests.map(req => (
                  <BorrowRequestRow
                    key={req._id}
                    req={req}
                    onViewDetail={setViewDetailReq}
                    actions={
                      <span className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        Not Returned
                      </span>
                    }
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ══ SECTION 7: Unreturned — Outstanding ═══════════════════════════════ */}
        {unreturnedRequests.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center gap-3 mb-5 px-1">
              <div className="w-1.5 h-8 bg-red-500 rounded-full" />
              <h3 className="text-xl font-black text-[#1E2B58] dark:text-white">Not returned</h3>
              <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/30">
                {unreturnedRequests.length}
              </span>
            </div>

            <div className="dashboard-card rounded-4xl overflow-hidden border border-red-200 dark:border-red-900/30 bg-red-50/30 dark:bg-red-900/10">
              <div className="divide-y divide-red-100 dark:divide-red-900/20">
                {unreturnedRequests.map(req => (
                  <BorrowRequestRow
                    key={req._id}
                    req={req}
                    onViewDetail={setViewDetailReq}
                    actions={
                      <div className="flex flex-col items-end gap-2">
                         <span className="px-3 py-1.5 rounded-lg bg-red-100 dark:bg-red-900/40 text-[10px] font-bold text-red-700 dark:text-red-400 uppercase tracking-widest animate-pulse">
                           Warning: Not returned
                         </span>
                         <div className="flex gap-2">
                           <button
                             onClick={() => setRemindReq(req)}
                             className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 font-bold text-[10px] uppercase tracking-widest hover:bg-amber-100 transition-all active:scale-95 border border-amber-200 dark:border-amber-900/30"
                           >
                             Remind
                           </button>
                           <button
                             onClick={() => setConfirmReturnReq(req)}
                             className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95"
                           >
                             Late recovery
                           </button>
                         </div>
                      </div>
                    }
                  />
                ))}
              </div>
            </div>
          </section>
        )}

      </main>

      {/* ══════════════════════════════════════════════════════════════════════
          MODALS
      ══════════════════════════════════════════════════════════════════════ */}

      <RemindModal
        isOpen={!!remindReq}
        onClose={() => setRemindReq(null)}
        request={remindReq}
        onConfirm={handleSendReminder}
        submitting={submitting}
      />

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

      <ReturnConfirmModal
        isOpen={!!confirmReturnReq}
        onClose={() => setConfirmReturnReq(null)}
        request={confirmReturnReq}
        onConfirm={confirmReturn}
        submitting={submitting}
      />

      <ConfirmModal
        isOpen={showEndSessionModal}
        onClose={() => setShowEndSessionModal(false)}
        title="End session"
        message="Are you sure you want to end this session? Students will no longer be able to submit borrow requests after you end it."
        confirmText="End now"
        cancelText="Cancel"
        onConfirm={handleCheckOut}
        submitting={checkingIn}
        type="warning"
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
