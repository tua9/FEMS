import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatusBadge } from '../shared/StatusBadge';

const mockHistory = [
    { id: 'HIS-101', item: 'Room AL-402', type: 'Facility', date: 'Ocr 20, 2024', status: 'RETURNED' },
    { id: 'HIS-102', item: 'Dell XPS 15', type: 'Equipment', date: 'Oct 18, 2024', status: 'APPROVED' },
    { id: 'HIS-103', item: 'Projector G5', type: 'Equipment', date: 'Oct 15, 2024', status: 'REJECTED' },
];

export const HistoryTable: React.FC = () => {
    return (
        <div className="glass-card rounded-[32px] p-6 sm:p-8 overflow-hidden">
            <h3 className="text-xl font-extrabold text-[#1E2B58] dark:text-white mb-6">My Activity History</h3>
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="border-b border-[#1E2B58]/10 dark:border-white/10 hover:bg-transparent">
                            <TableHead className="text-xs font-bold text-slate-500">Item</TableHead>
                            <TableHead className="text-xs font-bold text-slate-500">Type</TableHead>
                            <TableHead className="text-xs font-bold text-slate-500">Date</TableHead>
                            <TableHead className="text-xs font-bold text-slate-500 text-right">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mockHistory.map((row) => (
                            <TableRow key={row.id} className="border-b border-[#1E2B58]/5 dark:border-white/5 hover:bg-white/20 dark:hover:bg-white/5 transition-colors">
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-[#1E2B58] dark:text-white text-sm">{row.item}</span>
                                        <span className="text-xs text-slate-500">{row.id}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-sm font-medium text-slate-600 dark:text-slate-300">{row.type}</TableCell>
                                <TableCell className="text-xs text-slate-500">{row.date}</TableCell>
                                <TableCell className="text-right">
                                    <StatusBadge status={row.status as "RETURNED" | "APPROVED" | "REJECTED"} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};
