"use client";

import React, { ReactNode } from 'react';

interface CategoryButtonProps {
  label: string;
  icon?: ReactNode | React.ElementType; // Changed ComponentType to ElementType for broader support
  active?: boolean;
  onClick?: () => void;
  variant?: 'rounded' | 'square';
}

const CategoryButton: React.FC<CategoryButtonProps> = ({
  label,
  icon,
  active = false,
  onClick,
  variant = 'rounded',
}) => {
  const roundedClass = variant === 'rounded' ? 'rounded-full' : 'rounded-xl';

  const renderIcon = (): ReactNode => {
    if (!icon) return null;
    
    // 1. If it is already a valid React Element (e.g., <Icon /> was passed), return it.
    if (React.isValidElement(icon)) {
      return icon;
    }

    // 2. Otherwise, treat it as a Component (function or object) and render it.
    // This handles Lucide icons which might be objects ({ $$typeof, render })
    const IconComponent = icon as React.ElementType;
    return <IconComponent className={`w-5 h-5 ${active ? 'text-white' : 'text-textBlack'}`} />;
  };

  return (
    <button
      onClick={onClick}
      type="button"
      className={`flex items-center gap-2 px-4 py-2.5 ${roundedClass} text-sm font-bold transition-colors whitespace-nowrap cursor-pointer
        ${active
          ? 'bg-orange text-white'
          : 'bg-white text-textBlack border border-gray-200 hover:bg-gray-50'
        }`}
    >
      {renderIcon()}
      {label}
    </button>
  );
};

export default CategoryButton;