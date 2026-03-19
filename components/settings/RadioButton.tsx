"use client";

import React from 'react';
import { useI18n } from '@/contexts/i18n-context';

interface RadioButtonProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: () => void;
  value: string;
  name: string;
}

const RadioButton: React.FC<RadioButtonProps> = ({
  label,
  description,
  checked,
  onChange,
  value,
  name,
}) => {
  const { tr } = useI18n();
  return (
    <label className="flex items-start gap-3 cursor-pointer py-3 border-b border-gray-200 last:border-b-0">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="mt-1 w-5 h-5 text-orange border-gray-300 focus:ring-orange focus:ring-2 cursor-pointer"
      />
      <div className="flex-1">
        <div className="text-textBlack font-medium mb-1">{tr(label)}</div>
        {description && (
          <div className="text-textGray text-sm">{tr(description)}</div>
        )}
      </div>
    </label>
  );
};

export default RadioButton;

