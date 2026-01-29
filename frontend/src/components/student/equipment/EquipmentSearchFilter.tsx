import React from 'react';

const EquipmentSearchFilter: React.FC = () => {
    return (
        <section className="glass-main p-3 rounded-full flex flex-col md:flex-row gap-2 items-center shadow-xl">
            <div className="relative flex-grow w-full">
                <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-slate-500">
                    search
                </span>
                <input
                    type="text"
                    placeholder="Search devices (e.g. Laptop, Projector, Tablet...)"
                    className="w-full bg-transparent border-none rounded-full pl-14 pr-4 py-3.5 focus:ring-0 outline-none text-sm text-slate-800 dark:text-white"
                />
            </div>

            <div className="flex items-center gap-4 px-4 w-full md:w-auto">
                <select className="bg-transparent border-none py-3 pr-8 focus:ring-0 outline-none text-sm font-semibold text-slate-700 dark:text-slate-300">
                    <option>Device Type</option>
                    <option>Computing</option>
                    <option>Visual & Audio</option>
                </select>
                <button className="btn-navy-gradient text-white px-8 py-3 rounded-full font-bold text-sm transition-all shrink-0">
                    Filter
                </button>
            </div>
        </section>
    );
};

export default EquipmentSearchFilter;