import React, { useEffect, useMemo, useState } from 'react';
import { technicianApi } from '@/services/api/technicianApi';

type DeviceHealthStats = {
  totalAssets: number;
  healthy: number;
  maintenance: number;
  faulty: number;
  unknown?: number;
};

const clampPct = (n: number) => Math.max(0, Math.min(100, n));

const EquipmentHealth: React.FC = () => {
  const [data, setData] = useState<DeviceHealthStats | null>(null);

  useEffect(() => {
    technicianApi
      .getDeviceHealth()
      .then(setData)
      .catch(console.error);
  }, []);

  const { total, healthyPct, maintenancePct, faultyPct } = useMemo(() => {
    const total = data?.totalAssets ?? 0;
    const healthy = data?.healthy ?? 0;
    const maintenance = data?.maintenance ?? 0;
    const faulty = data?.faulty ?? 0;

    if (total <= 0) {
      return { total: 0, healthyPct: 0, maintenancePct: 0, faultyPct: 0 };
    }

    const healthyPct = clampPct((healthy / total) * 100);
    const maintenancePct = clampPct((maintenance / total) * 100);
    const faultyPct = clampPct((faulty / total) * 100);

    return { total, healthyPct, maintenancePct, faultyPct };
  }, [data]);

  // Donut math
  const CIRC = 251.2; // circumference for radius 40
  const healthyLen = (healthyPct / 100) * CIRC;
  const maintenanceLen = (maintenancePct / 100) * CIRC;
  const faultyLen = (faultyPct / 100) * CIRC;

  // Offset logic for stacked donut segments
  const healthyOffset = CIRC - healthyLen;
  const maintenanceOffset = CIRC - (healthyLen + maintenanceLen);
  const faultyOffset = CIRC - (healthyLen + maintenanceLen + faultyLen);

  return (
    <div className="dashboard-card p-8 rounded-3xl flex flex-col h-full transition-all duration-300">
      <h3 className="text-sm font-bold text-[#1A2B56] dark:text-white uppercase tracking-widest mb-10">
        Equipment Health
      </h3>

      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="relative w-44 h-44 mb-8">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            {/* Background */}
            <circle
              className="text-slate-100 dark:text-slate-800"
              cx="50" cy="50" fill="transparent" r="40"
              stroke="currentColor" strokeWidth="10"
            />
            {/* Healthy — primary */}
            <circle
              className="text-[#1A2B56] dark:text-blue-500"
              cx="50" cy="50" fill="transparent" r="40"
              stroke="currentColor"
              strokeDasharray={CIRC}
              strokeDashoffset={healthyOffset}
              strokeLinecap="round"
              strokeWidth="10"
              style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
            />
            {/* Maintenance — blue-accent */}
            <circle
              className="text-blue-400 dark:text-blue-400"
              cx="50" cy="50" fill="transparent" r="40"
              stroke="currentColor"
              strokeDasharray={CIRC}
              strokeDashoffset={maintenanceOffset}
              strokeLinecap="round"
              strokeWidth="10"
              style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
            />
            {/* Faulty — blue-light */}
            <circle
              className="text-blue-200 dark:text-blue-300"
              cx="50" cy="50" fill="transparent" r="40"
              stroke="currentColor"
              strokeDasharray={CIRC}
              strokeDashoffset={faultyOffset}
              strokeLinecap="round"
              strokeWidth="10"
              style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
            />
          </svg>
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-extrabold text-[#1A2B56] dark:text-white leading-none">
              {total.toLocaleString()}
            </span>
            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">
              Assets
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 w-full max-w-xs mx-auto">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#1A2B56] dark:bg-blue-500"></span>
            <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">{Math.round(healthyPct)}% Healthy</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
            <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">{Math.round(maintenancePct)}% Maint.</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-200 dark:bg-blue-300"></span>
            <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">{Math.round(faultyPct)}% Faulty</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquipmentHealth;
