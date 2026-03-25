import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Loader2 } from 'lucide-react';
import { useReportStore } from '@/stores/useReportStore';
import { formatDisplayDate } from '@/utils/dateUtils';
import HistoryDetailModal from '@/features/student/components/history/HistoryDetailModal';

const STATUS_CLASSES= {
 'processing': 'bg-[#1E2B58] text-white border-white/10',
 'approved': 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/50',
 'fixed': 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/50',
 'pending': 'bg-slate-200 text-slate-700 border-slate-300 dark:bg-slate-700/30 dark:text-slate-400 dark:border-slate-600/50',
 'rejected': 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/50',
 'cancelled': 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800/30 dark:text-slate-500 dark:border-slate-800',
};

/** Shows the current user's 4 most recent reports, loaded from the backend. */
export const RecentReports = ({ newReport }) => {
 const navigate = useNavigate();
 const { myReports, fetchMyReports, loading } = useReportStore();
 const [modal, setModal] = useState(null);

 useEffect(() => {
 fetchMyReports();
 }, [fetchMyReports]);

 // Map `myReports` to `ReportEntry` UI format
 const fetchedReports= myReports.map(r => {
 let subjectStr = "Report";
 if (r.type === 'equipment' && r.equipment_id && typeof r.equipment_id !== 'string') {
 subjectStr = r.equipment_id.name;
 } else if (r.type === 'infrastructure' && r.room_id && typeof r.room_id !== 'string') {
 subjectStr = `Infrastructure Issue in ${r.room_id.name}`;
 } else if (r.description) {
 subjectStr = r.description.substring(0, 40) + (r.description.length > 40 ? '...' : '');
 }

 return {
 id: r._id,
 subject: subjectStr,
 date: formatDisplayDate(r.createdAt),
 status: r.status,
 originalReport: r,
 };
 });

 const displayReports= newReport
 ? [newReport, ...fetchedReports.filter(r => r.id !== newReport.id)].slice(0, 4)
 : fetchedReports.slice(0, 4);

 const handleRowClick = (report) => {
 if (report.originalReport) {
 setModal({ type: 'report', item: report.originalReport });
 } else {
 // Fallback navigation based on URL
 const isLecturer = window.location.pathname.includes('/lecturer');
 navigate(isLecturer ? '/lecturer/history' : '/student/history');
 }
 };

 return (
 <div className="mt-[3rem] dashboard-card p-[2rem] lg:p-[2.5rem] rounded-[2.5rem]">
 {/* Header */}
 <div className="flex items-center justify-between mb-[2rem]">
 <h3 className="text-[1.5rem] font-bold text-[#1E2B58] dark:text-white tracking-tight">My Recent Reports</h3>
 <button
 onClick={() => {
 const isLecturer = window.location.pathname.includes('/lecturer');
 navigate(isLecturer ? '/lecturer/history' : '/student/history');
 }}
 className="text-[0.6875rem] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest hover:text-[#1E2B58] dark:hover:text-white transition-colors flex items-center gap-1"
 >
 View All History
 <ArrowUpRight className="w-3 h-3" />
 </button>
 </div>

 {/* Loading */}
 {loading && fetchedReports.length === 0 && (
 <div className="py-8 flex justify-center">
 <Loader2 className="w-6 h-6 animate-spin text-[#1E2B58]/40" />
 </div>
 )}

 {/* Empty state */}
 {!loading && displayReports.length === 0 && (
 <div className="py-10 text-center">
 <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No reports yet</p>
 <p className="text-xs text-slate-400 mt-1">Your submitted reports will appear here.</p>
 </div>
 )}

 {/* Rows */}
 <div className="space-y-[0.75rem]">
 {displayReports.map((report) => (
 <div
 key={report.id}
 onClick={() => handleRowClick(report)}
 className="bg-white/50 dark:bg-white/5 border border-white/70 dark:border-white/10 rounded-[1.5rem] p-[1.25rem] grid grid-cols-1 md:grid-cols-12 items-start md:items-center gap-[1rem] transition-all hover:bg-white/80 dark:hover:bg-white/10 cursor-pointer group hover:shadow-md active:scale-[0.995]"
 >
 {/* ID */}
 <div className="md:col-span-3">
 <p className="text-[0.625rem] font-bold text-slate-400 uppercase tracking-wider mb-[0.25rem]">Report ID</p>
 <p className="text-[0.875rem] font-bold text-[#1E2B58] dark:text-white group-hover:underline max-w-xs truncate" title={report.id}>
 {(report.id || '').substring(0, 8).toUpperCase()}...
 </p>
 </div>
 {/* Subject */}
 <div className="md:col-span-4">
 <p className="text-[0.625rem] font-bold text-slate-400 uppercase tracking-wider mb-[0.25rem]">Subject</p>
 <p className="text-[0.875rem] font-bold text-[#1E2B58] dark:text-white max-w-[12rem] truncate" title={report.subject}>{report.subject}</p>
 </div>
 {/* Date */}
 <div className="md:col-span-3">
 <p className="text-[0.625rem] font-bold text-slate-400 uppercase tracking-wider mb-[0.25rem]">Date Submitted</p>
 <p className="text-[0.875rem] font-medium text-slate-600 dark:text-slate-400">{report.date}</p>
 </div>
 {/* Status */}
 <div className="md:col-span-2 flex md:justify-end">
 <span className={`min-w-[7.5rem] text-center text-[0.625rem] font-bold px-[1rem] rounded-[0.5rem] border uppercase tracking-wider h-[2.5rem] flex items-center justify-center leading-none ${STATUS_CLASSES[report.status.toLowerCase()] || STATUS_CLASSES['pending']}`}>
 {report.status}
 </span>
 </div>
 </div>
 ))}
 </div>
 
 {modal && (
 <HistoryDetailModal modal={modal} onClose={() => setModal(null)} />
 )}
 </div>
 );
};
