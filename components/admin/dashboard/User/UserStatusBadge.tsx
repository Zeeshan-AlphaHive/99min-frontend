import React from 'react';
import type { UserStatus } from './types';

const statusStyles: Record<UserStatus, string> = {
  Active: 'bg-green-100 text-green-600',
  Suspended: 'bg-red-100 text-red-500',
  Removed: 'bg-gray-100 text-gray-600',
};

export default function UserManagementStatusBadge({ status }: { status: UserStatus }) {
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-medium ${statusStyles[status]}`}>
      {status}
    </span>
  );
}