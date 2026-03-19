"use client";

import React from 'react';
import { useI18n } from '@/contexts/i18n-context';

interface RangeSliderProps {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  label?: string;
  minLabel?: string;
  maxLabel?: string;
  unit?: string;
}

const RangeSlider: React.FC<RangeSliderProps> = ({
  min,
  max,
  value,
  onChange,
  label,
  minLabel,
  maxLabel,
  unit = 'mi',
}) => {
  const { tr } = useI18n();
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div>
      {label && (
        <label className="block text-textGray text-sm font-medium mb-2">
          {tr(label)}
        </label>
      )}
      <div className="flex items-center gap-4 mb-2">
        <div className="flex-1 relative">
          <input
            type="range"
            min={min}
            max={max}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-orange [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:bg-orange [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-0"
            style={{
              background: `linear-gradient(to right, #FF7A00 0%, #FF7A00 ${percentage}%, #E5E7EB ${percentage}%, #E5E7EB 100%)`,
            }}
          />
        </div>
        <span className="text-orange font-bold text-sm min-w-[70px] text-right">
          {value} {tr(unit)}
        </span>
      </div>
      <div className="flex justify-between text-textGray text-xs">
        <span>{minLabel ? tr(minLabel) : `${min} ${tr(unit)}`}</span>
        <span>{maxLabel ? tr(maxLabel) : `${max} ${tr(unit)}`}</span>
      </div>
    </div>
  );
};

export default RangeSlider;

