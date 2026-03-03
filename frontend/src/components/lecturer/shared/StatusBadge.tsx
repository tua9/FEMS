import React from 'react';
import { Badge } from '@/components/ui/badge';

type StatusType = 'APPROVED' | 'PENDING' | 'REJECTED' | 'RETURNED' | 'OVERDUE' | 'BORROWED' | 'RESOLVED' | 'IN PROGRESS';

export const StatusBadge: React.FC<{ status: StatusType }> = ({ status }) => {
    const getStyles = () => {
        switch (status) {
            case 'APPROVED': case 'RETURNED': case 'RESOLVED':
                return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
            case 'PENDING': case 'IN PROGRESS':
                return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
            case 'BORROWED':
                return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
            case 'REJECTED': case 'OVERDUE':
                return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
            default:
                return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20';
        }
    };

    return (
        <Badge variant="outline" className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest ${getStyles()}`}>
            {status}
        </Badge>
    );
};
