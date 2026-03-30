'use client';

import React, { useState } from 'react';
import UserManagementHeader from './UserHeader';
import UserManagementTable from './UserTable';
import type { UserManagementRow } from './types';

type UserFilter = 'All Task' | 'Active' | 'Suspended' | 'Removed';

const usersData: UserManagementRow[] = [
  {
    id: 1,
    avatar: '/assets/images/Avatar.png',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    plan: 'Pro',
    tasksPosted: 12,
    status: 'Active',
    joinDate: '2024-01-15',
  },
  {
    id: 2,
    avatar: '/assets/images/Avatar.png',
    name: 'Sarah Miller',
    email: 'sarah@example.com',
    plan: 'Business',
    tasksPosted: 45,
    status: 'Active',
    joinDate: '2023-11-15',
  },
  {
    id: 3,
    avatar: '/assets/images/Avatar.png',
    name: 'Mike Ross',
    email: 'mike@example.com',
    plan: 'Free',
    tasksPosted: 2,
    status: 'Suspended',
    joinDate: '2024-01-02',
  },
  {
    id: 4,
    avatar: '/assets/images/Avatar.png',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    plan: 'Pro',
    tasksPosted: 66,
    status: 'Active',
    joinDate: '2023-11-23',
  },
  {
    id: 5,
    avatar: '/assets/images/Avatar.png',
    name: 'Sarah Miller',
    email: 'sarah@example.com',
    plan: 'Business',
    tasksPosted: 55,
    status: 'Active',
    joinDate: '2024-08-12',
  },
  {
    id: 6,
    avatar: '/assets/images/Avatar.png',
    name: 'Mike Ross',
    email: 'mike@example.com',
    plan: 'Free',
    tasksPosted: 24,
    status: 'Suspended',
    joinDate: '2024-09-23',
  },
  {
    id: 7,
    avatar: '/assets/images/Avatar.png',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    plan: 'Pro',
    tasksPosted: 71,
    status: 'Active',
    joinDate: '2025-06-04',
  },
];

export default function UserManagement() {
  const [filter, setFilter] = useState<UserFilter>('All Task');

  const filteredUsers = usersData.filter((user) => {
    if (filter === 'All Task') return true;
    if (filter === 'Removed') return false;
    return user.status === filter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <UserManagementHeader onFilterChange={setFilter} />
      <UserManagementTable users={filteredUsers} />
    </div>
  );
}