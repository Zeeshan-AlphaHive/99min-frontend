'use client';

import React, { useState, useMemo } from 'react';
import { CalendarDays, Clock, X } from 'lucide-react';
import StatCard from '@/components/admin/dashboard/Shared/StatsCard';
import TableToolbar from '@/components/admin/dashboard/Shared/TableToolbar';
import DataTable, { ColumnDef } from '@/components/admin/dashboard/Shared/DataTable';
import UserCell from '@/components/admin/dashboard/Shared/UserCell';
import type { SubscriptionRow, SubPlan, SubStatus } from './types';

// ── Badge helpers ─────────────────────────────────────────────────────────────
const planStyles: Record<SubPlan, string> = {
  Pro: 'bg-green-100 text-green-600',
  Business: 'bg-orange-100 text-orange-500',
  Free: 'bg-gray-100 text-gray-500',
};

const statusStyles: Record<SubStatus, string> = {
  Active: 'bg-green-100 text-green-600',
  Expired: 'bg-red-100 text-red-500',
};

const dotColors: Record<SubStatus, string> = {
  Active: 'bg-green-500',
  Expired: 'bg-red-500',
};

// ── Data ──────────────────────────────────────────────────────────────────────
const subscriptionsData: SubscriptionRow[] = [
  { id: 1, avatar: '/assets/images/Avatar.png', name: 'Mike Ross', email: 'info@gmail.com', plan: 'Pro', startDate: '2025-12-15', status: 'Active', expiryDate: '2026-04-15', daysRemaining: 19 },
  { id: 2, avatar: '/assets/images/Avatar.png', name: 'Mike Ross', email: 'info@gmail.com', plan: 'Pro', startDate: '2025-12-15', status: 'Expired', expiryDate: '2026-04-15', daysRemaining: 19 },
  { id: 3, avatar: '/assets/images/Avatar.png', name: 'Mike Ross', email: 'info@gmail.com', plan: 'Pro', startDate: '2025-12-15', status: 'Active', expiryDate: '2026-04-15', daysRemaining: 19 },
  { id: 4, avatar: '/assets/images/Avatar.png', name: 'Mike Ross', email: 'info@gmail.com', plan: 'Business', startDate: '2025-12-15', status: 'Expired', expiryDate: '2026-04-15', daysRemaining: 19 },
  { id: 5, avatar: '/assets/images/Avatar.png', name: 'Mike Ross', email: 'info@gmail.com', plan: 'Business', startDate: '2025-12-15', status: 'Active', expiryDate: '2026-04-15', daysRemaining: 19 },
  { id: 6, avatar: '/assets/images/Avatar.png', name: 'Mike Ross', email: 'info@gmail.com', plan: 'Free', startDate: '2025-12-15', status: 'Expired', expiryDate: '2026-04-15', daysRemaining: 19 },
  { id: 7, avatar: '/assets/images/Avatar.png', name: 'Mike Ross', email: 'info@gmail.com', plan: 'Free', startDate: '2025-12-15', status: 'Expired', expiryDate: '2026-04-15', daysRemaining: 19 },
];

// ── Columns ───────────────────────────────────────────────────────────────────
const columns: ColumnDef<SubscriptionRow>[] = [
  {
    key: 'user',
    header: 'User',
    width: '20%',
    render: (row) => <UserCell avatar={row.avatar} name={row.name} email={row.email} />,
  },
  {
    key: 'email',
    header: 'Email',
    render: (row) => <span className="text-sm text-textGray">{row.email}</span>,
  },
  {
    key: 'plan',
    header: 'Plan Type',
    render: (row) => (
      <span className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-medium ${planStyles[row.plan]}`}>
        {row.plan}
      </span>
    ),
  },
  {
    key: 'startDate',
    header: 'Start Date',
    render: (row) => <span className="text-sm text-textGray">{row.startDate}</span>,
  },
  {
    key: 'status',
    header: 'Status',
    render: (row) => (
      <span className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-medium ${statusStyles[row.status]}`}>
        {row.status}
      </span>
    ),
  },
  {
    key: 'expiryDate',
    header: 'Expiry Date',
    render: (row) => <span className="text-sm text-textGray">{row.expiryDate}</span>,
  },
  {
    key: 'daysRemaining',
    header: 'Days Remaining',
    render: (row) => (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium bg-gray-100 text-textGray">
        <span className={`w-2 h-2 rounded-full shrink-0 ${dotColors[row.status]}`} />
        {row.daysRemaining} days left
      </span>
    ),
  },
];

// ── Page ──────────────────────────────────────────────────────────────────────
export default function UserSubscriptions() {
  const [search, setSearch] = useState('');
  const [planFilter, setPlanFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expiryFilter, setExpiryFilter] = useState('all');
  const [page, setPage] = useState(2);

  const filtered = useMemo(() => {
    return subscriptionsData.filter((row) => {
      const q = search.toLowerCase();
      const matchSearch = !q || row.name.toLowerCase().includes(q) || row.email.toLowerCase().includes(q);
      const matchPlan = planFilter === 'all' || row.plan.toLowerCase() === planFilter;
      const matchStatus = statusFilter === 'all' || row.status.toLowerCase() === statusFilter;
      return matchSearch && matchPlan && matchStatus;
    });
  }, [search, planFilter, statusFilter]);

  const activeCount = subscriptionsData.filter((r) => r.status === 'Active').length;
  const expiredCount = subscriptionsData.filter((r) => r.status === 'Expired').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
     <h1 className="text-2xl font-semibold text-textBlack mb-6">User Subscriptions</h1>

      {/* Stat cards */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <StatCard
          label="Total Active Subscriptions"
          value={activeCount}
          icon={<CalendarDays className="w-4 h-4" />}
          iconContainerClassName="bg-red-100 text-red-700"
        />
        <StatCard
          label="Expiring Soon (3 days)"
          value={5}
          icon={<Clock className="w-4 h-4" />}
          iconContainerClassName="bg-orange-100 text-orange-600"
        />
        <StatCard
          label="Expired Plans"
          value={expiredCount}
          icon={<X className="w-4 h-4" />}
          iconContainerClassName="bg-red-100 text-red-700"
        />
      </div>

      {/* Toolbar */}
      <TableToolbar
        searchValue={search}
        onSearchChange={setSearch}
        filters={[
          {
            placeholder: 'All Plan',
            value: planFilter,
            onChange: setPlanFilter,
            options: [
              { label: 'All Plan', value: 'all' },
              { label: 'Pro', value: 'pro' },
              { label: 'Business', value: 'business' },
              { label: 'Free', value: 'free' },
            ],
          },
          {
            placeholder: 'All Status',
            value: statusFilter,
            onChange: setStatusFilter,
            options: [
              { label: 'All Status', value: 'all' },
              { label: 'Active', value: 'active' },
              { label: 'Expired', value: 'expired' },
            ],
          },
          {
            placeholder: 'All Expiries',
            value: expiryFilter,
            onChange: setExpiryFilter,
            options: [
              { label: 'All Expiries', value: 'all' },
              { label: 'This Week', value: 'week' },
              { label: 'This Month', value: 'month' },
            ],
          },
        ]}
      />

      {/* Table */}
      <DataTable
        columns={columns}
        rows={filtered}
        getRowKey={(r) => r.id}
        totalResults={2846}
        currentPage={page}
        totalPages={3}
        onPageChange={setPage}
      />
    </div>
  );
}