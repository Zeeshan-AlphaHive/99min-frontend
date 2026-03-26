'use client';

import React from 'react';
import { ChevronDown, Download, Search } from 'lucide-react';

type IdentityHubToolbarProps = {
  searchValue: string;
  onSearchChange: (value: string) => void;
};

export default function IdentityHubToolbar({ searchValue, onSearchChange }: IdentityHubToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
      <div className="relative w-full sm:max-w-xs">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-textGray">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search..."
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-inputBg text-textBlack placeholder-textGray focus:outline-none focus:ring-2 focus:ring-orange focus:bg-white transition-all"
        />
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto">
        <button
          type="button"
          className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-textBlack hover:bg-gray-50 transition-colors bg-white"
        >
          All Filters
          <ChevronDown className="w-4 h-4 text-textGray" />
        </button>

        <button
          type="button"
          className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-textBlack hover:bg-gray-50 transition-colors bg-white"
        >
          <Download className="w-4 h-4 text-textGray" />
          Export Assets
        </button>
      </div>
    </div>
  );
}
