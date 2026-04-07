"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, SlidersHorizontal } from "lucide-react";

type UserFilter = "All Task" | "Active" | "Suspended" | "Removed";

const FILTER_OPTIONS: UserFilter[] = [
  "All Task",
  "Active",
  "Suspended",
  "Removed",
];

type UserManagementHeaderProps = {
  onFilterChange?: (filter: UserFilter) => void;
};

export default function UserManagementHeader({
  onFilterChange,
}: UserManagementHeaderProps) {
  const [selected, setSelected] = useState<UserFilter>("All Task");
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

  const handleSelect = (option: UserFilter) => {
    setSelected(option);
    setOpen(false);
    onFilterChange?.(option);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">

      {/* TITLE */}
      <h1 className="text-xl sm:text-2xl font-semibold text-textBlack">
        User Management
      </h1>

      {/* ACTIONS */}
      <div className="flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">

        {/* FILTER BUTTON */}
        <button
          type="button"
          className="flex items-center justify-center sm:justify-start gap-2 px-3 sm:px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-textBlack bg-white hover:bg-gray-50 transition-colors shadow-sm"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span className="hidden sm:inline">Filters</span>
        </button>

        {/* DROPDOWN */}
        <div className="relative" ref={ref}>
          <button
            type="button"
            onClick={() => setOpen((p) => !p)}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-textBlack bg-white hover:bg-gray-50 transition-colors shadow-sm"
          >
            <span className="truncate max-w-[90px] sm:max-w-none">
              {selected}
            </span>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                open ? "rotate-180" : ""
              }`}
            />
          </button>

          {open && (
            <div className="absolute right-0 mt-1.5 w-40 bg-white border border-gray-200 rounded-xl shadow-lg z-[9999] overflow-hidden py-1">
              {FILTER_OPTIONS.map((option) => (
                <button
                  key={option}
                  onClick={() => handleSelect(option)}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                    selected === option
                      ? "text-orange font-medium bg-orange-50"
                      : "text-textBlack hover:bg-gray-50"
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