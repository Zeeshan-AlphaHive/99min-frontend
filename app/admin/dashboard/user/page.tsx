'use client';

import IdentityHubHeader from '@/components/dashboard/user/IdentityHubHeader';
import IdentityHubTable from '@/components/dashboard/user/IdentityHubTable';
import IdentityHubToolbar from '@/components/dashboard/user/IdentityHubToolbar';
import OnboardIdentityModal from '@/components/dashboard/user/OnboardIdentityModal';
import { IdentityHubUser } from '@/components/dashboard/user/types';
import React, { useMemo, useState } from 'react';

const usersData: IdentityHubUser[] = [
  {
    id: 1,
    avatar: '/api/placeholder/40/40',
    address: '1901 Thornridge Cir. Shiloh, Hawaii 81...',
    email: 'john@example.com',
    accountLevel: 'TechCrap Solutions',
    status: 'Completed',
    onboarded: 'info@gmail.com',
  },
  {
    id: 2,
    avatar: '/api/placeholder/40/40',
    address: '3891 Ranchview Dr. Richardson, Calif...',
    email: 'john@example.com',
    accountLevel: 'TechCrap Solutions',
    status: 'Completed',
    onboarded: 'info@gmail.com',
  },
  {
    id: 3,
    avatar: '/api/placeholder/40/40',
    address: '3891 Ranchview Dr. Richardson, Calif...',
    email: 'john@example.com',
    accountLevel: 'TechCrap Solutions',
    status: 'Completed',
    onboarded: 'info@gmail.com',
  },
  {
    id: 4,
    avatar: '/api/placeholder/40/40',
    address: '2715 Ash Dr. San Jose, South Dakota...',
    email: 'john@example.com',
    accountLevel: 'TechCrap Solutions',
    status: 'Completed',
    onboarded: 'info@gmail.com',
  },
  {
    id: 5,
    avatar: '/api/placeholder/40/40',
    address: '2972 Westheimer Rd. Santa Ana, Illin...',
    email: 'john@example.com',
    accountLevel: 'TechCrap Solutions',
    status: 'Completed',
    onboarded: 'info@gmail.com',
  },
  {
    id: 6,
    avatar: '/api/placeholder/40/40',
    address: '2118 Thornridge Cir. Syracuse, Connec...',
    email: 'john@example.com',
    accountLevel: 'TechCrap Solutions',
    status: 'Completed',
    onboarded: 'info@gmail.com',
  },
  {
    id: 7,
    avatar: '/api/placeholder/40/40',
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

  const filteredUsers = useMemo(() => {
    const q = searchValue.trim().toLowerCase();
    if (!q) return usersData;
    return usersData.filter((u) =>
      [u.address, u.email, u.accountLevel, u.status, u.onboarded].some((v) =>
        v.toLowerCase().includes(q)
      )
    );
  }, [searchValue]);

  return (
    <div className="max-w-7xl mx-auto">
      <IdentityHubHeader onOpenOnboardModal={() => setIsOnboardOpen(true)} />
      <IdentityHubToolbar searchValue={searchValue} onSearchChange={setSearchValue} />
      <IdentityHubTable users={filteredUsers} />

      <OnboardIdentityModal isOpen={isOnboardOpen} onClose={() => setIsOnboardOpen(false)} />
    </div>
  );
}
