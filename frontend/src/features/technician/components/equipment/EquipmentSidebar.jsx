import React from 'react';
import CategoryList from './CategoryList';
import StorageStatus from './StorageStatus';

const EquipmentSidebar = ({
 activeCategory,
 storagePercentage,
 onCategorySelect,
}) => (
 <aside className="w-full md:w-64 space-y-6 flex-shrink-0">
 <CategoryList activeCategory={activeCategory} onSelect={onCategorySelect} />
 <StorageStatus percentage={storagePercentage} />
 </aside>
);

export default EquipmentSidebar;
