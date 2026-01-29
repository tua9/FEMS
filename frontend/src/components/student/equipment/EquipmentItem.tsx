// src/components/equipment/EquipmentItem.tsx
import React from 'react';

interface EquipmentItemProps {
    name: string;
    tag: string;
    status: string;
    icon: string;
}

const EquipmentItem: React.FC<EquipmentItemProps> = ({ name, tag, status, icon }) => (
    <div className="flex flex-col">
        <div className="glass-card aspect-[4/3] rounded-[2.5rem] mb-5 flex items-center justify-center relative overflow-hidden group">
            <span className="material-symbols-outlined text-6xl text-slate-400 group-hover:scale-110 transition-transform duration-500">
                {icon}
            </span>
            <div className="absolute top-5 right-5">
                <span
                    className={`${status === 'Available'
                            ? 'bg-emerald-500/10 text-emerald-700'
                            : 'bg-orange-500/10 text-orange-700'
                        } text-[9px] font-extrabold px-3 py-1 rounded-full uppercase tracking-widest border border-white/20 backdrop-blur-md`}
                >
                    {status}
                </span>
            </div>
        </div>

        <div className="px-3">
            <h3 className="font-bold text-slate-800 dark:text-white mb-1">{name}</h3>
            <p className="text-[10px] font-bold text-slate-500 uppercase mb-4">{tag} • Lab Room 402</p>

            {status === 'Available' ? (
                <button className="w-full btn-navy-gradient text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2">
                    Request Borrow <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
            ) : (
                <button
                    disabled
                    className="w-full bg-white/30 text-slate-500 font-bold py-4 rounded-2xl cursor-not-allowed border border-white/60"
                >
                    Unavailable
                </button>
            )}
        </div>
    </div>
);

export default EquipmentItem;