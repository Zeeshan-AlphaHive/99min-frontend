'use client';
import React, { useState } from 'react';
import AllTaskHeader from './AllTaskHeader';
import AllTaskTable from './AllTaskTable';
import { useAdminTasks } from '@/hooks/UseAdminTasks';
import type { TaskStatus } from './types';
type TaskFilter = 'All Task' | 'Active' | 'Expired' | 'Removed';

const filterToStatus = (f: TaskFilter) => ({
  'Active': 'active', 'Expired': 'expired', 'Removed': 'removed'
} as Record<string, string>)[f];

const formatRemaining = (expiresAt: string) => {
  const diff = new Date(expiresAt).getTime() - Date.now();
  if (diff <= 0) return { label: 'Expired', expired: true };
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  return { label: hours > 0 ? `${hours}h ${mins % 60}m` : `${mins}m`, expired: false };
};

export default function AllTask() {
  const [filter, setFilter] = useState<TaskFilter>('All Task');
  const [page, setPage]     = useState(1);

  const { data, isLoading, isError } = useAdminTasks({
    page, limit: 20, status: filterToStatus(filter),
  });

  const mappedTasks = (data?.data.items ?? []).map((t) => {
    const { label, expired } = formatRemaining(t.expiresAt);
    return {
      id: t._id,
     avatar: t.posterUserId?.avatar ?? '',
      title: t.title,
      description: t.description,
      budget: `$${t.budget.min}–$${t.budget.max}`,
      location: t.location.label,
      remaining: label,
      remainingExpired: expired,
      interested: t.interestCount ?? 0,
status: (t.status.charAt(0).toUpperCase() + t.status.slice(1)) as TaskStatus,
    };
  });

  if (isLoading) return <div className="p-6 text-sm text-gray-500">Loading tasks...</div>;
  if (isError)   return <div className="p-6 text-sm text-red-500">Failed to load tasks.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <AllTaskHeader onFilterChange={(f) => { setFilter(f); setPage(1); }} />
      <AllTaskTable
        tasks={mappedTasks}
        totalResults={data?.data.pagination.totalItems}
        currentPage={data?.data.pagination.page ?? 1}
        totalPages={data?.data.pagination.totalPages ?? 1}
        onPageChange={setPage}
      />
    </div>
  );
}