import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon }) => {
    return (
        <Card className="dashboard-card border-none rounded-3xl lg:rounded-4xl overflow-hidden">
            <CardContent className="p-4 lg:p-6 flex items-center gap-4 lg:gap-5">
                <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl flex items-center justify-center stat-card-icon shrink-0">
                    <Icon className="w-6 h-6 lg:w-7 lg:h-7" />
                </div>
                <div>
                    <p className="text-[0.5625rem] lg:text-[0.625rem] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 line-clamp-1">
                        {title}
                    </p>
                    <p className="text-2xl lg:text-3xl font-black text-[#1E2B58] dark:text-white mt-0.5 lg:mt-1">{value}</p>
                </div>
            </CardContent>
        </Card>
    );
};
