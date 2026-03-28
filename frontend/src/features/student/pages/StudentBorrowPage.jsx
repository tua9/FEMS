import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Loader2, BookOpen, MapPin, Clock, Package, AlertTriangle,
  Search, ChevronLeft, ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';
import { scheduleService } from '@/services/scheduleService';
import { equipmentService } from '@/services/equipmentService';
import { borrowRequestService } from '@/services/borrowRequestService';
import { useAuthStore } from '@/stores/useAuthStore';
import { PageHeader } from '@/features/shared/components/PageHeader';
import ConfirmModal from '@/features/shared/components/ConfirmModal';
import { getTodayVN, getSlotTimeStatus } from '@/utils/dateUtils';
import { uploadImages } from '@/utils/uploadHelper';

// ─── Borrow Components ────────────────────────────────────────────────────────
import { fmtTime, fmtDateTime } from '../components/borrow/borrowUtils';
import BorrowBadge from '../components/borrow/BorrowBadge';
import AvailabilityLabel from '../components/borrow/AvailabilityLabel';
import BorrowModal from '../components/borrow/BorrowModal';
import HandoverConfirmModal from '../components/borrow/HandoverConfirmModal';
import RequestDetailModal from '../components/borrow/RequestDetailModal';
import EquipmentCard from '../components/borrow/EquipmentCard';
import ActiveRequestItem from '../components/borrow/ActiveRequestItem';

/** Avoid "Slot Slot 1" when API already returns name like "Slot 1". */
const formatSlotLabel = (slot) => {
  const raw = String(slot?.name || slot?.code || '').trim();
  if (!raw) return null;
  return /^slot\b/i.test(raw) ? raw : `Slot ${raw}`;
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
  const [borrowTarget, setBorrowTarget] = useState(null);
  const [handoverViewTarget, setHandoverViewTarget] = useState(null);
  const [viewRequest, setViewRequest] = useState(null);
  const [returnConfirmReq, setReturnConfirmReq] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // ── Pagination for My Requests ────────────────────────────────────────────
  const [reqCurrentPage, setReqCurrentPage] = useState(1);
  const REQ_ITEMS_PER_PAGE = 3;

  const [nowTick, setNowTick] = useState(Date.now());

  // ── Derived: active schedule ──────────────────────────────────────────────
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

    // 3. Fallback: Recently ended session of today
    const recentlyEnded = [...schedules]
      .filter(s => getSlotTimeStatus(s.startAt, s.endAt) === 'ended')
      .sort((a, b) => new Date(b.endAt) - new Date(a.endAt))[0];

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

  // ── Load schedules ────────────────────────────────────────────────────────
  const loadSchedules = useCallback(async () => {
    if (schedules.length === 0) setScheduleLoading(true);
    try {
      const res = await scheduleService.getMySchedules(getTodayVN());
      setSchedules(Array.isArray(res) ? res : []);
    } catch {
      setSchedules([]);
    } finally {
      setScheduleLoading(false);
    }
  }, [schedules.length]);

  useEffect(() => { loadSchedules(); }, [loadSchedules]);

  // ── Load room equipment when session is known ─────────────────────────────
  useEffect(() => {
    const roomId = activeSchedule?.roomId?._id || activeSchedule?.roomId;
    if (!roomId) {
      setRoomEquipment([]);
      return;
    }

    let cancelled = false;
    const load = async () => {
      // Only show main loading if we don't have equipment for this room yet
      if (roomEquipment.length === 0) setEquipmentLoading(true);
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
  }, [activeSchedule?._id]); // Stable dependency

  // ── Load my requests ──────────────────────────────────────────────────────
  const loadMyRequests = useCallback(async () => {
    if (myRequests.length === 0) setRequestsLoading(true);
    try {
      const res = await borrowRequestService.getMyBorrowRequests();
      setMyRequests(Array.isArray(res) ? res : res.data || []);
    } catch {
      setMyRequests([]);
    } finally {
      setRequestsLoading(false);
    }
  }, [myRequests.length]);

  useEffect(() => { loadMyRequests(); }, [loadMyRequests]);

  // ── Derived maps ──────────────────────────────────────────────────────────
  // My active request keyed by equipmentId
  const myActiveByEqId = useMemo(() => {
    const map = {};
    myRequests.forEach(r => {
      if (['pending', 'approved', 'handed_over', 'returning', 'unreturned'].includes(r.status)) {
        const id = String(r.equipmentId?._id || r.equipmentId);
        map[id] = r;
      }
    });
    return map;
  }, [myRequests]);

  const occupiedByMeIds = useMemo(() => new Set(Object.keys(myActiveByEqId)), [myActiveByEqId]);

  const activeRequests = useMemo(
    () => myRequests.filter(r => ['pending', 'approved', 'handed_over', 'returning', 'unreturned'].includes(r.status)),
    [myRequests]
  );

  // ── Pagination active requests ────────────────────────────────────────────
  const reqTotalPages = Math.max(1, Math.ceil(activeRequests.length / REQ_ITEMS_PER_PAGE));
  const validReqCurrentPage = Math.min(Math.max(1, reqCurrentPage), reqTotalPages);

  const paginatedActiveRequests = useMemo(() => {
    const start = (validReqCurrentPage - 1) * REQ_ITEMS_PER_PAGE;
    return activeRequests.slice(start, start + REQ_ITEMS_PER_PAGE);
  }, [activeRequests, validReqCurrentPage]);

  // ── Borrow submit ─────────────────────────────────────────────────────────
  const handleBorrowSubmit = async (note) => {
    if (!borrowTarget) return;
    const roomId = activeSchedule?.roomId?._id || activeSchedule?.roomId;
    setSubmitting(true);
    try {
      await borrowRequestService.createBorrowRequest({
        equipmentId: borrowTarget._id,
        roomId: roomId || undefined,
        note: note,
        type: 'equipment',
        borrowDate: new Date().toISOString(),
        expectedReturnDate: activeSchedule?.endAt || new Date(Date.now() + 4 * 3600 * 1000).toISOString(),
      });
      toast.success(`Borrow request sent for "${borrowTarget.name}".`);
      setBorrowTarget(null);
      await loadMyRequests();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not send borrow request.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Confirm received (student) ────────────────────────────────────────────
  const handleConfirmReceived = async (formData) => {
    if (!handoverViewTarget) return;
    setSubmitting(true);
    try {
      let imageUrls = [];
      if (formData.files && formData.files.length > 0) {
        imageUrls = await uploadImages(formData.files);
      }
      await borrowRequestService.confirmReceived(handoverViewTarget._id, {
        checklist: formData.checklist,
        notes: formData.notes,
        images: imageUrls,
      });
      toast.success('Equipment receipt confirmed.');
      setHandoverViewTarget(null);
      await loadMyRequests();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not confirm receipt.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Return request: open confirm modal, then submit ─────────────────────
  const handleReturnClick = (req) => {
    setReturnConfirmReq(req);
  };

  const handleReturnConfirm = async () => {
    if (!returnConfirmReq) return;
    const req = returnConfirmReq;
    setSubmitting(true);
    try {
      await borrowRequestService.submitReturn(req._id);
      toast.success('Return request sent. Waiting for lecturer confirmation.');
      setReturnConfirmReq(null);
      await loadMyRequests();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not submit return request.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Cancel request ────────────────────────────────────────────────────────
  const handleCancelRequest = async (req) => {
    try {
      await borrowRequestService.cancelBorrowRequest(req._id, 'Cancelled by student');
      toast.success('Borrow request cancelled.');
      await loadMyRequests();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not cancel request.');
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="w-full">
      <main className="mx-auto flex w-full max-w-[90vw] flex-1 flex-col px-4 pt-6 sm:pt-24 pb-10 sm:px-6 xl:max-w-7xl">

        <PageHeader
          title="Borrow Equipment"
          subtitle="View and request equipment in your current classroom session."
        />

        {/* ══ SECTION 1: Session Info ══════════════════════════════════════════ */}
        <section className="mb-8">
          {scheduleLoading ? (
            <div className="dashboard-card rounded-4xl p-8 flex items-center gap-4">
              <Loader2 className="w-5 h-5 animate-spin text-[#1E2B58]/30 dark:text-white/20" />
              <span className="text-sm text-[#1E2B58]/50 dark:text-white/40">Loading schedule…</span>
            </div>
          ) : !activeSchedule ? (
            <div className="dashboard-card rounded-4xl p-12 flex flex-col items-center justify-center text-center gap-4">
              <BookOpen className="w-12 h-12 text-[#1E2B58]/15 dark:text-white/15" />
              <div>
                <p className="font-black text-[#1E2B58]/50 dark:text-white/40">No upcoming class session</p>
                <p className="text-xs text-[#1E2B58]/30 dark:text-white/30 mt-1">
                  Borrowing is only available during a scheduled class.
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
                      Today&apos;s session
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
                      {(() => {
                        const slotLabel = formatSlotLabel(activeSchedule.slotId);
                        if (!slotLabel) return null;
                        return (
                          <span className="text-xs font-bold text-slate-400 dark:text-slate-500">
                            {slotLabel}
                          </span>
                        );
                      })()}
                    </div>
                  </div>
                </div>

                {/* Status badge */}
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <span className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border ${(activeSchedule.status === 'completed' || getSlotTimeStatus(activeSchedule.startAt, activeSchedule.endAt) === 'ended')
                      ? 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                      : isSessionOngoing
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/30'
                        : 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-900/30'
                    }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${(activeSchedule.status === 'completed' || getSlotTimeStatus(activeSchedule.startAt, activeSchedule.endAt) === 'ended') ? 'bg-slate-400' :
                        isSessionOngoing ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                      }`} />
                    {(activeSchedule.status === 'completed' || getSlotTimeStatus(activeSchedule.startAt, activeSchedule.endAt) === 'ended') ? 'Completed' :
                      isSessionOngoing ? 'Ongoing' : 'Upcoming'}
                  </span>
                  
                  {isSessionOngoing && !activeSchedule.isLecturerCheckedIn && (
                    <span className="text-[10px] font-bold text-amber-500 dark:text-amber-400 italic pr-1">
                      ( Lecturer has not checked in )
                    </span>
                  )}
                </div>
              </div>

              {/* Warning banner if session not yet started or ended */}
              {(!isSessionOngoing || !activeSchedule.isLecturerCheckedIn) && (
                <div className="mt-5 p-3 rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-xs font-bold text-amber-600 dark:text-amber-400">
                    {activeSchedule.status === 'completed' || getSlotTimeStatus(activeSchedule.startAt, activeSchedule.endAt) === 'ended'
                      ? 'This session has ended. You can no longer borrow equipment.'
                      : !isSessionOngoing
                        ? 'Class has not started yet. Please wait until your slot begins to borrow equipment.'
                        : 'The lecturer has not checked in. Borrowing is temporarily locked.'}
                  </p>
                </div>
              )}
            </div>
          )}
        </section>

        {/* ══ SECTION 2: My Active Requests ═══════════════════════════════════ */}
        <section className="mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 px-1">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-8 bg-amber-400 dark:bg-amber-500 rounded-full" />
              <h3 className="text-xl font-black text-[#1E2B58] dark:text-white">My requests</h3>
              {!requestsLoading && (
                <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-400/10 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-400/20">
                  {activeRequests.length}
                </span>
              )}
            </div>
          </div>

          {requestsLoading && activeRequests.length === 0 ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-6 h-6 animate-spin text-[#1E2B58]/20 dark:text-white/20" />
            </div>
          ) : activeRequests.length === 0 ? (
            <div className="dashboard-card rounded-3xl p-8 flex flex-col items-center justify-center text-center gap-3 bg-white/50 dark:bg-[#1E2B58]/20">
              <BookOpen className="w-8 h-8 text-slate-300 dark:text-slate-600" />
              <p className="text-sm font-bold text-slate-400 dark:text-slate-500">
                You don&apos;t have any borrow requests yet.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {paginatedActiveRequests.map(req => (
                <ActiveRequestItem
                  key={req._id}
                  req={req}
                  onReturn={handleReturnClick}
                  onConfirmReceived={setHandoverViewTarget}
                  onCancel={handleCancelRequest}
                  onViewDetail={() => setViewRequest(req)}
                />
              ))}

              {/* Pagination */}
              {reqTotalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-4">
                  <button
                    onClick={() => setReqCurrentPage(p => Math.max(1, p - 1))}
                    disabled={reqCurrentPage === 1}
                    className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 disabled:opacity-50 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    Page {reqCurrentPage} / {reqTotalPages}
                  </span>
                  <button
                    onClick={() => setReqCurrentPage(p => Math.min(reqTotalPages, p + 1))}
                    disabled={reqCurrentPage === reqTotalPages}
                    className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 disabled:opacity-50 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </section>

        {/* ══ SECTION 3: Equipment in Room ════════════════════════════════════ */}
        {activeSchedule && (
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-6 px-1">
              <div className="w-1.5 h-8 bg-[#1E2B58] dark:bg-blue-500 rounded-full" />
              <h3 className="text-xl font-black text-[#1E2B58] dark:text-white">
                Equipment in room
              </h3>
              <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-400/10 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-400/20">
                {roomEquipment.length} {roomEquipment.length === 1 ? 'ITEM' : 'ITEMS'}
              </span>
            </div>

            {equipmentLoading && roomEquipment.length === 0 ? (
              <div className="flex justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-[#1E2B58]/20 dark:text-white/20" />
              </div>
            ) : roomEquipment.length === 0 ? (
              <div className="dashboard-card rounded-4xl p-10 flex flex-col items-center justify-center text-center gap-3">
                <Package className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                <p className="text-sm font-bold text-slate-400 dark:text-slate-500">
                  No equipment is registered for this room.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {roomEquipment.map(item => (
                  <EquipmentCard
                    key={item._id}
                    item={item}
                    myReq={myActiveByEqId[item._id]}
                    isSessionOngoing={isSessionOngoing && activeSchedule.isLecturerCheckedIn}
                    onBorrow={(it) => {
                      if (!isSessionOngoing) {
                        toast.warning('Class has not started yet. Please wait for your slot.');
                        return;
                      }
                      if (!activeSchedule.isLecturerCheckedIn) {
                        toast.warning('The lecturer has not checked in. You cannot borrow equipment yet.');
                        return;
                      }
                      setBorrowTarget(it);
                    }}
                    onReturn={handleReturnClick}
                    onConfirmReceived={setHandoverViewTarget}
                    onCancel={handleCancelRequest}
                    onViewDetail={setViewRequest}
                  />
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      {/* ══════════════════════════════════════════════════════════════════════
          MODALS
      ══════════════════════════════════════════════════════════════════════ */}

      {/* Borrow Request Modal */}
      <BorrowModal
        isOpen={!!borrowTarget}
        onClose={() => setBorrowTarget(null)}
        target={borrowTarget}
        activeSchedule={activeSchedule}
        onConfirm={handleBorrowSubmit}
        submitting={submitting}
      />

      {/* Handover Confirm Modal */}
      <HandoverConfirmModal
        isOpen={!!handoverViewTarget}
        onClose={() => setHandoverViewTarget(null)}
        request={handoverViewTarget}
        onConfirm={handleConfirmReceived}
        onCancelRequest={handleCancelRequest}
        submitting={submitting}
      />

      {/* Request Detail Modal */}
      <RequestDetailModal
        isOpen={!!viewRequest}
        onClose={() => setViewRequest(null)}
        request={viewRequest}
      />

      <ConfirmModal
        isOpen={!!returnConfirmReq}
        onClose={() => {
          if (!submitting) setReturnConfirmReq(null);
        }}
        title="Request return"
        message={
          returnConfirmReq
            ? `Submit a return request for "${returnConfirmReq.equipmentId?.name || 'this equipment'}"? Your lecturer will confirm once you return the item.`
            : ''
        }
        confirmText="Submit request"
        cancelText="Cancel"
        onConfirm={handleReturnConfirm}
        submitting={submitting}
        type="info"
      />
    </div>
  );
};

export default StudentBorrowPage;
