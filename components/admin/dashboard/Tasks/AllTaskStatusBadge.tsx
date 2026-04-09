import React from 'react';
import type { TaskStatus } from './types';

type AllTaskStatusBadgeProps = {
  status: TaskStatus;
};

const statusStyles: Record<TaskStatus, string> = {
  Active: 'bg-green-100 text-green-600',
  Pending: 'bg-orange-100 text-orange-500',
  Expired: 'bg-gray-100 text-gray-500',
  Removed: 'bg-red-100 text-red-600',
};

export default function AllTaskStatusBadge({ status }: AllTaskStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-medium ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}