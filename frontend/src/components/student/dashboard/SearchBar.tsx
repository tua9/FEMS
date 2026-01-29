import React from 'react';

const SearchBar: React.FC = () => {
    return (
        <section className="glass-main p-4 rounded-3xl flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-grow w-full">
                <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
                    search
                </span>
                <input
                    type="text"
                    placeholder="Search devices (e.g. Projector, HDMI...)"
                    className="w-full bg-white/60 dark:bg-slate-900/40 border-none rounded-2xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-navy-deep outline-none backdrop-blur-md"
                />
            </div>

            <button className="w-full md:w-14 h-14 btn-navy-gradient text-white rounded-2xl flex items-center justify-center">
                <span className="material-symbols-outlined">search</span>
            </button>
        </section>
    );
};

export default SearchBar;