"use client";

import React from 'react';
import { useI18n } from '@/contexts/i18n-context';

interface QuickSelectButtonsProps {
  options: number[];
  selected: number;
  onChange: (value: number) => void;
  unit?: string;
}

const QuickSelectButtons: React.FC<QuickSelectButtonsProps> = ({
  options,
  selected,
  onChange,
  unit = 'mi',
}) => {
  const { tr } = useI18n();
  return (
    <div className="flex gap-3">
      {options.map((option) => {
        const isSelected = option === selected;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`flex-1 px-4 py-2.5  max-w-[80px] rounded-xl font-bold text-sm transition-colors ${
              isSelected
                ? 'bg-orange text-white'
                : 'bg-inputBg text-textBlack  hover:bg-gray-50'
            }`}
          >
            {option} {tr(unit)}
          </button>
        );
      })}
    </div>
  );
};

export default QuickSelectButtons;

