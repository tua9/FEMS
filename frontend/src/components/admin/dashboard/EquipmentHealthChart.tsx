import React from 'react';

interface EquipmentHealthChartProps {
    healthyPercentage: number;
    availableNodes: number;
    maintenanceNodes: number;
    brokenNodes: number;
}

const EquipmentHealthChart: React.FC<EquipmentHealthChartProps> = ({
    healthyPercentage,
    availableNodes,
    maintenanceNodes,
    brokenNodes
}) => {
    const total = availableNodes + maintenanceNodes + brokenNodes;
    const circumference = 251.2;

    const getSegment = (count: number) => {
        if (total === 0) return { length: 0, offset: circumference };
        const length = (count / total) * circumference;
        return { length, offset: circumference - length };
    };

    const available = getSegment(availableNodes);
    const maintenance = getSegment(maintenanceNodes);
    const broken = getSegment(brokenNodes);

    // Calculate rotations to stack segments
    const availableRotation = -90;
    const maintenanceRotation = availableRotation + (available.length / circumference) * 360;
    const brokenRotation = maintenanceRotation + (maintenance.length / circumference) * 360;

    return (
        <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-6">Equipment Health Status</p>
            <div className="relative flex-1 flex flex-col items-center justify-center py-6 min-h-[220px]">
                <svg className="w-52 h-52 drop-shadow-xl" viewBox="0 0 100 100" style={{ transform: 'rotate(0deg)' }}>
                    {/* Available Segment */}
                    <circle 
                        className="text-[#1A2B56] dark:text-blue-500" 
                        cx="50" cy="50" fill="transparent" r="40" 
                        stroke="currentColor" 
                        strokeDasharray={circumference} 
                        strokeDashoffset={available.offset} 
                        strokeWidth="12"
                        style={{ transform: `rotate(${availableRotation}deg)`, transformOrigin: 'center' }}
                    ></circle>
                    {/* Maintenance Segment */}
                    <circle 
                        className="text-[#4A8DB7] dark:text-blue-400" 
                        cx="50" cy="50" fill="transparent" r="40" 
                        stroke="currentColor" 
                        strokeDasharray={circumference} 
                        strokeDashoffset={maintenance.offset} 
                        strokeWidth="12" 
                        style={{ transform: `rotate(${maintenanceRotation}deg)`, transformOrigin: 'center' }}
                    ></circle>
                    {/* Broken Segment */}
                    <circle 
                        className="text-[#75BDE0] dark:text-cyan-400" 
                        cx="50" cy="50" fill="transparent" r="40" 
                        stroke="currentColor" 
                        strokeDasharray={circumference} 
                        strokeDashoffset={broken.offset} 
                        strokeWidth="12" 
                        style={{ transform: `rotate(${brokenRotation}deg)`, transformOrigin: 'center' }}
                    ></circle>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-[#1A2B56] dark:text-white leading-tight">{healthyPercentage}%</span>
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest leading-tight">Healthy</span>
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

export default EquipmentHealthChart;
