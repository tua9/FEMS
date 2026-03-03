"use client";

import { ArrowLeft, Send } from "lucide-react";

export function ReportActions() {
  return (
    <div className="flex items-center justify-between">
      <button className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm font-medium transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Cancel Reporting
      </button>
      <button className="bg-primary text-primary-foreground flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold shadow-md transition-opacity hover:opacity-90">
        Submit Report
        <Send className="h-4 w-4" />
      </button>
    </div>
  );
}
