"use client";

import React from 'react';
import { Monitor, Palette, Package, PawPrint, Globe, Activity } from 'lucide-react';
import CategoryButton from '@/components/shared/CategoryButton';
import { useI18n } from '@/contexts/i18n-context';

export interface Category {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const categories: Category[] = [
  { id: 'errands', label: 'Errands', icon: <span>🏃</span> },
  { id: 'tech', label: 'Tech', icon: <span>💻</span> },
  { id: 'design', label: 'Design', icon: <span>🎨</span> },
  { id: 'moving', label: 'Moving', icon: <span>📦</span> },
  { id: 'pet-care', label: 'Pet Care', icon: <span>🐕</span> },
  // { id: 'translation', label: 'Translation', icon: <span>🌍</span> },
];

interface CategorySelectorProps {
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  selectedCategory,
  onCategoryChange,
}) => {
  const { tr } = useI18n();
  return (
    <div className="mb-6">
      <label className="block text-textBlack text-sm font-bold mb-3 ml-1">
        {tr("Category")}
      </label>
      <div className="flex flex-wrap gap-3">
        {categories.map((category) => {
          const isActive = selectedCategory === category.id;
          return (
            <CategoryButton
              key={category.id}
              label={tr(category.label)}
              icon={category.icon}
              active={isActive}
              onClick={() => onCategoryChange(category.id)}
              variant="square"
            />
          );
        })}
      </div>
    </div>
  );
};

export default CategorySelector;
export { categories };

