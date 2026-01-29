import React from 'react';

interface Category {
    id: string;
    icon: string;
}

interface CategorySelectorProps {
    categories: Category[];
    selectedCategory: string;
    onSelect: (category: string) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
    categories,
    selectedCategory,
    onSelect,
}) => {
    return (
        <div className="space-y-4">
            <h3 className="text-base font-extrabold text-slate-800 dark:text-white">Select Category</h3>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        type="button"
                        onClick={() => onSelect(cat.id)}
                        className={`flex flex-col items-center justify-center gap-2 py-5 rounded-2xl transition-all ${selectedCategory === cat.id
                            ? 'bg-white dark:bg-slate-700 shadow-lg border-2 border-navy-deep dark:border-slate-500 text-navy-deep dark:text-slate-200'
                            : 'bg-white/40 dark:bg-slate-800/30 border border-transparent dark:border-slate-700/30 text-slate-500 dark:text-slate-400'
                            }`}
                    >
                        <span className="material-symbols-outlined text-2xl">{cat.icon}</span>
                        <span className="text-[9px] font-bold uppercase tracking-widest">{cat.id}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CategorySelector;