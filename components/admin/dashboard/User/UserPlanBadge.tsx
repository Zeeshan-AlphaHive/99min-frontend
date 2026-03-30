import React from 'react';
import type { UserPlan } from './types';

const planStyles: Record<UserPlan, string> = {
  Pro: 'bg-orange-100 text-orange-500',
  Business: 'bg-blue-100 text-blue-500',
  Free: 'bg-gray-100 text-gray-500',
};

export default function UserManagementPlanBadge({ plan }: { plan: UserPlan }) {
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-medium ${planStyles[plan]}`}>
      {plan}
    </span>
  );
}