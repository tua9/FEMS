import { Check, ChevronDown, Search } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";

interface DropdownOption { value: string; label: string }

interface EquipmentFilterProps {
  searchText: string;
  onSearchChange: (val: string) => void;
  typeFilter: string;
  onTypeChange: (val: string) => void;
  locationFilter: string;
  onLocationChange: (val: string) => void;
  onFilter: () => void;
}

// static options
const TYPES: DropdownOption[] = [
  { value: "all-types", label: "All Types" },
  { value: "laptop", label: "Laptop" },
  { value: "projector", label: "Projector" },
  { value: "tablet", label: "Tablet" },
  { value: "monitor", label: "Monitor" },
  { value: "camera", label: "Camera" },
  { value: "audio", label: "Audio" },
];

const LOCATIONS: DropdownOption[] = [
  { value: "all-locations", label: "All Locations" },
  { value: "gamma", label: "Gamma Building" },
  { value: "alpha", label: "Alpha Building" },
];

export const EquipmentFilter: React.FC<EquipmentFilterProps> = ({
  searchText,
  onSearchChange,
  typeFilter,
  onTypeChange,
  locationFilter,
  onLocationChange,
  onFilter,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") onFilter();
  };

  return (
    <section className="extreme-glass rounded-[2rem] md:rounded-full px-[1.5rem] py-[0.5rem] flex flex-col md:flex-row flex-wrap items-stretch md:items-center gap-[1rem] mb-[3rem]">
      <div className="flex-1 min-w-0 md:min-w-[18.75rem] flex items-center gap-[0.75rem] bg-white/20 dark:bg-slate-800/40 px-[1rem] py-[0.5rem] rounded-full border border-white/30 dark:border-slate-700/50 focus-within:ring-2 focus-within:ring-[#1E2B58]/20 transition-all">
        <Search className="w-[1.25rem] h-[1.25rem] opacity-40 text-[#1E2B58] dark:text-white shrink-0" />
        <input
          className="bg-transparent border-none focus:ring-0 w-full placeholder:text-[#1E2B58]/40 dark:placeholder:text-white/40 font-medium text-[#1E2B58] dark:text-white outline-none text-[1rem]"
          placeholder="Search devices (e.g. Laptop, Projector, Tablet...)"
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

      {/* Location Dropdown */}
      <select
        value={locationFilter}
        onChange={(e) => onLocationChange(e.target.value)}
        className="rounded-full px-3 py-1 text-[0.875rem] font-bold border border-white/30 dark:border-white/10 bg-white/20 dark:bg-slate-800/40"
      >
        {LOCATIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

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