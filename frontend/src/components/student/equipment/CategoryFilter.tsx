import React from 'react';

interface Category {
    id: string;
    icon: string;
}

interface CategoryFilterProps {
    activeCategory: string;
    onCategoryChange: (category: string) => void;
}

const categories: Category[] = [
    { id: 'All', icon: 'grid_view' },
    { id: 'Laptop', icon: 'laptop_mac' },
    { id: 'Projector', icon: 'videocam' },
    { id: 'Tablet', icon: 'tablet_mac' },
    { id: 'Monitor', icon: 'desktop_windows' },
    { id: 'Camera', icon: 'camera' },
    { id: 'Audio', icon: 'mic' },
];

const CategoryFilter: React.FC<CategoryFilterProps> = ({ activeCategory, onCategoryChange }) => {
    return (
        <section className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-4">
            {categories.map((cat) => (
                <button
                    key={cat.id}
                    onClick={() => onCategoryChange(cat.id)}
                    className={`flex flex-col items-center justify-center gap-2 p-5 rounded-2xl transition-all duration-300 border ${activeCategory === cat.id
                            ? 'bg-white shadow-xl text-navy-deep border-white scale-105'
                            : 'bg-white/20 text-slate-600 hover:bg-white/50 border-white/40'
                        }`}
                >
                    <span className="material-symbols-outlined text-2xl">{cat.icon}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest">{cat.id}</span>
                </button>
            ))}
        </section>
    );
};

export default CategoryFilter;