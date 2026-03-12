import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';

const mockRequests = [
    { id: 'REQ-01', student: 'Mai Van A', equip: 'MacBook Pro M2', date: 'Oct 24, 2024', purpose: 'Mobile Dev Lab' },
    { id: 'REQ-02', student: 'Tran Thi B', equip: 'Sony A7IV', date: 'Oct 25, 2024', purpose: 'Media Project' },
];

export const RequestTable: React.FC = () => {
    return (
        <div className="dashboard-card rounded-4xl p-6 sm:p-8 overflow-hidden">
            <h3 className="text-xl font-extrabold text-[#1E2B58] dark:text-white mb-6">Pending Borrow Requests</h3>
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="border-b border-[#1E2B58]/10 dark:border-white/10 hover:bg-transparent">
                            <TableHead className="text-xs font-bold text-slate-500">Student</TableHead>
                            <TableHead className="text-xs font-bold text-slate-500">Equipment</TableHead>
                            <TableHead className="text-xs font-bold text-slate-500">Date/Time</TableHead>
                            <TableHead className="text-xs font-bold text-slate-500">Purpose</TableHead>
                            <TableHead className="text-xs font-bold text-slate-500 text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mockRequests.map((req) => (
                            <TableRow key={req.id} className="border-b border-[#1E2B58]/5 dark:border-white/5 hover:bg-white/20 dark:hover:bg-white/5 transition-colors">
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-[#1E2B58] dark:text-white text-sm">{req.student}</span>
                                        <span className="text-xs text-slate-500">{req.id}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="font-medium text-[#1E2B58] dark:text-white text-sm">{req.equip}</TableCell>
                                <TableCell className="text-xs text-slate-500">{req.date}</TableCell>
                                <TableCell className="text-xs text-slate-500">{req.purpose}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Button size="icon" variant="outline" className="w-8 h-8 rounded-full border-green-500/30 text-green-600 hover:bg-green-50 dark:hover:bg-green-500/10">
                                            <Check className="w-4 h-4" />
                                        </Button>
                                        <Button size="icon" variant="outline" className="w-8 h-8 rounded-full border-red-500/30 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10">
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};
