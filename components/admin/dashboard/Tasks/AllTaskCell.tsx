import React from 'react';
import { Clock } from 'lucide-react';

type AllTaskRemainingCellProps = {
  remaining: string;
  expired?: boolean;
};

export default function AllTaskRemainingCell({ remaining, expired }: AllTaskRemainingCellProps) {
  if (expired) {
    return (
      <span className="flex items-center gap-1.5 text-sm text-red-500 font-medium">
        <Clock className="w-4 h-4" />
        Expired
      </span>
    );
  }

  return (
    <span className="flex items-center gap-1.5 text-sm text-orange-500 font-medium">
      <Clock className="w-4 h-4" />
      {remaining}
    </span>
  );
}