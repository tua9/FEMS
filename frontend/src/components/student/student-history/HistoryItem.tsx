import React from 'react';

interface HistoryItemProps {
    name: string;
    id: string;
    trxId: string;
    period: string;
    status: string;
    img: string;
    onClick: () => void;
}

const HistoryItem: React.FC<HistoryItemProps> = ({ name, id, trxId, period, status, img, onClick }) => {
    return (
        <div
            onClick={onClick}
            className="flex items-center gap-8 p-5 rounded-2xl transition-all duration-300 border border-transparent hover:border-white/50 hover:bg-white/30 hover:shadow-sm cursor-pointer"
        >
            <div className="w-20 h-20 bg-white/40 dark:bg-slate-700 rounded-2xl flex items-center justify-center shrink-0 p-2 shadow-sm overflow-hidden">
                <img src={img} alt={name} className="w-full h-full object-contain" />
            </div>

            <div className="flex-grow grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                <div className="md:col-span-1">
                    <h3 className="font-bold text-slate-800 dark:text-white text-base">{name}</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Device ID: {id}
                    </p>
                </div>

                <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Transaction ID</p>
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{trxId}</p>
                </div>

                <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Period</p>
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{period}</p>
                </div>

                <div className="flex justify-end">
                    <span
                        className={`${status === 'Returned' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-600'
                            } text-[10px] font-extrabold px-5 py-2 rounded-full uppercase tracking-widest`}
                    >
                        {status}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default HistoryItem;