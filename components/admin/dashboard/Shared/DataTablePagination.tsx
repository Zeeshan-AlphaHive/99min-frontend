'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type DataTablePaginationProps = {
  totalResults: number;
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
};

export default function DataTablePagination({
  totalResults,
  currentPage,
  totalPages,
  onPageChange,
}: DataTablePaginationProps) {
  const pages = Array.from({ length: Math.min(totalPages, 3) }, (_, i) => i + 1);

  return (
   <div className="flex flex-col sm:flex-row items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-100 gap-3 sm:gap-4">
  <span className="text-sm text-textGray">
    Showing 1 to 5 of {totalResults.toLocaleString()} result
  </span>

  <div className="flex items-center gap-1">
    <button
      type="button"
      onClick={() => onPageChange?.(Math.max(1, currentPage - 1))}
      disabled={currentPage === 1}
      className="flex items-center text-sm text-textGray hover:text-textBlack px-2 py-1 transition-colors disabled:opacity-40"
    >
      <ChevronLeft className="w-4 h-4 mr-1" />
      <span className="hidden sm:inline">Previous</span>
    </button>

    <div className="flex items-center gap-1 mx-1 sm:mx-2">
      {pages.map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => onPageChange?.(page)}
          className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-sm rounded-md transition-colors ${
            page === currentPage
              ? 'font-semibold bg-orange text-white shadow-sm'
              : 'text-textGray hover:bg-gray-100'
          }`}
        >
          {page}
        </button>
      ))}
      {totalPages > 3 && (
        <span className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-sm text-textGray">
          ...
        </span>
      )}
    </div>

    <button
      type="button"
      onClick={() => onPageChange?.(Math.min(totalPages, currentPage + 1))}
      disabled={currentPage === totalPages}
      className="flex items-center text-sm text-textGray hover:text-textBlack px-2 sm:px-3 py-1 sm:py-1.5 border border-gray-200 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors disabled:opacity-40"
    >
      <span className="hidden sm:inline">Next</span>
      <ChevronRight className="w-4 h-4 ml-1" />
    </button>
  </div>
</div>
  );
}