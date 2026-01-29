import React from 'react';

interface InfoFieldProps {
    label: string;
    value: string;
    icon: string;
}

const InfoField: React.FC<InfoFieldProps> = ({ label, value, icon }) => (
    <div className="space-y-3">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">{icon}</span>
            {label}
        </label>
        <div className="w-full bg-white/30 dark:bg-white/5 border border-white/50 dark:border-white/10 rounded-2xl px-5 py-4 text-sm font-bold text-slate-700 dark:text-slate-200 backdrop-blur-md">
            {value}
        </div>
    </div>
);

export default InfoField;