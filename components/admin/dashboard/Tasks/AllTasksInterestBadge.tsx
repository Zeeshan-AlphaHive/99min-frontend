import React from 'react';

type AllTaskInterestBadgeProps = {
  count: number;
};

export default function AllTaskInterestBadge({ count }: AllTaskInterestBadgeProps) {
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-green-100 text-green-600">
      {count} interested
    </span>
  );
}