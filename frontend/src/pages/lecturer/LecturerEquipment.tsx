import React from "react";
import { EQUIPMENT } from "./constants";

const LecturerEquipment: React.FC = () => {
  return (
    <div className="animate-in fade-in mx-auto max-w-[1400px] px-6 pt-32 pb-10 duration-500">
      <header className="mb-10">
        <h2 className="mb-3 text-5xl font-extrabold text-[#1E2B58] dark:text-white">
          Equipment Catalog
        </h2>
        <p className="text-lg font-medium text-slate-500 dark:text-slate-400">
          Explore and reserve university resources with our enhanced Lecturer
          Portal.
        </p>
      </header>

      <section className="extreme-glass mb-8 flex flex-wrap items-center gap-4 rounded-full px-6 py-2.5">
        <div className="flex min-w-[300px] flex-1 items-center gap-3">
          <span className="material-symbols-outlined text-[#1E2B58] opacity-40 dark:text-white">
            search
          </span>
          <input
            className="w-full border-none bg-transparent font-medium text-[#1E2B58] placeholder:text-[#1E2B58]/40 focus:ring-0 dark:text-white"
            placeholder="Search devices (e.g. Laptop, Projector, Tablet...)"
            type="text"
          />
        </div>
        <div className="flex items-center gap-8">
          <div className="flex cursor-pointer items-center gap-2 text-[#1E2B58] hover:opacity-70 dark:text-white">
            <span className="text-sm font-bold">Device Type</span>
            <span className="material-symbols-outlined text-sm">
              expand_more
            </span>
          </div>
          <button className="navy-gradient-btn rounded-full px-10 py-3 text-sm font-bold">
            Filter
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {EQUIPMENT.map((item) => (
          <div key={item.id} className="flex flex-col gap-6">
            <div className="glass-card group relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-[32px] p-8">
              <span
                className={`absolute top-6 right-6 rounded-full px-3 py-1 text-[9px] font-black tracking-widest uppercase ${
                  item.status === "AVAILABLE"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {item.status}
              </span>
              <span className="material-symbols-outlined text-8xl text-[#1E2B58] opacity-20 transition-transform group-hover:scale-110 dark:text-white">
                {item.category === "laptop"
                  ? "laptop"
                  : item.category === "projector"
                    ? "camera_outdoor"
                    : "tablet_android"}
              </span>
            </div>
            <div className="px-2">
              <h4 className="mb-1 text-xl font-bold text-[#1E2B58] dark:text-white">
                {item.name}
              </h4>
              <p className="text-[11px] font-bold tracking-widest text-slate-500 uppercase opacity-60">
                {item.assetId} • {item.location}
              </p>
            </div>
            <button
              disabled={item.status !== "AVAILABLE"}
              className={`${
                item.status === "AVAILABLE"
                  ? "navy-gradient-btn"
                  : "cursor-not-allowed border border-white/20 bg-white/40 text-slate-400"
              } flex items-center justify-center gap-2 rounded-[24px] py-5 font-bold`}
            >
              {item.status === "AVAILABLE" ? (
                <>
                  Request Borrow{" "}
                  <span className="material-symbols-outlined text-sm">
                    arrow_forward
                  </span>
                </>
              ) : (
                "Unavailable"
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LecturerEquipment;
