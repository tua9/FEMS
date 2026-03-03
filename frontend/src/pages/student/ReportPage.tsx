import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, X, ArrowRight, ClipboardList } from "lucide-react";

import { ReportHeader } from "@/components/lecturer/report/ReportHeader";
import {
  QuickScanReport,
  type QRResult,
} from "@/components/lecturer/report/QuickScanReport";
import {
  ReportManualForm,
  type ReportFormData,
  type IssueCategory,
} from "@/components/lecturer/report/ReportManualForm";
import {
  RecentReports,
  type ReportEntry,
} from "@/components/lecturer/report/RecentReports";

interface SubmittedReport {
  id: string;
  subject: string;
  location: string;
  category: IssueCategory;
  description: string;
  date: string;
}

const ReportPage: React.FC = () => {
  const navigate = useNavigate();

  const [prefillLocation, setPrefillLocation] = useState<string>("");
  const [prefillCategory, setPrefillCategory] = useState<
    IssueCategory | undefined
  >(undefined);
  const [prefillDescription, setPrefillDescription] = useState<string>("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReport, setSubmittedReport] =
    useState<SubmittedReport | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleQRDetected = (result: QRResult) => {
    setPrefillLocation(result.location);
    setPrefillCategory(result.category);
    setPrefillDescription(result.description);
  };

  const handleFormSubmit = (data: ReportFormData) => {
    setIsSubmitting(true);
    setTimeout(() => {
      const reportId = `#REP-${Math.floor(7800 + Math.random() * 200)}`;
      const categoryLabels: Record<IssueCategory, string> = {
        electrical: "Electrical",
        plumbing: "Plumbing",
        it: "IT Device",
        furniture: "Furniture",
        other: "Other",
      };
      const subject = `${categoryLabels[data.category]} Issue — ${data.location}`;
      const today = new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });

      setSubmittedReport({
        id: reportId,
        subject,
        location: data.location,
        category: data.category,
        description: data.description,
        date: today,
      });
      setIsSubmitting(false);
      setShowSuccess(true);
    }, 1500);
  };

  const newReportEntry: ReportEntry | null = submittedReport
    ? {
        id: submittedReport.id,
        subject: submittedReport.subject,
        date: submittedReport.date,
        status: "Pending",
      }
    : null;

  return (
    <div className="student-layout transition-colors duration-300">
      <main className="mx-auto flex w-full max-w-[90vw] flex-1 flex-col overflow-hidden px-4 pt-32 pb-10 sm:px-6 md:pt-36 xl:max-w-4xl">
        <ReportHeader />
        <QuickScanReport onQRDetected={handleQRDetected} />
        <div className="mb-[2rem] flex items-center gap-[1rem]">
          <div className="h-px flex-grow bg-slate-300 dark:bg-slate-700/50" />
          <span className="px-[0.5rem] text-[0.625rem] font-bold tracking-widest text-slate-400 uppercase">
            Or create manual request
          </span>
          <div className="h-px flex-grow bg-slate-300 dark:bg-slate-700/50" />
        </div>
        <ReportManualForm
          key={`${prefillLocation}-${prefillCategory}`}
          prefillLocation={prefillLocation}
          prefillCategory={prefillCategory}
          prefillDescription={prefillDescription}
          onSubmit={handleFormSubmit}
          isSubmitting={isSubmitting}
        />
        <RecentReports newReport={newReportEntry} />
      </main>

      {showSuccess && submittedReport && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setShowSuccess(false)}
        >
          <div className="glass-card animate-in fade-in zoom-in-95 relative w-full max-w-sm rounded-4xl p-8 shadow-2xl duration-200">
            <button
              onClick={() => setShowSuccess(false)}
              className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-black/5 dark:hover:bg-white/5"
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
              <div className="flex justify-between text-xs">
                <span>Report ID</span>
                <span className="font-black">{submittedReport.id}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Subject</span>
                <span className="max-w-[11rem] truncate font-bold">
                  {submittedReport.subject}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Date</span>
                <span className="font-bold">{submittedReport.date}</span>
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
