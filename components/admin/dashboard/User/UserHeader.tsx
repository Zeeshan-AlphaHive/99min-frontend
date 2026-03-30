'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, SlidersHorizontal } from 'lucide-react';

type UserFilter = 'All Task' | 'Active' | 'Suspended' | 'Removed';
const FILTER_OPTIONS: UserFilter[] = ['All Task', 'Active', 'Suspended', 'Removed'];

type UserManagementHeaderProps = {
  onFilterChange?: (filter: UserFilter) => void;
};

export default function UserManagementHeader({ onFilterChange }: UserManagementHeaderProps) {
  const [selected, setSelected] = useState<UserFilter>('All Task');
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (option: UserFilter) => {
    setSelected(option);
    setOpen(false);
    onFilterChange?.(option);
  };

  return (
    <div className="flex items-center justify-between mb-4 sm:mb-6">
  <h1 className="text-2xl font-semibold text-textBlack mb-1">User Management</h1>

  <div className="flex items-center gap-2">
    <button
      type="button"
      className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-textBlack bg-white hover:bg-gray-50 transition-colors shadow-sm"
    >
      <SlidersHorizontal className="w-4 h-4" />
      <span className="hidden sm:inline">Filters</span>
    </button>

    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-textBlack bg-white hover:bg-gray-50 transition-colors shadow-sm"
      >
        {selected}
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-1.5 w-40 bg-white border border-gray-200 rounded-xl shadow-lg z-10 overflow-hidden py-1">
          {FILTER_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => handleSelect(option)}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                selected === option
                  ? 'text-orange font-medium bg-orange-50'
                  : 'text-textBlack hover:bg-gray-50'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  </div>
</div>
  );
}