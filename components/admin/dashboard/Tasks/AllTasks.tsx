'use client';

import React from 'react';
import AllTaskHeader from './AllTaskHeader';
import AllTaskTable from './AllTaskTable';
import type { TaskRow } from './types';

const tasksData: TaskRow[] = [
  {
    id: 1,
    avatar: '/assets/images/Avatar.png',
    title: 'Fix leaky faucet...',
    description: 'Kitchen sink is asking...',
    budget: '$50',
    location: 'New York',
    remaining: '45m',
    interested: 12,
    status: 'Active',
  },
  {
    id: 2,
    avatar: '/assets/images/Avatar.png',
    title: 'Deliver groceries...',
    description: 'Need someone to pick up...',
    budget: '$47',
    location: 'Brooklyn',
    remaining: '1h 20m',
    interested: 8,
    status: 'Active',
  },
  {
    id: 3,
    avatar: '/assets/images/Avatar.png',
    title: 'Clean 2BR apartme',
    description: 'Deep clean needed...',
    budget: '$55',
    location: 'Queens',
    remaining: 'Expired',
    remainingExpired: true,
    interested: 11,
    status: 'Expired',
  },
  {
    id: 4,
    avatar: '/assets/images/Avatar.png',
    title: 'Setup WiFi router',
    description: 'Help with mesh network...',
    budget: '$66',
    location: 'Manhattan',
    remaining: '2h 10m',
    interested: 55,
    status: 'Active',
  },
  {
    id: 5,
    avatar: '/assets/images/Avatar.png',
    title: 'Deliver groceries...',
    description: 'Need someone to pick up...',
    budget: '$77',
    location: 'New York',
    remaining: '45m',
    interested: 15,
    status: 'Pending',
  },
  {
    id: 6,
    avatar: '/assets/images/Avatar.png',
    title: 'Deliver groceries...',
    description: 'Need someone to pick up...',
    budget: '$70',
    location: 'Manhattan',
    remaining: '2h 10m',
    interested: 77,
    status: 'Pending',
  },
  {
    id: 7,
    avatar: '/assets/images/Avatar.png',
    title: 'Deliver groceries...',
    description: 'Need someone to pick up...',
    budget: '$90',
    location: 'New York',
    remaining: '45m',
    interested: 11,
    status: 'Pending',
  },
];

type TaskFilter = 'All Task' | 'Active' | 'Expired' | 'Removed';

export default function AllTask() {
  const [filter, setFilter] = React.useState<TaskFilter>('All Task');

  const filteredTasks = tasksData.filter((task) => {
    if (filter === 'All Task') return true;
    if (filter === 'Removed') return false;
    return task.status === filter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <AllTaskHeader onFilterChange={setFilter} />
      <AllTaskTable tasks={filteredTasks} />
    </div>
  );
}