import { PageHeader } from "@/features/shared/components/PageHeader";
import { attendanceService } from "@/services/attendanceService";
import { borrowRequestService } from "@/services/borrowRequestService";
import { scheduleService } from "@/services/scheduleService";
import { useAuthStore } from "@/stores/useAuthStore";
import { getSlotTimeStatus, getTodayVN } from "@/utils/dateUtils";
import { uploadImages } from "@/utils/uploadHelper";
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  Clock,
  Loader2,
  LogIn,
  LogOut,
  MapPin,
  RefreshCw,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

// Sub-components
import ConfirmModal from "@/features/shared/components/ConfirmModal";
import ApproveModal from "../components/borrow/ApproveModal";
import BorrowRequestRow from "../components/borrow/BorrowRequestRow";
import RejectModal from "../components/borrow/RejectModal";
import RemindModal from "../components/borrow/RemindModal";
import RequestDetailModal from "../components/borrow/RequestDetailModal";
import ReturnConfirmModal from "../components/borrow/ReturnConfirmModal";

// Utilities
import {
  fmtTime,
  getEquipmentName,
  getStudentName,
} from "../components/borrow/borrowUtils";

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
    const ongoing = schedules.find(
      (s) =>
        s.status !== "completed" &&
        getSlotTimeStatus(s.startAt, s.endAt) === "ongoing",
    );
    if (ongoing) return ongoing;

    // 2. Upcoming: starts in the future AND not completed
    const upcoming = schedules.find(
      (s) =>
        s.status !== "completed" &&
        getSlotTimeStatus(s.startAt, s.endAt) === "upcoming",
    );
    if (upcoming) return upcoming;

    // 3. Fallback: Recently ended session of today (so lecturer can still checkout)
    const recentlyEnded = [...schedules]
      .filter((s) => getSlotTimeStatus(s.startAt, s.endAt) === "ended")
      .sort((a, b) => new Date(b.endAt) - new Date(a.endAt))[0];

    return recentlyEnded || null;
  }, [schedules, nowTick]);

  const isSessionOngoing = useMemo(() => {
    if (!activeSchedule) return false;
    if (activeSchedule.status === "completed") return false;
    return (
      getSlotTimeStatus(activeSchedule.startAt, activeSchedule.endAt) ===
      "ongoing"
    );
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

  useEffect(() => {
    loadSchedules();
  }, [loadSchedules]);

  // ── Load check-in status when schedule is known ───────────────────────────
  useEffect(() => {
    if (!activeSchedule?._id) {
      setCheckInStatus(null);
      return;
    }
    let cancelled = false;
    const load = async () => {
      setCheckInLoading(true);
      try {
        const res = await attendanceService.getMyCheckInStatus(
          activeSchedule._id,
        );
        if (!cancelled) setCheckInStatus(res);
      } catch {
        if (!cancelled) setCheckInStatus({ checkedIn: false });
      } finally {
        if (!cancelled) setCheckInLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
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

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  // ── Polling: silently refresh requests every 30s ──────────────────────────
  useEffect(() => {
    const id = setInterval(async () => {
      try {
        const res = await borrowRequestService.getAllBorrowRequests();
        setAllRequests(Array.isArray(res) ? res : res.data || []);
      } catch { /* silent */ }
    }, 2_000);
    return () => clearInterval(id);
  }, []);

  // ── Filter requests relevant to current session ───────────────────────────
  const sessionRoomId = activeSchedule?.roomId?._id || activeSchedule?.roomId;

  const pendingRequests = useMemo(
    () =>
      allRequests.filter(
        (r) =>
          r.status === "pending" &&
          // filter to current session room if we know it
          (!sessionRoomId ||
            String(r.roomId?._id || r.roomId) === String(sessionRoomId)),
      ),
    [allRequests, sessionRoomId],
  );

  const approvedRequests = useMemo(
    () =>
      allRequests.filter(
        (r) =>
          r.status === "approved" &&
          (!sessionRoomId ||
            String(r.roomId?._id || r.roomId) === String(sessionRoomId)),
      ),
    [allRequests, sessionRoomId],
  );

  const handedOverRequests = useMemo(
    () =>
      allRequests.filter(
        (r) =>
          r.status === "handed_over" &&
          (!sessionRoomId ||
            String(r.roomId?._id || r.roomId) === String(sessionRoomId)),
      ),
    [allRequests, sessionRoomId],
  );

  const returningRequests = useMemo(() => {
    const uid = user?._id ? String(user._id) : null;
    return allRequests.filter((r) => {
      if (r.status !== "returning") return false;
      const isCurrentSession =
        !sessionRoomId ||
        String(r.roomId?._id || r.roomId) === String(sessionRoomId);
      const isMyHandover =
        uid && String(r.handedOverBy?._id || r.handedOverBy) === uid;
      const isMyApprove =
        uid && String(r.approvedBy?._id || r.approvedBy) === uid;
      return isCurrentSession || isMyHandover || isMyApprove;
    });
  }, [allRequests, sessionRoomId, user]);

  const unreturnedRequests = useMemo(() => {
    if (!user?._id) return [];
    const uid = String(user._id);

    return allRequests.filter((r) => {
      if (r.status !== "unreturned") return false;

      const isMyAction =
        (r.approvedBy && String(r.approvedBy._id || r.approvedBy) === uid) ||
        (r.handedOverBy &&
          String(r.handedOverBy._id || r.handedOverBy) === uid);
      const isCurrentRoom =
        sessionRoomId &&
        String(r.roomId?._id || r.roomId) === String(sessionRoomId);

      return isMyAction || isCurrentRoom;
    });
  }, [allRequests, user, sessionRoomId]);

  // ── Helpers ───────────────────────────────────────────────────────────────
  // (Moved to borrowUtils.js)

  // ── Check-in ──────────────────────────────────────────────────────────────
  const handleCheckIn = async () => {
    if (!activeSchedule?._id) return;
    setCheckingIn(true);
    try {
      await attendanceService.checkIn(activeSchedule._id);
      toast.success("Check-in recorded successfully.");
      // Reload check-in status
      const res = await attendanceService.getMyCheckInStatus(
        activeSchedule._id,
      );
      setCheckInStatus(res);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Could not check in.");
    } finally {
      setCheckingIn(false);
    }
  };

  const handleCheckOut = async () => {
    if (!activeSchedule?._id) return;
    setCheckingIn(true);
    try {
      await attendanceService.checkOut(activeSchedule._id);
      toast.success("Session ended.");
      const res = await attendanceService.getMyCheckInStatus(
        activeSchedule._id,
      );
      setCheckInStatus(res);
      await loadSchedules(); // Reload to get updated schedule status
    } catch (err) {
      toast.error(err?.response?.data?.message || "Could not end the session.");
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
      await borrowRequestService.approveBorrowRequest(
        approvingReq._id,
        note.trim() || undefined,
      );
      toast.success(
        `${getStudentName(approvingReq)}'s request has been approved.`,
      );
      setApprovingReq(null);
      await loadRequests();
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Could not approve the request.",
      );
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
      toast.error(err?.response?.data?.message || "Could not send reminder.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Reject ────────────────────────────────────────────────────────────────
  const handleRejectSubmit = async (reason) => {
    if (!rejectingReq) return;
    setSubmitting(true);
    try {
      await borrowRequestService.rejectBorrowRequest(
        rejectingReq._id,
        reason.trim(),
      );
      toast.success(
        `${getStudentName(rejectingReq)}'s request has been rejected.`,
      );
      setRejectingReq(null);
      await loadRequests();
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Could not reject the request.",
      );
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
      toast.success(
        `Return confirmed for "${getEquipmentName(confirmReturnReq)}".`,
      );
      setConfirmReturnReq(null);
      await loadRequests();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Could not confirm return.");
    } finally {
      setSubmitting(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="w-full">
      <main className="mx-auto flex w-full max-w-[90vw] flex-1 flex-col px-4 pt-6 pb-10 sm:px-6 sm:pt-24 xl:max-w-7xl">
        <PageHeader
          title="Equipment borrow management"
          subtitle="Approve requests, hand over equipment, and confirm returns during your teaching session."
        />

        {/* ══ SECTION 1: Teaching Session + Check-in ══════════════════════════ */}
        <section className="mb-8">
          {scheduleLoading ? (
            <div className="dashboard-card flex items-center gap-4 rounded-4xl p-8">
              <Loader2 className="h-5 w-5 animate-spin text-[#1E2B58]/30 dark:text-white/20" />
              <span className="text-sm text-[#1E2B58]/50 dark:text-white/40">
                Loading today&apos;s schedule…
              </span>
            </div>
          ) : !activeSchedule ? (
            <div className="dashboard-card flex flex-col items-center justify-center gap-4 rounded-4xl p-12 text-center">
              <BookOpen className="h-12 w-12 text-[#1E2B58]/15 dark:text-white/15" />
              <div>
                <p className="font-black text-[#1E2B58]/50 dark:text-white/40">
                  No teaching sessions scheduled today
                </p>
                <p className="mt-1 text-xs text-[#1E2B58]/30 dark:text-white/30">
                  Borrow management is only available during a scheduled class
                  session.
                </p>
              </div>
            </div>
          ) : (
            <div className="dashboard-card rounded-4xl p-6 sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-6">
                {/* Session info */}
                <div className="flex flex-1 items-start gap-5">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-3xl bg-[#1E2B58]/8 dark:bg-white/5">
                    <BookOpen className="h-7 w-7 text-[#1E2B58] dark:text-white" />
                  </div>
                  <div>
                    <p className="mb-1 text-[0.625rem] font-black tracking-widest text-[#1E2B58]/50 uppercase dark:text-white/40">
                      Today&apos;s teaching session
                    </p>
                    <h2 className="text-xl leading-tight font-black text-[#1E2B58] dark:text-white">
                      {activeSchedule.title}
                    </h2>
                    <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1.5">
                      <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        {activeSchedule.roomId?.name || "N/A"}
                      </span>
                      <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400">
                        <Clock className="h-3.5 w-3.5 shrink-0" />
                        {activeSchedule.slotId?.startTime ||
                          fmtTime(activeSchedule.startAt)}{" "}
                        –{" "}
                        {activeSchedule.slotId?.endTime ||
                          fmtTime(activeSchedule.endAt)}
                      </span>
                      {activeSchedule.slotId && (
                        <span className="text-xs font-bold text-slate-400">
                          {activeSchedule.slotId.name ||
                            activeSchedule.slotId.code}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Check-in controls */}
                <div className="flex shrink-0 flex-col items-end gap-3">
                  {/* Session status badge */}
                  <span
                    className={`flex items-center gap-2 rounded-2xl border px-4 py-2 text-[10px] font-black tracking-widest uppercase ${
                      activeSchedule.status === "completed" ||
                      getSlotTimeStatus(
                        activeSchedule.startAt,
                        activeSchedule.endAt,
                      ) === "ended"
                        ? "border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-400"
                        : isSessionOngoing
                          ? "border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-900/30 dark:bg-emerald-900/20 dark:text-emerald-400"
                          : "border-amber-200 bg-amber-50 text-amber-600 dark:border-amber-900/30 dark:bg-amber-900/20 dark:text-amber-400"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        activeSchedule.status === "completed" ||
                        getSlotTimeStatus(
                          activeSchedule.startAt,
                          activeSchedule.endAt,
                        ) === "ended"
                          ? "bg-slate-400"
                          : isSessionOngoing
                            ? "animate-pulse bg-emerald-500"
                            : "bg-amber-500"
                      }`}
                    />
                    {activeSchedule.status === "completed" ||
                    getSlotTimeStatus(
                      activeSchedule.startAt,
                      activeSchedule.endAt,
                    ) === "ended"
                      ? "Completed"
                      : isSessionOngoing
                        ? "Ongoing"
                        : "Upcoming"}
                  </span>

                  {/* Check-in button */}
                  {checkInLoading ? (
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> Checking…
                    </div>
                  ) : isCheckedIn ? (
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-black ${
                          activeSchedule.status === "completed" ||
                          getSlotTimeStatus(
                            activeSchedule.startAt,
                            activeSchedule.endAt,
                          ) === "ended"
                            ? "border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-400"
                            : "border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-900/30 dark:bg-emerald-900/20 dark:text-emerald-400"
                        }`}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Checked in
                        {checkInStatus?.checkInTime &&
                          ` at ${fmtTime(checkInStatus.checkInTime)}`}
                      </span>
                      {activeSchedule.status !== "completed" && (
                        <button
                          onClick={() => setShowEndSessionModal(true)}
                          disabled={checkingIn}
                          className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-[10px] font-black tracking-widest uppercase transition-all active:scale-95 disabled:opacity-60 ${
                            getSlotTimeStatus(
                              activeSchedule.startAt,
                              activeSchedule.endAt,
                            ) === "ended"
                              ? "bg-red-500 text-white shadow-lg shadow-red-500/20 hover:bg-red-600"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                          }`}
                        >
                          {checkingIn ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <LogOut className="h-3.5 w-3.5" />
                          )}
                          End
                        </button>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={handleCheckIn}
                      disabled={checkingIn || !isSessionOngoing}
                      className={`flex items-center gap-2 rounded-2xl px-5 py-2.5 text-xs font-black tracking-widest uppercase transition-all active:scale-95 disabled:opacity-60 ${
                        isSessionOngoing
                          ? "bg-[#1E2B58] text-white shadow-lg shadow-blue-900/20 hover:bg-[#2A3B66]"
                          : "cursor-not-allowed bg-slate-100 text-slate-400 dark:bg-slate-800"
                      }`}
                    >
                      {checkingIn ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <LogIn className="h-3.5 w-3.5" />
                      )}
                      {isSessionOngoing ? "Check in" : "Not yet time"}
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
            <div
              className={`flex items-start gap-4 rounded-3xl border p-5 ${
                activeSchedule.status !== "completed" &&
                new Date(activeSchedule.endAt) < new Date() &&
                isCheckedIn
                  ? "animate-pulse border-red-200 bg-red-50 dark:border-red-900/20 dark:bg-red-900/10"
                  : isCheckedIn
                    ? "border-emerald-200 bg-emerald-50 dark:border-emerald-900/20 dark:bg-emerald-900/10"
                    : "border-amber-200 bg-amber-50 dark:border-amber-900/20 dark:bg-amber-900/10"
              }`}
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${
                  activeSchedule.status !== "completed" &&
                  new Date(activeSchedule.endAt) < new Date() &&
                  isCheckedIn
                    ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                    : isCheckedIn
                      ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                      : "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                }`}
              >
                {activeSchedule.status !== "completed" &&
                new Date(activeSchedule.endAt) < new Date() &&
                isCheckedIn ? (
                  <AlertTriangle className="h-5 w-5" />
                ) : isCheckedIn ? (
                  <ShieldCheck className="h-5 w-5" />
                ) : (
                  <AlertTriangle className="h-5 w-5" />
                )}
              </div>
              <div>
                <p
                  className={`text-sm font-black ${
                    activeSchedule.status !== "completed" &&
                    getSlotTimeStatus(
                      activeSchedule.startAt,
                      activeSchedule.endAt,
                    ) === "ended" &&
                    isCheckedIn
                      ? "text-red-700 dark:text-red-400"
                      : activeSchedule.status === "completed" ||
                          getSlotTimeStatus(
                            activeSchedule.startAt,
                            activeSchedule.endAt,
                          ) === "ended"
                        ? "text-slate-600 dark:text-slate-300"
                        : isCheckedIn
                          ? "text-emerald-700 dark:text-emerald-400"
                          : "text-amber-700 dark:text-amber-400"
                  }`}
                >
                  {activeSchedule.status !== "completed" &&
                  getSlotTimeStatus(
                    activeSchedule.startAt,
                    activeSchedule.endAt,
                  ) === "ended" &&
                  isCheckedIn
                    ? "ACTION REQUIRED: End Session"
                    : activeSchedule.status === "completed" ||
                        getSlotTimeStatus(
                          activeSchedule.startAt,
                          activeSchedule.endAt,
                        ) === "ended"
                      ? "Session has ended"
                      : isCheckedIn
                        ? "Equipment borrowing is enabled"
                        : "Students cannot borrow equipment yet"}
                </p>
                <p
                  className={`mt-0.5 text-xs ${
                    activeSchedule.status !== "completed" &&
                    getSlotTimeStatus(
                      activeSchedule.startAt,
                      activeSchedule.endAt,
                    ) === "ended" &&
                    isCheckedIn
                      ? "text-red-600/70 dark:text-red-400/60"
                      : activeSchedule.status === "completed" ||
                          getSlotTimeStatus(
                            activeSchedule.startAt,
                            activeSchedule.endAt,
                          ) === "ended"
                        ? "text-slate-500 dark:text-slate-400"
                        : isCheckedIn
                          ? "text-emerald-600/70 dark:text-emerald-400/60"
                          : "text-amber-600/70 dark:text-amber-400/60"
                  }`}
                >
                  {activeSchedule.status !== "completed" &&
                  getSlotTimeStatus(
                    activeSchedule.startAt,
                    activeSchedule.endAt,
                  ) === "ended" &&
                  isCheckedIn
                    ? 'The scheduled time for this slot has passed. Please click "End Session" to complete your check-out.'
                    : activeSchedule.status === "completed" ||
                        getSlotTimeStatus(
                          activeSchedule.startAt,
                          activeSchedule.endAt,
                        ) === "ended"
                      ? "Students can no longer submit borrow requests for this session."
                      : isCheckedIn
                        ? "You are checked in. Students in this room can now submit borrow requests."
                        : "You must check in before students can submit borrow requests."}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* ══ SECTION 3: Pending Requests ══════════════════════════════════════ */}
        {activeSchedule && (
          <section className="mb-8">
            <div className="mb-5 flex items-center gap-3 px-1">
              <div className="h-8 w-1.5 rounded-full bg-amber-400 dark:bg-amber-500" />
              <h3 className="text-xl font-black text-[#1E2B58] dark:text-white">
                Pending approval
              </h3>
              {!requestsLoading && (
                <span className="rounded-full border border-amber-100 bg-amber-50 px-2.5 py-1 text-[10px] font-black text-amber-600 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-400">
                  {pendingRequests.length}
                </span>
              )}
              <button
                onClick={loadRequests}
                className="ml-auto flex items-center gap-1.5 text-[10px] font-black tracking-widest text-[#1E2B58]/40 uppercase transition-colors hover:text-[#1E2B58] dark:text-white/30 dark:hover:text-white"
              >
                <RefreshCw className="h-3 w-3" /> Refresh
              </button>
            </div>

            <div className="dashboard-card overflow-hidden rounded-4xl">
              {requestsLoading ? (
                <div className="flex justify-center py-16">
                  <Loader2 className="h-7 w-7 animate-spin text-[#1E2B58]/20 dark:text-white/20" />
                </div>
              ) : pendingRequests.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 px-8 py-12 text-center">
                  <Users className="h-10 w-10 text-slate-300 dark:text-slate-600" />
                  <p className="text-sm font-bold text-slate-400 dark:text-slate-500">
                    No borrow requests are pending approval.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-[#1E2B58]/5 dark:divide-white/5">
                  {pendingRequests.map((req) => (
                    <BorrowRequestRow
                      key={req._id}
                      req={req}
                      onViewDetail={setViewDetailReq}
                      actions={
                        <>
                          <button
                            onClick={() => setRejectingReq(req)}
                            className="rounded-xl border border-red-100 bg-red-50 px-4 py-2 text-[10px] font-black tracking-widest text-red-500 uppercase transition-all hover:bg-red-100 active:scale-95 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => setApprovingReq(req)}
                            className="rounded-xl bg-emerald-500 px-4 py-2 text-[10px] font-black tracking-widest text-white uppercase shadow-md shadow-emerald-500/20 transition-all hover:bg-emerald-600 active:scale-95"
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
            <div className="mb-5 flex items-center gap-3 px-1">
              <div className="h-8 w-1.5 rounded-full bg-blue-500" />
              <h3 className="text-xl font-black text-[#1E2B58] dark:text-white">
                Awaiting student confirmation
              </h3>
              <span className="rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-[10px] font-black text-blue-600 dark:border-blue-400/20 dark:bg-blue-400/10 dark:text-blue-400">
                {approvedRequests.length}
              </span>
            </div>

            <div className="dashboard-card overflow-hidden rounded-4xl">
              <div className="divide-y divide-[#1E2B58]/5 dark:divide-white/5">
                {approvedRequests.map((req) => (
                  <BorrowRequestRow
                    key={req._id}
                    req={req}
                    onViewDetail={setViewDetailReq}
                    actions={
                      <span className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-1.5 text-[10px] font-bold tracking-widest text-blue-600 uppercase dark:border-blue-900/30 dark:bg-blue-900/20 dark:text-blue-400">
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
            <div className="mb-5 flex items-center gap-3 px-1">
              <div className="h-8 w-1.5 rounded-full bg-emerald-500" />
              <h3 className="text-xl font-black text-[#1E2B58] dark:text-white">
                Awaiting return confirmation
              </h3>
              <span className="rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[10px] font-black text-emerald-600 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-400">
                {returningRequests.length}
              </span>
            </div>

            <div className="dashboard-card overflow-hidden rounded-4xl border-2 border-emerald-500/20">
              <div className="divide-y divide-[#1E2B58]/5 dark:divide-white/5">
                {returningRequests.map((req) => (
                  <BorrowRequestRow
                    key={req._id}
                    req={req}
                    onViewDetail={setViewDetailReq}
                    actions={
                      <button
                        onClick={() => setConfirmReturnReq(req)}
                        className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 text-[10px] font-black tracking-widest text-white uppercase shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-600 active:scale-95"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" /> Confirm Return
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
            <div className="mb-5 flex items-center gap-3 px-1">
              <div className="h-8 w-1.5 rounded-full bg-slate-400" />
              <h3 className="text-xl font-black text-[#1E2B58] dark:text-white">
                In use
              </h3>
              <span className="rounded-full border border-slate-100 bg-slate-50 px-2.5 py-1 text-[10px] font-black text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-400">
                {handedOverRequests.length}
              </span>
            </div>

            <div className="dashboard-card overflow-hidden rounded-4xl">
              <div className="divide-y divide-[#1E2B58]/5 dark:divide-white/5">
                {handedOverRequests.map((req) => (
                  <BorrowRequestRow
                    key={req._id}
                    req={req}
                    onViewDetail={setViewDetailReq}
                    actions={
                      <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-[10px] font-bold tracking-widest text-slate-500 uppercase dark:bg-slate-800">
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
            <div className="mb-5 flex items-center gap-3 px-1">
              <div className="h-8 w-1.5 rounded-full bg-red-500" />
              <h3 className="text-xl font-black text-[#1E2B58] dark:text-white">
                Not returned
              </h3>
              <span className="rounded-full border border-red-100 bg-red-50 px-2.5 py-1 text-[10px] font-black text-red-600 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-400">
                {unreturnedRequests.length}
              </span>
            </div>

            <div className="dashboard-card overflow-hidden rounded-4xl border border-red-200 bg-red-50/30 dark:border-red-900/30 dark:bg-red-900/10">
              <div className="divide-y divide-red-100 dark:divide-red-900/20">
                {unreturnedRequests.map((req) => (
                  <BorrowRequestRow
                    key={req._id}
                    req={req}
                    onViewDetail={setViewDetailReq}
                    actions={
                      <div className="flex flex-col items-end gap-2">
                        <span className="animate-pulse rounded-lg bg-red-100 px-3 py-1.5 text-[10px] font-bold tracking-widest text-red-700 uppercase dark:bg-red-900/40 dark:text-red-400">
                          Cảnh báo: Chưa trả
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setRemindReq(req)}
                            className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-1.5 text-[10px] font-bold tracking-widest text-amber-600 uppercase transition-all hover:bg-amber-100 active:scale-95 dark:border-amber-900/30 dark:bg-amber-900/20 dark:text-amber-400"
                          >
                            Nhắc nhở
                          </button>
                          <button
                            onClick={() => setConfirmReturnReq(req)}
                            className="rounded-xl bg-slate-100 px-3 py-1.5 text-[10px] font-bold tracking-widest text-slate-600 uppercase transition-all hover:bg-slate-200 active:scale-95 dark:bg-slate-800 dark:text-slate-400"
                          >
                            Thu hồi muộn
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
