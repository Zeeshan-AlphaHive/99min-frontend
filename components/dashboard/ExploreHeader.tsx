"use client";

import React from "react";
import { Filter, TrendingUp } from "lucide-react";
import { useI18n } from "@/contexts/i18n-context";

interface ExploreHeaderProps {
  activeTasksCount?: number;
  onFilterClick?: () => void;
}

const ExploreHeader: React.FC<ExploreHeaderProps> = ({
  activeTasksCount = 0,
  onFilterClick,
}) => {
  const { tr } = useI18n();

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-textGray text-sm font-medium">
          {tr("Discover tasks ending soon")}
        </h1>
        {/* <button
          onClick={onFilterClick}
          className="flex items-center bg-lightGrey gap-2  border border-gray-300 px-4 py-2 rounded-xl  text-sm font-bold text-textBlack hover:bg-gray-50 transition-colors"
        >
          <Filter className="w-5 h-5 " />
          {tr("Filters")}
        </button> */}
      </div>

      <div className="flex items-center gap-2 text-textBlack font-bold mb-6">
        <TrendingUp className="w-5 h-5 text-green-500" />
        <span>{tr(`${activeTasksCount} active tasks`)}</span>
      </div>
    </>
  );
};

export default ExploreHeader;

