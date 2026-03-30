'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { CheckCircle, Clock, Flag, MoreHorizontal } from 'lucide-react';
import StatCard from '@/components/admin/dashboard/Shared/StatsCard';
import TableToolbar from '@/components/admin/dashboard/Shared/TableToolbar';
import DataTable, { ColumnDef } from '@/components/admin/dashboard/Shared/DataTable';
import UserCell from '@/components/admin/dashboard/Shared/UserCell';
import ReportDetailsModal from './ReportsDetailModal';
import BanUserModal from './BanUserModal';

type ReportStatus = 'Pending' | 'Resolved';
type ReportReason = 'Fraud' | 'Abuse' | 'Spam' | 'Other';

type ReportedUserRow = {
  id: number;
  avatar: string;
  name: string;
  email: string;
  reports: number;
  reason: ReportReason;
  latest: string;
  status: ReportStatus;
};

const reportsData: ReportedUserRow[] = [
  { id: 1, avatar: '/assets/images/Avatar.png', name: 'Mike Ross', email: 'info@gmail.com', reports: 8, reason: 'Fraud', latest: '10m ago', status: 'Pending' },
  { id: 2, avatar: '/assets/images/Avatar.png', name: 'Mike Ross', email: 'info@gmail.com', reports: 8, reason: 'Fraud', latest: '10m ago', status: 'Pending' },
  { id: 3, avatar: '/assets/images/Avatar.png', name: 'Mike Ross', email: 'info@gmail.com', reports: 8, reason: 'Abuse', latest: '10m ago', status: 'Pending' },
  { id: 4, avatar: '/assets/images/Avatar.png', name: 'Mike Ross', email: 'info@gmail.com', reports: 8, reason: 'Abuse', latest: '10m ago', status: 'Pending' },
  { id: 5, avatar: '/assets/images/Avatar.png', name: 'Mike Ross', email: 'info@gmail.com', reports: 8, reason: 'Fraud', latest: '10m ago', status: 'Pending' },
  { id: 6, avatar: '/assets/images/Avatar.png', name: 'Mike Ross', email: 'info@gmail.com', reports: 8, reason: 'Abuse', latest: '10m ago', status: 'Pending' },
  { id: 7, avatar: '/assets/images/Avatar.png', name: 'Mike Ross', email: 'info@gmail.com', reports: 8, reason: 'Abuse', latest: '10m ago', status: 'Pending' },
];

// ── Row action menu ───────────────────────────────────────────────────────────
function RowActionMenu({
  onViewDetails,
  onBanUser,
}: {
  onViewDetails: () => void;
  onBanUser: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="p-1.5 text-textGray hover:text-textBlack hover:bg-gray-100 rounded-md transition-colors"
      >
        <MoreHorizontal className="w-5 h-5" />
      </button>

      {open && (
        <div className="absolute right-0 mt-1 w-44 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden py-1">
          <button
            type="button"
            onClick={() => { setOpen(false); onViewDetails(); }}
            className="w-full text-left px-4 py-2.5 text-sm text-textBlack hover:bg-gray-50 transition-colors"
          >
            View Report Details
          </button>
          <button
            type="button"
            onClick={() => { setOpen(false); onBanUser(); }}
            className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
          >
            Ban User
          </button>
        </div>
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ReportedUsers() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(2);
  const [selectedRow, setSelectedRow] = useState<ReportedUserRow | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showBan, setShowBan] = useState(false);

  const filtered = useMemo(() => {
    return reportsData.filter((row) => {
      const q = search.toLowerCase();
      const matchSearch = !q || row.name.toLowerCase().includes(q) || row.email.toLowerCase().includes(q) || row.reason.toLowerCase().includes(q);
      const matchStatus = statusFilter === 'all' || row.status.toLowerCase() === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [search, statusFilter]);

  const pendingCount = reportsData.filter((r) => r.status === 'Pending').length;
  const resolvedCount = reportsData.filter((r) => r.status === 'Resolved').length;

  const columns: ColumnDef<ReportedUserRow>[] = [
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
      key: 'reports',
      header: 'Reports',
      render: (row) => (
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-red-100 text-red-500">
          {row.reports} Reports
        </span>
      ),
    },
    {
      key: 'reason',
      header: 'Reason',
      render: (row) => <span className="text-sm text-textGray">{row.reason}</span>,
    },
    {
      key: 'latest',
      header: 'Latest',
      render: (row) => <span className="text-sm text-textGray">{row.latest}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <span className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-medium ${
          row.status === 'Pending' ? 'bg-orange-100 text-orange-500' : 'bg-green-100 text-green-600'
        }`}>
          {row.status}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <RowActionMenu
          onViewDetails={() => { setSelectedRow(row); setShowDetails(true); }}
          onBanUser={() => { setSelectedRow(row); setShowBan(true); }}
        />
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-2xl font-semibold text-textBlack mb-6">Reported Users</h1>

      {/* Stat cards */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <StatCard
          label="Total Reports Today"
          value={reportsData.length + 17}
          icon={<Flag className="w-4 h-4" />}
          iconContainerClassName="bg-red-100 text-red-700"
        />
        <StatCard
          label="Pending Reports"
          value={pendingCount}
          icon={<Clock className="w-4 h-4" />}
          iconContainerClassName="bg-orange-100 text-orange-700"
        />
        <StatCard
          label="Action Taken"
          value={resolvedCount}
          icon={<CheckCircle className="w-4 h-4" />}
          iconContainerClassName="bg-green-100 text-green-700"
        />
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        rows={filtered}
        getRowKey={(r) => r.id}
        totalResults={2846}
        currentPage={page}
        totalPages={3}
        onPageChange={setPage}
        toolbar={
          <TableToolbar
            searchValue={search}
            onSearchChange={setSearch}
            filters={[
              {
                placeholder: 'All Filters',
                value: statusFilter,
                onChange: setStatusFilter,
                options: [
                  { label: 'All Filters', value: 'all' },
                  { label: 'Pending', value: 'pending' },
                  { label: 'Resolved', value: 'resolved' },
                ],
              },
            ]}
          />
        }
      />

      {/* Report Details Modal */}
      <ReportDetailsModal
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        onBanUser={() => { setShowDetails(false); setShowBan(true); }}
        user={{
          name: selectedRow?.name ?? '',
          email: selectedRow?.email ?? '',
          plan: 'Free',
          location: 'New York, NY',
        }}
      />

      {/* Ban User Modal */}
      <BanUserModal
        isOpen={showBan}
        onClose={() => setShowBan(false)}
        userName={selectedRow?.name ?? ''}
      />
    </div>
  );
}