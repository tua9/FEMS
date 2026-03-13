import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, X, ArrowRight, ArrowLeft } from "lucide-react";

import DarkModeToggle from "@/components/shared/navbar/DarkModeToggle";
import Footer from "@/components/common/Footer";
import {
  ReportHeader,
  QuickScanReport,
  ReportManualForm,
} from "@/components/shared/report";
import type {
  QRResult,
  ReportFormData,
  IssueCategory,
} from "@/components/shared/report";

interface SubmittedReport {
  id: string;
  subject: string;
  location: string;
  category: IssueCategory;
  description: string;
  date: string;
}

const GuestReportPage: React.FC = () => {
  const navigate = useNavigate();

  const [prefillLocation, setPrefillLocation] = useState<string>("");
  const [prefillCategory, setPrefillCategory] = useState<IssueCategory | undefined>(undefined);
  const [prefillDescription, setPrefillDescription] = useState<string>("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReport, setSubmittedReport] = useState<SubmittedReport | null>(null);
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

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#e0eafc] text-slate-800 transition-colors duration-300 dark:bg-[#0f172a] dark:text-slate-200">

      {/* ── Navbar ── */}
      <header className="fixed inset-x-0 top-0 z-10 flex items-center justify-between px-6 py-4 sm:px-10 sm:py-5">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full shadow-sm ring-1 ring-black/8 dark:ring-white/10">
            <img src="/logo1.png" alt="F-EMS Logo" className="h-full w-full object-cover" />
          </div>
          <span className="text-[0.9375rem] font-bold tracking-tight text-slate-800 dark:text-white">
            F-EMS
            <span className="ml-1 text-sm font-normal text-slate-400 dark:text-slate-500">| FPT University</span>
          </span>
        </div>

        {/* Right side: dark mode toggle + back to login */}
        <div className="flex items-center gap-4">
          <DarkModeToggle />
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="flex items-center gap-1.5 text-[0.85rem] font-extrabold text-slate-600 transition hover:text-slate-900 dark:text-slate-200 dark:hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Login
          </button>
        </div>
      </header>

      {/* ── Main content ── */}
      <main className="mx-auto flex w-full max-w-[90vw] flex-1 flex-col overflow-hidden px-4 pt-28 sm:pt-32 pb-10 sm:px-6 xl:max-w-4xl">
        <ReportHeader />
        <QuickScanReport onQRDetected={handleQRDetected} />

        <div className="mb-8 flex items-center gap-4">
          <div className="h-px grow bg-slate-300 dark:bg-slate-700/50" />
          <span className="px-2 text-[0.625rem] font-bold tracking-widest text-slate-400 uppercase">
            Or create manual request
          </span>
          <div className="h-px grow bg-slate-300 dark:bg-slate-700/50" />
        </div>

        <ReportManualForm
          key={`${prefillLocation}-${prefillCategory}`}
          prefillLocation={prefillLocation}
          prefillCategory={prefillCategory}
          prefillDescription={prefillDescription}
          onSubmit={handleFormSubmit}
          isSubmitting={isSubmitting}
        />
      </main>

      <Footer role="auth" />

      {/* ── Success modal ── */}
      {showSuccess && submittedReport && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setShowSuccess(false)}
        >
          <div className="glass-card animate-in fade-in zoom-in-95 relative w-full max-w-sm rounded-4xl p-8 shadow-2xl shadow-[#1E2B58]/20 duration-200">
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
            <p className="mb-6 text-center text-sm text-slate-500 dark:text-slate-400">
              Your issue has been logged. Our team will follow up soon.
            </p>
            <div className="mb-6 space-y-2.5 rounded-[1.25rem] bg-white/40 p-4 dark:bg-slate-800/40">
              <div className="flex justify-between text-xs">
                <span>Report ID</span>
                <span className="font-black">{submittedReport.id}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Subject</span>
                <span className="max-w-44 truncate font-bold">
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
                onClick={() => navigate("/login")}
                className="flex w-full items-center justify-center gap-2 rounded-[1.25rem] bg-[#1E2B58] py-3.5 text-sm font-bold text-white"
              >
                Back to Login <ArrowRight className="h-4 w-4" />
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

export default GuestReportPage;
