import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, X, ArrowRight, ClipboardList } from "lucide-react";

import {
  ReportHeader,
  QuickScanReport,
  ReportManualForm,
  RecentReports,
} from "@/components/shared/report";
import type {
  QRResult,
  ReportFormData,
  IssueCategory,
} from "@/components/shared/report";
import { useReportStore } from "@/stores/useReportStore";
import { useRoomStore } from "@/stores/useRoomStore";
import { useEquipmentStore } from "@/stores/useEquipmentStore";
import type { CreateReportPayload, ReportType } from "@/types/report";

const ReportPage: React.FC = () => {
  const navigate = useNavigate();

  const [prefillRoomId, setPrefillRoomId] = useState<string>("");
  const [prefillEquipmentId, setPrefillEquipmentId] = useState<string>("");
  const [prefillCategory, setPrefillCategory] = useState<
    IssueCategory | undefined
  >(undefined);
  const [prefillDescription, setPrefillDescription] = useState<string>("");

  const [submittedReportId, setSubmittedReportId] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const { createReport, loading: isSubmitting, fetchMyReports } = useReportStore();
  const { rooms, fetchAll: fetchRooms } = useRoomStore();
  const { fetchAll: fetchEquipments } = useEquipmentStore();

  useEffect(() => {
    fetchRooms();
    fetchEquipments();
    fetchMyReports();
  }, [fetchRooms, fetchEquipments, fetchMyReports]);

  const handleQRDetected = (result: QRResult) => {
    setPrefillRoomId(result.roomId);
    setPrefillEquipmentId(result.equipmentId);
    setPrefillCategory(result.category);
    setPrefillDescription(result.description);
  };

  const mapCategoryToReportType = (category: IssueCategory): ReportType => {
    switch (category) {
      case "it":
        return "equipment";
      case "electrical":
      case "plumbing":
      case "furniture":
        return "infrastructure";
      case "other":
      default:
        return "other";
    }
  };

  const handleFormSubmit = async (data: ReportFormData) => {
    try {
      const payload: CreateReportPayload = {
        type: mapCategoryToReportType(data.category),
        room_id: data.room_id,
        description: data.description,
      };

      if (data.equipment_id) {
        payload.equipment_id = data.equipment_id;
      }

      // If we supported actual image upload, we'd handle it here
      // For now, API expects img?: string, we could leave empty or mock string if needed

      await createReport(payload);
      
      // Update local state for success modal
      setSubmittedReportId(`New Report submitted successfully.`);
      setShowSuccess(true);
      
      // Reset form prefills
      setPrefillRoomId("");
      setPrefillEquipmentId("");
      setPrefillCategory(undefined);
      setPrefillDescription("");
      
    } catch (error) {
      console.error("Failed to submit report:", error);
      // Optional: show error toast here
    }
  };

  return (
    <div className="w-full">
      <main className="mx-auto flex w-full max-w-[90vw] flex-1 flex-col overflow-hidden px-4 pt-6 sm:pt-8 pb-10 sm:px-6 xl:max-w-4xl">
        <ReportHeader />
        <QuickScanReport onQRDetected={handleQRDetected} />
        <div className="mb-[2rem] flex items-center gap-[1rem]">
          <div className="h-px flex-grow bg-slate-300 dark:bg-slate-700/50" />
          <span className="px-[0.5rem] text-[0.625rem] font-bold tracking-widest text-slate-400 uppercase">
            Or create manual request (Debug: {rooms?.length || 0} rooms loaded)
          </span>
          <div className="h-px flex-grow bg-slate-300 dark:bg-slate-700/50" />
        </div>
        <ReportManualForm
          key={`${prefillRoomId}-${prefillEquipmentId}-${prefillCategory}`}
          prefillRoomId={prefillRoomId}
          prefillEquipmentId={prefillEquipmentId}
          prefillCategory={prefillCategory}
          prefillDescription={prefillDescription}
          onSubmit={handleFormSubmit}
          isSubmitting={isSubmitting}
          rooms={rooms}
        />
        <RecentReports />
      </main>

      {showSuccess && submittedReportId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setShowSuccess(false)}
        >
          <div className="dashboard-card animate-in fade-in zoom-in-95 relative w-full max-w-sm rounded-4xl p-8 shadow-2xl shadow-[#1E2B58]/20 duration-200">
            <button
              onClick={() => setShowSuccess(false)}
              className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full text-[#1E2B58]/60 transition hover:bg-[#1E2B58]/10 dark:text-white/60 dark:hover:bg-white/10"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
              <CheckCircle2 className="h-9 w-9 text-emerald-500" />
            </div>
            <h3 className="mb-1 text-center text-xl font-black">
              Report Submitted!
            </h3>
            <p className="mb-6 text-center text-sm text-slate-500">
              Your issue has been logged successfully.
            </p>
            <div className="mb-6 space-y-2.5 rounded-[1.25rem] bg-white/40 p-4 dark:bg-slate-800/40">
              <div className="flex justify-center text-center text-sm font-bold">
                {submittedReportId}
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate("/student/borrow-history")}
                className="flex w-full items-center justify-center gap-2 rounded-[1.25rem] bg-[#1E2B58] py-3.5 text-sm font-bold text-white"
              >
                <ClipboardList className="h-4 w-4" /> View History{" "}
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => setShowSuccess(false)}
                className="w-full rounded-2xl border border-black/10 py-3 text-sm font-bold dark:border-white/10"
              >
                Submit Another
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportPage;
