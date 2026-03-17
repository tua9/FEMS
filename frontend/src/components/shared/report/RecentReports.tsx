import React, { useEffect } from 'react';
import { useNavigate }     from 'react-router-dom';
import { ArrowUpRight, Loader2 } from 'lucide-react';
import { useReportStore }  from '@/stores/useReportStore';
import type { Report }     from '@/types/report';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ReportEntry {
    id:      string;
    subject: string;
    date:    string;
    status:  'In Progress' | 'Resolved' | 'Pending';
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_MAP: Record<string, ReportEntry['status']> = {
    pending:    'Pending',
    approved:   'In Progress',
    processing: 'In Progress',
    fixed:      'Resolved',
    rejected:   'Resolved',
};

const STATUS_CLASSES: Record<ReportEntry['status'], string> = {
    'In Progress': 'bg-[#1E2B58] text-white border-white/10',
    'Resolved':    'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/50',
    'Pending':     'bg-slate-200 text-slate-700 border-slate-300 dark:bg-slate-700/30 dark:text-slate-400 dark:border-slate-600/50',
};

const mapReport = (r: Report): ReportEntry => {
    const idSuffix = (r._id as string).slice(-6).toUpperCase();
    const eq   = r.equipment_id as any;
    const room = r.room_id      as any;
    const typeLabelMap: Record<string, string> = {
        equipment:      'Equipment Issue',
        infrastructure: 'Infrastructure Issue',
        other:          'General Issue',
    };
    const typeLabel = typeLabelMap[r.type] ?? 'Issue';
    const location  = room?.name || eq?.name || 'Unknown Location';
    const subject   = `${typeLabel} — ${location}`;
    const date      = r.createdAt
        ? new Date(r.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
        : 'N/A';
    return {
        id:     `#RPT-${idSuffix}`,
        subject,
        date,
        status: STATUS_MAP[r.status] ?? 'Pending',
    };
};

// ─── Component ────────────────────────────────────────────────────────────────

/** Shows the current user's 4 most recent reports, loaded from the backend. */
export const RecentReports: React.FC = () => {
    const navigate = useNavigate();
    const { myReports, fetchMyReports, loading } = useReportStore();

    useEffect(() => {
        fetchMyReports();
    }, []);

    const reports = myReports.slice(0, 4).map(mapReport);

    return (
        <div className="mt-[3rem] glass-card bg-white/60 dark:bg-slate-800/70 p-[2rem] lg:p-[2.5rem] rounded-[2.5rem] border border-white dark:border-white/10 shadow-[0_10px_30px_-5px_rgba(30,43,88,0.1)]">
            {/* Header */}
            <div className="flex items-center justify-between mb-[2rem]">
                <h3 className="text-[1.5rem] font-bold text-[#1E2B58] dark:text-white tracking-tight">My Recent Reports</h3>
                <button
                    onClick={() => navigate('/lecturer/history')}
                    className="text-[0.6875rem] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest hover:text-[#1E2B58] dark:hover:text-white transition-colors flex items-center gap-1"
                >
                    View All History
                    <ArrowUpRight className="w-3 h-3" />
                </button>
            </div>

            {/* Loading */}
            {loading && (
                <div className="py-8 flex justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-[#1E2B58]/40" />
                </div>
            )}

            {/* Empty state */}
            {!loading && reports.length === 0 && (
                <div className="py-10 text-center">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No reports yet</p>
                    <p className="text-xs text-slate-400 mt-1">Your submitted reports will appear here.</p>
                </div>
            )}

            {/* Rows */}
            {!loading && reports.length > 0 && (
                <div className="space-y-[0.75rem]">
                    {reports.map(report => (
                        <div
                            key={report.id}
                            onClick={() => navigate('/lecturer/history')}
                            className="bg-white/40 dark:bg-white/5 border border-white/50 dark:border-white/10 rounded-[1.5rem] p-[1.25rem] grid grid-cols-1 md:grid-cols-12 items-start md:items-center gap-[1rem] transition-all hover:bg-white/80 dark:hover:bg-white/10 cursor-pointer group hover:shadow-sm active:scale-[0.995]"
                        >
                            {/* ID */}
                            <div className="md:col-span-3">
                                <p className="text-[0.625rem] font-bold text-slate-400 uppercase tracking-wider mb-[0.25rem]">Report ID</p>
                                <p className="text-[0.875rem] font-bold text-[#1E2B58] dark:text-white group-hover:underline">{report.id}</p>
                            </div>
                            {/* Subject */}
                            <div className="md:col-span-4">
                                <p className="text-[0.625rem] font-bold text-slate-400 uppercase tracking-wider mb-[0.25rem]">Subject</p>
                                <p className="text-[0.875rem] font-bold text-[#1E2B58] dark:text-white">{report.subject}</p>
                            </div>
                            {/* Date */}
                            <div className="md:col-span-3">
                                <p className="text-[0.625rem] font-bold text-slate-400 uppercase tracking-wider mb-[0.25rem]">Date Submitted</p>
                                <p className="text-[0.875rem] font-medium text-slate-600 dark:text-slate-400">{report.date}</p>
                            </div>
                            {/* Status */}
                            <div className="md:col-span-2 flex md:justify-end">
                                <span className={`min-w-[7.5rem] text-center text-[0.625rem] font-bold px-[1rem] rounded-[0.5rem] border uppercase tracking-wider h-[2.5rem] flex items-center justify-center leading-none ${STATUS_CLASSES[report.status]}`}>
                                    {report.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
