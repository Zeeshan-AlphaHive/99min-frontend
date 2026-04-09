'use client';
import React, { useState } from 'react';
import UserManagementHeader from './UserHeader';
import UserManagementTable from './UserTable';
import { useAdminUsers, useUpdateUserStatus } from '@/hooks/UseAdminUsers';
import type { UserStatus, UserPlan } from './types';

type UserFilter = 'All Task' | 'Active' | 'Suspended' | 'Removed';

const filterToStatus = (f: UserFilter): string | undefined => ({
  Active: 'active',
  Suspended: 'suspended',
  Removed: 'deleted',
} as Record<string, string>)[f];

export default function UserManagement() {
  const [filter, setFilter] = useState<UserFilter>('All Task');
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useAdminUsers({
    page,
    limit: 20,
    status: filterToStatus(filter),
  });

  const { mutate: updateStatus } = useUpdateUserStatus();

  const handleAction = (userId: string, action: 'active' | 'suspend') => {
    updateStatus({
      userId,
      status: action === 'active' ? 'active' : 'suspended',
    });
  };

  const mappedUsers = (data?.data.items ?? []).map((u) => ({
    id: u._id,
    name: u.name,
    email: u.email,
  avatar: u.avatar ?? '',
    plan: (u.plan ?? 'Free') as UserPlan,
    tasksPosted: u.tasksPosted ?? 0,
    status: (u.status.charAt(0).toUpperCase() + u.status.slice(1)) as UserStatus,
    joinDate: new Date(u.createdAt).toISOString().split('T')[0],
  }));

  if (isLoading) return <div className="p-6 text-sm text-gray-500">Loading users...</div>;
  if (isError)   return <div className="p-6 text-sm text-red-500">Failed to load users.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <UserManagementHeader onFilterChange={(f) => { setFilter(f); setPage(1); }} />
      <UserManagementTable
        users={mappedUsers}
        totalResults={data?.data.pagination.totalItems}
        currentPage={data?.data.pagination.page ?? 1}
        totalPages={data?.data.pagination.totalPages ?? 1}
        onPageChange={setPage}
        onAction={handleAction}
      />
    </div>
  );
}