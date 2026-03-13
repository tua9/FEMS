import React from 'react';
import { Badge } from '@/components/ui/badge';

export type StatusType =
    | 'approved' | 'pending' | 'rejected'
    | 'returned' | 'overdue' | 'borrowed' | 'handed_over'
    | 'resolved' | 'in progress' | 'processing' | 'fixed' | string;

const STATUS_STYLES: Record<string, string> = {
    approved:      'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    returned:      'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    resolved:      'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    fixed:         'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    handed_over:   'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    pending:       'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    processing:    'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    'in progress': 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    borrowed:      'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    rejected:      'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    overdue:       'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
};

export const StatusBadge: React.FC<{ status: StatusType }> = ({ status }) => {
    const normalizedStatus = (status || "").toLowerCase();
    return (
        <Badge
            variant="outline"
            className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest ${STATUS_STYLES[normalizedStatus] ?? 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20'}`}
        >
            {status}
        </Badge>
    );
};
