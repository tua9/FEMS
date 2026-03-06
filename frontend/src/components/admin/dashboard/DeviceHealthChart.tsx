import React from 'react';

interface DeviceHealthChartProps {
    healthyPercentage: number;
    availableNodes: number;
    maintenanceNodes: number;
    brokenNodes: number;
}

const DeviceHealthChart: React.FC<DeviceHealthChartProps> = ({
    healthyPercentage,
    availableNodes,
    maintenanceNodes,
    brokenNodes
}) => {
    // 2 * pi * r (r=40) = 251.2
    return (
        <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-6">Device Health Status</p>
            <div className="relative flex items-center justify-center py-2">
                <svg className="w-44 h-44 drop-shadow-xl" viewBox="0 0 100 100">
                    <circle className="text-[#1A2B56] dark:text-blue-500" cx="50" cy="50" fill="transparent" r="40" stroke="currentColor" strokeDasharray="251.2" strokeDashoffset="50.2" strokeWidth="12"></circle>
                    <circle className="text-[#4A8DB7] dark:text-blue-400" cx="50" cy="50" fill="transparent" r="40" stroke="currentColor" strokeDasharray="251.2" strokeDashoffset="213.5" strokeWidth="12" style={{ transform: 'rotate(20deg)', transformOrigin: 'center' }}></circle>
                    <circle className="text-[#75BDE0] dark:text-cyan-400" cx="50" cy="50" fill="transparent" r="40" stroke="currentColor" strokeDasharray="251.2" strokeDashoffset="231.1" strokeWidth="12" style={{ transform: 'rotate(75deg)', transformOrigin: 'center' }}></circle>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-[#1A2B56] dark:text-white leading-tight">{healthyPercentage}%</span>
                    <span className="text-[8px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest leading-tight">Healthy</span>
                </div>
            </div>
            <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold dark:text-slate-300">
                    <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#1A2B56] dark:bg-blue-500"></span> Available</div>
                    <span>{availableNodes}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold dark:text-slate-300">
                    <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#4A8DB7] dark:bg-blue-400"></span> Maintenance</div>
                    <span>{maintenanceNodes}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold dark:text-slate-300">
                    <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#75BDE0] dark:bg-cyan-400"></span> Broken</div>
                    <span>{brokenNodes}</span>
                </div>
            </div>
        </div>
    );
};

export default DeviceHealthChart;
