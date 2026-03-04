// Shared history components – dùng được ở cả student lẫn lecturer pages
export { HistoryHeader } from "@/components/lecturer/history/HistoryHeader";
export { HistoryTabs } from "@/components/lecturer/history/HistoryTabs";
export { HistoryFilterBar } from "@/components/lecturer/history/HistoryFilterBar";
export {
  ReportHistoryTable,
  ALL_REPORT_HISTORY,
} from "@/components/lecturer/history/ReportHistoryTable";
export type {
  ReportHistoryItem,
  ReportSeverity,
} from "@/components/lecturer/history/ReportHistoryTable";
export {
  BorrowHistoryTable,
  ALL_BORROW_HISTORY,
} from "@/components/lecturer/history/BorrowHistoryTable";
export type {
  BorrowHistoryItem,
  BorrowStatus,
} from "@/components/lecturer/history/BorrowHistoryTable";
