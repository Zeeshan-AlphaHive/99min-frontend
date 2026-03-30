'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';

export type FilterOption = { label: string; value: string };

export type ToolbarFilter = {
  placeholder: string;
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
};

type TableToolbarProps = {
  searchValue: string;
  onSearchChange: (v: string) => void;
  searchPlaceholder?: string;
  filters?: ToolbarFilter[];
};

function DropdownFilter({ filter }: { filter: ToolbarFilter }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selected = filter.options.find((o) => o.value === filter.value);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-lg text-sm text-textBlack bg-white hover:bg-gray-50 transition-colors shadow-sm whitespace-nowrap"
      >
        {selected?.label ?? filter.placeholder}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-1.5 w-40 bg-white border border-gray-200 rounded-xl shadow-lg z-10 overflow-hidden py-1">
          {filter.options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { filter.onChange(opt.value); setOpen(false); }}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                filter.value === opt.value
                  ? 'text-orange font-medium bg-orange-50'
                  : 'text-textBlack hover:bg-gray-50'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function TableToolbar({
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search...',
  filters = [],
}: TableToolbarProps) {
  return (
    <div className="w-full flex items-center gap-3 mb-4">
      {/* Search — flex row so icon and text are always on same line */}
      <div
        className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg bg-white focus-within:ring-2 focus-within:ring-orange/30 transition"
        style={{ width: '224px', minWidth: '224px', maxWidth: '224px' }}
      >
        <Search className="w-4 h-4 text-textGray shrink-0" />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="flex-1 min-w-0 text-sm text-textBlack placeholder:text-textGray bg-transparent focus:outline-none"
        />
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Filters */}
      {filters.length > 0 && (
        <div className="flex items-center gap-2">
          {filters.map((f) => (
            <DropdownFilter key={f.placeholder} filter={f} />
          ))}
        </div>
      )}
    </div>
  );
}