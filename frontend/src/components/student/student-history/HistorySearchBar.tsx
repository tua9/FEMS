import React from 'react';

const HistorySearchBar: React.FC = () => {
    return (
        <section className="glass-main p-2 rounded-full flex flex-col md:flex-row gap-2 items-center">
            <div className="relative flex-grow w-full">
                <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-slate-400">
                    search
                </span>
                <input
                    type="text"
                    placeholder="Search by Transaction ID or Device Name..."
                    className="w-full bg-transparent border-none rounded-full pl-14 pr-4 py-3.5 focus:ring-0 outline-none text-sm"
                />
            </div>
            <button className="btn-navy-gradient text-white px-8 py-3 rounded-full font-bold text-sm mx-2">
                Apply
            </button>
        </section>
    );
};

export default HistorySearchBar;