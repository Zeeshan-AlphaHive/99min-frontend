import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function AdminsPagination() {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-gray-200 bg-white gap-4">
      <span className="text-sm text-textGray">Showing 1 to 5 of 2,846 result</span>

      <div className="flex items-center gap-1">
        <button type="button" className="flex items-center text-sm text-textGray hover:text-textBlack px-2 py-1 transition-colors">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </button>

        <div className="flex items-center gap-1 mx-2">
          <button type="button" className="w-8 h-8 flex items-center justify-center text-sm text-textGray hover:bg-gray-100 rounded-md transition-colors">
            1
          </button>
          <button type="button" className="w-8 h-8 flex items-center justify-center text-sm font-medium bg-orange text-white rounded-md shadow-sm">
            2
          </button>
          <button type="button" className="w-8 h-8 flex items-center justify-center text-sm text-textGray hover:bg-gray-100 rounded-md transition-colors">
            3
          </button>
          <span className="w-8 h-8 flex items-center justify-center text-sm text-textGray">...</span>
        </div>

        <button
          type="button"
          className="flex items-center text-sm text-textGray hover:text-textBlack px-2 py-1 transition-colors bg-gray-50 rounded-md border border-gray-200 hover:bg-gray-100"
        >
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );
}
