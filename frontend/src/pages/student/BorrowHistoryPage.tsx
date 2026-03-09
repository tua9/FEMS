import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  X,
  FileText,
  Laptop,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";

import {
  HistoryHeader,
  HistoryTabs,
  HistoryFilterBar,
  ReportHistoryTable,
  ALL_REPORT_HISTORY,
  BorrowHistoryTable,
  ALL_BORROW_HISTORY,
} from "@/components/shared/history";
import type {
  ReportHistoryItem,
  ReportSeverity,
  BorrowHistoryItem,
  BorrowStatus,
} from "@/components/shared/history";

type Tab = "report" | "borrow";

const ITEMS_PER_PAGE = 6;

const SEVERITY_COLORS: Record<string, string> = {
  CRITICAL:
    "text-red-600 bg-red-100 border-red-200 dark:bg-red-900/30 dark:text-red-400",
  HIGH: "text-orange-600 bg-orange-100 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400",
  MEDIUM:
    "text-yellow-600 bg-yellow-100 border-yellow-200 dark:bg-yellow-900/30 dark:text-orange-400",
  LOW: "text-blue-600 bg-blue-100 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400",
};

type ModalItem =
  | { type: "report"; item: ReportHistoryItem }
  | { type: "borrow"; item: BorrowHistoryItem };

const BorrowHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("borrow");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("Last 30 Days");
  const [statusFilter, setStatusFilter] = useState("All");
  const [reportPage, setReportPage] = useState(1);
  const [borrowPage, setBorrowPage] = useState(1);
  const [modal, setModal] = useState<ModalItem | null>(null);

  const handleTabChange = (tab: any) => {
    setActiveTab(tab as Tab);
    setSearchTerm("");
    setStatusFilter("All");
    setReportPage(1);
    setBorrowPage(1);
  };

  const filteredReports = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return ALL_REPORT_HISTORY.filter((r) => {
      const matchSearch =
        !q ||
        r.id.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q);
      const matchSeverity =
        statusFilter === "All" || r.severity === statusFilter.toUpperCase();
      return matchSearch && matchSeverity;
    });
  }, [searchTerm, statusFilter]);

  const filteredBorrow = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return ALL_BORROW_HISTORY.filter((b) => {
      const matchSearch =
        !q ||
        b.id.toLowerCase().includes(q) ||
        b.equipmentName.toLowerCase().includes(q);
      const matchStatus =
        statusFilter === "All" ||
        b.status === (statusFilter.toUpperCase() as BorrowStatus);
      return matchSearch && matchStatus;
    });
  }, [searchTerm, statusFilter]);

  const reportPages = Math.max(
    1,
    Math.ceil(filteredReports.length / ITEMS_PER_PAGE),
  );
  const borrowPages = Math.max(
    1,
    Math.ceil(filteredBorrow.length / ITEMS_PER_PAGE),
  );

  return (
    <div className="student-layout transition-colors duration-300">
      <main className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col px-4 pt-32 pb-10 sm:px-6 md:pt-36">
        <HistoryHeader />
        <HistoryTabs activeTab={activeTab} onTabChange={handleTabChange} />
        <HistoryFilterBar
          searchPlaceholder="Search history..."
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          dateFilter={dateFilter}
          onDateFilterChange={setDateFilter}
          filterLabel={activeTab === "borrow" ? "Status" : "Severity"}
          filterOptions={
            activeTab === "borrow"
              ? ["All", "Borrowed", "Returned", "Overdue"]
              : ["All", "Critical", "High", "Medium", "Low"]
          }
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          hasActiveFilters={searchTerm !== "" || statusFilter !== "All"}
          onClearFilters={() => {
            setSearchTerm("");
            setStatusFilter("All");
          }}
          onExportCsv={() => {}}
        />

        <div className="mt-6">
          {activeTab === "report" ? (
            <ReportHistoryTable
              items={filteredReports.slice(
                (reportPage - 1) * ITEMS_PER_PAGE,
                reportPage * ITEMS_PER_PAGE,
              )}
              currentPage={reportPage}
              totalPages={reportPages}
              totalItems={filteredReports.length}
              onPageChange={setReportPage}
              onViewDetail={(item) => setModal({ type: "report", item })}
            />
          ) : (
            <BorrowHistoryTable
              items={filteredBorrow.slice(
                (borrowPage - 1) * ITEMS_PER_PAGE,
                borrowPage * ITEMS_PER_PAGE,
              )}
              currentPage={borrowPage}
              totalPages={borrowPages}
              totalItems={filteredBorrow.length}
              onPageChange={setBorrowPage}
              onViewDetail={(item) => setModal({ type: "borrow", item })}
            />
          )}
        </div>
      </main>

      {modal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setModal(null)}
        >
          <div className="glass-card animate-in fade-in zoom-in-95 relative w-full max-w-md rounded-4xl p-8 shadow-2xl duration-200">
            <button
              onClick={() => setModal(null)}
              className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/5"
            >
              <X className="h-4 w-4" />
            </button>
            <h3 className="mb-6 text-xl font-black">
              {modal.type === "report" ? "Report Detail" : "Borrow Detail"}
            </h3>
            <div className="space-y-4 rounded-[1.25rem] bg-white/40 p-5 dark:bg-slate-800/40">
              {modal.type === "report" ? (
                <>
                  <div className="flex justify-between">
                    <span>ID</span>
                    <span className="font-bold">{modal.item.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Category</span>
                    <span className="font-bold">{modal.item.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Severity</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-bold ${SEVERITY_COLORS[modal.item.severity]}`}
                    >
                      {modal.item.severity}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between">
                    <span>ID</span>
                    <span className="font-bold">{modal.item.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Equipment</span>
                    <span className="font-bold">
                      {modal.item.equipmentName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status</span>
                    <span className="font-bold">{modal.item.status}</span>
                  </div>
                </>
              )}
            </div>
            <button
              onClick={() => setModal(null)}
              className="mt-6 w-full rounded-2xl bg-[#1E2B58] py-3 font-bold text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BorrowHistoryPage;
