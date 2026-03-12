import React from 'react';
import { LayoutGrid, Laptop, Projector, TabletSmartphone, Monitor, Camera, Mic } from 'lucide-react';

const categories = [
    { id: 'all',       label: 'All',       icon: LayoutGrid       },
    { id: 'laptop',    label: 'Laptop',    icon: Laptop           },
    { id: 'projector', label: 'Projector', icon: Projector        },
    { id: 'tablet',    label: 'Tablet',    icon: TabletSmartphone },
    { id: 'monitor',   label: 'Monitor',   icon: Monitor          },
    { id: 'camera',    label: 'Camera',    icon: Camera           },
    { id: 'audio',     label: 'Audio',     icon: Mic              },
];

interface EquipmentCategoriesProps {
    activeCategory: string;
    onCategoryChange: (id: string) => void;
}

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
                        className={`
                            dashboard-card
                            ${isActive ? 'ring-2 ring-[#1E2B58]/30 dark:ring-white/30 bg-white/70 dark:bg-slate-800/70' : 'hover:bg-white/60 dark:hover:bg-slate-800/60'} 
                            rounded-[1.5rem] md:rounded-[2rem] p-[1.5rem] md:p-[2rem] 
                            flex flex-col items-center justify-center gap-[0.75rem] 
                            shadow-sm hover:shadow-lg dark:hover:shadow-slate-900/40 
                            transition-all duration-300
                            hover:scale-105 active:scale-95
                        `}
                    >
                        <div className="w-[2rem] h-[2rem] flex items-center justify-center">
                            <Icon
                                className={`w-[1.5rem] md:w-[2rem] h-[1.5rem] md:h-[2rem] ${isActive ? 'text-[#1E2B58] dark:text-white' : 'text-[#1E2B58]/60 dark:text-white/60'} transition-colors`}
                                strokeWidth={2}
                            />
                        </div>
                        <span className={`text-[0.625rem] md:text-[0.75rem] font-black uppercase tracking-widest ${isActive ? 'text-[#1E2B58] dark:text-white' : 'text-[#1E2B58]/60 dark:text-white/60'} transition-opacity`}>
                            {category.label}
                        </span>
                    </button>
                );
            })}
        </section>
    );
};
