'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { CalendarDays, Clock, Eye, X } from 'lucide-react';
import StatCard     from '@/components/admin/dashboard/Shared/StatsCard';
import TableToolbar from '@/components/admin/dashboard/Shared/TableToolbar';
import DataTable, { ColumnDef } from '@/components/admin/dashboard/Shared/DataTable';
import { useAdminSubscriptions, useSubscriptionStats } from '@/hooks/UseAdminSubscriptions';
import type { AdminSubscription } from '@/utils/api/admin.subscriptions.api';

const planStyles: Record<string, string> = {
  pro:      'bg-green-100 text-green-600',
  business: 'bg-orange-100 text-orange-500',
  free:     'bg-gray-100 text-gray-500',
};

const statusStyles: Record<string, string> = {
  active:   'bg-green-100 text-green-600',
  canceled: 'bg-red-100 text-red-500',
  past_due: 'bg-yellow-100 text-yellow-600',
  free:     'bg-gray-100 text-gray-500',
};

const dotColors: Record<string, string> = {
  active:   'bg-green-500',
  canceled: 'bg-red-500',
  past_due: 'bg-yellow-500',
  free:     'bg-gray-400',
};

const daysRemaining = (end: string) => {
  if (!end) return 0;
  const diff = new Date(end).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / 86400000));
};

function SubscriptionDetailsModal({
  row,
  onClose,
}: {
  row: AdminSubscription | null;
  onClose: () => void;
}) {
  if (!row) return null;

  const name = row.userId?.name || '—';
  const email = row.userId?.email || '—';
  const plan = row.plan;
  const status = row.status;
  const start = row.currentPeriodStart
    ? new Date(row.currentPeriodStart).toISOString().split('T')[0]
    : row.plan === 'free' ? 'Free Plan' : 'Not activated';
  const end = row.currentPeriodEnd
    ? new Date(row.currentPeriodEnd).toISOString().split('T')[0]
    : row.plan === 'free' ? 'No expiry' : 'Not activated';

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-label="Close"
      />
      <div className="absolute left-1/2 top-1/2 w-[92vw] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white shadow-xl border border-gray-200 p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="text-base font-semibold text-textBlack truncate">{name}</div>
            <div className="text-sm text-textGray truncate">{email}</div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-50 border border-gray-200"
            aria-label="Close"
          >
            <X className="w-4 h-4 text-textGray" />
          </button>
        </div>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
            <div className="text-xs text-textGray">Plan</div>
            <div className="mt-1 text-sm font-medium text-textBlack">
              {plan.charAt(0).toUpperCase() + plan.slice(1)}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
            <div className="text-xs text-textGray">Status</div>
            <div className="mt-1 text-sm font-medium text-textBlack">
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
            <div className="text-xs text-textGray">Start date</div>
            <div className="mt-1 text-sm font-medium text-textBlack">{start}</div>
          </div>
          <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
            <div className="text-xs text-textGray">Expiry date</div>
            <div className="mt-1 text-sm font-medium text-textBlack">{end}</div>
          </div>
          <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 sm:col-span-2">
            <div className="text-xs text-textGray">Days remaining</div>
            <div className="mt-1 text-sm font-medium text-textBlack">
              {row.plan === 'free' ? 'Free Plan' : row.currentPeriodEnd ? `${daysRemaining(row.currentPeriodEnd)} days left` : 'Pending'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const buildColumns = (
  onView: (row: AdminSubscription) => void
): ColumnDef<AdminSubscription>[] => [
  {
    key: 'user', header: 'User', width: '20%',
    render: (row) => {
      const name   = row.userId?.name  || '—';
      const email  = row.userId?.email || '—';
      const avatar = row.userId?.avatar ?? '';

      return (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-100 shrink-0 relative">
            {avatar ? (
              <Image
                src={avatar}
                alt={name}
                fill
                sizes="36px"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <span className="text-xs font-semibold text-gray-500">
                  {name !== '—' ? name.charAt(0).toUpperCase() : '?'}
                </span>
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-textBlack truncate">{name}</p>
            <p className="text-xs text-textGray truncate">{email}</p>
          </div>
        </div>
      );
    },
  },
  {
    key: 'plan', header: 'Plan Type',
    render: (row) => (
      <span className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-medium ${planStyles[row.plan]}`}>
        {row.plan.charAt(0).toUpperCase() + row.plan.slice(1)}
      </span>
    ),
  },
   {
    key: 'status', header: 'Status',
    render: (row) => (
      <span className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-medium ${statusStyles[row.status]}`}>
        {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
      </span>
    ),
  },
  {
    key: 'daysRemaining',
    header: 'Remaining',
    render: (row) => {
      if (row.plan === 'free') {
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium bg-gray-100 text-textGray">
            <span className="w-2 h-2 rounded-full shrink-0 bg-gray-400" />
            Free Plan
          </span>
        );
      }
      if (!row.currentPeriodEnd) {
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium bg-gray-100 text-textGray">
            <span className="w-2 h-2 rounded-full shrink-0 bg-gray-400" />
            Pending
          </span>
        );
      }
      const days = daysRemaining(row.currentPeriodEnd);
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium bg-gray-100 text-textGray">
          <span className={`w-2 h-2 rounded-full shrink-0 ${dotColors[row.status] ?? 'bg-gray-400'}`} />
          {days} days left
        </span>
      );
    },
  },
  {
    key: 'view',
    header: 'View',
    render: (row) => (
      <div className="flex justify-end">
        <button
          type="button"
          className="inline-flex items-center justify-center p-2 rounded-lg border border-gray-200 hover:bg-gray-50"
          onClick={() => onView(row)}
          title="View details"
        >
          <Eye className="w-4 h-4 text-textGray" />
        </button>
      </div>
    ),
  },
];

export default function UserSubscriptions() {
  const [search,       setSearch]       = useState('');
  const [planFilter,   setPlanFilter]   = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page,         setPage]         = useState(1);
  const [selected, setSelected] = useState<AdminSubscription | null>(null);

  const { data, isLoading } = useAdminSubscriptions({
    page,
    limit:  20,
    search: search       || undefined,
    plan:   planFilter   !== 'all' ? planFilter   : undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined,
  });

  const { data: statsData } = useSubscriptionStats();
  const stats = statsData?.data;

  const expiringSoon = (data?.data.items ?? []).filter((s) => {
    const days = daysRemaining(s.currentPeriodEnd);
    return days > 0 && days <= 3;
  }).length;

  if (isLoading) return <div className="p-6 text-sm text-gray-500">Loading subscriptions...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-2xl font-semibold text-textBlack mb-6">User Subscriptions</h1>

      {/* Stat cards */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <StatCard
          label="Total Active Subscriptions"
          value={stats?.totalActive ?? 0}
          icon={<CalendarDays className="w-4 h-4" />}
          iconContainerClassName="bg-red-100 text-red-700"
        />
        <StatCard
          label="Expiring Soon (3 days)"
          value={expiringSoon}
          icon={<Clock className="w-4 h-4" />}
          iconContainerClassName="bg-orange-100 text-orange-600"
        />
        <StatCard
          label="Canceled Plans"
          value={stats?.totalCanceled ?? 0}
          icon={<X className="w-4 h-4" />}
          iconContainerClassName="bg-red-100 text-red-700"
        />
      </div>

      {/* Toolbar */}
      <TableToolbar
        searchValue={search}
        onSearchChange={(v) => { setSearch(v); setPage(1); }}
        filters={[
          {
            placeholder: 'All Plan',
            value: planFilter,
            onChange: (v) => { setPlanFilter(v); setPage(1); },
            options: [
              { label: 'All Plan',  value: 'all' },
              { label: 'Pro',       value: 'pro' },
              { label: 'Business',  value: 'business' },
              { label: 'Free',      value: 'free' },
            ],
          },
          {
            placeholder: 'All Status',
            value: statusFilter,
            onChange: (v) => { setStatusFilter(v); setPage(1); },
            options: [
              { label: 'All Status', value: 'all' },
              { label: 'Active',     value: 'active' },
              { label: 'Canceled',   value: 'canceled' },
              { label: 'Past Due',   value: 'past_due' },
            ],
          },
        ]}
      />

      {/* Table */}
      <DataTable
        columns={buildColumns((row) => setSelected(row))}
        rows={data?.data.items ?? []}
        getRowKey={(r) => r._id}
        totalResults={data?.data.pagination.totalItems}
        currentPage={data?.data.pagination.page ?? 1}
        totalPages={data?.data.pagination.totalPages ?? 1}
        onPageChange={setPage}
      />

      <SubscriptionDetailsModal row={selected} onClose={() => setSelected(null)} />
    </div>
  );
}