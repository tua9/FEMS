import React from "react";
import {
  HistoryHeader,
  HistoryTabs,
  HistoryFilterBar,
  ReportHistoryTable,
  BorrowHistoryTable,
} from "@/components/shared/history";
import HistoryDetailModal from "@/components/student/history/HistoryDetailModal";
import { useHistoryController } from "@/hooks/student/useHistoryController";

export default function BorrowHistoryPage() {
  const { state, actions } = useHistoryController(6);

  const {
    activeTab,
    searchTerm,
    dateFilter,
    statusFilter,
    reportPage,
    borrowPage,
    modal,
    filteredReports,
    filteredBorrow,
    reportPages,
    borrowPages,
    currentReportItems,
    currentBorrowItems,
    isLoading
  } = state;

  const {
    handleTabChange,
    setSearchTerm,
    setDateFilter,
    setStatusFilter,
    setReportPage,
    setBorrowPage,
    setModal,
    handleClearFilters
  } = actions;

  return (
    <div className="student-layout transition-colors duration-300">
      <main className="mx-auto flex w-full max-w-350 flex-1 flex-col px-4 pt-32 pb-10 sm:px-6 md:pt-36">
        <HistoryHeader />
        <HistoryTabs activeTab={activeTab} onTabChange={handleTabChange} />
        <HistoryFilterBar
          searchPlaceholder="Search history..."
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          dateFilter={dateFilter}
          onDateFilterChange={setDateFilter}
          filterLabel={activeTab === "borrow" ? "Status" : "Status"}
          filterOptions={
            activeTab === "borrow"
              ? ["All", "Borrowed", "Returned", "Overdue", "Approved", "Pending", "Rejected"]
              : ["All", "Resolved", "Processing", "Pending"]
          }
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          hasActiveFilters={searchTerm !== "" || statusFilter !== "All"}
          onClearFilters={handleClearFilters}
          onExportCsv={() => {}}
        />

        <div className="mt-6">
          {isLoading ? (
            <div className="flex items-center justify-center p-12">
              <div className="w-8 h-8 rounded-full border-4 border-[#1E2B58]/20 border-t-[#1E2B58] dark:border-white/20 dark:border-t-white animate-spin" />
              <span className="ml-3 font-medium text-slate-500">Loading history...</span>
            </div>
          ) : activeTab === "report" ? (
            <ReportHistoryTable
              items={currentReportItems}
              currentPage={reportPage}
              totalPages={reportPages}
              totalItems={filteredReports.length}
              onPageChange={setReportPage}
              onViewDetail={(item) => setModal({ type: "report", item: item as any })}
            />
          ) : (
            <BorrowHistoryTable
              items={currentBorrowItems}
              currentPage={borrowPage}
              totalPages={borrowPages}
              totalItems={filteredBorrow.length}
              onPageChange={setBorrowPage}
              onViewDetail={(item) => setModal({ type: "borrow", item: item as any })}
            />
          )}
        </div>
      </main>

      {modal && (
        <HistoryDetailModal modal={modal} onClose={() => setModal(null)} />
      )}
    </div>
  );
}
