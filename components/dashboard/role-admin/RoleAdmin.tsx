'use client';

import React, { useMemo, useState } from 'react';
import RoleAdminHeader from './RoleAdminHeader';
import RoleCardsSection from './RoleCardsSection';
import AdminsTable from './AdminsTable';
import CreateAdminModal from './CreateAdminModal';
import type { AdminRow, RoleCard as RoleCardType } from './types';

const roleCardsData: RoleCardType[] = [
  {
    id: 1,
    title: 'Super Admin',
    activeCount: 1,
    description: 'Full access to all modules, rules, and system settings.',
  },
  {
    id: 2,
    title: 'Admin',
    activeCount: 1,
    description: 'Full access to all modules, rules, and system settings.',
  },
  {
    id: 3,
    title: 'Support',
    activeCount: 1,
    description: 'Full access to all modules, rules, and system settings.',
  },
];

const adminsData: AdminRow[] = [
  {
    id: 1,
    avatar: '/assets/images/account.png',
    address: '1901 Thornridge Cir. Shiloh, Hawaii 81063',
    email: 'john@example.com',
    roleLabel: 'Super Admin',
    lastLogin: '10 mins ago',
  },
  {
    id: 2,
    avatar: '/assets/images/account.png',
    address: '3891 Ranchview Dr. Richardson, California 62639',
    email: 'john@example.com',
    roleLabel: 'Super Admin',
    lastLogin: '10 mins ago',
  },
  {
    id: 3,
    avatar: '/assets/images/account.png',
    address: '3891 Ranchview Dr. Richardson, California 62639',
    email: 'john@example.com',
    roleLabel: 'Admin',
    lastLogin: '10 mins ago',
  },
  {
    id: 4,
    avatar: '/assets/images/account.png',
    address: '2715 Ash Dr. San Jose, South Dakota 83475',
    email: 'john@example.com',
    roleLabel: 'Support',
    lastLogin: '2 hours ago',
  },
  {
    id: 5,
    avatar: '/assets/images/account.png',
    address: '2972 Westheimer Rd. Santa Ana, Illinois 85486',
    email: 'john@example.com',
    roleLabel: 'Support',
    lastLogin: '2 hours ago',
  },
  {
    id: 6,
    avatar: '/assets/images/account.png',
    address: '2118 Thornridge Cir. Syracuse, Connecticut 35624',
    email: 'john@example.com',
    roleLabel: 'Super Admin',
    lastLogin: '2 hours ago',
  },
  {
    id: 7,
    avatar: '/assets/images/account.png',
    address: '2464 Royal Ln. Mesa, New Jersey 45463',
    email: 'john@example.com',
    roleLabel: 'Super Admin',
    lastLogin: '2 hours ago',
  },
];

export default function RoleAdmin() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const admins = useMemo(() => adminsData, []);

  return (
    <div className="p-8 max-w-7xl mx-auto font-sans">
      <RoleAdminHeader onOpenCreateAdminModal={() => setIsCreateOpen(true)} />
      <RoleCardsSection cards={roleCardsData} />
      <AdminsTable admins={admins} />

      <CreateAdminModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </div>
  );
}
