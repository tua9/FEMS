import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Monitor, Thermometer, Video, Cpu, Shield, Droplets, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface EquipmentProps {
    name: string;
    status: 'ACTIVE' | 'MAINTENANCE' | 'FAULTY';
    icon: keyof typeof IconMap;
}

interface RoomCardProps {
    roomName: string;
    roomType: string;
    statusText: string;
    equipment: EquipmentProps[];
    onReportIssue?: () => void;
}

const IconMap = {
    monitor: Monitor,
    thermostat: Thermometer,
    video: Video,
    cpu: Cpu,
    shield: Shield,
    droplets: Droplets
};

export const RoomCard: React.FC<RoomCardProps> = ({ roomName, roomType, statusText, equipment, onReportIssue }) => {
    const hasIssue = equipment.some(d => d.status === 'MAINTENANCE' || d.status === 'FAULTY');
    const hasFault = equipment.some(d => d.status === 'FAULTY');

    return (
        <div className="dashboard-card w-[85vw] sm:w-88 md:w-96 lg:w-100 max-w-full shrink-0 rounded-3xl lg:rounded-4xl overflow-hidden transition-all hover:scale-[1.01]">
            <div className="p-6 md:p-8 flex flex-col h-full">
                {/* Header */}
                <div className="flex justify-between items-start mb-6 md:mb-8">
                    <div>
                        <h3 className="text-xl md:text-2xl font-black text-[#1E2B58] dark:text-white">{roomName}</h3>
                        <p className="text-[0.5625rem] md:text-[0.625rem] font-bold text-[#1E2B58]/50 dark:text-white/50 uppercase tracking-[0.2em] mt-1">{roomType}</p>
                    </div>
                    <Badge
                        variant="outline"
                        className={`px-2.5 md:px-3 py-1 md:py-1.5 rounded-xl text-[0.5rem] md:text-[0.5625rem] font-black uppercase tracking-wider border ${
                            hasFault
                                ? 'bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400'
                                : hasIssue
                                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400'
                                    : 'bg-[#1E2B58]/10 dark:bg-white/10 border-[#1E2B58]/20 text-[#1E2B58] dark:text-white'
                        }`}
                    >
                        {statusText}
                    </Badge>
                </div>

                {/* Equipment list */}
                <div className="space-y-3 flex-1">
                    {equipment.map((item, idx) => {
                        const Icon = IconMap[item.icon] || Monitor;
                        const isActive = item.status === 'ACTIVE';
                        const textClass = isActive
                            ? 'text-[#1E2B58] dark:text-white'
                            : 'text-[#4A5A8A] dark:text-slate-400';
                        const statusColor =
                            item.status === 'FAULTY'      ? 'text-red-500 font-black' :
                            item.status === 'MAINTENANCE' ? 'text-amber-500 font-black' :
                            `${textClass} font-black`;

                        return (
                            <div
                                key={idx}
                                className={`flex items-center justify-between p-3 md:p-4 rounded-xl md:rounded-2xl border border-white/40 dark:border-white/10 backdrop-blur-sm ${
                                    isActive
                                        ? 'bg-white/25 dark:bg-white/5'
                                        : 'bg-white/10 dark:bg-white/3 opacity-60'
                                }`}
                            >
                                <div className="flex items-center gap-2 md:gap-3">
                                    <Icon className={`w-4 h-4 md:w-5 md:h-5 ${textClass} shrink-0`} />
                                    <span className={`text-xs md:text-sm font-bold ${textClass} line-clamp-1`}>{item.name}</span>
                                </div>
                                <span className={`text-[0.5625rem] md:text-[0.625rem] ${statusColor}`}>
                                    {item.status}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* Report Issue / All OK button */}
                {onReportIssue && (
                    <button
                        onClick={onReportIssue}
                        className={`mt-5 w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                            hasIssue
                                ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 hover:bg-amber-500/25 border border-amber-500/30'
                                : 'bg-[#1E2B58]/5 dark:bg-white/5 text-[#1E2B58]/50 dark:text-white/50 hover:bg-[#1E2B58]/10 dark:hover:bg-white/10 border border-[#1E2B58]/10 dark:border-white/10'
                        }`}
                    >
                        {hasIssue ? (
                            <>
                                <AlertTriangle className="w-3.5 h-3.5" />
                                Report Issue
                            </>
                        ) : (
                            <>
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                All Operational
                            </>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
};
