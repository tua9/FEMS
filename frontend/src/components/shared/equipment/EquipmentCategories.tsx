import React from "react";
import { LayoutGrid, Laptop, Cpu, TabletSmartphone, MonitorCog, Camera, Mic } from "lucide-react";

interface EquipmentCategoriesProps {
  activeCategory: string;
  onCategoryChange: (id: string) => void;
}

const categories = [
  { id: "all",     label: "All",       icon: LayoutGrid },
  { id: "laptop",  label: "Laptop",    icon: Laptop },
  { id: "iot_kit", label: "IoT Kit",   icon: Cpu },
  { id: "tablet",  label: "Tablet",    icon: TabletSmartphone },
  { id: "pc_lab",  label: "PC Lab",    icon: MonitorCog },
  { id: "camera",  label: "Camera",    icon: Camera },
  { id: "audio",   label: "Audio",     icon: Mic },
];

export const EquipmentCategories: React.FC<EquipmentCategoriesProps> = ({
  activeCategory,
  onCategoryChange,
}) => {
  return (
    <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-[1rem] mb-[3rem]">
      {categories.map((category) => {
        const Icon = category.icon;
        const isActive = activeCategory === category.id;
        return (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`${
              isActive ? "extreme-glass" : "glass-card hover:bg-white/60 dark:hover:bg-slate-800/60"
            } rounded-[2rem] p-[2rem] flex flex-col items-center justify-center gap-[0.75rem] shadow-sm hover:shadow-lg dark:hover:shadow-slate-900/40 transition-all duration-300 hover:scale-105 active:scale-95`}
          >
            <Icon
              className={`w-[2rem] h-[2rem] ${isActive ? "text-[#1E2B58] dark:text-white" : "text-[#1E2B58]/60 dark:text-white/60"}`}
              strokeWidth={2}
            />
            <span
              className={`text-[0.75rem] font-black uppercase tracking-widest ${
                isActive ? "text-[#1E2B58] dark:text-white" : "text-[#1E2B58]/60 dark:text-white/60"
              }`}
            >
              {category.label}
            </span>
          </button>
        );
      })}
    </section>
  );
};
