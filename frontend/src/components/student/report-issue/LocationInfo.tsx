import React from 'react';

const LocationInfo: React.FC = () => {
    return (
        <div className="bg-white/40 dark:bg-white/5 rounded-3xl p-6 flex flex-wrap items-center justify-between border border-white/60 dark:border-white/10">
            <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <span className="material-symbols-outlined text-3xl">location_on</span>
                </div>
                <div>
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">
                        Location/Subject Identified
                    </h3>
                    <div className="flex items-center gap-3">
                        <span className="text-lg font-extrabold text-slate-800 dark:text-white">
                            Block A - Room 402
                        </span>
                        <span className="bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                            #FPT-LOC-A402
                        </span>
                    </div>
                </div>
            </div>

            <button type="button" className="text-navy-deep dark:text-blue-400 text-sm font-bold hover:underline">
                Change Location
            </button>
        </div>
    );
};

export default LocationInfo;