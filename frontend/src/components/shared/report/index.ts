// Shared report components – dùng được ở cả student lẫn lecturer pages
export { ReportHeader } from "./ReportHeader";
export { QuickScanReport } from "./QuickScanReport";
export type { QRResult } from "./QuickScanReport";
export { ReportManualForm } from "./ReportManualForm";
export type { ReportFormData, IssueCategory } from "./ReportManualForm";
export { RecentReports } from "./RecentReports";
// Note: ReportEntry interface from RecentReports has been localized to reduce export surface.
