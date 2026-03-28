import React from 'react';
import { AlertTriangle, Lock, Unlock } from 'lucide-react';

const AvailabilityLabel = ({ equipmentStatus, isOccupiedByOther }) => {
  if (equipmentStatus === 'broken')
    return <span className="flex items-center gap-1 text-xs font-bold text-red-500"><AlertTriangle className="w-3 h-3" />Broken</span>;
  if (equipmentStatus === 'maintenance')
    return <span className="flex items-center gap-1 text-xs font-bold text-orange-500"><AlertTriangle className="w-3 h-3" />Maintenance</span>;
  if (isOccupiedByOther)
    return <span className="flex items-center gap-1 text-xs font-bold text-amber-500"><Lock className="w-3 h-3" />Borrowed</span>;
  return <span className="flex items-center gap-1 text-xs font-bold text-emerald-500"><Unlock className="w-3 h-3" />Available</span>;
};

export default AvailabilityLabel;
