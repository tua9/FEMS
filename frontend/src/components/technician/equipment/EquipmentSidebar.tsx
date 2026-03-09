import React from 'react';
import { AssetCategory } from '@/data/technician/mockEquipment';
import CategoryList from './CategoryList';
import StorageStatus from './StorageStatus';

interface Props {
  activeCategory: AssetCategory;
  storagePercentage: number;
  onCategorySelect: (category: AssetCategory) => void;
}

const EquipmentSidebar: React.FC<Props> = ({
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

