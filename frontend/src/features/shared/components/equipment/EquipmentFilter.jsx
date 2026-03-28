import { Search } from "lucide-react";
import React from "react";

// static options
const TYPES= [
 { value: "all-types", label: "All Types" },
 { value: "laptop", label: "Laptop" },
 { value: "iot_kit", label: "IoT Kit" },
 { value: "tablet", label: "Tablet" },
 { value: "pc_lab", label: "PC Lab" },
 { value: "camera", label: "Camera" },
 { value: "audio", label: "Audio" },
];

const STATUS_OPTIONS= [
 { value: "all-statuses", label: "All Statuses" },
 { value: "available", label: "Available" },
 { value: "maintenance", label: "Maintenance" },
 { value: "broken", label: "Broken" },
];

export const EquipmentFilter = ({
 searchText,
 onSearchChange,
 typeFilter,
 onTypeChange,
 statusFilter,
 onStatusChange,
 onFilter,
}) => {
 const handleKeyDown = (e) => {
 if (e.key === "Enter") onFilter();
 };

 return (
 <section className="extreme-glass rounded-[2rem] md:rounded-full px-[1.5rem] py-[0.5rem] flex flex-col md:flex-row flex-wrap items-stretch md:items-center gap-[1rem] mb-[3rem]">
 <div className="flex-1 min-w-0 md:min-w-[15rem] flex items-center gap-[0.75rem] bg-white/20 dark:bg-slate-800/40 px-[1rem] py-[0.5rem] rounded-full border border-white/30 dark:border-slate-700/50 focus-within:ring-2 focus-within:ring-[#1E2B58]/20 transition-all">
 <Search className="w-[1.25rem] h-[1.25rem] opacity-40 text-[#1E2B58] dark:text-white shrink-0" />
 <input
 className="bg-transparent border-none focus:ring-0 w-full placeholder:text-[#1E2B58]/40 dark:placeholder:text-white/40 font-medium text-[#1E2B58] dark:text-white outline-none text-[1rem]"
 placeholder="Search devices..."
 type="text"
 value={searchText}
 onChange={(e) => onSearchChange(e.target.value)}
 onKeyDown={handleKeyDown}
 />
 {searchText && (
 <button
 type="button"
 onClick={() => onSearchChange("")}
 className="text-[#1E2B58]/40 dark:text-white/40 hover:text-[#1E2B58] dark:hover:text-white transition-colors shrink-0 text-lg leading-none"
 >
 ×
 </button>
 )}
 </div>

 <div className="flex flex-wrap items-center gap-[0.5rem] md:gap-[1rem]">
 {/* Type Dropdown */}
 <select
 value={typeFilter}
 onChange={(e) => onTypeChange(e.target.value)}
 className="rounded-full px-3 py-1 text-[0.875rem] font-bold border border-white/30 dark:border-white/10 bg-white/20 dark:bg-slate-800/40"
 >
 {TYPES.map((opt) => (
 <option key={opt.value} value={opt.value}>
 {opt.label}
 </option>
 ))}
 </select>

 {/* Status Dropdown */}
 <select
 value={statusFilter}
 onChange={(e) => onStatusChange(e.target.value)}
 className="rounded-full px-3 py-1 text-[0.875rem] font-bold border border-white/30 dark:border-white/10 bg-white/20 dark:bg-slate-800/40"
 >
 {STATUS_OPTIONS.map((opt) => (
 <option key={opt.value} value={opt.value}>
 {opt.label}
 </option>
 ))}
 </select>
 </div>

 <button
 type="button"
 onClick={onFilter}
 className="bg-[#1E2B58] text-white px-[2rem] py-[0.6875rem] rounded-full font-bold text-[0.875rem] transition hover:scale-105 active:scale-95 hover:shadow-lg shadow-[#1E2B58]/20 whitespace-nowrap"
 >
 Filter
 </button>
 </section>
 );
};
