import CategoryFilter from '@/components/student/equipment/CategoryFilter';
import EquipmentGrid from '@/components/student/equipment/EquipmentGrid';
import EquipmentSearchFilter from '@/components/student/equipment/EquipmentSearchFilter';
import Pagination from '@/components/student/equipment/Pagination';
import React, { useState } from 'react';


const EquipmentList: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  return (
    <div className="max-w-7xl mx-auto px-6 space-y-12">
      {/* Header */}
      <div className="mb-12 text-left">
        <h1 className="text-4xl font-extrabold text-[var(--navy-deep)] dark:text-white mb-2">
          Equipment Catalog
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-base">
          Explore and reserve university resources with our enhanced Student Portal.
        </p>
      </div>

      {/* Search + Filter */}
      <EquipmentSearchFilter />

      {/* Category Tabs */}
      <CategoryFilter
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      {/* Equipment Grid */}
      <EquipmentGrid activeCategory={activeCategory} />

      {/* Pagination */}
      <Pagination />
    </div>
  );
};

export default EquipmentList;