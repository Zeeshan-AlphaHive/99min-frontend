'use client';

import React, { useMemo, useState } from 'react';
import type { IdentityHubUser } from './types';
import IdentityHubHeader from './IdentityHubHeader';
import IdentityHubToolbar from './IdentityHubToolbar';
import IdentityHubTable from './IdentityHubTable';
import OnboardIdentityModal from './OnboardIdentityModal';

const usersData: IdentityHubUser[] = [
  {
    id: 1,
    avatar: '/assets/images/dog.jpg',
    address: '1901 Thornridge Cir. Shiloh, Hawaii 81...',
    email: 'john@example.com',
    accountLevel: 'TechCrap Solutions',
    status: 'Completed',
    onboarded: 'info@gmail.com',
  },
  {
    id: 2,
    avatar: '/assets/images/dog.jpg',
    address: '3891 Ranchview Dr. Richardson, Calif...',
    email: 'john@example.com',
    accountLevel: 'TechCrap Solutions',
    status: 'Completed',
    onboarded: 'info@gmail.com',
  },
  {
    id: 3,
    avatar: '/assets/images/dog.jpg',
    address: '3891 Ranchview Dr. Richardson, Calif...',
    email: 'john@example.com',
    accountLevel: 'TechCrap Solutions',
    status: 'Completed',
    onboarded: 'info@gmail.com',
  },
  {
    id: 4,
    avatar: '/assets/images/dog.jpg',
    address: '2715 Ash Dr. San Jose, South Dakota...',
    email: 'john@example.com',
    accountLevel: 'TechCrap Solutions',
    status: 'Completed',
    onboarded: 'info@gmail.com',
  },
  {
    id: 5,
    avatar: '/assets/images/dog.jpg',
    address: '2972 Westheimer Rd. Santa Ana, Illin...',
    email: 'john@example.com',
    accountLevel: 'TechCrap Solutions',
    status: 'Completed',
    onboarded: 'info@gmail.com',
  },
  {
    id: 6,
    avatar: '/assets/images/dog.jpg',
    address: '2118 Thornridge Cir. Syracuse, Connec...',
    email: 'john@example.com',
    accountLevel: 'TechCrap Solutions',
    status: 'Completed',
    onboarded: 'info@gmail.com',
  },
  {
    id: 7,
    avatar: '/assets/images/dog.jpg',
    address: '2464 Royal Ln. Mesa, New Jersey 45...',
    email: 'john@example.com',
    accountLevel: 'TechCrap Solutions',
    status: 'Completed',
    onboarded: 'info@gmail.com',
  },
];

export default function IdentityHub() {
  const [searchValue, setSearchValue] = useState('');
  const [isOnboardOpen, setIsOnboardOpen] = useState(false);

  const users = useMemo(() => {
    const query = searchValue.trim().toLowerCase();
    if (!query) return usersData;

    return usersData.filter((user) => {
      const haystack = [
        user.address,
        user.email,
        user.accountLevel,
        user.status,
        user.onboarded,
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [searchValue]);

  return (
    <div className="max-w-7xl mx-auto">
      <IdentityHubHeader onOpenOnboardModal={() => setIsOnboardOpen(true)} />
      <IdentityHubToolbar searchValue={searchValue} onSearchChange={setSearchValue} />
      <IdentityHubTable users={users} />

      <OnboardIdentityModal isOpen={isOnboardOpen} onClose={() => setIsOnboardOpen(false)} />
    </div>
  );
}
