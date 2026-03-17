import React from 'react';
import { Badge } from '@/components/ui/badge';

export type StatusType =
    | 'APPROVED' | 'PENDING' | 'REJECTED'
    | 'RETURNED' | 'OVERDUE' | 'BORROWED'
    | 'RESOLVED' | 'IN PROGRESS';

const STATUS_STYLES: Record<StatusType, string> = {
    APPROVED:      'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 shadow-[0_2px_10px_-3px_rgba(16,185,129,0.2)] dark:bg-emerald-900/20',
    RETURNED:      'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 shadow-[0_2px_10px_-3px_rgba(16,185,129,0.2)] dark:bg-emerald-900/20',
    RESOLVED:      'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 shadow-[0_2px_10px_-3px_rgba(16,185,129,0.2)] dark:bg-emerald-900/20',
    PENDING:       'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 shadow-[0_2px_10px_-3px_rgba(245,158,11,0.2)] dark:bg-amber-900/20',
    'IN PROGRESS': 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 shadow-[0_2px_10px_-3_rgba(245,158,11,0.2)] dark:bg-amber-900/20',
    BORROWED:      'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 shadow-[0_2px_10px_-3px_rgba(59,130,246,0.2)] dark:bg-blue-900/20',
    REJECTED:      'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 shadow-[0_2px_10px_-3px_rgba(244,63,94,0.2)] dark:bg-rose-900/20',
    OVERDUE:       'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 shadow-[0_2px_10px_-3px_rgba(244,63,94,0.2)] dark:bg-rose-900/20',
};

export const StatusBadge: React.FC<{ status: StatusType }> = ({ status }) => (
    <Badge
        variant="outline"
        className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-[0.1em] backdrop-blur-md border ${STATUS_STYLES[status] ?? 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20'}`}
    >
        {status}
    </Badge>
);
