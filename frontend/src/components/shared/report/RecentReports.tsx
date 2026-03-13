import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

export interface ReportEntry {
    id: string;
    subject: string;
    date: string;
    status: 'In Progress' | 'Resolved' | 'Pending';
}

const STATUS_CLASSES: Record<ReportEntry['status'], string> = {
    'In Progress': 'bg-[#1E2B58] text-white border-white/10',
    'Resolved':    'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/50',
    'Pending':     'bg-slate-200 text-slate-700 border-slate-300 dark:bg-slate-700/30 dark:text-slate-400 dark:border-slate-600/50',
};

const DEFAULT_REPORTS: ReportEntry[] = [
    { id: '#REP-7742', subject: 'Projector Error (Room 402)', date: 'Oct 24, 2023', status: 'In Progress' },
    { id: '#REP-7611', subject: 'AC Leakage in Library',      date: 'Oct 19, 2023', status: 'Resolved'    },
    { id: '#REP-7590', subject: 'Loose Power Socket',         date: 'Oct 15, 2023', status: 'Pending'     },
];

interface RecentReportsProps {
    /** New report just submitted — prepended at the top */
    newReport?: ReportEntry | null;
}

export const RecentReports: React.FC<RecentReportsProps> = ({ newReport }) => {
    const navigate = useNavigate();

    const reports: ReportEntry[] = newReport
        ? [newReport, ...DEFAULT_REPORTS].slice(0, 4)
        : DEFAULT_REPORTS;

    return (
        <div className="mt-[3rem] dashboard-card p-[2rem] lg:p-[2.5rem] rounded-[2.5rem]">
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

            {/* Rows */}
            <div className="space-y-[0.75rem]">
                {reports.map((report) => (
                    <div
                        key={report.id}
                        onClick={() => navigate('/lecturer/history')}
                        className="bg-white/50 dark:bg-white/5 border border-white/70 dark:border-white/10 rounded-[1.5rem] p-[1.25rem] grid grid-cols-1 md:grid-cols-12 items-start md:items-center gap-[1rem] transition-all hover:bg-white/80 dark:hover:bg-white/10 cursor-pointer group hover:shadow-md active:scale-[0.995]"
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
        </div>
    );
};
