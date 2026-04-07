"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, Search } from "lucide-react";

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
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selected = filter.options.find((o) => o.value === filter.value);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="flex items-center justify-between gap-2 w-full sm:w-auto px-3 py-2 border border-gray-200 rounded-lg text-sm text-textBlack bg-white hover:bg-gray-50 transition-colors shadow-sm"
      >
        <span className="truncate max-w-[140px]">
          {selected?.label ?? filter.placeholder}
        </span>

        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-1.5 w-full sm:w-40 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden py-1">
          {filter.options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                filter.onChange(opt.value);
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                filter.value === opt.value
                  ? "text-orange font-medium bg-orange-50"
                  : "text-textBlack hover:bg-gray-50"
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
  searchPlaceholder = "Search...",
  filters = [],
}: TableToolbarProps) {
  return (
    <div className="w-full mb-4 flex flex-col sm:flex-row sm:items-center gap-3">

      {/* SEARCH */}
      <div className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg bg-white focus-within:ring-2 focus-within:ring-orange/30 transition w-full sm:w-[224px]">
        <Search className="w-4 h-4 text-textGray shrink-0" />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="flex-1 min-w-0 text-sm text-textBlack placeholder:text-textGray bg-transparent focus:outline-none"
        />
      </div>

      {/* FILTERS */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
        {filters.map((f) => (
          <DropdownFilter key={f.placeholder} filter={f} />
        ))}
      </div>
    </div>
  );
}