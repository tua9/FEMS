
import React from 'react';
import { EQUIPMENT } from './constants';

const LecturerEquipment: React.FC = () => {
  return (
    <div className="pt-32 pb-10 px-6 max-w-[1400px] mx-auto animate-in fade-in duration-500">
      <header className="mb-10">
        <h2 className="text-5xl font-extrabold mb-3 text-[#1E2B58] dark:text-white">Equipment Catalog</h2>
        <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">
          Explore and reserve university resources with our enhanced Lecturer Portal.
        </p>
      </header>

      <section className="extreme-glass rounded-full px-6 py-2.5 flex flex-wrap items-center gap-4 mb-8">
        <div className="flex-1 min-w-[300px] flex items-center gap-3">
          <span className="material-symbols-outlined opacity-40 text-[#1E2B58] dark:text-white">search</span>
          <input
            className="bg-transparent border-none focus:ring-0 w-full placeholder:text-[#1E2B58]/40 font-medium text-[#1E2B58] dark:text-white"
            placeholder="Search devices (e.g. Laptop, Projector, Tablet...)"
            type="text"
          />
        </div>
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 cursor-pointer hover:opacity-70 text-[#1E2B58] dark:text-white">
            <span className="text-sm font-bold">Device Type</span>
            <span className="material-symbols-outlined text-sm">expand_more</span>
          </div>
          <button className="navy-gradient-btn px-10 py-3 rounded-full font-bold text-sm">Filter</button>
        </div>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {EQUIPMENT.map((item) => (
          <div key={item.id} className="flex flex-col gap-6">
            <div className="glass-card aspect-[4/3] rounded-[32px] relative flex items-center justify-center p-8 group overflow-hidden">
              <span className={`absolute top-6 right-6 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${item.status === 'AVAILABLE' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                {item.status}
              </span>
              <span className="material-symbols-outlined text-8xl text-[#1E2B58] dark:text-white opacity-20 transition-transform group-hover:scale-110">
                {item.category === 'laptop' ? 'laptop' : item.category === 'projector' ? 'camera_outdoor' : 'tablet_android'}
              </span>
            </div>
            <div className="px-2">
              <h4 className="font-bold text-xl text-[#1E2B58] dark:text-white mb-1">{item.name}</h4>
              <p className="text-[11px] font-bold uppercase tracking-widest opacity-60 text-slate-500">
                {item.assetId} • {item.location}
              </p>
            </div>
            <button
              disabled={item.status !== 'AVAILABLE'}
              className={`${item.status === 'AVAILABLE' ? 'navy-gradient-btn' : 'bg-white/40 text-slate-400 cursor-not-allowed border border-white/20'
                } py-5 rounded-[24px] font-bold flex items-center justify-center gap-2`}
            >
              {item.status === 'AVAILABLE' ? (
                <>Request Borrow <span className="material-symbols-outlined text-sm">arrow_forward</span></>
              ) : 'Unavailable'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LecturerEquipment;
