import React, { useState, useMemo } from "react";

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
  BorrowStatus,
} from "@/components/shared/history";
import HistoryDetailModal, { type ModalItem } from "@/components/student/history/HistoryDetailModal";

type Tab = "report" | "borrow";

const ITEMS_PER_PAGE = 6;

const BorrowHistoryPage: React.FC = () => {
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
    <div className="student-layout transition-colors duration-300">        <main className="mx-auto flex w-full max-w-350 flex-1 flex-col px-4 pt-6 sm:pt-8 pb-10 sm:px-6">
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
        <HistoryDetailModal modal={modal} onClose={() => setModal(null)} />
      )}
    </div>
  );
};

export default BorrowHistoryPage;
