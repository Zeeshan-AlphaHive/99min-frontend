'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { CheckCircle, Clock, Flag, MoreHorizontal } from 'lucide-react';
import StatCard from '@/components/admin/dashboard/Shared/StatsCard';
import TableToolbar from '@/components/admin/dashboard/Shared/TableToolbar';
import DataTable, { ColumnDef } from '@/components/admin/dashboard/Shared/DataTable';
import ReportDetailsModal from './ReportsDetailModal';
import BanUserModal from './BanUserModal';
import { fetchTaskReports, type AdminTaskReport } from '@/utils/api/admin.reports.api';
import { formatDistanceToNow } from 'date-fns';
import { createPortal } from 'react-dom';

type ReportedUserRow = {
  id: string; // reportId
  report: AdminTaskReport;
  taskTitle: string;
  reporterName: string;
  reporterEmail: string;
  ownerName: string;
  reports: number; // kept for UI badge; currently 1 per row
  reason: string;
  latest: string;
  status: 'Pending' | 'Resolved';
};

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
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number; width: number } | null>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const t = e.target as Node;
      const clickedButton = ref.current?.contains(t);
      const clickedMenu = menuRef.current?.contains(t);
      if (!clickedButton && !clickedMenu) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (!open) return;
    const update = () => {
      const el = buttonRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      setPos({ top: rect.bottom + 6, left: rect.right - 176, width: rect.width });
    };
    update();
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="p-1.5 text-textGray hover:text-textBlack hover:bg-gray-100 rounded-md transition-colors"
      >
        <MoreHorizontal className="w-5 h-5" />
      </button>

      {open && pos && typeof document !== 'undefined'
        ? createPortal(
            <div
              ref={menuRef}
              className="fixed w-44 bg-white border border-gray-200 rounded-xl shadow-lg z-[9999] overflow-hidden py-1"
              style={{ top: pos.top, left: pos.left }}
            >
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  onViewDetails();
                }}
                className="w-full text-left px-4 py-2.5 text-sm text-textBlack hover:bg-gray-50 transition-colors"
              >
                View Report Details
              </button>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  onBanUser();
                }}
                className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
              >
                Ban User
              </button>
            </div>,
            document.body
          )
        : null}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ReportedUsers() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [selectedRow, setSelectedRow] = useState<ReportedUserRow | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showBan, setShowBan] = useState(false);
  const [rows, setRows] = useState<ReportedUserRow[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const status =
          statusFilter === 'all' ? 'all' : (statusFilter as 'pending' | 'resolved' | 'reviewing' | 'dismissed');
        const res = await fetchTaskReports({ page, limit: 10, status, q: search || undefined });
        if (cancelled) return;

        const mapped: ReportedUserRow[] = res.data.map((r) => {
          const statusLabel = r.status === 'resolved' ? 'Resolved' : 'Pending';
          const latest = formatDistanceToNow(new Date(r.createdAt), { addSuffix: true });
          return {
            id: r._id,
            report: r,
            taskTitle: r.taskId?.title || 'Unknown task',
            reporterName: r.reporterUserId?.name || 'Unknown',
            reporterEmail: r.reporterUserId?.email || '',
            ownerName: r.taskId?.posterUserId?.name || 'Unknown',
            reports: 1,
            reason: r.reason,
            latest,
            status: statusLabel,
          };
        });

        setRows(mapped);
      } catch (e) {
        console.error(e);
        setRows([]);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [page, search, statusFilter]);

  const filtered = useMemo(() => {
    // Server already filters; keep client as a no-op for safety.
    return rows;
  }, [rows]);

  const pendingCount = rows.filter((r) => r.status === 'Pending').length;
  const resolvedCount = rows.filter((r) => r.status === 'Resolved').length;

  const columns: ColumnDef<ReportedUserRow>[] = [
    {
      key: 'task',
      header: 'Task',
      width: '34%',
      render: (row) => (
        <div className="min-w-0">
          <p className="text-sm font-semibold text-textBlack truncate">{row.taskTitle}</p>
          <p className="text-xs text-textGray mt-0.5 truncate">Owner: {row.ownerName}</p>
        </div>
      ),
    },
    {
      key: 'reporter',
      header: 'Reported by',
      render: (row) => (
        <div className="min-w-0">
          <p className="text-sm text-textBlack truncate">{row.reporterName}</p>
          <p className="text-xs text-textGray mt-0.5 truncate">{row.reporterEmail}</p>
        </div>
      ),
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
      <h1 className="text-2xl font-semibold text-textBlack mb-6">Reported Tasks</h1>

      {/* Stat cards */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <StatCard
          label="Total Task Reports"
          value={rows.length}
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
          label="Resolved"
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
        totalResults={rows.length}
        currentPage={page}
        totalPages={Math.max(1, Math.ceil(rows.length / 10))}
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
        report={selectedRow?.report ?? null}
      />

      {/* Ban User Modal */}
      <BanUserModal
        isOpen={showBan}
        onClose={() => setShowBan(false)}
        userName={selectedRow?.report?.taskId?.posterUserId?.name ?? ''}
        userId={selectedRow?.report?.taskId?.posterUserId?._id ?? null}
      />
    </div>
  );
}